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
                    <h1 className="text-4xl font-bold text-gray-900">Metode Penulisan</h1>
                    <p className="mt-4 text-lg text-gray-600">
                        Dokumentasi metodologi penelitian dan rancangan pengembangan platform TailingSIM.
                    </p>
                </div>

                <div className="space-y-12">
                    {/* 3.1 */}
                    <section className="rounded-2xl border bg-white p-8 shadow-sm">
                        <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-gray-900">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-sm text-gray-700">3.1</span>
                            Desain dan Pendekatan Penelitian
                        </h2>
                        <div className="prose max-w-none text-gray-700 space-y-4">
                            <p>Penelitian ini mengimplementasikan desain Mixed Methods atau pendekatan campuran yang mengintegrasikan analisis kuantitatif dan kualitatif. Pendekatan kuantitatif berfokus pada pemodelan komputasional untuk penyelesaian stoikiometri netralisasi asam serta uji parametrik untuk memprediksi kuat tekan material sementisius dari residu tailing. Sementara itu pendekatan kualitatif difokuskan pada interpretasi analisis tekno ekonomi dan perumusan strategi implementasi pemberdayaan komunitas di lingkar kawasan industri pertambangan.</p>
                            <p>Secara matematis integrasi pendekatan campuran pada optimasi purwarupa ini dimodelkan melalui fungsi tujuan berikut:</p>
                            <div className="bg-gray-100 p-4 rounded-lg font-mono text-center text-lg overflow-x-auto">
                                O<sub>opt</sub> = max &#123; &omega;<sub>1</sub>T(x) + &omega;<sub>2</sub>E(y) + &omega;<sub>3</sub>S(z) &#125;
                            </div>
                            <p>di mana O<sub>opt</sub> adalah luaran optimasi TailingSIM, T(x) mewakili fungsi kelayakan teknis kuantitatif, E(y) mewakili fungsi kelayakan ekonomi, S(z) mewakili penerimaan sosial kualitatif, serta &omega; merupakan bobot prioritas masing masing parameter.</p>
                        </div>
                    </section>

                    {/* 3.2 */}
                    <section className="rounded-2xl border bg-white p-8 shadow-sm">
                        <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-gray-900">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-sm text-gray-700">3.2</span>
                            Lokasi dan Waktu Penelitian
                        </h2>
                        <div className="prose max-w-none text-gray-700 space-y-4">
                            <p>Fase pengembangan komputasional dan rekayasa perangkat lunak TailingSIM dilakukan secara digital di lingkungan Institut Teknologi Bandung pada semester genap awal tahun 2026. Fokus lokasi penerapan simulasi studi kasus secara penuh diarahkan pada kawasan PT Indonesia Morowali Industrial Park guna menjamin tingkat relevansi operasional hilirisasi nikel laterit secara riil.</p>
                            <p>Proyeksi kapasitas pengolahan tailing secara spasio temporal disimulasikan menggunakan parameter waktu operasional pabrik yang dirumuskan sebagai:</p>
                            <div className="bg-gray-100 p-4 rounded-lg font-mono text-center text-lg overflow-x-auto">
                                T<sub>p</sub> = V<sub>tailing</sub> / (Q<sub>proses</sub> &times; E<sub>f</sub>)
                            </div>
                            <p>di mana T<sub>p</sub> adalah waktu proyeksi operasional, V<sub>tailing</sub> adalah volume ketersediaan tailing HPAL di penampungan, Q<sub>proses</sub> adalah laju konsumsi tailing harian, dan E<sub>f</sub> adalah faktor efisiensi operasional harian.</p>
                        </div>
                    </section>

                    {/* 3.3 */}
                    <section className="rounded-2xl border bg-white p-8 shadow-sm">
                        <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-gray-900">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-sm text-gray-700">3.3</span>
                            Populasi Sampel dan Subjek Penelitian
                        </h2>
                        <div className="prose max-w-none text-gray-700 space-y-4">
                            <p>Populasi utama dalam simulasi ini adalah aliran limbah atau slurry yang dihasilkan dari proses High Pressure Acid Leaching bijih nikel laterit zona limonit. Sampel fisik yang dijadikan basis parameter input didasarkan pada data sekunder tailing dengan dominasi mineral hematit hasil operasi autoklaf pada rentang suhu 220 hingga 250 derajat Celcius. Subjek implementasi inovasi secara sosial adalah kelompok Badan Usaha Milik Desa yang diberdayakan sebagai agen pengolah residu menjadi batako konstruksi.</p>
                            
                            <div className="mt-8 flex flex-col items-center">
                                {/* Ganti src dengan file asli Anda, misal /assets/gambar3-1.png */}
                                <img src="/assets/gambar3-1.png" alt="Gambar 3.1" className="max-w-full h-auto rounded-lg shadow-md border bg-white p-2" />
                                <p className="mt-3 text-sm text-center text-gray-500 italic max-w-3xl">
                                    Gambar 3.1 Kinetika pelarutan nikel dan profil mineralogi presipitasi besi pada residu proses HPAL nikel laterit limonit. (Abbasi Gharaei dkk., 2024).
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* 3.4 */}
                    <section className="rounded-2xl border bg-white p-8 shadow-sm">
                        <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-gray-900">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-sm text-gray-700">3.4</span>
                            Definisi Operasional Variabel
                        </h2>
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
                    </section>

                    {/* 3.5 */}
                    <section className="rounded-2xl border bg-white p-8 shadow-sm">
                        <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-gray-900">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-sm text-gray-700">3.5</span>
                            Instrumen Penelitian
                        </h2>
                        <div className="prose max-w-none text-gray-700 space-y-4">
                            <p>Instrumen pengukuran primer yang digunakan adalah purwarupa perangkat lunak Decision Support System TailingSIM. Instrumen sekunder yang dijadikan pedoman kalibrasi mutu meliputi Standar Nasional Indonesia SNI 03-0349-1989 untuk standarisasi kuat tekan bata beton serta Lampiran XI Peraturan Pemerintah No. 22 Tahun 2021 sebagai instrumen batas kelulusan uji toksisitas pelindihan lingkungan.</p>
                            
                            <div className="mt-8 flex flex-col items-center">
                                {/* Ganti src dengan file asli Anda, misal /assets/gambar3-2.png */}
                                <img src="/assets/gambar3-2.png" alt="Gambar 3.2" className="max-w-full h-auto rounded-lg shadow-md border bg-white p-2" />
                                <p className="mt-3 text-sm text-center text-gray-500 italic max-w-3xl">
                                    Gambar 3.2 Antarmuka purwarupa instrumen perangkat lunak Decision Support System TailingSIM (Dokumentasi Pribadi, 2026).
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* 3.6 */}
                    <section className="rounded-2xl border bg-white p-8 shadow-sm">
                        <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-gray-900">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-sm text-gray-700">3.6</span>
                            Teknik Pengumpulan Data
                        </h2>
                        <div className="prose max-w-none text-gray-700 space-y-4">
                            <p>Pengumpulan data dilaksanakan melalui teknik penelusuran literatur sekunder dari publikasi jurnal kuartil atas yang memuat data eksperimental ekstraksi nikel limonit. Data kalibrasi penetralan keasaman divalidasi menggunakan metode kurva penyangga atau buffer curve method yang terbukti paling presisi dalam memprediksi kebutuhan reagen kimia secara linier pada sistem limbah asam.</p>
                            
                            <div className="mt-8 flex flex-col items-center">
                                {/* Ganti src dengan file asli Anda, misal /assets/gambar3-3.png */}
                                <img src="/assets/gambar3-3.png" alt="Gambar 3.3" className="max-w-full h-auto rounded-lg shadow-md border bg-white p-4" />
                                <p className="mt-3 text-sm text-center text-gray-500 italic max-w-3xl">
                                    Gambar 3.3 Kurva hubungan empiris prediksi pH terhadap fluktuasi dosis penambahan kapur penetral (Dimodifikasi dari Yin dkk., 2021).
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* 3.7 */}
                    <section className="rounded-2xl border bg-white p-8 shadow-sm">
                        <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-gray-900">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-sm text-gray-700">3.7</span>
                            Teknik Analisis Data
                        </h2>
                        <div className="prose max-w-none text-gray-700 space-y-8">
                            <p>Seluruh data yang terkumpul diproses menggunakan algoritma komputasi di dalam platform TailingSIM. Teknik analisis matematis yang diusulkan dijabarkan melalui rumusan berikut:</p>
                            
                            <div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">A. Analisis Kesetimbangan Massa dan Stoikiometri Netralisasi</h3>
                                <p>Kebutuhan agen penetral dihitung secara kuantitatif berdasarkan massa sisa asam bebas. Reaksi utama diformulasikan sebagai berikut:</p>
                                <div className="bg-gray-100 p-4 rounded-lg font-mono text-center text-lg my-4 overflow-x-auto">
                                    H<sub>2</sub>SO<sub>4</sub> + Ca(OH)<sub>2</sub> &rarr; CaSO<sub>4</sub>&middot;2H<sub>2</sub>O
                                </div>
                                <p>Massa gipsum produk sampingan tersebut diakumulasikan ke dalam matriks total padatan hematit karena berfungsi sebagai bahan penambah pengatur waktu pengikatan.</p>
                            </div>

                            <div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">B. Analisis Empiris Kuat Tekan</h3>
                                <p>Aktivasi kimiawi tailing besi terbukti mampu memperkuat matriks material sementisius secara signifikan. Estimasi kuat tekan batako diproyeksikan dengan rumus empiris:</p>
                                <div className="bg-gray-100 p-4 rounded-lg font-mono text-center text-lg my-4 overflow-x-auto">
                                    f<sub>c</sub> = f<sub>base</sub> + R<sub>binder</sub>k<sub>1</sub> + (%Fe<sub>2</sub>O<sub>3</sub>)k<sub>2</sub>
                                </div>
                                <p>di mana f<sub>c</sub> adalah kuat tekan akhir material, f<sub>base</sub> merupakan kuat tekan dasar pengikat, R<sub>binder</sub> adalah rasio massa aktivator alkali atau semen, dan k merupakan konstanta aktivitas kimia micro filler pengisi rongga.</p>
                                
                                <div className="mt-8 flex flex-col items-center">
                                    {/* Ganti src dengan file asli Anda, misal /assets/gambar3-4.png */}
                                    <img src="/assets/gambar3-4.png" alt="Gambar 3.4" className="max-w-full h-auto rounded-lg shadow-md border bg-white p-4" />
                                    <p className="mt-3 text-sm text-center text-gray-500 italic max-w-3xl">
                                        Gambar 3.4 Peningkatan kuat tekan material seiring aktivasi kimia tailing kaya besi (Hu dkk., 2024).
                                    </p>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">C. Analisis Kelayakan Tekno Ekonomi</h3>
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
                                <h3 className="text-xl font-bold text-gray-800 mb-2">D. Uji Modifikasi Keamanan TCLP</h3>
                                <p>Guna menjamin keamanan lingkungan, modifikasi Toxicity Characteristic Leaching Procedure disimulasikan untuk menguji stabilitas matriks. Algoritma pembatasan keselamatan sistem TailingSIM menolak rancangan komposisi apabila proyeksi pelindihan memenuhi kondisi ketidakamanan operasional berikut:</p>
                                <div className="bg-gray-100 p-4 rounded-lg font-mono text-center text-lg my-4 overflow-x-auto">
                                    C<sub>Ni</sub> &gt; 5.0 mg/L &nbsp;&nbsp;|&nbsp;&nbsp; C<sub>Co</sub> &gt; 1.0 mg/L
                                </div>
                                <p>Modifikasi pengujian ini secara literatur terbukti akurat mengonfirmasi mekanisme enkapsulasi pada limbah padat berbasis semen.</p>
                                
                                <div className="mt-8 flex flex-col items-center">
                                    {/* Ganti src dengan file asli Anda, misal /assets/gambar3-5.png */}
                                    <img src="/assets/gambar3-5.png" alt="Gambar 3.5" className="max-w-full h-auto rounded-lg shadow-md border bg-white p-4" />
                                    <p className="mt-3 text-sm text-center text-gray-500 italic max-w-3xl">
                                        Gambar 3.5 Profil pelindihan unsur logam berat dari matriks padatan semen melalui uji TCLP yang dimodifikasi dengan (a) Zn umur 3 hari, (b) Zn 28 hari, (c) Pb 3 hari, (d) Pb 28 hari (Dimodifikasi dari Huang dkk., 2016).
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
