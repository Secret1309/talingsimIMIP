// ============================================================
// TAILINGSIM - Simulation Constants for HPAL Nickel Laterite Tailing
// LKTI HLHS PT IMIP 2026 Competition
// 1. Muhammad Ilham Saripul Milah (Lead Researcher & Full-Stack Developer | Metallurgical Engineering ITB, FTTM)
// 2. Dzaky Zahy Rabbani (Numerical Modelling & Developer | Oceanography ITB, FITB)
// 3. Dean (Chemical Engineering Lead Researcher | Chemical Engineering ITB, FTI)
// ============================================================

// --- TAILING TYPES ---
// Dua skenario tailing HPAL berdasarkan status netralisasi asamnya
export const TAILING_TYPES = {
    HPAL_RAW: 'Tailing HPAL Mentah (High Free Acid ±30 gpl)',
    HPAL_NEUTRALIZED: 'Tailing HPAL Pra-Netralisasi (Low Free Acid)',
} as const;

export type TailingType = typeof TAILING_TYPES[keyof typeof TAILING_TYPES];

// --- TAILING COMPOSITION INTERFACE ---
// Diperluas dengan parameter khas tailing HPAL nikel laterit
export interface TailingComposition {
    // Oksida utama (% berat kering)
    Fe2O3: number;   // Hematit - dominan, hasil hidrolisis besi di autoklaf
    SiO2: number;    // Silika/Kuarsa - penyusun utama residu padat
    MgO: number;     // Magnesia - pengonsumsi asam selama pelindian
    Al2O3: number;   // Alumina - sebagian terlarut, sebagian terendapkan
    others: number;  // NiO sisa, CoO, CaO, dll (% berat)

    // Parameter khas HPAL
    H2SO4_gpl: number; // Sisa asam sulfat bebas (g/L) - kritis untuk netralisasi

    // Kualitas produk hasil upcycling
    qualityGrade: 'standard' | 'premium';
    productName: string; // Nama produk konstruksi yang dihasilkan

    // Narasi teknis (untuk Dashboard)
    chemicalProfile: string;
    biogeopolymerProductionImpact: string;

    // Biaya pra-perlakuan (Rp/ton tailing)
    preTreatmentCostPerTon: number;
}

// --- DEFAULT TAILING PROFILES ---
// Berdasarkan data komposisi tailing HPAL nikel laterit zona limonit
// Referensi: Crundwell et al. (2011), Tabel 1 dari draft paper KTI
export const DEFAULT_TAILING: Record<TailingType, TailingComposition> = {
    [TAILING_TYPES.HPAL_RAW]: {
        // Komposisi khas tailing HPAL mentah pasca-CCD (Counter Current Decantation)
        // Sebelum tahap netralisasi dengan kapur
        Fe2O3: 42.5,   // % - Hematit tinggi, hasil hidrolisis Fe2(SO4)3 → Fe2O3 + 3H2SO4
        SiO2: 35.2,    // % - Silika residu, tidak larut dalam H2SO4
        MgO: 8.3,      // % - Magnesia, sebagian terlarut saat pelindian
        Al2O3: 6.1,    // % - Alumina, sebagian mengendap sebagai alunit/jarosit
        others: 7.9,   // % - NiO (<0.1%), CoO (<0.05%), CaO, TiO2, dll
        H2SO4_gpl: 30, // g/L - Sisa asam bebas khas tailing HPAL (kritis!)

        qualityGrade: 'standard',
        productName: 'Batako Berongga (Hollow Block) SNI 03-0349-1989',

        chemicalProfile:
            'Didominasi hematit (Fe₂O₃ ~42%) dan silika (SiO₂ ~35%) hasil reaksi di ' +
            'autoklaf HPAL (240-260°C, 40 atm). Mengandung sisa asam sulfat bebas ' +
            '(H₂SO₄ ±30 gpl) yang bersifat korosif dan membutuhkan netralisasi ' +
            'menyeluruh dengan kapur tohor (CaO) atau kalsium hidroksida (Ca(OH)₂) ' +
            'sebelum dapat diproses lebih lanjut. Kandungan NiO dan CoO sangat rendah ' +
            '(<0.1%) karena sudah terekstraksi. Mengandung logam berat sisa ' +
            '(Cr, As) yang harus dienkapsulasi.',

        preTreatmentCostPerTon: 35_000,
        // Biaya pra-perlakuan (stabilisasi logam berat, tidak termasuk netralisasi asam yang sudah dihitung terpisah)

        biogeopolymerProductionImpact:
            'Tantangan utama: netralisasi H₂SO₄ sisa (±30 gpl) menggunakan Ca(OH)₂. ' +
            'Reaksi: H₂SO₄ + Ca(OH)₂ → CaSO₄·2H₂O (Gipsum) + H₂O. Gipsum yang ' +
            'terbentuk ikut terenkapsulasi dalam matriks batako sebagai filler mikro. ' +
            'Fe₂O₃ (hematit) bertindak sebagai mikrofiller yang meningkatkan densitas ' +
            'dan mengurangi porositas produk. SiO₂ reaktif berpotensi membentuk ' +
            'kalsium silikat hidrat (C-S-H) bersama semen, meningkatkan kuat tekan. ' +
            'Cr⁶⁺ harus dienkapsulasi dalam matriks semen/kapur untuk lulus uji TCLP ' +
            'PP No. 22 Tahun 2021.',
    },

    [TAILING_TYPES.HPAL_NEUTRALIZED]: {
        // Komposisi tailing HPAL pasca-netralisasi bertahap dengan kapur
        // H2SO4 sudah sangat rendah, aman untuk proses pencampuran langsung
        Fe2O3: 40.1,   // % - Hematit, sedikit berkurang karena diencerkan gipsum
        SiO2: 33.8,    // % - Silika, stabil
        MgO: 7.9,      // % - Magnesia, stabil
        Al2O3: 5.8,    // % - Alumina, stabil
        others: 12.4,  // % - Termasuk ~4% CaSO₄·2H₂O (gipsum hasil netralisasi)
        H2SO4_gpl: 2,  // g/L - Asam sisa sangat rendah pasca-netralisasi (aman)

        qualityGrade: 'premium',
        productName: 'Paving Block (Bata Beton) SNI 03-0691-1996',

        chemicalProfile:
            'Profil kimia pasca-netralisasi dua tahap: (1) penambahan kapur aktif ' +
            '(CaO) untuk menetralkan free acid, menghasilkan gipsum (CaSO₄·2H₂O) ' +
            'sebagai produk sampingan yang ikut terenkapsulasi. (2) Stabilisasi pH ' +
            '> 7.5. Komposisi didominasi hematit (Fe₂O₃ ~40%) dan silika (SiO₂ ~34%) ' +
            'dengan kandungan gipsum ~4%. Kadar Ni/Co sangat rendah (<0.1%). ' +
            'Lebih stabil secara kimiawi dan aman untuk ditangani operator BUMDes ' +
            'tanpa perlindungan kimia khusus.',

        preTreatmentCostPerTon: 22_000,
        // Biaya lebih rendah - netralisasi sudah dilakukan di fasilitas PT IMIP

        biogeopolymerProductionImpact:
            'Kondisi ideal untuk produksi paving block premium. Netralisasi sudah ' +
            'selesai, gipsum yang terbentuk (±4%) berfungsi sebagai retarder alami ' +
            'yang mengontrol waktu setting produk (ideal untuk pencetakan). ' +
            'Fe₂O₃ tinggi (~40%) meningkatkan densitas produk akhir secara signifikan ' +
            '(target >2,0 g/cm³). SiO₂ reaktif bereaksi dengan Ca(OH)₂ sisa membentuk ' +
            'C-S-H (Calcium Silicate Hydrate) yang memperkuat matriks semen. ' +
            'Estimasi kuat tekan produk ≥ 20 MPa (Mutu B - SNI 03-0691-1996), ' +
            'memenuhi standar paving block area industri kelas berat.',
    },
};

// --- ECONOMIC DEFAULTS ---
// Konstanta tekno-ekonomi untuk pabrik upcycling tailing HPAL skala industri
// Konteks: Kawasan PT IMIP, Morowali, Sulawesi Tengah
export const ECONOMIC_DEFAULTS = {
    // === CAPEX REFERENSI ===
    // Pabrik pengolahan tailing HPAL skala menengah (50 ton/hari)
    // Komponen utama: unit netralisasi + pencampuran + pencetakan + curing
    CAPEX_MIXER_REF: 2_800_000_000,          // Rp 2.8 M - Industrial Paddle Mixer (untuk material abrasif/korosif)
    CAPEX_MOLDER_REF: 3_200_000_000,         // Rp 3.2 M - Hydraulic Brick Press (kapasitas 10 ton/jam)
    CAPEX_CURING_CHAMBER_REF: 1_800_000_000, // Rp 1.8 M - Steam Curing Chamber (untuk akselerasi C-S-H)
    CAPEX_SILO_CONVEYOR_REF: 1_200_000_000,  // Rp 1.2 M - Silo tailing + belt conveyor anti-korosi
    CAPEX_NEUTRALIZATION_UNIT_REF: 1_500_000_000, // Rp 1.5 M - Unit netralisasi asam (tangki, agitator, pH meter)
    CAPEX_REF_CAPACITY: 50,                  // ton/hari - Kapasitas referensi pabrik kecil-menengah

    // === SCALING RULE ===
    SCALING_FACTOR: 0.6,  // Six-Tenths Rule (Chemical Engineering plant cost scaling)
    // CAPEX_scaled = CAPEX_ref × (Capacity_target / Capacity_ref)^0.6
    // Berlaku untuk range 50 - 500 ton/hari (kisaran operasional PT IMIP)

    // === LANG FACTORS (untuk pabrik di kawasan industri, termasuk infrastruktur) ===
    LANG_FACTORS: {
        INSTALLATION: 0.18,   // 18% - Instalasi perpipaan (pipa anti-korosi SS316 untuk slurry asam)
        CIVIL: 0.14,          // 14% - Sipil: pondasi, bangunan, bak netralisasi tahan asam
        ENGINEERING: 0.10,    // 10% - Engineering, procurement, commissioning (EPC)
        CONTINGENCY: 0.10,    // 10% - Kontingensi (risiko konstruksi di Morowali)
    },

    // === OPEX COMPONENTS ===
    // Labor cost scales sub-linearly with capacity using 0.25 power law
    // Ref capacity: 50 ton/hari = 10 orang (UMK Morowali 2024 ~Rp 3.6 jt/bulan)
    LABOR_COST_REF_YEAR: 432_000_000,   // Rp 432 jt/tahun (10 orang × Rp 3.6 jt × 12 bulan)
    LABOR_REF_CAPACITY: 50,              // ton/hari (kapasitas referensi untuk labor scaling)
    LABOR_SCALING_FACTOR: 0.25,          // Power law exponent (sub-linear: doubling capacity +19% labor)
    OPEX_FIXED_PERCENT: 0.04,            // 4% CAPEX (pemeliharaan + asuransi + lingkungan)
    ELECTRICITY_COST_KWH: 1_444,         // Rp/kWh (Tarif Industri PLN Golongan I-3 Tegangan Menengah)

    // === BIAYA BAHAN BAKU NETRALISASI ===
    // Parameter baru khas HPAL - tidak ada di versi tailing emas/tembaga
    LIME_COST_PER_KG: 2_000,   // Rp 2.000/kg (kapur tohor CaO, harga lokal Sulawesi Tengah)
    // Range referensi: Rp 1.500-2.500/kg (tergantung kemurnian dan jarak dari Palu)

    // === BINDER SEMEN ===
    // Untuk tailing HPAL, binder utama adalah Portland Cement (bukan alkali aktivator)
    // karena kandungan SiO2 + Fe2O3 bertindak sebagai pozolan reaktif
    BINDER_COST_PER_KG: 2_200, // Rp 2.200/kg (Semen Portland tipe I, harga Morowali)
    // Catatan: 1 sak semen 40 kg = Rp 88.000 di Morowali (lebih mahal dari Jawa)

    // === HARGA JUAL PRODUK (B2B Kawasan IMIP) ===
    // Produk dikonsumsi internal untuk infrastruktur kawasan industri & perumahan karyawan
    // Ref: Survey harga material konstruksi Sulawesi Tengah 2024-2025
    PRODUCT_PRICE_STANDARD: 550_000,  // Rp 550.000/ton (Batako Berongga, SNI 03-0349-1989)
    // ~Rp 4.950/buah batako 40x20x10cm (harga grosir kawasan industri Sulawesi)
    PRODUCT_PRICE_PREMIUM: 850_000,   // Rp 850.000/ton (Paving Block, SNI 03-0691-1996)
    // ~Rp 2.635/buah paving block 21x10.5x6cm (harga grosir proyek infrastruktur IMIP)

    // === TIPPING FEE ===
    // PT IMIP membayar biaya pengelolaan limbah ke operator pabrik upcycling
    // Referensi: Biaya disposal limbah B3 di Indonesia Rp 500.000-2.000.000/ton (PP 22/2021)
    // Tipping fee jauh di bawah biaya disposal konvensional = insentif kuat bagi IMIP
    TIPPING_FEE_PER_TON: 150_000, // Rp 150.000/ton (masih 70-90% lebih murah dari disposal konvensional B3)

    // === PARAMETER FINANSIAL ===
    DISCOUNT_RATE: 0.12,   // 12% WACC (lebih tinggi dari standar karena risiko operasi kawasan industri)
    TAX_RATE: 0.22,        // 22% PPh Badan
    PROJECT_YEARS: 10,     // 10 tahun (sesuai umur teknis peralatan)
};

// --- ENERGY CONSTANTS ---
// Konsumsi energi per tahap proses (kWh/ton produk)
// Lebih tinggi dari geopolimer biasa karena proses netralisasi memerlukan agitasi
export const ENERGY_CONSTANTS = {
    MIXING_ENERGY_KWH_PER_TON: 30,        // kWh/ton - Lebih tinggi karena abrasivitas hematit
    MOLDING_ENERGY_KWH_PER_TON: 18,       // kWh/ton - Hydraulic press untuk densifikasi
    CONVEYOR_ENERGY_KWH_PER_TON: 6,       // kWh/ton - Material handling slurry
    NEUTRALIZATION_ENERGY_KWH_PER_TON: 8, // kWh/ton - Agitasi tangki netralisasi (BARU)

    // Curing: steam curing lebih efektif untuk tailing berbasis hematit (akselerasi C-S-H)
    CURING_BASE_KWH_PER_TON_PER_DEG: 1.0, // kWh/ton/°C di atas 25°C

    OPERATING_DAYS: 300, // hari/tahun operasi (mempertimbangkan maintenance & shutdown)
};

// --- COMMUNITY CONSTANTS ---
// Konstanta untuk Kalkulator BUMDes / Komunitas Lokal Morowali
export const COMMUNITY_CONSTANTS = {
    // === HARGA ECERAN LOKAL MOROWALI (bukan Mimika/Papua) ===
    // Referensi: Survey harga bahan bangunan Kabupaten Morowali, 2024-2025
    LIME_CaO_PRICE_PER_KG: 2_200,        // Rp 2.200/kg (kapur tohor CaO untuk netralisasi)
    LIME_Ca_OH_2_PRICE_PER_KG: 1_800,    // Rp 1.800/kg (kapur padam Ca(OH)₂, lebih murah)
    CEMENT_PRICE_PER_SAK: 95_000,        // Rp 95.000/Sak 40 kg (Toko Bangunan Bungku/Kolonodale)
    CEMENT_ADDITIVE_PRICE_PER_KG: 2_375, // Kalkulasi otomatis dari harga Sak
    SAND_PRICE_PER_M3: 250_000,          // Rp 250.000/m³ (pasir sungai lokal Morowali)

    // === SPECIFIC GRAVITY MATERIAL ===
    TAILING_BULK_DENSITY: 1.7,  // kg/L (tailing HPAL lebih padat karena kandungan hematit tinggi)
    LIME_BULK_DENSITY: 0.9,     // kg/L (kapur tohor bulk density)
    CEMENT_BULK_DENSITY: 1.35,  // kg/L

    // === PARAMETER SAFETY FLAG ===
    // Baku Mutu TCLP (Toxicity Characteristic Leaching Procedure)
    // Referensi: PP No. 22 Tahun 2021, Lampiran XI
    // Parameter kritis untuk tailing HPAL nikel laterit (berbeda dari Au/Cu)
    TCLP_LIMITS: {
        Ni: 5.0,   // Nikel (mg/L) - parameter utama nikel laterit
        Co: 1.0,   // Kobalt (mg/L)
        Cr6: 0.5,  // Kromium Heksavalen (mg/L) - sangat toksik, ada di laterit
        As: 0.5,   // Arsen (mg/L)
        // Catatan: Pb, Cd tidak relevan untuk HPAL laterit (tidak signifikan)
    },

    // === SPESIFIKASI PRODUK SNI ===
    PRODUCT_SPECS: {
        PAVING_BLOCK: {
            name: 'Paving Block (Bata Beton)',
            sni: 'SNI 03-0691-1996',
            dimensions: '21 cm × 10,5 cm × 6 cm',
            weightKg: 3.1,
            minStrengthMPa: 20, // Mutu B (area industri ringan)
        },
        BATAKO_BERONGGA: {
            name: 'Batako Berongga (Hollow Block)',
            sni: 'SNI 03-0349-1989',
            dimensions: '40 cm × 20 cm × 10 cm',
            weightKg: 9.0,
            minStrengthMPa: 2.5, // Mutu III (dinding non-struktural)
        },
    },

    // === RASIO RESEP STANDAR TAILING HPAL ===
    // Berbeda dari resep geopolimer! Untuk tailing HPAL, binder utama adalah
    // campuran semen Portland + kapur (untuk memanfaatkan silika reaktif membentuk C-S-H)
    RECIPE_RATIOS: {
        // Untuk Tailing HPAL Mentah (perlu netralisasi dulu):
        RAW: {
            LIME_KG_PER_KG_TAILING: 0.085,    // 8.5% kapur untuk netralkan 30 gpl H2SO4
            CEMENT_KG_PER_KG_TAILING: 0.15,   // 15% semen sebagai binder utama
            WATER_LITER_PER_KG_TAILING: 0.12, // 12% air (W/C ratio ~0.5)
        },
        // Untuk Tailing HPAL Pra-Netralisasi (langsung dicampur):
        NEUTRALIZED: {
            LIME_KG_PER_KG_TAILING: 0.02,     // 2% kapur (hanya untuk penyempurnaan pH)
            CEMENT_KG_PER_KG_TAILING: 0.12,   // 12% semen
            WATER_LITER_PER_KG_TAILING: 0.10, // 10% air
        },
    },

    // === BUFFER STORAGE IMIP (Data simulasi) ===
    // Lokasi penyimpanan tailing yang telah divalidasi keamanannya
    BUFFER_STORAGE: {
        HPAL_RAW: {
            locationName: 'Tailing Storage Pond - HPAL Plant, Kawasan IMIP Block C',
            availableTons: 15_000,  // ton (stok harian dari operasi HPAL)
            lastValidated: '2026-05-10',
            tclpResults: { Ni: 3.2, Co: 0.45, Cr6: 0.28, As: 0.15 }, // Lulus TCLP
        },
        HPAL_NEUTRALIZED: {
            locationName: 'Intermediate Buffer Storage - Post-Neutralization Tank, IMIP',
            availableTons: 8_500,
            lastValidated: '2026-05-12',
            tclpResults: { Ni: 0.8, Co: 0.12, Cr6: 0.05, As: 0.04 }, // Jauh di bawah ambang batas
        },
    },
};
