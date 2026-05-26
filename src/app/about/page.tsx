
import { Header } from "@/components/layout/Header";
import { ArrowLeft } from "lucide-react";
import Link from 'next/link';

export default function About() {
    return (
        <div className="min-h-screen bg-gray-100">
            <Header />

            <main className="container mx-auto max-w-5xl px-4 py-12">
                <Link href="/" className="mb-8 inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-800">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Beranda
                </Link>

                <div className="space-y-12">
                    {/* Section 1: Introduction */}
                    <section className="rounded-2xl border bg-white p-8 shadow-sm">
                        <h2 className="mb-6 text-3xl font-bold text-gray-900">Metodologi Penelitian</h2>
                        <p className="mb-6 text-lg text-gray-600">
                            Penelitian ini mengembangkan platform simulasi web berbasis Decision Support System (DSS) untuk mengoptimalkan
                            proses <strong>upcycling tailing HPAL nikel laterit</strong> menjadi produk konstruksi bernilai ekonomi tinggi melalui pendekatan
                            semen-pozolan dan ekonomi sirkular terintegrasi kawasan PT IMIP, Morowali.
                        </p>

                        <div className="rounded-xl bg-gray-50 p-6 border border-gray-200">
                            <h3 className="mb-4 text-xl font-semibold text-gray-800">Teknologi Upcycling Tailing HPAL via Semen-Pozolan</h3>
                            <p className="text-gray-700">
                                Tailing HPAL nikel laterit memiliki kandungan Fe₂O₃ (hematit) ~40-43% dan SiO₂ ~33-35%.
                                Silika reaktif dalam tailing bereaksi dengan Ca(OH)₂ dari semen menghasilkan senyawa
                                Calcium Silicate Hydrate (C-S-H) - fase pengikat utama yang memberikan kuat tekan.
                                Proses ini menjadikan tailing sebagai material semen parsial (<em>partial cement replacement</em>)
                                alami setelah netralisasi asam. Hematit (Fe₂O₃) bertindak sebagai mikrofiller yang meningkatkan
                                densitas produk akhir secara signifikan.
                            </p>
                        </div>
                    </section>

                    {/* Section 2: Process Flow - 4 langkah (termasuk Netralisasi) */}
                    <section className="space-y-8">
                        <div className="rounded-2xl border bg-white p-8 shadow-sm">
                            <h2 className="mb-6 text-2xl font-bold text-gray-900">Alur Proses Upcycling Tailing HPAL</h2>
                            <div className="grid gap-4 md:grid-cols-4">
                                <div className="rounded-xl bg-gray-50 p-6 border border-gray-200 text-center">
                                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-300 text-gray-700 font-bold text-xl">1</div>
                                    <h4 className="font-semibold text-gray-800 mb-2">Penerimaan Tailing HPAL</h4>
                                    <p className="text-sm text-gray-600">Tailing dari proses HPAL (240-260°C, 40 atm) ditampung di Tailing Storage Pond kawasan PT IMIP.</p>
                                </div>
                                <div className="rounded-xl bg-amber-50 p-6 border border-amber-200 text-center">
                                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-amber-300 text-amber-800 font-bold text-xl">2</div>
                                    <h4 className="font-semibold text-amber-900 mb-2">Netralisasi Asam</h4>
                                    <p className="text-sm text-gray-600">Penambahan Ca(OH)₂ untuk menetralisasi H₂SO₄ sisa (±30 gpl). Menghasilkan gipsum (CaSO₄·2H₂O) sebagai produk sampingan.</p>
                                </div>
                                <div className="rounded-xl bg-gray-50 p-6 border border-gray-200 text-center">
                                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-300 text-gray-700 font-bold text-xl">3</div>
                                    <h4 className="font-semibold text-gray-800 mb-2">Pencampuran Semen</h4>
                                    <p className="text-sm text-gray-600">Tailing ternetralisasi dicampur dengan Semen Portland Tipe I sesuai rasio optimal, lalu dicetak dengan hydraulic press.</p>
                                </div>
                                <div className="rounded-xl bg-gray-50 p-6 border border-gray-200 text-center">
                                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-300 text-gray-700 font-bold text-xl">4</div>
                                    <h4 className="font-semibold text-gray-800 mb-2">Steam Curing & Produk</h4>
                                    <p className="text-sm text-gray-600">Produk di-curing pada suhu terkontrol (25–80°C) dengan steam curing untuk akselerasi pembentukan C-S-H.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 3: Mass Balance + Netralisasi */}
                    <section className="rounded-2xl border bg-white p-8 shadow-sm">
                        <h2 className="mb-6 text-2xl font-bold text-gray-900">Model Neraca Massa</h2>
                        <div className="grid gap-8 md:grid-cols-2">
                            <div>
                                <p className="mb-4 text-gray-600">
                                    Model neraca massa yang digunakan menghitung distribusi material dari input tailing HPAL
                                    hingga output produk konstruksi jadi, termasuk stoikiometri netralisasi asam:
                                </p>
                                <ul className="ml-5 list-disc space-y-2 text-gray-600">
                                    <li><strong>Input:</strong> Massa Tailing HPAL (ton/hari)</li>
                                    <li><strong>Netralisasi:</strong> Kapur Ca(OH)₂ (berdasarkan konsentrasi H₂SO₄)</li>
                                    <li><strong>Binder:</strong> Semen Portland Tipe I (% terhadap massa tailing)</li>
                                    <li><strong>By-product:</strong> Gipsum CaSO₄·2H₂O (terenkapsulasi dalam produk)</li>
                                    <li><strong>Output:</strong> Produk Konstruksi (Paving Block / Batako SNI)</li>
                                    <li><strong>Loss:</strong> Kehilangan material dalam proses (~2-3.5%)</li>
                                </ul>
                            </div>
                            <div className="flex flex-col items-center justify-center rounded-lg bg-gray-900 p-6 font-mono text-gray-100 space-y-4">
                                <div className="w-full">
                                    <p className="mb-2 text-sm text-gray-400">Reaksi Netralisasi:</p>
                                    <p className="text-lg text-red-400">H₂SO₄ + Ca(OH)₂ → CaSO₄·2H₂O + H₂O</p>
                                </div>
                                <div className="h-px w-full bg-gray-700"></div>
                                <div className="w-full">
                                    <p className="mb-2 text-sm text-gray-400">Kebutuhan Kapur:</p>
                                    <p className="text-lg text-amber-400">m_lime = (m_H₂SO₄ / 98) × 74 × 1.15</p>
                                </div>
                                <div className="h-px w-full bg-gray-700"></div>
                                <div className="w-full">
                                    <p className="mb-2 text-sm text-gray-400">Gipsum Terbentuk:</p>
                                    <p className="text-lg text-blue-400">m_gypsum = (m_H₂SO₄ / 98) × 172</p>
                                </div>
                                <div className="h-px w-full bg-gray-700"></div>
                                <div className="w-full">
                                    <p className="mb-2 text-sm text-gray-400">Neraca Massa Total:</p>
                                    <p className="text-lg text-yellow-400">M_product = M_tailing + M_binder + M_lime + M_gypsum - M_loss</p>
                                </div>
                                <div className="h-px w-full bg-gray-700"></div>
                                <div className="w-full">
                                    <p className="mb-2 text-sm text-gray-400">Yield Produk:</p>
                                    <p className="text-lg text-green-400">η = M_product / M_total_input × 100%</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 4: Economic Model */}
                    <section className="rounded-2xl border bg-white p-8 shadow-sm">
                        <h2 className="mb-6 text-2xl font-bold text-gray-900">Model Analisis Ekonomi</h2>
                        <div className="grid gap-8 md:grid-cols-2">
                            <div>
                                <p className="mb-4 text-gray-600">
                                    Analisis tekno-ekonomi komprehensif mencakup perhitungan kelayakan investasi
                                    pabrik upcycling tailing HPAL di kawasan PT IMIP:
                                </p>
                                <ul className="ml-5 list-disc space-y-2 text-gray-600">
                                    <li><strong>CAPEX:</strong> Investasi mixer, press, steam curing, silo, dan unit netralisasi asam</li>
                                    <li><strong>OPEX:</strong> Biaya semen, kapur netralisasi, energi, tenaga kerja</li>
                                    <li><strong>Revenue:</strong> Penjualan produk SNI (Rp/ton) + Tipping Fee PT IMIP</li>
                                    <li><strong>NPV:</strong> Net Present Value (10 tahun, WACC 12%)</li>
                                    <li><strong>IRR:</strong> Internal Rate of Return (Newton-Raphson)</li>
                                    <li><strong>PBP:</strong> Payback Period</li>
                                </ul>
                            </div>
                            <div className="flex flex-col items-center justify-center rounded-lg bg-gray-900 p-6 font-mono text-gray-100">
                                <p className="mb-2">Net Present Value:</p>
                                <p className="text-lg text-yellow-400">NPV = Σ [CF_t / (1+r)^t] - I₀</p>
                                <div className="my-4 h-px w-full bg-gray-700"></div>
                                <p className="mb-2">Internal Rate of Return:</p>
                                <p className="text-lg text-green-400">IRR: NPV(IRR) = 0</p>
                                <div className="my-4 h-px w-full bg-gray-700"></div>
                                <p className="mb-2">Payback Period:</p>
                                <p className="text-lg text-blue-400">PBP = CAPEX / Annual Cash Flow</p>
                            </div>
                        </div>
                    </section>

                    {/* Section 5: HPAL Tailing Types - Raw vs Neutralized */}
                    <section className="rounded-2xl border bg-white p-8 shadow-sm">
                        <h2 className="mb-6 text-2xl font-bold text-gray-900">Pengaruh Status Netralisasi terhadap Produksi</h2>
                        <p className="mb-6 text-gray-600">
                            Tailing HPAL nikel laterit tersedia dalam dua kondisi berdasarkan tahap netralisasi asamnya.
                            Status ini menentukan strategi proses dan kualitas produk akhir:
                        </p>
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="rounded-xl border-2 border-red-200 bg-red-50/40 p-6">
                                <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-red-800">
                                    <span>⚠️</span> Tailing HPAL Mentah
                                </h3>
                                <p className="text-sm text-gray-700">
                                    Mengandung sisa asam sulfat bebas tinggi (H₂SO₄ ±30 gpl). Didominasi hematit (Fe₂O₃ ~42.5%)
                                    dan silika (SiO₂ ~35.2%). Membutuhkan netralisasi menyeluruh dengan Ca(OH)₂ sebelum pencampuran.
                                    Cr⁶⁺ harus dienkapsulasi dalam matriks semen/kapur untuk lulus uji TCLP.
                                    Produk output: <strong>Batako Berongga (SNI 03-0349-1989)</strong>.
                                </p>
                            </div>
                            <div className="rounded-xl border-2 border-green-200 bg-green-50/40 p-6">
                                <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-green-800">
                                    <span>✅</span> Tailing HPAL Pra-Netralisasi
                                </h3>
                                <p className="text-sm text-gray-700">
                                    Asam bebas sudah sangat rendah (±2 gpl). Mengandung ~4% gipsum (CaSO₄·2H₂O) hasil netralisasi
                                    yang berfungsi sebagai retarder alami. Aman untuk ditangani operator BUMDes. Fe₂O₃ (~40%)
                                    meningkatkan densitas produk secara signifikan. SiO₂ reaktif membentuk C-S-H bersama semen.
                                    Produk output: <strong>Paving Block Premium (SNI 03-0691-1996, ≥20 MPa)</strong>.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Section NEW: Pemenuhan SNI dan TCLP */}
                    <section className="rounded-2xl border bg-white p-8 shadow-sm">
                        <h2 className="mb-6 text-2xl font-bold text-gray-900">Pemenuhan Standar SNI & Uji TCLP</h2>
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="rounded-xl bg-gray-50 p-6 border border-gray-200">
                                <h3 className="mb-4 text-lg font-semibold text-gray-800">Standar Produk (SNI)</h3>
                                <ul className="space-y-3 text-sm text-gray-700">
                                    <li className="flex items-start gap-2">
                                        <span className="mt-0.5 text-green-500 font-bold">✓</span>
                                        <span><strong>SNI 03-0691-1996</strong> - Paving Block (Bata Beton) Mutu B ≥ 20 MPa</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="mt-0.5 text-green-500 font-bold">✓</span>
                                        <span><strong>SNI 03-0349-1989</strong> - Batako Berongga (Hollow Block) Mutu III ≥ 2.5 MPa</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="rounded-xl bg-gray-50 p-6 border border-gray-200">
                                <h3 className="mb-4 text-lg font-semibold text-gray-800">Uji TCLP (PP No. 22/2021 Lamp. XI)</h3>
                                <ul className="space-y-3 text-sm text-gray-700">
                                    <li className="flex items-start gap-2">
                                        <span className="mt-0.5 text-green-500 font-bold">✓</span>
                                        <span><strong>Nikel (Ni)</strong> ≤ 5.0 mg/L - Parameter utama nikel laterit</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="mt-0.5 text-green-500 font-bold">✓</span>
                                        <span><strong>Kobalt (Co)</strong> ≤ 1.0 mg/L - Logam berharga sisa</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="mt-0.5 text-green-500 font-bold">✓</span>
                                        <span><strong>Kromium⁶⁺ (Cr⁶⁺)</strong> ≤ 0.5 mg/L - Sangat toksik</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="mt-0.5 text-green-500 font-bold">✓</span>
                                        <span><strong>Arsen (As)</strong> ≤ 0.5 mg/L - Dari mineral arsenopirit</span>
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
