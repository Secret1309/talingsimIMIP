
import Papa from 'papaparse';
import { MassBalanceResult } from './simulation/massBalance';
import { EconomicResult } from './simulation/economics';

const downloadFile = (content: string, filename: string, mimeType: string) => {
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + content], { type: mimeType });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export const exportSimulationData = (result: MassBalanceResult) => {
    const rows = [
        ['Parameter', 'Nilai', 'Satuan'],
        ['Input Tailing Harian', result.dailyTailingInput.toFixed(2), 'ton/hari'],
        ['Input Binder (Semen) Harian', result.dailyBinderInput.toFixed(2), 'ton/hari'],
        ['Input Kapur Ca(OH)₂ Harian', result.dailyLimeInput.toFixed(2), 'ton/hari'],
        ['Gipsum Sampingan Harian', result.dailyGypsumByProduct.toFixed(2), 'ton/hari'],
        ['Total Input Harian', result.dailyTotalInput.toFixed(2), 'ton/hari'],
        ['Output Produk Harian', result.dailyProductOutput.toFixed(2), 'ton/hari'],
        ['Kehilangan Harian', result.dailyLoss.toFixed(2), 'ton/hari'],
        ['Product Yield', result.productYield.toFixed(2), '%'],
        ['', '', ''],
        ['Input Tailing Tahunan', result.annualTailingInput.toFixed(2), 'ton/tahun'],
        ['Input Binder (Semen) Tahunan', result.annualBinderInput.toFixed(2), 'ton/tahun'],
        ['Input Kapur Ca(OH)₂ Tahunan', result.annualLimeInput.toFixed(2), 'ton/tahun'],
        ['Output Produk Tahunan', result.annualProductOutput.toFixed(2), 'ton/tahun'],
        ['', '', ''],
        ['=== STOIKIOMETRI NETRALISASI ===', '', ''],
        ['Sisa Asam Bebas (H₂SO₄)', result.h2so4ContentGpl.toFixed(1), 'gpl'],
        ['Kebutuhan Kapur per Ton Tailing', result.limeRequirementKgPerTonTailing.toFixed(1), 'kg/ton'],
        ['Gipsum Terbentuk per Ton Tailing', result.gypsumProducedKgPerTonTailing.toFixed(1), 'kg/ton'],
        ['', '', ''],
        ['Kualitas Produk', result.qualityGrade, '-'],
        ['Nama Produk', result.productName, '-'],
        ['Kuat Tekan', result.compressiveStrength.toFixed(1), 'MPa'],
        ['', '', ''],
        ['Konsumsi Energi Harian', result.dailyEnergyKWh.toFixed(2), 'kWh/hari'],
        ['Konsumsi Energi Tahunan', result.annualEnergyKWh.toFixed(2), 'kWh/tahun'],
    ];

    // Use tab-separated values so Excel auto-formats into columns
    const tsv = rows.map(row => row.join('\t')).join('\n');
    downloadFile(tsv, `TAILINGSIM_HPAL_Neraca_Massa_${new Date().toISOString().slice(0, 10)}.xls`, 'application/vnd.ms-excel');
};

export const exportEconomicReport = (econ: EconomicResult) => {
    const formatNum = (n: number) => Math.round(n).toLocaleString('id-ID');

    const rows = [
        ['TAILINGSIM HPAL - Laporan Tekno-Ekonomi', '', ''],
        ['Kompetisi LKTI HLHS PT IMIP 2026', '', ''],
        ['Tanggal', new Date().toLocaleDateString('id-ID'), ''],
        ['', '', ''],
        ['=== CAPEX (Investasi Awal) ===', '', ''],
        ['Komponen', 'Nilai (Rp)', 'Satuan'],
        ['Industrial Paddle Mixer', formatNum(econ.capexBreakdown.mixer), 'IDR'],
        ['Hydraulic Brick Press', formatNum(econ.capexBreakdown.molder), 'IDR'],
        ['Steam Curing Chamber', formatNum(econ.capexBreakdown.curingChamber), 'IDR'],
        ['Silo & Belt Conveyor', formatNum(econ.capexBreakdown.siloConveyor), 'IDR'],
        ['Unit Netralisasi Asam', formatNum(econ.capexBreakdown.neutralizationUnit), 'IDR'],
        ['Instalasi & Sipil & Engineering', formatNum(econ.capexBreakdown.installation), 'IDR'],
        ['CAPEX TOTAL', formatNum(econ.capexTotal), 'IDR'],
        ['', '', ''],
        ['=== OPEX (Biaya Operasional/Tahun) ===', '', ''],
        ['Komponen', 'Nilai (Rp)', 'Satuan'],
        ['Biaya Semen (Binder)', formatNum(econ.opexBreakdown.binderCost), 'IDR/tahun'],
        ['Biaya Kapur Netralisasi', formatNum(econ.opexBreakdown.limeCost), 'IDR/tahun'],
        ['Biaya Energi', formatNum(econ.opexBreakdown.energyCost), 'IDR/tahun'],
        ['Tenaga Kerja', formatNum(econ.opexBreakdown.laborCost), 'IDR/tahun'],
        ['Pemeliharaan & Lingkungan', formatNum(econ.opexBreakdown.maintenance), 'IDR/tahun'],
        ['Pra-Perlakuan Tailing', formatNum(econ.opexBreakdown.preTreatmentCost), 'IDR/tahun'],
        ['OPEX TOTAL', formatNum(econ.annualOpex), 'IDR/tahun'],
        ['', '', ''],
        ['=== REVENUE (Pendapatan/Tahun) ===', '', ''],
        ['Komponen', 'Nilai (Rp)', 'Satuan'],
        ['Penjualan Produk SNI', formatNum(econ.revenueBreakdown.productSales), 'IDR/tahun'],
        ['Tipping Fee PT IMIP', formatNum(econ.revenueBreakdown.tippingFee), 'IDR/tahun'],
        ['REVENUE TOTAL', formatNum(econ.annualRevenue), 'IDR/tahun'],
        ['', '', ''],
        ['=== PROFITABILITAS ===', '', ''],
        ['Metrik', 'Nilai', 'Satuan'],
        ['Laba Kotor', formatNum(econ.grossProfit), 'IDR/tahun'],
        ['Laba Bersih', formatNum(econ.netProfit), 'IDR/tahun'],
        ['NPV (10 Tahun)', formatNum(econ.metrics.npv), 'IDR'],
        ['IRR', econ.metrics.irr.toFixed(1), '%'],
        ['Payback Period', econ.metrics.paybackPeriod.toFixed(1), 'Tahun'],
        ['', '', ''],
        ['=== UNIT ECONOMICS ===', '', ''],
        ['Metrik', 'Nilai', 'Satuan'],
        ['Harga Jual Produk', formatNum(econ.productPricePerTon), 'IDR/ton'],
        ['Biaya Produksi', formatNum(Math.round(econ.costPerTonProduct)), 'IDR/ton'],
        ['Margin per Ton', formatNum(Math.round(econ.productPricePerTon - econ.costPerTonProduct)), 'IDR/ton'],
    ];

    const tsv = rows.map(row => row.join('\t')).join('\n');
    downloadFile(tsv, `TAILINGSIM_HPAL_Laporan_Ekonomi_${new Date().toISOString().slice(0, 10)}.xls`, 'application/vnd.ms-excel');
};
