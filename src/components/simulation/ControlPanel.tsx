
"use client";

import { useState } from "react";
import { useSimulationStore } from "@/lib/store";
import { TAILING_TYPES } from "@/lib/simulation/constants";
import { Play, RotateCcw, Download } from "lucide-react";
import { exportSimulationData, exportEconomicReport } from "@/lib/export";

export function ControlPanel() {
    const {
        tailingType, inputMass, binderRatio, curingTemp, isSimulating,
        setTailingType, setParams, runSimulation, massBalanceResult, economicResults
    } = useSimulationStore();

    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Mobile Toggle */}
            <div className="border-b bg-white p-4 lg:hidden">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700"
                >
                    <span>{isOpen ? 'Sembunyikan Parameter' : 'Atur Parameter'}</span>
                    <Play className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
                </button>
            </div>

            {/* Panel Content */}
            <div className={`${isOpen ? 'flex' : 'hidden'} h-full w-full flex-col gap-6 overflow-y-auto border-r bg-white p-6 shadow-sm lg:flex lg:w-80`}>
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="mb-1 text-lg font-bold text-gray-900">Parameter Input</h2>
                        <p className="text-xs text-gray-500">Konfigurasi Parameter Simulasi Tailing HPAL</p>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="rounded-md p-1 hover:bg-gray-100 lg:hidden">
                        <RotateCcw className="h-4 w-4 rotate-45" />
                    </button>
                </div>

                {/* 1. Tailing Type */}
                <div className="space-y-4">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-600">1. Jenis Tailing</h3>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Tipe Tailing</label>
                        <select
                            className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-gray-500 focus:outline-none"
                            value={tailingType}
                            onChange={(e) => setTailingType(e.target.value as any)}
                        >
                            {Object.values(TAILING_TYPES).map((t) => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium">Kapasitas Tailing HPAL (ton/hari)</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    min="1" max="5000"
                                    value={inputMass}
                                    onChange={(e) => setParams({ inputMass: Number(e.target.value) || 1 })}
                                    className="w-20 rounded-md border border-gray-300 p-1 text-right text-sm font-bold text-gray-700 focus:border-gray-500 focus:outline-none"
                                />
                                <span className="text-sm font-bold text-gray-700">ton/hari</span>
                            </div>
                        </div>
                        <input
                            type="range" min="1" max="5000" step="1"
                            value={inputMass}
                            onChange={(e) => setParams({ inputMass: Number(e.target.value) })}
                            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-gray-700"
                        />
                        <div className="flex justify-between text-xs text-gray-400">
                            <span>1</span>
                            <span>5000</span>
                        </div>
                    </div>
                </div>

                {/* 2. Process Parameters */}
                <div className="space-y-6">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-600">2. Parameter Proses</h3>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium">Rasio Semen/Binder (% terhadap tailing)</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    min="5" max="30"
                                    value={binderRatio}
                                    onChange={(e) => setParams({ binderRatio: Number(e.target.value) || 5 })}
                                    className="w-16 rounded-md border border-gray-300 p-1 text-right text-sm font-bold text-gray-700 focus:border-gray-500 focus:outline-none"
                                />
                                <span className="text-sm font-bold text-gray-700">%</span>
                            </div>
                        </div>
                        <input
                            type="range" min="5" max="30" step="1"
                            value={binderRatio}
                            onChange={(e) => setParams({ binderRatio: Number(e.target.value) })}
                            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-gray-700"
                        />
                        <div className="flex justify-between text-xs text-gray-400">
                            <span>5%</span>
                            <span>30%</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium">Suhu Steam Curing</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    min="25" max="80"
                                    value={curingTemp}
                                    onChange={(e) => setParams({ curingTemp: Number(e.target.value) || 25 })}
                                    className="w-16 rounded-md border border-gray-300 p-1 text-right text-sm font-bold text-gray-700 focus:border-gray-500 focus:outline-none"
                                />
                                <span className="text-sm font-bold text-gray-700">°C</span>
                            </div>
                        </div>
                        <input
                            type="range" min="25" max="80" step="1"
                            value={curingTemp}
                            onChange={(e) => setParams({ curingTemp: Number(e.target.value) })}
                            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-gray-700"
                        />
                        <div className="flex justify-between text-xs text-gray-400">
                            <span>25°C</span>
                            <span>80°C</span>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="mt-auto space-y-3 pt-6">
                    <button
                        onClick={() => {
                            runSimulation();
                            setIsOpen(false);
                        }}
                        disabled={isSimulating}
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-800 px-4 py-3 font-semibold text-white transition-colors hover:bg-gray-700 disabled:bg-gray-400"
                    >
                        {isSimulating ? (
                            <>Menghitung...</>
                        ) : (
                            <>
                                <Play className="h-4 w-4" /> Jalankan Simulasi
                            </>
                        )}
                    </button>

                    <div className="h-px w-full bg-gray-200 my-2"></div>

                    <button
                        onClick={() => massBalanceResult && exportSimulationData(massBalanceResult)}
                        disabled={!massBalanceResult}
                        className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 disabled:opacity-50"
                    >
                        <Download className="h-3 w-3" /> Export CSV
                    </button>

                    <button
                        onClick={() => economicResults && exportEconomicReport(economicResults)}
                        disabled={!economicResults}
                        className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 disabled:opacity-50"
                    >
                        <Download className="h-3 w-3" /> Export Laporan Ekonomi
                    </button>

                    <button
                        onClick={() => setParams({ inputMass: 500, binderRatio: 15, curingTemp: 25 })}
                        className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                    >
                        <RotateCcw className="h-3 w-3" /> Reset Default
                    </button>
                </div>
            </div>
        </>
    );
}
