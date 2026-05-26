import { TailingComposition, ENERGY_CONSTANTS, TAILING_TYPES } from './constants';

// Konstanta stoikiometri netralisasi asam
const MW_H2SO4 = 98;   // g/mol
const MW_Ca_OH_2 = 74; // g/mol
const MW_GYPSUM = 172; // g/mol (CaSO4·2H2O)
const SLURRY_DENSITY_TON_PER_M3 = 1.35; // ton slurry per m³
const SLURRY_SOLID_FRACTION = 0.35;      // 35% padatan dalam slurry HPAL (65% air)

export interface MassBalanceState {
    time: number;
    tailingMass: number;   // ton
    binderMass: number;    // ton
    limeMass: number;      // ton - BARU: massa kapur untuk netralisasi
    gypsumMass: number;    // ton - BARU: massa gipsum produk sampingan
    totalMass: number;     // ton
    productMass: number;   // ton
    lossMass: number;      // ton
}

export interface MassBalanceResult {
    // === DAILY VALUES ===
    dailyTailingInput: number;      // ton/hari (padatan kering)
    dailyBinderInput: number;       // ton/hari (semen Portland)
    dailyLimeInput: number;         // ton/hari - BARU: kapur netralisasi
    dailyGypsumByProduct: number;   // ton/hari - BARU: gipsum terbentuk
    dailyTotalInput: number;        // ton/hari (tailing + binder + kapur)
    dailyProductOutput: number;     // ton/hari (batako/paving block jadi)
    dailyLoss: number;              // ton/hari
    productYield: number;           // %

    // === ANNUAL VALUES ===
    annualTailingInput: number;
    annualBinderInput: number;
    annualLimeInput: number;        // ton/tahun - BARU
    annualProductOutput: number;

    // === NEUTRALIZATION STOICHIOMETRY ===
    // Data kimia untuk display di Dashboard
    h2so4ContentGpl: number;        // gpl sisa asam bebas (dari input tailing)
    limeRequirementKgPerTonTailing: number; // kg Ca(OH)2 per ton tailing kering
    gypsumProducedKgPerTonTailing: number;  // kg CaSO4·2H2O per ton tailing

    // === QUALITY ===
    qualityGrade: 'standard' | 'premium';
    productName: string;
    compressiveStrength: number;    // MPa

    // === ENERGY ===
    dailyEnergyKWh: number;
    annualEnergyKWh: number;

    // === PROCESS DATA (untuk visualisasi) ===
    processData: MassBalanceState[];

    // === SENSITIVITY ANALYSIS ===
    // DIUBAH: Rasio Kapur Netralisasi vs Biaya OPEX Harian vs NPV Proxy
    sensitivityData: {
        limeRatio: number;           // % kapur vs massa tailing
        dailyOpexProxy: number;      // Juta Rp/hari (estimasi OPEX harian)
        compressiveStrengthMPa: number; // MPa (kualitas produk)
        gypsumByproductTon: number;  // ton/hari gipsum (nilai potensial)
    }[];
}

export const runMassBalance = (
    tailing: TailingComposition,
    inputMassTonPerDay: number,
    binderRatioPercent: number,
    curingTempC: number,
): MassBalanceResult => {

    const dailyTailingInput = inputMassTonPerDay;

    // =========================================================
    // STEP 1: STOIKIOMETRI NETRALISASI ASAM BEBAS
    // Reaksi: H2SO4 + Ca(OH)2 → CaSO4·2H2O + H2O
    // =========================================================

    const h2so4Gpl = tailing.H2SO4_gpl; // gpl sisa asam bebas

    // Volume slurry per ton padatan tailing kering
    // Tailing HPAL keluar sebagai slurry ~35% padatan (w/w)
    // 1 ton padatan → (1 / 0.35) ton slurry → (1 / 0.35) / 1.35 m³ slurry
    const slurryVolumeM3PerTonDryTailing = (1 / SLURRY_SOLID_FRACTION) / SLURRY_DENSITY_TON_PER_M3;

    // Massa H2SO4 dalam slurry per ton padatan tailing (kg)
    // H2SO4_gpl × volume slurry (L) per ton padatan
    const slurryVolumeLiterPerTonDry = slurryVolumeM3PerTonDryTailing * 1000;
    const h2so4MassKgPerTonTailing = (h2so4Gpl * slurryVolumeLiterPerTonDry) / 1000; // kg H2SO4 per ton tailing

    // Kebutuhan Ca(OH)2 berdasarkan stoikiometri 1:1 molar
    // n_H2SO4 = m_H2SO4 / MW_H2SO4
    // n_Ca(OH)2 = n_H2SO4 (rasio 1:1)
    // m_Ca(OH)2 = n_Ca(OH)2 × MW_Ca(OH)2
    const limeRequirementKgPerTonTailing =
        (h2so4MassKgPerTonTailing / MW_H2SO4) * MW_Ca_OH_2; // kg/ton
    // Kali faktor keamanan 1.15 (excess lime 15% untuk memastikan pH > 7)
    const limeRequirementKgPerTonWithExcess = limeRequirementKgPerTonTailing * 1.15;

    // Massa gipsum yang terbentuk per ton tailing
    // n_gypsum = n_H2SO4 (rasio 1:1 dengan H2SO4)
    const gypsumProducedKgPerTonTailing =
        (h2so4MassKgPerTonTailing / MW_H2SO4) * MW_GYPSUM;

    // Daily lime dan gipsum (ton/hari)
    const dailyLimeInput = (dailyTailingInput * limeRequirementKgPerTonWithExcess) / 1000;
    const dailyGypsumByProduct = (dailyTailingInput * gypsumProducedKgPerTonTailing) / 1000;

    // =========================================================
    // STEP 2: MASS BALANCE PENCAMPURAN & PENCETAKAN
    // =========================================================

    const dailyBinderInput = dailyTailingInput * (binderRatioPercent / 100);

    // Total input padatan = tailing + binder (semen) + kapur + gipsum (already in mix)
    // Gipsum sudah terbentuk in-situ saat kapur ditambahkan ke slurry
    const dailyTotalInput = dailyTailingInput + dailyBinderInput + dailyLimeInput;
    // Gipsum tidak ditambahkan ekstra ke totalInput karena sudah bagian dari tailing
    // setelah netralisasi (massa sudah termasuk dalam dailyTailingInput + dailyLimeInput yang bereaksi)

    // Loss Factor - lebih rendah untuk HPAL_NEUTRALIZED karena material lebih homogen
    let baseLossPercent = tailing.qualityGrade === 'premium' ? 2.0 : 3.5;

    // Efek binder ratio terhadap loss
    const binderEffect = Math.min(binderRatioPercent / 25, 1.0);
    baseLossPercent -= binderEffect * 1.2;
    baseLossPercent = Math.max(0.8, baseLossPercent);

    // Efek suhu curing
    if (curingTempC > 40 && curingTempC <= 70) {
        baseLossPercent -= 0.4; // Range optimal steam curing
    } else if (curingTempC > 70) {
        baseLossPercent -= 0.2;
    }
    baseLossPercent = Math.max(0.5, baseLossPercent);

    const dailyLoss = dailyTotalInput * (baseLossPercent / 100);
    // Produk akhir juga mengandung gipsum yang terenkapsulasi
    const dailyProductOutput = dailyTotalInput + dailyGypsumByProduct - dailyLoss;
    const productYield = (dailyProductOutput / (dailyTotalInput + dailyGypsumByProduct)) * 100;

    // =========================================================
    // STEP 3: NILAI TAHUNAN
    // =========================================================

    const opDays = ENERGY_CONSTANTS.OPERATING_DAYS;
    const annualTailingInput = dailyTailingInput * opDays;
    const annualBinderInput = dailyBinderInput * opDays;
    const annualLimeInput = dailyLimeInput * opDays;
    const annualProductOutput = dailyProductOutput * opDays;

    // =========================================================
    // STEP 4: ESTIMASI KUAT TEKAN (MPa)
    // Model semi-empirik untuk tailing berbasis hematit (Fe2O3) + silika
    // =========================================================

    // Base strength dari grade produk
    let baseStrength = tailing.qualityGrade === 'premium' ? 22 : 12; // MPa

    // Efek binder ratio (semen)
    baseStrength += binderRatioPercent * 0.75;

    // Efek suhu curing (steam curing sangat menguntungkan untuk C-S-H)
    if (curingTempC > 30) {
        baseStrength += Math.min((curingTempC - 25) * 0.18, 10); // Max +10 MPa
    }

    // Efek Fe2O3 (hematit sebagai microfiller - mengisi pori-pori)
    // Penelitian Mehta & Monteiro (2014): Fe2O3 >30% meningkatkan densitas signifikan
    const hematiteEffect = (tailing.Fe2O3 - 30) * 0.12;
    baseStrength += Math.max(0, hematiteEffect);

    // Efek SiO2 reaktif (membentuk C-S-H bersama Ca(OH)2)
    const silicaEffect = (tailing.SiO2 - 20) * 0.08;
    baseStrength += Math.max(0, silicaEffect);

    // Efek positif gipsum sisa (retarder alami, meningkatkan workability → densifikasi lebih baik)
    // Hanya berlaku jika tailing sudah dinetralkan (H2SO4 rendah)
    if (tailing.H2SO4_gpl < 5) {
        baseStrength += 1.5; // Bonus +1.5 MPa untuk tailing ternetralisasi
    }

    const compressiveStrength = Math.max(5, Math.min(55, baseStrength));

    // =========================================================
    // STEP 5: KONSUMSI ENERGI
    // =========================================================

    const mixingEnergy = dailyProductOutput * ENERGY_CONSTANTS.MIXING_ENERGY_KWH_PER_TON;
    const moldingEnergy = dailyProductOutput * ENERGY_CONSTANTS.MOLDING_ENERGY_KWH_PER_TON;
    const conveyorEnergy = dailyTotalInput * ENERGY_CONSTANTS.CONVEYOR_ENERGY_KWH_PER_TON;
    const neutralizationEnergy = dailyTailingInput * ENERGY_CONSTANTS.NEUTRALIZATION_ENERGY_KWH_PER_TON;
    const curingEnergy = curingTempC > 25
        ? dailyProductOutput * (curingTempC - 25) * ENERGY_CONSTANTS.CURING_BASE_KWH_PER_TON_PER_DEG
        : 0;

    const dailyEnergyKWh = mixingEnergy + moldingEnergy + conveyorEnergy + neutralizationEnergy + curingEnergy;
    const annualEnergyKWh = dailyEnergyKWh * opDays;

    // =========================================================
    // STEP 6: PROCESS SIMULATION DATA (untuk chart)
    // =========================================================

    const processData: MassBalanceState[] = [
        {
            time: 0, // Input: Tailing HPAL masuk dari Tailing Pond
            tailingMass: dailyTailingInput,
            binderMass: 0,
            limeMass: 0,
            gypsumMass: 0,
            totalMass: dailyTailingInput,
            productMass: 0,
            lossMass: 0,
        },
        {
            time: 1, // Netralisasi: Kapur ditambahkan, gipsum mulai terbentuk
            tailingMass: dailyTailingInput,
            binderMass: 0,
            limeMass: dailyLimeInput,
            gypsumMass: dailyGypsumByProduct * 0.8,
            totalMass: dailyTailingInput + dailyLimeInput,
            productMass: 0,
            lossMass: 0,
        },
        {
            time: 2, // Pencampuran: Semen ditambahkan, semua material digabung
            tailingMass: dailyTailingInput,
            binderMass: dailyBinderInput,
            limeMass: dailyLimeInput,
            gypsumMass: dailyGypsumByProduct,
            totalMass: dailyTotalInput + dailyGypsumByProduct,
            productMass: (dailyTotalInput + dailyGypsumByProduct) * 0.5,
            lossMass: dailyLoss * 0.3,
        },
        {
            time: 3, // Pencetakan & Early Curing
            tailingMass: dailyTailingInput,
            binderMass: dailyBinderInput,
            limeMass: dailyLimeInput,
            gypsumMass: dailyGypsumByProduct,
            totalMass: dailyTotalInput + dailyGypsumByProduct,
            productMass: (dailyTotalInput + dailyGypsumByProduct) * 0.85,
            lossMass: dailyLoss * 0.7,
        },
        {
            time: 4, // Produk Jadi: Batako/Paving Block siap distribusi
            tailingMass: dailyTailingInput,
            binderMass: dailyBinderInput,
            limeMass: dailyLimeInput,
            gypsumMass: dailyGypsumByProduct,
            totalMass: dailyTotalInput + dailyGypsumByProduct,
            productMass: dailyProductOutput,
            lossMass: dailyLoss,
        },
    ];

    // =========================================================
    // STEP 7: SENSITIVITY ANALYSIS
    // BARU: Rasio Kapur Netralisasi vs Biaya OPEX Harian vs Kuat Tekan
    // =========================================================

    const LIME_COST_PER_KG = 2.0; // Rp/gram → Rp 2.000/kg
    const CEMENT_COST_PER_KG = 2.2;
    const ELECTRICITY_COST = 1.444; // Rp/Wh → Rp 1.444/kWh

    const limeRatioPoints = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

    const sensitivityData = limeRatioPoints.map(limeRatioPercent => {
        // Simulasi lime yang ditambahkan sebagai persen dari massa tailing
        const simLimeMassPerDay = dailyTailingInput * (limeRatioPercent / 100);

        // Biaya OPEX harian sederhana (juta Rp/hari)
        const simLimeCost = simLimeMassPerDay * 1000 * LIME_COST_PER_KG;      // Rp/hari
        const simCementCost = dailyBinderInput * 1000 * CEMENT_COST_PER_KG;  // Rp/hari
        const simEnergyCost = dailyEnergyKWh * ELECTRICITY_COST;              // Rp/hari
        const dailyOpexProxy = (simLimeCost + simCementCost + simEnergyCost) / 1_000_000; // Juta Rp

        // Kuat tekan dipengaruhi oleh rasio kapur (optimal ~8-10%)
        // Terlalu sedikit → pH rendah → hidrasi semen terganggu
        // Terlalu banyak → gipsum berlebih → ekspansi merusak
        let simStrength = baseStrength;
        if (limeRatioPercent < 7) {
            simStrength -= (7 - limeRatioPercent) * 1.5; // Kurang kapur: kuat tekan turun
        } else if (limeRatioPercent > 10) {
            simStrength -= (limeRatioPercent - 10) * 0.8; // Kelebihan kapur: efek negatif
        }
        simStrength = Math.max(5, simStrength);

        // Gipsum yang terbentuk (ton/hari)
        const simGypsumTon = (dailyTailingInput * (limeRatioPercent / 100) / MW_Ca_OH_2) * MW_GYPSUM;

        return {
            limeRatio: limeRatioPercent,
            dailyOpexProxy: Math.round(dailyOpexProxy * 10) / 10,
            compressiveStrengthMPa: Math.round(simStrength * 10) / 10,
            gypsumByproductTon: Math.round(simGypsumTon * 100) / 100,
        };
    });

    return {
        dailyTailingInput,
        dailyBinderInput,
        dailyLimeInput,
        dailyGypsumByProduct,
        dailyTotalInput,
        dailyProductOutput,
        dailyLoss,
        productYield,
        annualTailingInput,
        annualBinderInput,
        annualLimeInput,
        annualProductOutput,
        h2so4ContentGpl: h2so4Gpl,
        limeRequirementKgPerTonTailing: Math.round(limeRequirementKgPerTonWithExcess * 10) / 10,
        gypsumProducedKgPerTonTailing: Math.round(gypsumProducedKgPerTonTailing * 10) / 10,
        qualityGrade: tailing.qualityGrade,
        productName: tailing.productName,
        compressiveStrength,
        dailyEnergyKWh,
        annualEnergyKWh,
        processData,
        sensitivityData,
    };
};
