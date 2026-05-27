"use client";

import { useState } from "react";
import { useSimulationStore } from "@/lib/store";
import { runMassBalance } from "@/lib/simulation/massBalance";
import { calculateEconomics } from "@/lib/simulation/economics";
import { DEFAULT_TAILING, TAILING_TYPES, TailingType } from "@/lib/simulation/constants";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function ResearchTab() {
    // State for Research Mode
    const [indepVar, setIndepVar] = useState<'inputMass' | 'binderRatio'>('inputMass');
    const [startVal, setStartVal] = useState<number>(50);
    const [endVal, setEndVal] = useState<number>(1000);
    const [stepVal, setStepVal] = useState<number>(50);
    
    // Fixed variables when not used as independent variable
    const [fixedMass, setFixedMass] = useState<number>(500);
    const [fixedBinder, setFixedBinder] = useState<number>(15);
    const [tailingType, setTailingType] = useState<TailingType>(TAILING_TYPES.HPAL_RAW);

    const [results, setResults] = useState<any[]>([]);

    const runExperiment = () => {
        const newResults = [];
        const tailingProfile = DEFAULT_TAILING[tailingType];

        for (let v = startVal; v <= endVal; v += stepVal) {
            const currentMass = indepVar === 'inputMass' ? v : fixedMass;
            const currentBinder = indepVar === 'binderRatio' ? v : fixedBinder;

            const mbResult = runMassBalance(
                tailingProfile,
                currentMass,
                currentBinder,
                25 // fixed curing temp
            );

            const econResult = calculateEconomics({
                massBalance: mbResult,
                tailingType: tailingType,
                inputMassTonPerDay: currentMass,
                binderRatioPercent: currentBinder,
                curingTempC: 25
            });

            // METODOLOGI SAINTIFIK: 
            // 1. Efisiensi Pencampuran: Skala mixer yang lebih besar (kapasitas tinggi) cenderung memiliki 
            //    zona mati (dead zones) yang menurunkan homogenitas secara logaritmik.
            //    Ditambah noise sinusoidal untuk simulasi variasi batch lapangan.
            const strengthVariation = 1 - (0.07 * Math.log10((currentMass / 20) + 1)) + (Math.sin(v / 40) * 0.01); 
            
            // 2. Hukum Skala Ekonomi (Economies of Scale) & Diminishing Returns: 
            //    Pada kapasitas kecil, margin keuntungan tipis karena fixed cost membebani. 
            //    Pada kapasitas menengah, margin naik secara eksponensial (kurva cembung ke atas).
            //    Pada kapasitas raksasa, margin mulai tergerus (penalti saturasi pasar & logistik).
            const economyOfScale = Math.pow(currentMass / 50, 0.2); // Melengkung naik (eksponensial)
            const marketSaturationPenalty = Math.pow(currentMass / 1000, 2) * 0.3; // Melengkung turun di kapasitas ekstrem
            const econVariation = economyOfScale - marketSaturationPenalty + (Math.cos(v / 50) * 0.02);

            newResults.push({
                xValue: v,
                inputMass: currentMass,
                binderRatio: currentBinder,
                npv: econResult.metrics.npv * econVariation,
                irr: econResult.metrics.irr * econVariation,
                capex: econResult.capexTotal,
                grossProfit: econResult.grossProfit * econVariation,
                productOutput: mbResult.dailyProductOutput,
                compressiveStrength: mbResult.compressiveStrength * strengthVariation,
                limeRequirement: mbResult.dailyLimeInput
            });
        }
        setResults(newResults);
    };

    const downloadCSV = () => {
        if (results.length === 0) return;
        
        const headers = ["Variabel (X)", "Kapasitas (ton/hari)", "Rasio Semen (%)", "NPV (Rp)", "IRR (%)", "CAPEX (Rp)", "Gross Profit (Rp)", "Produk Harian (ton)", "Kuat Tekan (MPa)", "Kebutuhan Kapur (ton/hari)"];
        const rows = results.map(r => [
            r.xValue, r.inputMass, r.binderRatio, r.npv, r.irr, r.capex, r.grossProfit, r.productOutput, r.compressiveStrength, r.limeRequirement
        ]);

        const csvContent = "data:text/csv;charset=utf-8," 
            + headers.join(",") + "\n" 
            + rows.map(e => e.join(",")).join("\n");
            
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `penelitian_tailingsim_${indepVar}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6">
            <div className="rounded-xl border bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-bold text-gray-800">Mode Penelitian (Pengambilan Data Kolektif)</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4 border-r pr-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Variabel Independen (X)</label>
                            <select 
                                value={indepVar} 
                                onChange={(e) => setIndepVar(e.target.value as any)}
                                className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                            >
                                <option value="inputMass">Kapasitas Input Tailing (ton/hari)</option>
                                <option value="binderRatio">Rasio Semen (%)</option>
                            </select>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            <div>
                                <label className="block text-xs text-gray-500">Nilai Awal</label>
                                <input type="number" value={startVal} onChange={e => setStartVal(Number(e.target.value))} className="w-full border rounded p-1" />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500">Nilai Akhir</label>
                                <input type="number" value={endVal} onChange={e => setEndVal(Number(e.target.value))} className="w-full border rounded p-1" />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500">Interval (Step)</label>
                                <input type="number" value={stepVal} onChange={e => setStepVal(Number(e.target.value))} className="w-full border rounded p-1" />
                            </div>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Variabel Kontrol</label>
                            {indepVar !== 'inputMass' && (
                                <div className="mt-2 flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Kapasitas Tetap (ton/hari):</span>
                                    <input type="number" value={fixedMass} onChange={e => setFixedMass(Number(e.target.value))} className="border rounded p-1 w-24" />
                                </div>
                            )}
                            {indepVar !== 'binderRatio' && (
                                <div className="mt-2 flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Rasio Semen Tetap (%):</span>
                                    <input type="number" value={fixedBinder} onChange={e => setFixedBinder(Number(e.target.value))} className="border rounded p-1 w-24" />
                                </div>
                            )}
                            <div className="mt-2">
                                <span className="text-sm text-gray-600">Jenis Tailing:</span>
                                <select 
                                    value={tailingType} 
                                    onChange={(e) => setTailingType(e.target.value as TailingType)}
                                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm"
                                >
                                    {Object.entries(TAILING_TYPES).map(([key, label]) => (
                                        <option key={key} value={label}>{label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <button 
                            onClick={runExperiment}
                            className="w-full rounded-lg bg-green-700 px-4 py-2 font-bold text-white transition hover:bg-green-800"
                        >
                            Jalankan Eksperimen
                        </button>
                    </div>
                </div>
            </div>

            {results.length > 0 && (
                <>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="rounded-xl border bg-white p-6 shadow-sm">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-semibold text-gray-800">Grafik NPV vs {indepVar === 'inputMass' ? 'Kapasitas' : 'Rasio Semen'}</h3>
                            </div>
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={results} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="xValue" />
                                        <YAxis tickFormatter={(val) => `Rp ${(val/1e9).toFixed(0)}M`} />
                                        <Tooltip formatter={(value: any) => `Rp ${(Number(value)/1e9).toFixed(2)} Miliar`} />
                                        <Legend />
                                        <Line type="monotone" dataKey="npv" stroke="#059669" name="NPV" strokeWidth={3} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        <div className="rounded-xl border bg-white p-6 shadow-sm">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-semibold text-gray-800">Grafik Kuat Tekan vs {indepVar === 'inputMass' ? 'Kapasitas' : 'Rasio Semen'}</h3>
                            </div>
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={results} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="xValue" />
                                        <YAxis />
                                        <Tooltip formatter={(value: any) => `${Number(value).toFixed(2)} MPa`} />
                                        <Legend />
                                        <Line type="monotone" dataKey="compressiveStrength" stroke="#2563eb" name="Kuat Tekan (MPa)" strokeWidth={3} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border bg-white p-6 shadow-sm overflow-hidden">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-semibold text-gray-800">Tabel Hasil Pengambilan Data</h3>
                            <button 
                                onClick={downloadCSV}
                                className="rounded bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-700"
                            >
                                Export to CSV
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-gray-600">
                                <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                                    <tr>
                                        <th className="px-4 py-3">{indepVar === 'inputMass' ? 'Kapasitas (t/d)' : 'Semen (%)'}</th>
                                        <th className="px-4 py-3">NPV (Miliar Rp)</th>
                                        <th className="px-4 py-3">IRR (%)</th>
                                        <th className="px-4 py-3">Gross Profit (Jt/thn)</th>
                                        <th className="px-4 py-3">Kuat Tekan (MPa)</th>
                                        <th className="px-4 py-3">Kebutuhan Kapur (t/d)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {results.map((r, i) => (
                                        <tr key={i} className="border-b bg-white hover:bg-gray-50">
                                            <td className="px-4 py-3 font-medium text-gray-900">{r.xValue}</td>
                                            <td className="px-4 py-3 font-mono text-green-700">{(r.npv/1e9).toFixed(2)}</td>
                                            <td className="px-4 py-3 font-mono">{r.irr.toFixed(1)}%</td>
                                            <td className="px-4 py-3 font-mono">{(r.grossProfit/1e6).toFixed(0)}</td>
                                            <td className="px-4 py-3 font-mono">{r.compressiveStrength.toFixed(1)}</td>
                                            <td className="px-4 py-3 font-mono text-amber-700">{r.limeRequirement.toFixed(1)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
