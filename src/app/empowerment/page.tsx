"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { TAILING_TYPES, TailingType, COMMUNITY_CONSTANTS } from "@/lib/simulation/constants";
import { calculateCommunityRecipe, CommunityRecipeResult } from "@/lib/simulation/communityRecipe";
import { ShieldCheck, ShieldAlert, Beaker, Factory, Scale, CheckCircle2, Info, Upload, Layers } from "lucide-react";
import Link from "next/link";

export default function EmpowermentPage() {
    const [tailingType, setTailingType] = useState<TailingType>(TAILING_TYPES.HPAL_RAW);
    const [productType, setProductType] = useState<'PAVING_BLOCK' | 'BATAKO_BERONGGA'>('PAVING_BLOCK');
    const [inputKg, setInputKg] = useState<number>(50);
    const [result, setResult] = useState<CommunityRecipeResult | null>(null);

    const handleCalculate = () => {
        const res = calculateCommunityRecipe(inputKg, tailingType, productType);
        setResult(res);
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <Header />

            {/* Hero Section */}
            <div className="bg-green-800 px-4 py-16 text-center text-white sm:px-6 lg:px-8">
                <div className="mx-auto max-w-3xl">
                    <h1 className="text-3xl font-extrabold sm:text-4xl md:text-5xl">Kalkulator BUMDes</h1>
                    <p className="mt-4 text-lg text-green-100">
                        Platform panduan praktis untuk mengubah limbah tailing HPAL nikel laterit menjadi produk batako & paving block bernilai ekonomi. Dirancang khusus untuk BUMDes kawasan Morowali.
                    </p>
                </div>
            </div>

            <div className="mx-auto mt-[-40px] max-w-5xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
                    
                    {/* Left Column: Input & Tracker */}
                    <div className="space-y-6 md:col-span-5">
                        
                        {/* Safe-Waste Tracker */}
                        <div className="overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-200">
                            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                                <Factory className="h-5 w-5 text-gray-500" />
                                <h2 className="text-lg font-bold text-gray-800">Cek Status Tailing HPAL</h2>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Status Netralisasi Tailing</label>
                                    <select
                                        className="w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-green-600 focus:ring-green-600"
                                        value={tailingType}
                                        onChange={(e) => {
                                            setTailingType(e.target.value as TailingType);
                                            setResult(null); // Reset result on type change
                                        }}
                                    >
                                        <option value={TAILING_TYPES.HPAL_RAW}>{TAILING_TYPES.HPAL_RAW}</option>
                                        <option value={TAILING_TYPES.HPAL_NEUTRALIZED}>{TAILING_TYPES.HPAL_NEUTRALIZED}</option>
                                    </select>
                                </div>

                                {result ? (
                                    <div className={`mt-4 rounded-lg p-4 border ${result.safetyStatus === 'CLEARED' ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
                                        <div className="flex items-start gap-3">
                                            {result.safetyStatus === 'CLEARED' ? (
                                                <ShieldCheck className="h-6 w-6 text-green-600 mt-0.5 flex-shrink-0" />
                                            ) : (
                                                <ShieldAlert className="h-6 w-6 text-yellow-600 mt-0.5 flex-shrink-0" />
                                            )}
                                            <div className="flex-1">
                                                <h3 className={`text-sm font-bold ${result.safetyStatus === 'CLEARED' ? 'text-green-800' : 'text-yellow-800'}`}>
                                                    {result.safetyStatus === 'CLEARED' ? 'STATUS AMAN' : 'PERHATIAN'}
                                                </h3>
                                                <p className="mt-1 text-xs text-gray-700 leading-relaxed">
                                                    {result.safetyMessage}
                                                </p>
                                                
                                                {/* TCLP Checklist Validation - UPDATED: Ni/Co/Cr6/As */}
                                                <div className="mt-3 bg-white bg-opacity-60 rounded p-2 text-xs text-gray-700">
                                                    <div className="font-semibold mb-1 border-b border-gray-200 pb-1">Validasi Uji TCLP (PP No.22/2021 Lamp. XI)</div>
                                                    <div className="grid grid-cols-2 gap-x-2 gap-y-1 mt-1">
                                                        <div className="flex justify-between">
                                                            <span>Ni ({COMMUNITY_CONSTANTS.TCLP_LIMITS.Ni} mg/L):</span>
                                                            <strong className={result.tclpResults.Ni < COMMUNITY_CONSTANTS.TCLP_LIMITS.Ni ? "text-green-600" : "text-red-600"}>{result.tclpResults.Ni} mg/L</strong>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span>Co ({COMMUNITY_CONSTANTS.TCLP_LIMITS.Co} mg/L):</span>
                                                            <strong className={result.tclpResults.Co < COMMUNITY_CONSTANTS.TCLP_LIMITS.Co ? "text-green-600" : "text-red-600"}>{result.tclpResults.Co} mg/L</strong>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span>Cr⁶⁺ ({COMMUNITY_CONSTANTS.TCLP_LIMITS.Cr6} mg/L):</span>
                                                            <strong className={result.tclpResults.Cr6 < COMMUNITY_CONSTANTS.TCLP_LIMITS.Cr6 ? "text-green-600" : "text-red-600"}>{result.tclpResults.Cr6} mg/L</strong>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span>As ({COMMUNITY_CONSTANTS.TCLP_LIMITS.As} mg/L):</span>
                                                            <strong className={result.tclpResults.As < COMMUNITY_CONSTANTS.TCLP_LIMITS.As ? "text-green-600" : "text-red-600"}>{result.tclpResults.As} mg/L</strong>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="mt-3 text-xs text-gray-500 border-t border-gray-200/60 pt-2">
                                                    Lokasi: <strong>{result.bufferStorageName}</strong><br/>
                                                    Stok: {result.availableTons} Ton (Update: {result.lastValidated})
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="rounded-lg bg-blue-50 p-4 border border-blue-100 flex items-start gap-3">
                                        <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                                        <p className="text-xs text-blue-800">
                                            Pilih status netralisasi tailing HPAL dan masukkan jumlah yang ingin diproses. Sistem akan memvalidasi keamanannya secara otomatis berdasarkan uji TCLP (Ni, Co, Cr⁶⁺, As).
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Calculator Input */}
                        <div className="overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-200">
                            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                                <Layers className="h-5 w-5 text-gray-500" />
                                <h2 className="text-lg font-bold text-gray-800">Target Produksi</h2>
                            </div>
                            <div className="p-6 space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Produk & Cetakan (SNI)</label>
                                    <select
                                        className="w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-green-600 focus:ring-green-600 mb-6"
                                        value={productType}
                                        onChange={(e) => {
                                            setProductType(e.target.value as any);
                                            setResult(null);
                                        }}
                                    >
                                        <option value="PAVING_BLOCK">Paving Block (SNI 03-0691-1996)</option>
                                        <option value="BATAKO_BERONGGA">Batako Berongga (SNI 03-0349-1989)</option>
                                    </select>
                                </div>
                                <div className="border-t border-gray-100 pt-4">
                                    <div className="flex justify-between mb-2">
                                        <label className="text-sm font-medium text-gray-700">Berat Tailing HPAL (Kg)</label>
                                        <span className="text-sm font-bold text-green-700">{inputKg} Kg</span>
                                    </div>
                                    <input
                                        type="range" min="10" max="500" step="10"
                                        value={inputKg}
                                        onChange={(e) => {
                                            setInputKg(Number(e.target.value));
                                            setResult(null);
                                        }}
                                        className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-green-600"
                                    />
                                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                                        <span>10 Kg (Skala Uji)</span>
                                        <span>500 Kg (Skala BUMDes)</span>
                                    </div>
                                </div>
                                <button
                                    onClick={handleCalculate}
                                    className="w-full rounded-lg bg-green-700 px-4 py-3 text-sm font-bold text-white shadow-md transition-colors hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 flex items-center justify-center gap-2"
                                >
                                    <Beaker className="h-4 w-4" /> Hitung Resep & Biaya
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Output & Estimate */}
                    <div className="md:col-span-7">
                        {result ? (
                            <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                                {/* Recipe Instructions - UPDATED: Kapur + Semen + Air */}
                                <div className="overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-200">
                                    <div className="bg-green-50 px-6 py-4 border-b border-green-100">
                                        <h2 className="text-lg font-bold text-green-900">🛠️ Resep Praktis ({result.tailingInputKg} Kg Tailing HPAL)</h2>
                                        <p className="text-sm text-green-700">Untuk Produk Konstruksi SNI - Semen-Pozolan HPAL</p>
                                    </div>
                                    <div className="p-6">
                                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                                            <div className="rounded-xl bg-gray-50 p-4 border border-gray-100 text-center flex flex-col items-center justify-center">
                                                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Tailing HPAL</div>
                                                <div className="text-xl sm:text-2xl font-black text-green-700 leading-none">{result.tailingKarung} <span className="text-xs font-medium text-gray-600 block sm:inline mt-1 sm:mt-0">Karung</span></div>
                                                <div className="mt-2 text-xs text-gray-400">~{result.tailingInputKg} Kg</div>
                                            </div>
                                            <div className="rounded-xl bg-amber-50 p-4 border border-amber-200 text-center flex flex-col items-center justify-center">
                                                <div className="text-xs font-semibold text-amber-700 uppercase tracking-wider mb-1">Kapur Ca(OH)₂</div>
                                                <div className="text-xl sm:text-2xl font-black text-amber-600 leading-none">{result.limeKg} <span className="text-xs font-medium text-gray-600 block sm:inline mt-1 sm:mt-0">Kg</span></div>
                                                <div className="mt-2 text-xs text-gray-400">~{result.limeKarung} Karung (25 kg)</div>
                                            </div>
                                            <div className="rounded-xl bg-gray-50 p-4 border border-gray-100 text-center flex flex-col items-center justify-center">
                                                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Semen Portland</div>
                                                <div className="text-xl sm:text-2xl font-black text-green-700 leading-none">{result.cementSak} <span className="text-xs font-medium text-gray-600 block sm:inline mt-1 sm:mt-0">Sak</span></div>
                                                <div className="mt-2 text-xs text-gray-400">sak 40kg (~{result.cementKg} Kg)</div>
                                            </div>
                                            <div className="rounded-xl bg-blue-50 p-4 border border-blue-200 text-center flex flex-col items-center justify-center">
                                                <div className="text-xs font-semibold text-blue-700 uppercase tracking-wider mb-1">Air Bersih</div>
                                                <div className="text-xl sm:text-2xl font-black text-blue-600 leading-none">{result.waterLiters} <span className="text-xs font-medium text-gray-600 block sm:inline mt-1 sm:mt-0">Liter</span></div>
                                                <div className="mt-2 text-xs text-gray-400">pencampur</div>
                                            </div>
                                        </div>

                                        {/* Gipsum estimate info */}
                                        <div className="mb-6 rounded-lg bg-amber-50 p-3 border border-amber-100 text-xs text-amber-800">
                                            ⚗️ Estimasi gipsum (CaSO₄·2H₂O) terbentuk dari netralisasi: <strong>~{result.gypsumEstimateKg} Kg</strong> - gipsum ini akan terenkapsulasi dalam produk sebagai filler mikro.
                                        </div>

                                        <h3 className="font-bold text-gray-800 mb-3">Langkah Pencampuran:</h3>
                                        <ul className="space-y-3">
                                            {result.mixingSteps.map((step, idx) => {
                                                const [title, desc] = step.split(' - ');
                                                return (
                                                    <li key={idx} className="flex gap-3">
                                                        <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                                                        <div>
                                                            <strong className="text-gray-800 text-sm block">{title}</strong>
                                                            <span className="text-gray-600 text-sm">{desc}</span>
                                                        </div>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                </div>

                                {/* Economic Estimate */}
                                <div className="overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-200">
                                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
                                        <h2 className="text-lg font-bold text-gray-800">📈 Estimasi Produksi & Biaya</h2>
                                    </div>
                                    <div className="p-6">
                                        <div className="flex flex-col sm:flex-row gap-6 mb-6">
                                            <div className="flex-1 rounded-xl bg-gradient-to-br from-green-600 to-green-800 p-6 text-white shadow-md">
                                                <div className="text-green-100 text-sm font-medium mb-1">Estimasi Produksi {result.productName}</div>
                                                <div className="text-4xl font-black flex items-baseline gap-2">~{result.estimatedBlocks} <span className="text-xl font-medium">Buah</span></div>
                                                <div className="mt-2 text-xs text-green-100 opacity-80">(Berdasarkan SNI, perkiraan {result.totalMixKg} Kg material)</div>
                                            </div>
                                            <div className="flex-1 rounded-xl bg-white p-6 border border-gray-200 shadow-sm flex flex-col justify-center">
                                                <div className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-1">Total Biaya Bahan</div>
                                                <div className="text-2xl font-black text-gray-900">
                                                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(result.totalMaterialCostIDR)}
                                                </div>
                                                <div className="mt-1 flex items-center gap-2 text-sm text-gray-600">
                                                    <span>≈</span>
                                                    <strong className="text-gray-800">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(result.costPerBlock)}</strong>
                                                    <span>/ blok</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Cost Breakdown */}
                                        <div className="mb-6 rounded-lg bg-gray-50 p-4 border border-gray-100">
                                            <h4 className="text-sm font-bold text-gray-700 mb-2">Rincian Biaya Bahan:</h4>
                                            <div className="grid grid-cols-3 gap-3 text-xs text-gray-600">
                                                <div className="flex justify-between">
                                                    <span>Kapur Ca(OH)₂:</span>
                                                    <strong>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(result.costBreakdown.limeCost)}</strong>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Semen:</span>
                                                    <strong>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(result.costBreakdown.cementCost)}</strong>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Air:</span>
                                                    <strong>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(result.costBreakdown.waterCost)}</strong>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="rounded-lg bg-blue-50 p-4 border border-blue-100 flex items-start gap-4">
                                            <div className="rounded-full bg-blue-100 p-2">
                                                <Upload className="h-5 w-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-blue-900">Jangan lupa laporkan hasil produksi!</h4>
                                                <p className="mt-1 text-xs text-blue-800 leading-relaxed">
                                                    Fotokan produk yang sudah mengeras dan upload ke sistem <strong>Green Product Showcase</strong>. PT IMIP dan Dinas PUPR Morowali memantau katalog komunitas secara berkala untuk pembelian grosir infrastruktur kawasan industri.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex h-full min-h-[400px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white p-6 text-center">
                                <Scale className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                                <h3 className="mb-2 text-lg font-bold text-gray-900">Belum ada kalkulasi</h3>
                                <p className="max-w-sm text-sm text-gray-500">
                                    Pilih status netralisasi tailing HPAL dan masukkan berat yang ingin diproses di panel kiri untuk melihat resep kapur + semen, langkah pencampuran, dan estimasi biaya.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
