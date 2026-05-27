
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
                    {/* PAPER: Metode Penulisan */}
                    <section className="rounded-2xl border bg-white p-8 shadow-sm">
                        <h2 className="mb-6 text-3xl font-bold text-gray-900">Metode Penulisan</h2>
                        
                        {/* 3.1 */}
                        <div className="mb-10">
                            <h3 className="mb-4 flex items-center gap-3 text-2xl font-bold text-gray-800">
                                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-sm text-gray-700">3.1</span>
                                Desain dan Pendekatan Penelitian
                            </h3>
                            <div className="prose max-w-none text-gray-700 space-y-4">
                                <p>Penelitian ini mengimplementasikan desain Mixed Methods atau pendekatan campuran yang mengintegrasikan analisis kuantitatif dan kualitatif. Pendekatan kuantitatif berfokus pada pemodelan komputasional untuk penyelesaian stoikiometri netralisasi asam serta uji parametrik untuk memprediksi kuat tekan material sementisius dari residu tailing. Sementara itu pendekatan kualitatif difokuskan pada interpretasi analisis tekno ekonomi dan perumusan strategi implementasi pemberdayaan komunitas di lingkar kawasan industri pertambangan.</p>
                                <p>Secara matematis integrasi pendekatan campuran pada optimasi purwarupa ini dimodelkan melalui fungsi tujuan berikut:</p>
                                <div className="bg-gray-100 p-4 rounded-lg font-mono text-center text-lg overflow-x-auto">
                                    O<sub>opt</sub> = max &#123; &omega;<sub>1</sub>T(x) + &omega;<sub>2</sub>E(y) + &omega;<sub>3</sub>S(z) &#125;
                                </div>
                                <p>di mana O<sub>opt</sub> adalah luaran optimasi TailingSIM, T(x) mewakili fungsi kelayakan teknis kuantitatif, E(y) mewakili fungsi kelayakan ekonomi, S(z) mewakili penerimaan sosial kualitatif, serta &omega; merupakan bobot prioritas masing masing parameter.</p>
                            </div>
                        </div>

                        {/* 3.2 */}
                        <div className="mb-10">
                            <h3 className="mb-4 flex items-center gap-3 text-2xl font-bold text-gray-800">
                                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-sm text-gray-700">3.2</span>
                                Lokasi dan Waktu Penelitian
                            </h3>
                            <div className="prose max-w-none text-gray-700 space-y-4">
                                <p>Fase pengembangan komputasional dan rekayasa perangkat lunak TailingSIM dilakukan secara digital di lingkungan Institut Teknologi Bandung pada semester genap awal tahun 2026. Fokus lokasi penerapan simulasi studi kasus secara penuh diarahkan pada kawasan PT Indonesia Morowali Industrial Park guna menjamin tingkat relevansi operasional hilirisasi nikel laterit secara riil.</p>
                                <p>Proyeksi kapasitas pengolahan tailing secara spasio temporal disimulasikan menggunakan parameter waktu operasional pabrik yang dirumuskan sebagai:</p>
                                <div className="bg-gray-100 p-4 rounded-lg font-mono text-center text-lg overflow-x-auto">
                                    T<sub>p</sub> = V<sub>tailing</sub> / (Q<sub>proses</sub> &times; E<sub>f</sub>)
                                </div>
                                <p>di mana T<sub>p</sub> adalah waktu proyeksi operasional, V<sub>tailing</sub> adalah volume ketersediaan tailing HPAL di penampungan, Q<sub>proses</sub> adalah laju konsumsi tailing harian, dan E<sub>f</sub> adalah faktor efisiensi operasional harian.</p>
                            </div>
                        </div>

                        {/* 3.3 */}
                        <div className="mb-10">
                            <h3 className="mb-4 flex items-center gap-3 text-2xl font-bold text-gray-800">
                                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-sm text-gray-700">3.3</span>
                                Populasi Sampel dan Subjek Penelitian
                            </h3>
                            <div className="prose max-w-none text-gray-700 space-y-4">
                                <p>Populasi utama dalam simulasi ini adalah aliran limbah atau slurry yang dihasilkan dari proses High Pressure Acid Leaching bijih nikel laterit zona limonit. Sampel fisik yang dijadikan basis parameter input didasarkan pada data sekunder tailing dengan dominasi mineral hematit hasil operasi autoklaf pada rentang suhu 220 hingga 250 derajat Celcius. Subjek implementasi inovasi secara sosial adalah kelompok Badan Usaha Milik Desa yang diberdayakan sebagai agen pengolah residu menjadi batako konstruksi.</p>
                                
                                <div className="mt-8 flex flex-col items-center">
                                    <img src="/assets/gambar3-1.png" alt="Gambar 3.1" className="max-w-full h-auto rounded-lg shadow-md border bg-white p-2" />
                                    <p className="mt-3 text-sm text-center text-gray-500 italic max-w-3xl">
                                        Gambar 3.1 Kinetika pelarutan nikel dan profil mineralogi presipitasi besi pada residu proses HPAL nikel laterit limonit. (Abbasi Gharaei dkk., 2024).
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* 3.4 */}
                        <div className="mb-10">
                            <h3 className="mb-4 flex items-center gap-3 text-2xl font-bold text-gray-800">
                                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-sm text-gray-700">3.4</span>
                                Definisi Operasional Variabel
                            </h3>
                            <div className="prose max-w-none text-gray-700 space-y-4">
                                <p>Guna menjamin validitas dan keandalan sistem pengukuran batasan variabel ditetapkan sebagai berikut:</p>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li><strong>Variabel Bebas:</strong> Dosis penambahan agen penetral kapur kalsium hidroksida dan persentase rasio pengikat berbasis semen atau geopolimer.</li>
                                    <li><strong>Variabel Terikat:</strong> Tingkat keasaman akhir slurry, nilai kuat tekan batako dalam satuan Megapascal, profil pelindihan logam berat, serta metrik keuangan berupa Net Present Value dan Internal Rate of Return.</li>
                                    <li><strong>Variabel Kontrol:</strong> Parameter suhu pelindian yang dijaga konstan serta densitas ruah dari tailing awal.</li>
                                </ul>
                                <p>Hubungan fungsional antar variabel di dalam sistem komputasi TailingSIM didefinisikan melalui persamaan matriks berikut:</p>
                                <div className="bg-gray-100 p-4 rounded-lg font-mono text-center text-lg overflow-x-auto">
                                    [Y<sub>1</sub>, Y<sub>2</sub>, Y<sub>3</sub>] = f(X<sub>1</sub>, X<sub>2</sub> | C<sub>1</sub>, C<sub>2</sub>)
                                </div>
                                <p>di mana himpunan Y adalah variabel terikat, X adalah variabel bebas, dan C adalah konstanta variabel kontrol.</p>
                            </div>
                        </div>

                        {/* 3.5 */}
                        <div className="mb-10">
                            <h3 className="mb-4 flex items-center gap-3 text-2xl font-bold text-gray-800">
                                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-sm text-gray-700">3.5</span>
                                Instrumen Penelitian
                            </h3>
                            <div className="prose max-w-none text-gray-700 space-y-4">
                                <p>Instrumen pengukuran primer yang digunakan adalah purwarupa perangkat lunak Decision Support System TailingSIM. Instrumen sekunder yang dijadikan pedoman kalibrasi mutu meliputi Standar Nasional Indonesia SNI 03-0349-1989 untuk standarisasi kuat tekan bata beton serta Lampiran XI Peraturan Pemerintah No. 22 Tahun 2021 sebagai instrumen batas kelulusan uji toksisitas pelindihan lingkungan.</p>
                                
                                <div className="mt-8 flex flex-col items-center">
                                    <img src="/assets/gambar3-2.png" alt="Gambar 3.2" className="max-w-full h-auto rounded-lg shadow-md border bg-white p-2" />
                                    <p className="mt-3 text-sm text-center text-gray-500 italic max-w-3xl">
                                        Gambar 3.2 Antarmuka purwarupa instrumen perangkat lunak Decision Support System TailingSIM (Dokumentasi Pribadi, 2026).
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* 3.6 */}
                        <div className="mb-10">
                            <h3 className="mb-4 flex items-center gap-3 text-2xl font-bold text-gray-800">
                                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-sm text-gray-700">3.6</span>
                                Teknik Pengumpulan Data
                            </h3>
                            <div className="prose max-w-none text-gray-700 space-y-4">
                                <p>Pengumpulan data dilaksanakan melalui teknik penelusuran literatur sekunder dari publikasi jurnal kuartil atas yang memuat data eksperimental ekstraksi nikel limonit. Data kalibrasi penetralan keasaman divalidasi menggunakan metode kurva penyangga atau buffer curve method yang terbukti paling presisi dalam memprediksi kebutuhan reagen kimia secara linier pada sistem limbah asam.</p>
                                
                                <div className="mt-8 flex flex-col items-center">
                                    <img src="/assets/gambar3-3.png" alt="Gambar 3.3" className="max-w-full h-auto rounded-lg shadow-md border bg-white p-4" />
                                    <p className="mt-3 text-sm text-center text-gray-500 italic max-w-3xl">
                                        Gambar 3.3 Kurva hubungan empiris prediksi pH terhadap fluktuasi dosis penambahan kapur penetral (Dimodifikasi dari Yin dkk., 2021).
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* 3.7 */}
                        <div>
                            <h3 className="mb-4 flex items-center gap-3 text-2xl font-bold text-gray-800">
                                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-sm text-gray-700">3.7</span>
                                Teknik Analisis Data
                            </h3>
                            <div className="prose max-w-none text-gray-700 space-y-8">
                                <p>Seluruh data yang terkumpul diproses menggunakan algoritma komputasi di dalam platform TailingSIM. Teknik analisis matematis yang diusulkan dijabarkan melalui rumusan berikut:</p>
                                
                                <div>
                                    <h4 className="text-xl font-bold text-gray-800 mb-2">A. Analisis Kesetimbangan Massa dan Stoikiometri Netralisasi</h4>
                                    <p>Kebutuhan agen penetral dihitung secara kuantitatif berdasarkan massa sisa asam bebas. Reaksi utama diformulasikan sebagai berikut:</p>
                                    <div className="bg-gray-100 p-4 rounded-lg font-mono text-center text-lg my-4 overflow-x-auto">
                                        H<sub>2</sub>SO<sub>4</sub> + Ca(OH)<sub>2</sub> &rarr; CaSO<sub>4</sub>&middot;2H<sub>2</sub>O
                                    </div>
                                    <p>Massa gipsum produk sampingan tersebut diakumulasikan ke dalam matriks total padatan hematit karena berfungsi sebagai bahan penambah pengatur waktu pengikatan.</p>
                                </div>

                                <div>
                                    <h4 className="text-xl font-bold text-gray-800 mb-2">B. Analisis Empiris Kuat Tekan</h4>
                                    <p>Aktivasi kimiawi tailing besi terbukti mampu memperkuat matriks material sementisius secara signifikan. Estimasi kuat tekan batako diproyeksikan dengan rumus empiris:</p>
                                    <div className="bg-gray-100 p-4 rounded-lg font-mono text-center text-lg my-4 overflow-x-auto">
                                        f<sub>c</sub> = f<sub>base</sub> + R<sub>binder</sub>k<sub>1</sub> + (%Fe<sub>2</sub>O<sub>3</sub>)k<sub>2</sub>
                                    </div>
                                    <p>di mana f<sub>c</sub> adalah kuat tekan akhir material, f<sub>base</sub> merupakan kuat tekan dasar pengikat, R<sub>binder</sub> adalah rasio massa aktivator alkali atau semen, dan k merupakan konstanta aktivitas kimia micro filler pengisi rongga.</p>
                                    
                                    <div className="mt-8 flex flex-col items-center">
                                        <img src="/assets/gambar3-4.png" alt="Gambar 3.4" className="max-w-full h-auto rounded-lg shadow-md border bg-white p-4" />
                                        <p className="mt-3 text-sm text-center text-gray-500 italic max-w-3xl">
                                            Gambar 3.4 Peningkatan kuat tekan material seiring aktivasi kimia tailing kaya besi (Hu dkk., 2024).
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-xl font-bold text-gray-800 mb-2">C. Analisis Kelayakan Tekno Ekonomi</h4>
                                    <p>Biaya modal awal atau CAPEX diestimasi menggunakan hukum skala enam persepuluh agar valid secara industrial:</p>
                                    <div className="bg-gray-100 p-4 rounded-lg font-mono text-center text-lg my-4 overflow-x-auto">
                                        C<sub>B</sub> = C<sub>A</sub>(S<sub>B</sub> / S<sub>A</sub>)<sup>0.6</sup>
                                    </div>
                                    <p>di mana C<sub>B</sub> adalah estimasi biaya pabrik berskala baru, C<sub>A</sub> adalah biaya referensi pabrik yang sudah ada, dan S merupakan kapasitas produksi tonase harian.</p>
                                    <p>Selanjutnya kelayakan ekonomi jangka panjang diuji menggunakan rumus Net Present Value NPV:</p>
                                    <div className="bg-gray-100 p-4 rounded-lg font-mono text-center text-lg my-4 overflow-x-auto">
                                        NPV = &Sigma; [C<sub>t</sub> / (1 + r)<sup>t</sup>] - C<sub>0</sub>
                                    </div>
                                    <p>di mana C<sub>t</sub> mewakili arus kas masuk bersih tahunan, r adalah faktor diskonto, dan C<sub>0</sub> adalah belanja modal awal di tahun ke nol.</p>
                                </div>

                                <div>
                                    <h4 className="text-xl font-bold text-gray-800 mb-2">D. Uji Modifikasi Keamanan TCLP</h4>
                                    <p>Guna menjamin keamanan lingkungan, modifikasi Toxicity Characteristic Leaching Procedure disimulasikan untuk menguji stabilitas matriks. Algoritma pembatasan keselamatan sistem TailingSIM menolak rancangan komposisi apabila proyeksi pelindihan memenuhi kondisi ketidakamanan operasional berikut:</p>
                                    <div className="bg-gray-100 p-4 rounded-lg font-mono text-center text-lg my-4 overflow-x-auto">
                                        C<sub>Ni</sub> &gt; 5.0 mg/L &nbsp;&nbsp;|&nbsp;&nbsp; C<sub>Co</sub> &gt; 1.0 mg/L
                                    </div>
                                    <p>Modifikasi pengujian ini secara literatur terbukti akurat mengonfirmasi mekanisme enkapsulasi pada limbah padat berbasis semen.</p>
                                    
                                    <div className="mt-8 flex flex-col items-center">
                                        <img src="/assets/gambar3-5.png" alt="Gambar 3.5" className="max-w-full h-auto rounded-lg shadow-md border bg-white p-4" />
                                        <p className="mt-3 text-sm text-center text-gray-500 italic max-w-3xl">
                                            Gambar 3.5 Profil pelindihan unsur logam berat dari matriks padatan semen melalui uji TCLP yang dimodifikasi dengan (a) Zn umur 3 hari, (b) Zn 28 hari, (c) Pb 3 hari, (d) Pb 28 hari (Dimodifikasi dari Huang dkk., 2016).
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
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
