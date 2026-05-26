"use client";

import { Header } from "@/components/layout/Header";
import { ArrowLeft, User, GraduationCap, MapPin } from "lucide-react";
import Link from 'next/link';
import Image from "next/image";

export default function TeamPage() {
    const researchers = [
        {
            name: "Muhammad Ilham Saripul Milah",
            role: "Lead Researcher & Full-Stack Developer",
            uni: "Institut Teknologi Bandung (ITB)",
            major: "Metallurgical Engineering - FTTM",
            img: "/assets/pp_ilham.jpg"
        },
        {
            name: "Dzaky Zahy Rabbani",
            role: "Numerical Modelling & Developer",
            uni: "Institut Teknologi Bandung (ITB)",
            major: "Oseanografi - FITB",
            img: "/assets/pp_dzaky.jpg"
        },
        {
            name: "Dean",
            role: "Chemistry Engineering Lead Researcher",
            uni: "Institut Teknologi Bandung (ITB)",
            major: "Teknik Kimia - FTI",
            img: "/assets/pp_dean.jpg"
        },
    ];

    return (
        <div className="min-h-screen bg-gray-100">
            <Header />

            <main className="container mx-auto max-w-6xl px-4 py-12">
                <Link href="/" className="mb-8 inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-800">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Beranda
                </Link>

                <div className="mb-12 text-center">
                    <span className="mb-2 block text-sm font-semibold uppercase tracking-widest text-green-600">LKTI HLHS PT IMIP 2026</span>
                    <h1 className="text-4xl font-bold text-gray-900">Tim Pengembang TAILINGSIM</h1>
                    <p className="mt-4 text-gray-600">Riset dan pengembangan platform simulasi upcycling tailing HPAL nikel laterit untuk kompetisi LKTI HLHS PT IMIP 2026.</p>
                </div>

                <div className="flex justify-center">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {researchers.map((res, i) => (
                            <div key={i} className="group w-full max-w-sm overflow-hidden rounded-2xl border bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                                <div className="relative h-72 w-full bg-gray-200">
                                    <Image
                                        src={res.img}
                                        alt={res.name}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        onError={(e) => {
                                            // Fallback if image not found
                                            const target = e.target as HTMLImageElement;
                                            target.style.display = 'none';
                                        }}
                                    />
                                    {/* Fallback avatar */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <User className="h-20 w-20 text-gray-400" />
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-900">{res.name}</h3>
                                    <p className="mb-4 text-sm font-medium text-gray-600">{res.role}</p>

                                    <div className="space-y-2 text-sm text-gray-500">
                                        <div className="flex items-start gap-2">
                                            <GraduationCap className="mt-0.5 h-4 w-4" />
                                            <span>{res.uni}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4" />
                                            <span>{res.major}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Logos - ITB & IMIP */}
                <div className="mt-20 flex flex-col items-center justify-center space-y-4 opacity-50 grayscale transition-all hover:grayscale-0">
                    <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400">Supported By</h3>
                    <div className="flex items-center gap-8">
                        <div className="relative h-16 w-16 lg:h-20 lg:w-20">
                            <Image src="/assets/Logo_ITB.png" alt="ITB" fill className="object-contain" />
                        </div>
                        <Image src="/LogoIMIP.png" alt="PT IMIP" width={220} height={65} className="h-12 w-auto lg:h-14" />
                    </div>
                </div>

            </main>
        </div>
    );
}
