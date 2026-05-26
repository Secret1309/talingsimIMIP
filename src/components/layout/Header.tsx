"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-300 bg-white/80 backdrop-blur-md">
            <div className="container relative mx-auto flex h-16 items-center justify-between px-2 lg:h-24 lg:px-4">

                {/* Logos Section - Left (hidden on mobile to prevent overlap) */}
                <div className="hidden items-center gap-2 lg:flex lg:gap-6">
                    <div className="relative h-[55px] w-[55px] overflow-hidden rounded-full border-2 border-slate-200 shadow-sm">
                        <Image
                            src="/assets/Logo_ITB.png"
                            alt="Logo ITB"
                            fill
                            className="object-contain p-1"
                        />
                    </div>
                    <Image
                        src="/LogoIMIP.png"
                        alt="Logo IMIP"
                        width={180}
                        height={55}
                        className="h-[36px] w-auto lg:h-[40px]"
                    />
                </div>

                {/* Center Title - Centered on all screens */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform text-center">
                    <Link href="/">
                        <h1 className="bg-gradient-to-r from-green-700 via-green-600 to-yellow-500 bg-clip-text text-xl font-extrabold tracking-[0.1em] text-transparent drop-shadow-sm transition-all hover:opacity-90 sm:text-2xl lg:text-5xl lg:tracking-[0.2em]">
                            TAILINGSIM
                        </h1>
                    </Link>
                </div>

                {/* Right Section - Hamburger Menu */}
                <div className="relative ml-auto flex items-center lg:ml-0">
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-800 focus:outline-none"
                    >
                        {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>

                    {/* Dropdown Menu */}
                    {isMenuOpen && (
                        <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-gray-200 bg-white py-2 shadow-xl backdrop-blur-xl">
                            <Link
                                href="/simulation"
                                className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Simulasi
                            </Link>
                            <Link
                                href="/empowerment"
                                className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Kalkulator BUMDes
                            </Link>
                            <Link
                                href="/about"
                                className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Metodologi
                            </Link>
                            <Link
                                href="/documentation"
                                className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Dokumentasi
                            </Link>
                            <Link
                                href="/team"
                                className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Pengembang
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
