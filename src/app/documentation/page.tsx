
import { Header } from "@/components/layout/Header";
import { ArrowLeft } from "lucide-react";
import Link from 'next/link';

export default function Documentation() {
    return (
        <div className="min-h-screen bg-gray-100">
            <Header />

            <main className="container mx-auto max-w-5xl px-4 py-12">
                <Link href="/" className="mb-8 inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-800">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Beranda
                </Link>

                <div className="mb-10">
                    <h1 className="text-4xl font-bold text-gray-900">Dokumentasi & Logika Simulasi</h1>
                    <p className="mt-4 text-lg text-gray-600">
                        Penjelasan lengkap mengenai algoritma, model neraca massa, stoikiometri netralisasi, dan analisis tekno-ekonomi yang digunakan dalam TAILINGSIM untuk tailing HPAL nikel laterit PT IMIP.
                    </p>
                </div>

                <div className="space-y-12">
                    {/* 1. Alur Simulasi */}
                    <section className="rounded-2xl border bg-white p-8 shadow-sm">
                        <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-gray-900">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-sm text-gray-700">1</span>
                            Alur Kerja Simulasi
                        </h2>
                        <div className="prose max-w-none text-gray-600">
                            <p>
                                Saat pengguna menekan tombol <strong>Jalankan Simulasi</strong>, sistem melakukan
                                komputasi sekuensial berikut secara real-time:
                            </p>
                            <ol className="mt-4 list-decimal space-y-2 pl-5">
                                <li>
                                    <strong>Input Parsing</strong>: Membaca parameter pengguna (Jenis Tailing HPAL, Kapasitas Produksi, Rasio Semen/Binder, Suhu Steam Curing).
                                </li>
                                <li>
                                    <strong>Stoikiometri Netralisasi</strong>: Menghitung kebutuhan Ca(OH)₂ berdasarkan konsentrasi H₂SO₄ sisa, dan massa gipsum terbentuk.
                                </li>
                                <li>
                                    <strong>Mass Balance Calculation</strong>: Menghitung neraca massa termasuk tailing + kapur + semen + gipsum → produk.
                                </li>
                                <li>
                                    <strong>Quality Estimation</strong>: Memperkirakan kuat tekan berdasarkan Fe₂O₃, SiO₂, rasio semen, dan suhu curing.
                                </li>
                                <li>
                                    <strong>Economic Evaluation</strong>: Menghitung CAPEX, OPEX (termasuk biaya kapur), Revenue, NPV, IRR, dan Payback Period.
                                </li>
                            </ol>
                        </div>
                    </section>

                    {/* 2. Neraca Massa */}
                    <section className="rounded-2xl border bg-white p-8 shadow-sm">
                        <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-gray-900">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-sm text-gray-700">2</span>
                            Model Neraca Massa HPAL
                        </h2>
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">Reaksi Netralisasi Asam</h3>
                                <p className="text-gray-600 mb-2">Tailing HPAL mengandung sisa asam sulfat bebas yang harus dinetralkan:</p>
                                <div className="rounded-lg bg-gray-900 p-4 font-mono text-red-400">
                                    H₂SO₄ + Ca(OH)₂ → CaSO₄·2H₂O (Gipsum) + H₂O
                                </div>
                                <div className="mt-3 rounded-lg bg-gray-900 p-4 font-mono text-amber-400">
                                    m_lime = (m_H₂SO₄ / 98) × 74 × 1.15 &nbsp;&nbsp;[faktor excess 15%]
                                </div>
                                <div className="mt-3 rounded-lg bg-gray-900 p-4 font-mono text-blue-400">
                                    m_gypsum = (m_H₂SO₄ / 98) × 172
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">Neraca Massa Total</h3>
                                <div className="rounded-lg bg-gray-900 p-4 font-mono text-yellow-400">
                                    M_product = M_tailing + M_binder + M_lime + M_gypsum - M_loss
                                </div>
                                <div className="mt-3 rounded-lg bg-gray-900 p-4 font-mono text-green-400">
                                    M_binder = M_tailing × (Binder_Ratio / 100)
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">Faktor Kehilangan (Loss Factor)</h3>
                                <p className="text-gray-600 mb-2">
                                    Kehilangan material dipengaruhi oleh status netralisasi, rasio binder, dan suhu curing:
                                </p>
                                <ul className="mt-2 text-sm text-gray-600 list-disc pl-5">
                                    <li>Tailing HPAL Mentah: Base loss 3.5% (memerlukan netralisasi)</li>
                                    <li>Tailing HPAL Ternetralisasi: Base loss 2.0% (material lebih homogen)</li>
                                    <li>Binder ratio tinggi: mengurangi loss hingga 1.2%</li>
                                    <li>Suhu steam curing optimal (40-70°C): mengurangi loss 0.4%</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">Estimasi Kuat Tekan</h3>
                                <p className="text-gray-600 mb-2">Kuat tekan produk (MPa) ditentukan oleh model semi-empirik:</p>
                                <div className="rounded-lg bg-gray-100 p-4 font-mono text-gray-800 border-l-4 border-gray-500">
                                    σ = σ_base + (BR × 0.75) + min((T - 25) × 0.18, 10) + (Fe₂O₃ - 30) × 0.12 + (SiO₂ - 20) × 0.08
                                </div>
                                <ul className="mt-2 text-sm text-gray-600 list-disc pl-5">
                                    <li>σ_base: 12 MPa (standar/mentah) atau 22 MPa (premium/ternetralisasi)</li>
                                    <li>BR: Rasio semen meningkatkan kekuatan secara linier</li>
                                    <li>T: Suhu steam curing meningkatkan early-age strength (maks +10 MPa)</li>
                                    <li>Fe₂O₃: Hematit {'>'} 30% meningkatkan densitas (efek microfiller)</li>
                                    <li>SiO₂: Silika reaktif {'>'} 20% membentuk C-S-H bersama semen</li>
                                    <li>Bonus +1.5 MPa untuk tailing ternetralisasi (efek gipsum retarder)</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* 3. Komposisi Tailing HPAL */}
                    <section className="rounded-2xl border bg-white p-8 shadow-sm">
                        <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-gray-900">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-sm text-gray-700">3</span>
                            Komposisi Tailing HPAL
                        </h2>
                        <div className="overflow-hidden rounded-lg border">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Parameter</th>
                                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Tailing HPAL Mentah</th>
                                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Tailing HPAL Ternetralisasi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    <tr>
                                        <td className="px-4 py-3 text-gray-700">Fe₂O₃ (Hematit)</td>
                                        <td className="px-4 py-3 font-mono text-gray-900">42.5%</td>
                                        <td className="px-4 py-3 font-mono text-gray-900">40.1%</td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-3 text-gray-700">SiO₂ (Silika)</td>
                                        <td className="px-4 py-3 font-mono text-gray-900">35.2%</td>
                                        <td className="px-4 py-3 font-mono text-gray-900">33.8%</td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-3 text-gray-700">MgO (Magnesia)</td>
                                        <td className="px-4 py-3 font-mono text-gray-900">8.3%</td>
                                        <td className="px-4 py-3 font-mono text-gray-900">7.9%</td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-3 text-gray-700">Al₂O₃ (Alumina)</td>
                                        <td className="px-4 py-3 font-mono text-gray-900">6.1%</td>
                                        <td className="px-4 py-3 font-mono text-gray-900">5.8%</td>
                                    </tr>
                                    <tr className="bg-red-50">
                                        <td className="px-4 py-3 text-gray-700 font-semibold">H₂SO₄ Bebas</td>
                                        <td className="px-4 py-3 font-mono text-red-700 font-bold">±30 gpl</td>
                                        <td className="px-4 py-3 font-mono text-green-700 font-bold">±2 gpl</td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-3 text-gray-700">Grade Produk</td>
                                        <td className="px-4 py-3 text-gray-900">Standar (Batako Berongga)</td>
                                        <td className="px-4 py-3 text-gray-900">Premium (Paving Block)</td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-3 text-gray-700">Harga Jual Produk</td>
                                        <td className="px-4 py-3 font-mono text-gray-900">Rp 380.000/ton</td>
                                        <td className="px-4 py-3 font-mono text-gray-900">Rp 680.000/ton</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* 4. Model Ekonomi */}
                    <section className="rounded-2xl border bg-white p-8 shadow-sm">
                        <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-gray-900">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-sm text-gray-700">4</span>
                            Analisis Tekno-Ekonomi (TEA)
                        </h2>
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">CAPEX (Capital Expenditure)</h3>
                                <p className="text-gray-600 mb-2">Investasi awal pabrik upcycling tailing HPAL dihitung berdasarkan Six-Tenths Rule:</p>
                                <div className="rounded-lg bg-gray-900 p-4 font-mono text-yellow-400">
                                    CAPEX_scaled = CAPEX_ref × (Capacity / Capacity_ref)^0.6
                                </div>
                                <div className="mt-3 overflow-hidden rounded-lg border">
                                    <table className="w-full text-sm">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-3 text-left font-semibold text-gray-700">Komponen</th>
                                                <th className="px-4 py-3 text-left font-semibold text-gray-700">Referensi (50 ton/hari)</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y">
                                            <tr>
                                                <td className="px-4 py-3 text-gray-700">Industrial Paddle Mixer (Anti-korosi)</td>
                                                <td className="px-4 py-3 font-mono text-gray-900">Rp 2,8 Miliar</td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-3 text-gray-700">Hydraulic Brick Press</td>
                                                <td className="px-4 py-3 font-mono text-gray-900">Rp 3,2 Miliar</td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-3 text-gray-700">Steam Curing Chamber</td>
                                                <td className="px-4 py-3 font-mono text-gray-900">Rp 1,8 Miliar</td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-3 text-gray-700">Silo & Belt Conveyor Anti-korosi</td>
                                                <td className="px-4 py-3 font-mono text-gray-900">Rp 1,2 Miliar</td>
                                            </tr>
                                            <tr className="bg-amber-50">
                                                <td className="px-4 py-3 text-amber-800 font-semibold">Unit Netralisasi Asam (BARU)</td>
                                                <td className="px-4 py-3 font-mono text-amber-900 font-bold">Rp 1,5 Miliar</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="grid gap-6 md:grid-cols-3">
                                <div className="rounded-lg border p-4">
                                    <h4 className="font-semibold text-gray-900">NPV</h4>
                                    <p className="mt-1 text-sm text-gray-600">
                                        Σ [CF_t / (1+r)^t] - I₀ dengan discount rate 12% (WACC) selama 10 tahun.
                                    </p>
                                </div>
                                <div className="rounded-lg border p-4">
                                    <h4 className="font-semibold text-gray-900">IRR</h4>
                                    <p className="mt-1 text-sm text-gray-600">
                                        Internal Rate of Return dihitung menggunakan metode Newton-Raphson iteratif.
                                    </p>
                                </div>
                                <div className="rounded-lg border p-4">
                                    <h4 className="font-semibold text-gray-900">Payback Period</h4>
                                    <p className="mt-1 text-sm text-gray-600">
                                        CAPEX / Annual Cash Flow. Waktu pengembalian investasi.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 5. OPEX */}
                    <section className="rounded-2xl border bg-white p-8 shadow-sm">
                        <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-gray-900">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-sm text-gray-700">5</span>
                            Komponen Biaya Operasional (OPEX)
                        </h2>
                        <div className="space-y-6">
                            <div className="overflow-hidden rounded-lg border">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left font-semibold text-gray-700">Komponen OPEX</th>
                                            <th className="px-4 py-3 text-left font-semibold text-gray-700">Kalkulasi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        <tr>
                                            <td className="px-4 py-3 text-gray-700">Biaya Semen (Binder)</td>
                                            <td className="px-4 py-3 text-gray-600">M_binder (ton/hari) × 1000 × Rp 2.200/kg × 300 hari</td>
                                        </tr>
                                        <tr className="bg-amber-50">
                                            <td className="px-4 py-3 text-amber-800 font-semibold">Biaya Kapur Netralisasi (BARU)</td>
                                            <td className="px-4 py-3 text-amber-700">M_lime (ton/tahun) × 1000 × Rp 2.000/kg</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-3 text-gray-700">Biaya Energi</td>
                                            <td className="px-4 py-3 text-gray-600">Total kWh/tahun × Rp 1.444/kWh (tarif industri PLN)</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-3 text-gray-700">Tenaga Kerja</td>
                                            <td className="px-4 py-3 text-gray-600">Rp 2,16 Miliar/tahun (UMK Morowali × 20 orang)</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-3 text-gray-700">Pemeliharaan & Lingkungan</td>
                                            <td className="px-4 py-3 text-gray-600">4.5% dari CAPEX total</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div className="rounded-lg bg-gray-50 p-4 text-sm text-gray-700 border border-gray-200">
                                <strong>Catatan:</strong> Limbah tailing HPAL diasumsikan gratis (Rp 0/ton) karena merupakan limbah industri.
                                Bahkan, pabrik menerima <strong>Tipping Fee</strong> sebesar Rp 75.000/ton dari PT IMIP untuk menerima tailing, menjadikan bahan baku justru menghasilkan pendapatan.
                            </div>
                        </div>
                    </section>

                    {/* 6. Energi */}
                    <section className="rounded-2xl border bg-white p-8 shadow-sm">
                        <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-gray-900">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-sm text-gray-700">6</span>
                            Konsumsi Energi
                        </h2>
                        <div className="space-y-6">
                            <p className="text-gray-600">
                                Konsumsi energi dihitung berdasarkan tahapan proses dan suhu curing yang dipilih:
                            </p>
                            <div className="overflow-hidden rounded-lg border">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left font-semibold text-gray-700">Tahap Proses</th>
                                            <th className="px-4 py-3 text-left font-semibold text-gray-700">Konsumsi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        <tr>
                                            <td className="px-4 py-3 text-gray-700">Mixing (Abrasivitas hematit tinggi)</td>
                                            <td className="px-4 py-3 font-mono text-gray-900">30 kWh/ton produk</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-3 text-gray-700">Molding (Hydraulic Press)</td>
                                            <td className="px-4 py-3 font-mono text-gray-900">18 kWh/ton produk</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-3 text-gray-700">Material Handling (Slurry)</td>
                                            <td className="px-4 py-3 font-mono text-gray-900">6 kWh/ton input</td>
                                        </tr>
                                        <tr className="bg-amber-50">
                                            <td className="px-4 py-3 text-amber-800 font-semibold">Netralisasi Asam (BARU)</td>
                                            <td className="px-4 py-3 font-mono text-amber-900 font-bold">8 kWh/ton tailing</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-3 text-gray-700">Steam Curing (jika {'>'}25°C)</td>
                                            <td className="px-4 py-3 font-mono text-gray-900">1.0 kWh/ton/°C di atas 25°C</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </section>

                    {/* 7. Pengaruh Tailing HPAL */}
                    <section className="rounded-2xl border bg-white p-8 shadow-sm">
                        <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-gray-900">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-sm text-gray-700">7</span>
                            Pengaruh Status Netralisasi Tailing HPAL
                        </h2>
                        <div className="space-y-6">
                            <p className="text-gray-600">
                                Status netralisasi asam pada tailing HPAL secara langsung menentukan strategi pengolahan dan karakteristik produk yang dihasilkan:
                            </p>
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="rounded-xl border-2 border-red-200 bg-red-50/40 p-6">
                                    <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-red-800">
                                        <span>⚠️</span> Tailing HPAL Mentah
                                    </h3>
                                    <p className="text-sm text-gray-700 mb-3">
                                        Mengandung sisa H₂SO₄ bebas ±30 gpl. Didominasi hematit (Fe₂O₃ ~42.5%) dan silika (SiO₂ ~35.2%).
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        <strong>Dampak Produksi:</strong> Membutuhkan netralisasi asam menyeluruh dengan Ca(OH)₂.
                                        Gipsum yang terbentuk (CaSO₄·2H₂O) ikut terenkapsulasi sebagai filler mikro. Cr⁶⁺ harus
                                        terenkapsulasi dalam matriks semen/kapur untuk memenuhi uji TCLP PP No. 22 Tahun 2021.
                                    </p>
                                </div>
                                <div className="rounded-xl border-2 border-green-200 bg-green-50/40 p-6">
                                    <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-green-800">
                                        <span>✅</span> Tailing HPAL Pra-Netralisasi
                                    </h3>
                                    <p className="text-sm text-gray-700 mb-3">
                                        Asam bebas rendah (±2 gpl). Mengandung ~4% gipsum sebagai retarder alami.
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        <strong>Dampak Produksi:</strong> Kondisi ideal untuk paving block premium. Gipsum (±4%) mengontrol
                                        waktu setting. Fe₂O₃ meningkatkan densitas ({'>'} 2.0 g/cm³). SiO₂ reaktif membentuk C-S-H
                                        yang memperkuat matriks. Target kuat tekan ≥ 20 MPa (Mutu B - SNI 03-0691-1996).
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 8. Parameter Kalkulator BUMDes */}
                    <section className="rounded-2xl border bg-white p-8 shadow-sm">
                        <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-gray-900">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-sm text-gray-700">8</span>
                            Parameter Kalkulator BUMDes (Konteks Morowali)
                        </h2>
                        <div className="space-y-8">
                            
                            {/* Tabel 1 - Material */}
                            <div>
                                <h3 className="mb-3 text-lg font-semibold text-gray-800">Tabel 1: Parameter Konversi Satuan Fisis (Material HPAL)</h3>
                                <div className="overflow-hidden rounded-lg border">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-gray-50 border-b">
                                            <tr>
                                                <th className="px-4 py-3 font-semibold text-gray-700">Komponen Material</th>
                                                <th className="px-4 py-3 font-semibold text-gray-700">Parameter Fisis</th>
                                                <th className="px-4 py-3 font-semibold text-gray-700">Nilai Referensi</th>
                                                <th className="px-4 py-3 font-semibold text-gray-700">Satuan Eksekusi Warga</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y">
                                            <tr>
                                                <td className="px-4 py-3 font-medium text-gray-900">Tailing HPAL (Kering)</td>
                                                <td className="px-4 py-3 text-gray-600">Bulk Density</td>
                                                <td className="px-4 py-3 text-gray-600">1,7 kg/Liter</td>
                                                <td className="px-4 py-3 text-gray-600">1 Karung Standar ≈ 50 kg</td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-3 font-medium text-gray-900">Kapur Padam Ca(OH)₂</td>
                                                <td className="px-4 py-3 text-gray-600">Bulk Density</td>
                                                <td className="px-4 py-3 text-gray-600">0,9 kg/Liter</td>
                                                <td className="px-4 py-3 text-gray-600">1 Karung ≈ 25 kg</td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-3 font-medium text-gray-900">Semen Portland Tipe I</td>
                                                <td className="px-4 py-3 text-gray-600">Bulk Density</td>
                                                <td className="px-4 py-3 text-gray-600">1,35 kg/Liter</td>
                                                <td className="px-4 py-3 text-gray-600">1 Sak ≈ 40 kg</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Tabel 2 - Produk */}
                            <div>
                                <h3 className="mb-3 text-lg font-semibold text-gray-800">Tabel 2: Data Konversi Dimensi & Berat Produk Akhir (SNI)</h3>
                                <div className="overflow-hidden rounded-lg border">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-gray-50 border-b">
                                            <tr>
                                                <th className="px-4 py-3 font-semibold text-gray-700">Jenis Produk</th>
                                                <th className="px-4 py-3 font-semibold text-gray-700">Standar Acuan Mutu</th>
                                                <th className="px-4 py-3 font-semibold text-gray-700">Dimensi Standar</th>
                                                <th className="px-4 py-3 font-semibold text-gray-700">Estimasi Berat</th>
                                                <th className="px-4 py-3 font-semibold text-gray-700">Min. Kuat Tekan</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y">
                                            <tr>
                                                <td className="px-4 py-3 font-medium text-gray-900">Paving Block (Bata Beton)</td>
                                                <td className="px-4 py-3 text-gray-600">SNI 03-0691-1996</td>
                                                <td className="px-4 py-3 text-gray-600">21 × 10,5 × 6 cm</td>
                                                <td className="px-4 py-3 text-gray-600">≈ 3,1 kg / buah</td>
                                                <td className="px-4 py-3 text-gray-600">≥ 20 MPa (Mutu B)</td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-3 font-medium text-gray-900">Batako Berongga (Hollow Block)</td>
                                                <td className="px-4 py-3 text-gray-600">SNI 03-0349-1989</td>
                                                <td className="px-4 py-3 text-gray-600">40 × 20 × 10 cm</td>
                                                <td className="px-4 py-3 text-gray-600">≈ 9,0 kg / buah</td>
                                                <td className="px-4 py-3 text-gray-600">≥ 2,5 MPa (Mutu III)</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Tabel 3 - Harga Morowali */}
                            <div>
                                <h3 className="mb-3 text-lg font-semibold text-gray-800">Tabel 3: Database Harga Eceran Komponen OPEX (Konteks Morowali)</h3>
                                <div className="overflow-hidden rounded-lg border">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-gray-50 border-b">
                                            <tr>
                                                <th className="px-4 py-3 font-semibold text-gray-700">Komponen</th>
                                                <th className="px-4 py-3 font-semibold text-gray-700">Jenis</th>
                                                <th className="px-4 py-3 font-semibold text-gray-700">Harga Estimasi (Morowali)</th>
                                                <th className="px-4 py-3 font-semibold text-gray-700">Keterangan</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y">
                                            <tr>
                                                <td className="px-4 py-3 font-medium text-gray-900">Tailing HPAL</td>
                                                <td className="px-4 py-3 text-gray-600">Bahan Baku</td>
                                                <td className="px-4 py-3 font-mono text-gray-900">Rp 0 (Gratis + Tipping Fee)</td>
                                                <td className="px-4 py-3 text-gray-600">Disuplai PT IMIP</td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-3 font-medium text-gray-900">Kapur Tohor (CaO)</td>
                                                <td className="px-4 py-3 text-gray-600">Netralisasi Asam</td>
                                                <td className="px-4 py-3 font-mono text-gray-900">Rp 1.800 - 2.500/kg</td>
                                                <td className="px-4 py-3 text-gray-600">Supplier Palu/Kendari</td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-3 font-medium text-gray-900">Kapur Padam (Ca(OH)₂)</td>
                                                <td className="px-4 py-3 text-gray-600">Netralisasi</td>
                                                <td className="px-4 py-3 font-mono text-gray-900">Rp 1.500 - 2.000/kg</td>
                                                <td className="px-4 py-3 text-gray-600">Lebih aman ditangani</td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-3 font-medium text-gray-900">Semen Portland Tipe I</td>
                                                <td className="px-4 py-3 text-gray-600">Binder</td>
                                                <td className="px-4 py-3 font-mono text-gray-900">Rp 90.000 - 100.000/sak 40 kg</td>
                                                <td className="px-4 py-3 text-gray-600">Toko bangunan Bungku</td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-3 font-medium text-gray-900">Pasir Sungai</td>
                                                <td className="px-4 py-3 text-gray-600">Agregat</td>
                                                <td className="px-4 py-3 font-mono text-gray-900">Rp 200.000 - 300.000/m³</td>
                                                <td className="px-4 py-3 text-gray-600">Sungai lokal Morowali</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Tabel 4 - TCLP */}
                            <div>
                                <h3 className="mb-3 text-lg font-semibold text-gray-800">Tabel 4: Parameter Safety Flag - Uji TCLP Nikel Laterit</h3>
                                <div className="overflow-hidden rounded-lg border">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-gray-50 border-b">
                                            <tr>
                                                <th className="px-4 py-3 font-semibold text-gray-700">Parameter</th>
                                                <th className="px-4 py-3 font-semibold text-gray-700">Kategori</th>
                                                <th className="px-4 py-3 font-semibold text-gray-700">Batas Maks PP 22/2021</th>
                                                <th className="px-4 py-3 font-semibold text-gray-700">Relevansi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y">
                                            <tr>
                                                <td className="px-4 py-3 font-medium text-gray-900">Nikel (Ni)</td>
                                                <td className="px-4 py-3 text-gray-600">Toksik</td>
                                                <td className="px-4 py-3 font-mono text-gray-900">5,0 mg/L</td>
                                                <td className="px-4 py-3 text-gray-600">Parameter utama HPAL laterit</td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-3 font-medium text-gray-900">Kobalt (Co)</td>
                                                <td className="px-4 py-3 text-gray-600">Toksik</td>
                                                <td className="px-4 py-3 font-mono text-gray-900">1,0 mg/L</td>
                                                <td className="px-4 py-3 text-gray-600">Logam berharga sisa</td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-3 font-medium text-red-700 font-semibold">Kromium⁶⁺ (Cr⁶⁺)</td>
                                                <td className="px-4 py-3 text-red-600 font-semibold">Sangat Toksik</td>
                                                <td className="px-4 py-3 font-mono text-red-700 font-bold">0,5 mg/L</td>
                                                <td className="px-4 py-3 text-gray-600">Dari mineral kromit</td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-3 font-medium text-gray-900">Arsen (As)</td>
                                                <td className="px-4 py-3 text-gray-600">Toksik</td>
                                                <td className="px-4 py-3 font-mono text-gray-900">0,5 mg/L</td>
                                                <td className="px-4 py-3 text-gray-600">Dari mineral arsenopirit</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                        </div>
                    </section>

                    {/* 9. Daftar Pustaka */}
                    <section className="rounded-2xl border bg-white p-8 shadow-sm">
                        <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-gray-900">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-sm text-gray-700">9</span>
                            Daftar Pustaka (Referensi Ilmiah)
                        </h2>
                        <div className="space-y-6">
                            <div>
                                <h3 className="mb-3 text-lg font-semibold text-gray-800">Hidrometalurgi HPAL & Tailing Nikel Laterit</h3>
                                <ul className="list-disc space-y-3 pl-5 text-sm text-gray-700">
                                    <li>
                                        Crundwell, F., Moats, M., Ramachandran, V., Robinson, T., & Davenport, W. G. (2011). <em>Extractive Metallurgy of Nickel, Cobalt and Platinum Group Metals</em>. Oxford: Elsevier.
                                    </li>
                                    <li>
                                        Li, G., Xiong, X., Wang, L., & Peng, J. (2017). Utilization of laterite nickel ore HPAL tailings for cement-based material production. <em>Construction and Building Materials</em>.
                                    </li>
                                    <li>
                                        Mubarok, M. Z., & Lieberto, J. (2013). Precipitation of nickel hydroxide from simulated and atmospheric-leach solution of nickel laterite ore. <em>Procedia Earth and Planetary Science</em>, 6, 457-464.
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="mb-3 text-lg font-semibold text-gray-800">Standar Mutu, Regulasi Lingkungan & Parameter KTI</h3>
                                <ul className="list-disc space-y-3 pl-5 text-sm text-gray-700">
                                    <li>
                                        Badan Standardisasi Nasional. (1989). <em>SNI 03-0349-1989: Bata Beton Pejal untuk Pasangan Dinding</em>. Jakarta: BSN.
                                    </li>
                                    <li>
                                        Badan Standardisasi Nasional. (1996). <em>SNI 03-0691-1996: Bata Beton (Paving Block)</em>. Jakarta: BSN.
                                    </li>
                                    <li>
                                        Peraturan Pemerintah Republik Indonesia Nomor 22 Tahun 2021 tentang Penyelenggaraan Perlindungan dan Pengelolaan Lingkungan Hidup. Lampiran XI: Baku Mutu TCLP. Jakarta: Sekretariat Negara.
                                    </li>
                                    <li>
                                        Mehta, P. K., & Monteiro, P. J. M. (2014). <em>Concrete: Microstructure, Properties, and Materials</em> (4th ed.). McGraw-Hill Education.
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
