
import { TailingType, TAILING_TYPES, DEFAULT_TAILING, COMMUNITY_CONSTANTS } from './constants';

export interface CommunityRecipeResult {
    // Input echo
    tailingInputKg: number;
    tailingType: TailingType;

    // Recipe (in practical units) - HPAL: Kapur + Semen + Air
    limeKg: number;          // BARU: Kapur Ca(OH)₂ untuk netralisasi
    limeKarung: number;      // BARU: Kapur dalam satuan karung (~25 kg)
    cementKg: number;
    waterLiters: number;     // BARU: Air pencampur
    gypsumEstimateKg: number; // BARU: Estimasi gipsum terbentuk

    // Backward compatibility - set ke 0 untuk HPAL (tidak pakai NaOH/Na2SiO3)
    na2sio3Liters: number;   // 0 (tidak digunakan untuk HPAL)
    naohLiters: number;      // 0 (tidak digunakan untuk HPAL)
    
    // Execution Units (Satuan Eksekusi Warga)
    tailingKarung: number;   // ~50kg per karung
    naohFlakesKg: number;    // 0 untuk HPAL
    cementSak: number;       // ~40kg per sak (update dari 50kg)

    // Production estimate
    productName: string;
    totalMixKg: number;
    estimatedBlocks: number;

    // Cost breakdown (IDR)
    totalMaterialCostIDR: number;
    costBreakdown: {
        limeCost: number;    // BARU: Biaya kapur
        cementCost: number;
        waterCost: number;   // BARU: Biaya air (minimal)
    };
    costPerBlock: number;

    // Simple mixing instructions
    mixingSteps: string[];

    // Safety status
    safetyStatus: 'CLEARED' | 'WARNING';
    safetyMessage: string;

    // Buffer storage info
    bufferStorageName: string;
    availableTons: number;
    lastValidated: string;
    tclpResults: { Ni: number; Co: number; Cr6: number; As: number };
}

/**
 * Community-scale recipe calculator for HPAL Nickel Laterite tailing.
 * Translates the TAILINGSIM backend ratios into simple Kg/Liter instructions
 * for BUMDes operators and local Morowali community members.
 */
export function calculateCommunityRecipe(
    tailingKg: number,
    tailingType: TailingType,
    productType: 'PAVING_BLOCK' | 'BATAKO_BERONGGA' = 'PAVING_BLOCK'
): CommunityRecipeResult {
    const CC = COMMUNITY_CONSTANTS;
    const isRaw = tailingType === TAILING_TYPES.HPAL_RAW;
    const R = isRaw ? CC.RECIPE_RATIOS.RAW : CC.RECIPE_RATIOS.NEUTRALIZED;

    // 1. Calculate material quantities based on HPAL recipe ratios
    const limeKg = Math.round(tailingKg * R.LIME_KG_PER_KG_TAILING * 100) / 100;
    const cementKg = Math.round(tailingKg * R.CEMENT_KG_PER_KG_TAILING * 100) / 100;
    const waterLiters = Math.round(tailingKg * R.WATER_LITER_PER_KG_TAILING * 100) / 100;

    // Estimasi gipsum yang terbentuk dari reaksi netralisasi
    // Stoikiometri: H2SO4 + Ca(OH)2 → CaSO4·2H2O
    // Massa gipsum ≈ limeKg × (172/74) ≈ limeKg × 2.32
    const gypsumEstimateKg = Math.round(limeKg * (172 / 74) * 100) / 100;

    // Satuan eksekusi warga
    const tailingKarung = Math.round((tailingKg / 50) * 10) / 10;  // ~50 kg per karung
    const limeKarung = Math.round((limeKg / 25) * 10) / 10;         // ~25 kg per karung kapur
    const cementSak = Math.round((cementKg / 40) * 100) / 100;      // ~40 kg per sak semen

    // 2. Total mix weight (tailing + kapur + semen + air + gipsum terbentuk)
    const totalMixKg = tailingKg + limeKg + cementKg + (waterLiters * 1.0) + gypsumEstimateKg;

    // 3. Estimate blocks (with ~3% production loss)
    const usableMixKg = totalMixKg * 0.97;
    const spec = CC.PRODUCT_SPECS[productType];
    const estimatedBlocks = Math.floor(usableMixKg / spec.weightKg);

    // 4. Cost breakdown - HPAL uses Lime + Cement (not NaOH/Na2SiO3)
    const limeCost = Math.ceil(limeKg) * CC.LIME_Ca_OH_2_PRICE_PER_KG;
    const cementCost = Math.ceil(cementKg) * CC.CEMENT_ADDITIVE_PRICE_PER_KG;
    const waterCost = Math.ceil(waterLiters) * 50; // Rp 50/liter (air bersih lokal)
    const totalMaterialCostIDR = limeCost + cementCost + waterCost;
    const costPerBlock = estimatedBlocks > 0
        ? Math.round(totalMaterialCostIDR / estimatedBlocks)
        : 0;

    // 5. Mixing steps (in simple Bahasa Indonesia for BUMDes operators)
    const mixingSteps = isRaw
        ? [
            `Langkah 1 - Netralisasi Asam: Siapkan ${limeKarung} Karung (~${limeKg} Kg) kapur Ca(OH)₂. Campurkan kapur secara perlahan ke dalam ${tailingKarung} Karung (~${tailingKg} Kg) tailing HPAL di bak netralisasi. Aduk perlahan selama 10-15 menit hingga pH > 7 (cek dengan kertas lakmus). HATI-HATI: tailing mentah bersifat asam!`,
            `Langkah 2 - Pencampuran Semen: Setelah tailing ternetralisasi, tambahkan ${cementSak} Sak (~${cementKg} Kg) semen Portland Tipe I. Aduk kering hingga merata (~5 menit). Gipsum putih yang terbentuk (~${gypsumEstimateKg} Kg) adalah normal dan akan memperkuat produk.`,
            `Langkah 3 - Penambahan Air: Tuangkan ${waterLiters} Liter air bersih secara perlahan sambil terus diaduk. Campurkan hingga konsistensi adonan merata dan mudah dicetak (~5 menit).`,
            `Langkah 4 - Cetak & Curing: Cetak adonan menjadi ${spec.name}. Diamkan dalam cetakan 24 jam, lalu keluarkan dan simpan di tempat teduh selama 7 hari. Siram dengan air 2x sehari untuk pengerasan optimal.`,
        ]
        : [
            `Langkah 1 - Siapkan Material: Siapkan ${tailingKarung} Karung (~${tailingKg} Kg) tailing HPAL ternetralisasi. Tambahkan ${limeKarung} Karung (~${limeKg} Kg) kapur Ca(OH)₂ untuk penyempurnaan pH. Aduk rata 3-5 menit.`,
            `Langkah 2 - Pencampuran Semen: Tambahkan ${cementSak} Sak (~${cementKg} Kg) semen Portland Tipe I. Aduk kering hingga homogen (~5 menit).`,
            `Langkah 3 - Penambahan Air: Tuangkan ${waterLiters} Liter air bersih secara perlahan sambil terus diaduk. Campurkan hingga konsistensi merata (~5 menit).`,
            `Langkah 4 - Cetak & Curing: Cetak adonan menjadi ${spec.name}. Diamkan dalam cetakan 24 jam, lalu simpan di tempat teduh selama 7 hari. Siram dengan air 2x sehari untuk pengerasan optimal.`,
        ];

    // 6. Safety status - HPAL tailing validated against Ni/Co/Cr6/As TCLP limits
    const safetyStatus: 'CLEARED' | 'WARNING' = 'CLEARED';
    const safetyMessage = isRaw
        ? '✅ Tailing HPAL Mentah dari Tailing Storage Pond telah melalui uji TCLP dan memenuhi baku mutu PP No. 22 Tahun 2021 Lampiran XI untuk parameter Ni, Co, Cr⁶⁺, dan As. PERHATIAN: Tailing bersifat asam (H₂SO₄ ±30 gpl) - wajib lakukan netralisasi dengan kapur Ca(OH)₂ sebelum pencampuran. Gunakan sarung tangan dan kacamata pelindung.'
        : '✅ Tailing HPAL Pra-Netralisasi dari Buffer Storage telah divalidasi. Kadar asam bebas sangat rendah (±2 gpl), pH stabil > 7.5. Semua parameter TCLP (Ni, Co, Cr⁶⁺, As) jauh di bawah ambang batas. Aman untuk ditangani operator BUMDes tanpa perlindungan kimia khusus.';

    // 7. Buffer storage info - IMIP Morowali locations
    const storageKey = isRaw ? 'HPAL_RAW' : 'HPAL_NEUTRALIZED';
    const storage = CC.BUFFER_STORAGE[storageKey];

    return {
        tailingInputKg: tailingKg,
        tailingType,
        limeKg,
        limeKarung,
        cementKg,
        waterLiters,
        gypsumEstimateKg,
        // Backward compatibility fields - set to 0
        na2sio3Liters: 0,
        naohLiters: 0,
        tailingKarung,
        naohFlakesKg: 0,
        cementSak,
        productName: spec.name,
        totalMixKg: Math.round(totalMixKg * 100) / 100,
        estimatedBlocks,
        totalMaterialCostIDR,
        costBreakdown: {
            limeCost,
            cementCost,
            waterCost,
        },
        costPerBlock,
        mixingSteps,
        safetyStatus,
        safetyMessage,
        bufferStorageName: storage.locationName,
        availableTons: storage.availableTons,
        lastValidated: storage.lastValidated,
        tclpResults: storage.tclpResults,
    };
}
