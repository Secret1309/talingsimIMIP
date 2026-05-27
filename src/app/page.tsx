
import Link from 'next/link';
import { Header } from "@/components/layout/Header";
import { ArrowRight, Factory, LineChart, Layers, Users } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-900">
      <Header />

      {/* Parallax / Sticky Background (Placeholder for Video) */}
      <div className="fixed inset-0 -z-10 h-screen w-full">
        {/* Fallback image (can be replaced with <video> tag later) */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/assets/bg_imip.jpg')" }}
        />
        {/* Dark overlay to ensure text readability */}
        <div className="absolute inset-0 bg-black/60 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 py-20 lg:py-28">
        <div className="container relative mx-auto px-4 text-center">
          <div className="mx-auto max-w-4xl space-y-6">
            <span className="inline-block rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-800">
              LKTI HLHS PT IMIP 2026 - Subtema Tailing
            </span>

            <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl leading-tight drop-shadow-md">
              TailingSIM: Decision Support System untuk Upcycling Tailing HPAL Nikel Laterit PT IMIP
            </h2>

            <p className="mx-auto max-w-3xl text-lg text-gray-200 leading-relaxed drop-shadow">
              Platform simulasi web real-time untuk menghitung stoikiometri netralisasi asam
              bebas (H₂SO₄ ±30 gpl), neraca massa hematit, kelayakan finansial (NPV/IRR),
              dan rekomendasi resep batako/paving block SNI dari limbah <strong>tailing HPAL nikel
              laterit</strong> - mendukung sirkular ekonomi terintegrasi kawasan PT IMIP dan
              pemberdayaan <strong>BUMDes Morowali</strong>.
            </p>

            <div className="mx-auto flex w-full max-w-[600px] flex-col items-center justify-center gap-4 pt-6">
              {/* Baris Atas: 2 Tombol Utama (Lebih Besar/Panjang) */}
              <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                <Link
                  href="/simulation"
                  className="group flex w-full items-center justify-center gap-2 rounded-full bg-green-700 py-4 px-2 text-center text-[15px] sm:text-lg font-semibold text-white shadow-lg transition-all hover:bg-green-800 hover:shadow-green-100"
                >
                  Mulai Simulasi <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/empowerment"
                  className="flex w-full items-center justify-center gap-2 rounded-full border border-yellow-400 bg-yellow-500 py-4 px-2 text-center text-[15px] sm:text-lg font-semibold text-gray-900 shadow-lg transition-all hover:bg-yellow-400 hover:shadow-yellow-100"
                >
                  Kalkulator BUMDes
                </Link>
              </div>

              {/* Baris Bawah: 3 Tombol Sekunder (Normal) */}
              <div className="mt-2 grid w-full grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
                <Link
                  href="/about"
                  className="flex w-full items-center justify-center gap-1 rounded-full border border-gray-300 bg-white py-3 px-2 text-center text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50"
                >
                  Metodologi
                </Link>
                <Link
                  href="/documentation"
                  className="flex w-full items-center justify-center gap-1 rounded-full border border-gray-300 bg-white py-3 px-2 text-center text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50"
                >
                  Dokumentasi
                </Link>
                <Link
                  href="/team"
                  className="flex w-full items-center justify-center gap-1 rounded-full border border-gray-300 bg-white py-3 px-2 text-center text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50"
                >
                  Pengembang
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats/Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border bg-white p-8 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gray-200 text-gray-700">
                <Layers className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-bold">Neraca Massa HPAL</h3>
              <p className="text-gray-600">Kalkulasi stoikiometri netralisasi H₂SO₄ + Ca(OH)₂ menjadi Gipsum secara otomatis. Simulasi mass balance hematit (Fe₂O₃) dan silika dengan variabel rasio kapur.</p>
            </div>

            <div className="rounded-2xl border bg-white p-8 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-100 text-yellow-800">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-bold">Kalkulator BUMDes</h3>
              <p className="text-gray-600">Terjemahan resep praktis (Kg & Liter) untuk masyarakat Morowali. Ubah tailing HPAL jadi batako/paving block standar SNI dengan panduan langkah demi langkah.</p>
            </div>

            <div className="rounded-2xl border bg-white p-8 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gray-200 text-gray-700">
                <Factory className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-bold">Visualisasi Pabrik 3D</h3>
              <p className="text-gray-600">Visualisasi 3D interaktif: Tangki Netralisasi, Mixer Tailing-Semen, Hydraulic Press, dan Steam Curing Chamber.</p>
            </div>

            <div className="rounded-2xl border bg-white p-8 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gray-200 text-gray-700">
                <LineChart className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-bold">Analisis Tekno-Ekonomi</h3>
              <p className="text-gray-600">Analisis kelayakan ekonomi lengkap: NPV, IRR, Payback Period, CAPEX/OPEX skala industri kawasan PT IMIP Morowali.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
