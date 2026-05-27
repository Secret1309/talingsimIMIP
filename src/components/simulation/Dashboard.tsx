"use client";

import { useState } from "react";
import { useSimulationStore } from "@/lib/store";
import { DEFAULT_TAILING, TAILING_TYPES } from "@/lib/simulation/constants";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AreaChart, Area, BarChart, Bar, ReferenceLine } from 'recharts';
import { ReactorScene } from "./ReactorScene";
import { ResearchTab } from "./ResearchTab";

const formatRp = (value: number): string => {
    if (Math.abs(value) >= 1e12) return `Rp ${(value / 1e12).toFixed(2)} T`;
    if (Math.abs(value) >= 1e9) return `Rp ${(value / 1e9).toFixed(2)} M`;
    if (Math.abs(value) >= 1e6) return `Rp ${(value / 1e6).toFixed(1)} Jt`;
    return `Rp ${value.toLocaleString('id-ID')}`;
};

export function Dashboard() {
    const [activeTab, setActiveTab] = useState<'visual' | 'results' | 'economy' | 'research'>('results');
    const { massBalanceResult, economicResults, inputMass, tailingType } = useSimulationStore();

    const COLORS = ['#374151', '#6b7280', '#9ca3af', '#d1d5db', '#d97706', '#0e7490'];

    // Mass balance pie chart data
    const massDistribution = massBalanceResult ? [
        { name: 'Produk Jadi', value: massBalanceResult.dailyProductOutput },
        { name: 'Material Loss', value: massBalanceResult.dailyLoss },
    ] : [];

    // Input composition pie chart - UPDATED: includes Kapur
    const inputComposition = massBalanceResult ? [
        { name: 'Tailing HPAL', value: massBalanceResult.dailyTailingInput },
        { name: 'Semen (Binder)', value: massBalanceResult.dailyBinderInput },
        { name: 'Kapur Ca(OH)₂', value: massBalanceResult.dailyLimeInput },
    ] : [];

    // OPEX breakdown for bar chart - UPDATED: includes Kapur
    const opexBreakdownData = economicResults ? (() => {
        const rawData = [
            { name: 'Semen', value: +(economicResults.opexBreakdown.binderCost / 1e9).toFixed(2), fill: '#374151' },
            { name: 'Kapur', value: +(economicResults.opexBreakdown.limeCost / 1e9).toFixed(2), fill: '#d97706' },
            { name: 'Energi', value: +(economicResults.opexBreakdown.energyCost / 1e9).toFixed(2), fill: '#6b7280' },
            { name: 'Tenaga Kerja', value: +(economicResults.opexBreakdown.laborCost / 1e9).toFixed(2), fill: '#9ca3af' },
            { name: 'Pemeliharaan', value: +(economicResults.opexBreakdown.maintenance / 1e9).toFixed(2), fill: '#d1d5db' },
            { name: 'Pra-Perlakuan', value: +(economicResults.opexBreakdown.preTreatmentCost / 1e9).toFixed(2), fill: '#0e7490' },
        ];
        const maxVal = Math.max(...rawData.map(d => d.value));
        const minBarHeight = maxVal * 0.03; // 3% of max ensures visibility
        return rawData.map(d => ({
            ...d,
            actualValue: d.value,
            value: Math.max(d.value, minBarHeight),
        }));
    })() : [];

    return (
        <div className="flex h-full flex-1 flex-col overflow-hidden bg-gray-100">
            {/* Tab Navigation */}
            <div className="flex overflow-x-auto border-b bg-white px-2 lg:px-6 no-scrollbar">
                <button
                    onClick={() => setActiveTab('visual')}
                    className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors lg:px-6 lg:py-4 ${activeTab === 'visual' ? 'border-gray-800 text-gray-800' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    Visualisasi Pabrik
                </button>
                <button
                    onClick={() => setActiveTab('results')}
                    className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors lg:px-6 lg:py-4 ${activeTab === 'results' ? 'border-gray-800 text-gray-800' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    Neraca Massa
                </button>
                <button
                    onClick={() => setActiveTab('economy')}
                    className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors lg:px-6 lg:py-4 ${activeTab === 'economy' ? 'border-gray-800 text-gray-800' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    Dashboard Ekonomi
                </button>
                <button
                    onClick={() => setActiveTab('research')}
                    className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors lg:px-6 lg:py-4 ${activeTab === 'research' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-blue-600'}`}
                >
                    Mode Penelitian
                </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6">
                {/* ====== MASS BALANCE TAB ====== */}
                {activeTab === 'results' && (
                    <div className="space-y-6">
                        {/* KPI Cards - 6 cards including new Kapur and Gipsum */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-6">
                            <div className="rounded-xl border bg-white p-4 shadow-sm">
                                <p className="text-sm text-gray-500">Output Produk (Harian)</p>
                                <p className="text-2xl font-bold text-gray-800 font-mono">
                                    {massBalanceResult ? massBalanceResult.dailyProductOutput.toFixed(1) : '-'} <span className="text-sm font-sans">ton/hari</span>
                                </p>
                            </div>
                            <div className="rounded-xl border bg-white p-4 shadow-sm">
                                <p className="text-sm text-gray-500">Product Yield</p>
                                <p className="text-2xl font-bold text-gray-700 font-mono">
                                    {massBalanceResult ? massBalanceResult.productYield.toFixed(1) : '-'}%
                                </p>
                            </div>
                            <div className="rounded-xl border bg-white p-4 shadow-sm">
                                <p className="text-sm text-gray-500">Kuat Tekan Produk</p>
                                <p className="text-2xl font-bold text-gray-700 font-mono">
                                    {massBalanceResult ? massBalanceResult.compressiveStrength.toFixed(1) : '-'} <span className="text-sm font-sans">MPa</span>
                                </p>
                            </div>
                            <div className="rounded-xl border bg-white p-4 shadow-sm">
                                <p className="text-sm text-gray-500">Output Tahunan</p>
                                <p className="text-2xl font-bold text-gray-800 font-mono">
                                    {massBalanceResult ? (massBalanceResult.annualProductOutput / 1000).toFixed(1) : '-'} <span className="text-sm font-sans">kton/tahun</span>
                                </p>
                            </div>
                            {/* NEW: Kebutuhan Kapur Harian */}
                            <div className="rounded-xl border bg-white p-4 shadow-sm">
                                <p className="text-sm text-gray-500">Kebutuhan Kapur Harian</p>
                                <p className="text-2xl font-bold text-amber-700 font-mono">
                                    {massBalanceResult ? massBalanceResult.dailyLimeInput.toFixed(1) : '-'}
                                    <span className="text-sm font-sans"> ton/hari</span>
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                    ≈ {massBalanceResult ? massBalanceResult.limeRequirementKgPerTonTailing.toFixed(1) : '-'} kg/ton tailing
                                </p>
                            </div>
                            {/* NEW: Gipsum Sampingan */}
                            <div className="rounded-xl border bg-white p-4 shadow-sm">
                                <p className="text-sm text-gray-500">Gipsum Sampingan</p>
                                <p className="text-2xl font-bold text-blue-700 font-mono">
                                    {massBalanceResult ? massBalanceResult.dailyGypsumByProduct.toFixed(1) : '-'}
                                    <span className="text-sm font-sans"> ton/hari</span>
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                    ≈ {massBalanceResult ? massBalanceResult.gypsumProducedKgPerTonTailing.toFixed(1) : '-'} kg/ton tailing
                                </p>
                            </div>
                        </div>

                        {/* Product Info Card */}
                        {massBalanceResult && (
                            <div className="rounded-xl border-2 border-gray-300 bg-white p-4 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500">Produk Output</p>
                                        <p className="text-lg font-bold text-gray-800">{massBalanceResult.productName}</p>
                                    </div>
                                    <span className={`rounded-full px-3 py-1 text-sm font-semibold ${
                                        massBalanceResult.qualityGrade === 'premium'
                                            ? 'bg-gray-800 text-white'
                                            : 'bg-gray-200 text-gray-700'
                                    }`}>
                                        {massBalanceResult.qualityGrade === 'premium' ? '⭐ Premium' : 'Standar'}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* NEW: Stoikiometri Netralisasi Card */}
                        {massBalanceResult && (
                            <div className="rounded-xl border-2 border-amber-200 bg-amber-50/30 p-6">
                                <h3 className="font-bold text-amber-900 mb-3">
                                    ⚗️ Stoikiometri Netralisasi Asam Bebas
                                </h3>
                                <div className="grid grid-cols-3 gap-4 font-mono text-sm">
                                    <div className="text-center p-3 bg-white rounded-lg border">
                                        <div className="text-xs text-gray-500 mb-1">Sisa Asam (H₂SO₄)</div>
                                        <div className="font-bold text-red-700">{massBalanceResult.h2so4ContentGpl} gpl</div>
                                    </div>
                                    <div className="text-center p-3 bg-white rounded-lg border">
                                        <div className="text-xs text-gray-500 mb-1">Kapur Ca(OH)₂</div>
                                        <div className="font-bold text-amber-700">
                                            {massBalanceResult.limeRequirementKgPerTonTailing} kg/ton
                                        </div>
                                    </div>
                                    <div className="text-center p-3 bg-white rounded-lg border">
                                        <div className="text-xs text-gray-500 mb-1">Gipsum Terbentuk</div>
                                        <div className="font-bold text-blue-700">
                                            {massBalanceResult.gypsumProducedKgPerTonTailing} kg/ton
                                        </div>
                                    </div>
                                </div>
                                <p className="text-xs text-amber-800 mt-3">
                                    Reaksi: H₂SO₄ + Ca(OH)₂ → CaSO₄·2H₂O (Gipsum) + H₂O
                                    | Rasio Molar 1:1 | MW H₂SO₄=98 g/mol | MW Ca(OH)₂=74 g/mol | MW Gipsum=172 g/mol
                                </p>
                            </div>
                        )}

                        {/* Charts Grid */}
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            {/* Input Composition */}
                            <div className="rounded-xl border bg-white p-6 shadow-sm">
                                <h3 className="mb-4 font-semibold text-gray-800">Komposisi Input</h3>
                                <div className="h-[300px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={inputComposition}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                                                outerRadius={100}
                                                fill="#374151"
                                                dataKey="value"
                                            >
                                                {inputComposition.map((_, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip formatter={(value) => `${Number(value).toFixed(1)} ton/hari`} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Output Distribution */}
                            <div className="rounded-xl border bg-white p-6 shadow-sm">
                                <h3 className="mb-4 font-semibold text-gray-800">Distribusi Output</h3>
                                <div className="h-[300px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={massDistribution}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(1)}%`}
                                                outerRadius={100}
                                                fill="#374151"
                                                dataKey="value"
                                            >
                                                {massDistribution.map((_, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip formatter={(value) => `${Number(value).toFixed(2)} ton/hari`} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Sensitivity Analysis - UPDATED: Lime Ratio vs Strength & OPEX */}
                            {massBalanceResult && (
                                <div className="col-span-1 rounded-xl border bg-white p-6 shadow-sm lg:col-span-2">
                                    <h3 className="mb-4 font-semibold text-gray-800">Optimasi Netralisasi: Rasio Kapur vs Kuat Tekan & Biaya OPEX</h3>
                                    <div className="h-[350px] w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={massBalanceResult.sensitivityData} margin={{ top: 5, right: 40, left: 40, bottom: 25 }}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="limeRatio" label={{ value: 'Rasio Kapur (%)', position: 'insideBottom', offset: -10 }} />
                                                <YAxis yAxisId="left" width={80} label={{ value: 'Kuat Tekan (MPa)', angle: -90, position: 'insideLeft', offset: -10 }} />
                                                <YAxis yAxisId="right" orientation="right" width={70} label={{ value: 'OPEX (Juta Rp/hari)', angle: 90, position: 'insideRight', offset: 5 }} />
                                                <Tooltip />
                                                <Legend verticalAlign="top" />
                                                <ReferenceLine yAxisId="left" x={8.5} stroke="#d97706" strokeDasharray="5 5" strokeWidth={2} label={{ value: 'Titik Optimal', fill: '#d97706', fontSize: 12 }} />
                                                <Line yAxisId="left" type="monotone" dataKey="compressiveStrengthMPa" stroke="#374151" name="Kuat Tekan (MPa)" strokeWidth={3} />
                                                <Line yAxisId="right" type="monotone" dataKey="dailyOpexProxy" stroke="#9ca3af" name="OPEX Harian (Jt Rp)" strokeWidth={2} strokeDasharray="5 5" />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ====== ECONOMY TAB ====== */}
                {activeTab === 'economy' && economicResults && (
                    <div className="space-y-6">
                        {/* Financial KPIs */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <div className="rounded-xl border-2 border-gray-300 bg-white p-4 shadow-sm">
                                <p className="text-sm text-gray-500">NPV (10 Tahun)</p>
                                <p className={`text-2xl font-bold font-mono ${economicResults.metrics.npv > 0 ? 'text-green-700' : 'text-red-600'}`}>
                                    {formatRp(economicResults.metrics.npv)}
                                </p>
                            </div>
                            <div className="rounded-xl border-2 border-gray-300 bg-white p-4 shadow-sm">
                                <p className="text-sm text-gray-500">IRR</p>
                                <p className={`text-2xl font-bold font-mono ${economicResults.metrics.irr > 12 ? 'text-green-700' : 'text-amber-600'}`}>
                                    {economicResults.metrics.irr.toFixed(1)}%
                                </p>
                            </div>
                            <div className="rounded-xl border-2 border-gray-300 bg-white p-4 shadow-sm">
                                <p className="text-sm text-gray-500">Payback Period</p>
                                <p className="text-2xl font-bold text-gray-800 font-mono">
                                    {economicResults.metrics.paybackPeriod < 100 ? economicResults.metrics.paybackPeriod.toFixed(1) : '> 10'} <span className="text-sm font-sans">Tahun</span>
                                </p>
                            </div>
                            <div className="rounded-xl border-2 border-gray-300 bg-white p-4 shadow-sm">
                                <p className="text-sm text-gray-500">Gross Profit / Tahun</p>
                                <p className={`text-2xl font-bold font-mono ${economicResults.grossProfit > 0 ? 'text-green-700' : 'text-red-600'}`}>
                                    {formatRp(economicResults.grossProfit)}
                                </p>
                            </div>
                        </div>

                        {/* CAPEX & Revenue Summary */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div className="rounded-xl border bg-white p-4 shadow-sm">
                                <p className="text-sm text-gray-500">CAPEX Total</p>
                                <p className="text-xl font-bold text-gray-800">{formatRp(economicResults.capexTotal)}</p>
                            </div>
                            <div className="rounded-xl border bg-white p-4 shadow-sm">
                                <p className="text-sm text-gray-500">Annual Revenue</p>
                                <p className="text-xl font-bold text-gray-800">{formatRp(economicResults.annualRevenue)}</p>
                            </div>
                            <div className="rounded-xl border bg-white p-4 shadow-sm">
                                <p className="text-sm text-gray-500">Annual OPEX</p>
                                <p className="text-xl font-bold text-gray-800">{formatRp(economicResults.annualOpex)}</p>
                            </div>
                        </div>

                        {/* Cost Info - UPDATED for HPAL */}
                        <div className="rounded-lg bg-gray-50 p-4 text-sm text-gray-700 border border-gray-200">
                            <p>
                                <strong>Catatan:</strong><br />
                                • <strong>CAPEX</strong>: Investasi mesin Industrial Paddle Mixer, Hydraulic Brick Press, Steam Curing Chamber, Silo & Belt Conveyor, dan <strong>Unit Netralisasi Asam</strong> + instalasi.<br />
                                • <strong>OPEX</strong>: Biaya semen Portland (binder), <strong>kapur Ca(OH)₂ (netralisasi H₂SO₄)</strong>, energi listrik, tenaga kerja, pemeliharaan, dan biaya pra-perlakuan tailing HPAL.<br />
                                • <strong>Revenue</strong>: Penjualan produk konstruksi SNI (batako/paving block) + Tipping Fee penerimaan tailing dari PT IMIP (Rp {(75_000).toLocaleString('id-ID')}/ton).
                            </p>
                        </div>

                        {/* Charts */}
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            {/* OPEX Breakdown */}
                            <div className="rounded-xl border bg-white p-6 shadow-sm">
                                <h3 className="mb-4 font-semibold text-gray-800">Komposisi OPEX (Miliar/Tahun)</h3>
                                <div className="h-[400px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={opexBreakdownData} margin={{ top: 30, right: 30, left: 20, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis label={{ value: 'Miliar IDR', angle: -90, position: 'insideLeft' }} />
                                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                            <Tooltip formatter={(_value: any, _name: any, props: any) => {
                                                const actual = props?.payload?.actualValue !== undefined ? props.payload.actualValue : _value;
                                                return [`Rp ${actual} M`, 'Biaya'];
                                            }} />
                                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                            <Bar dataKey="value" name="Biaya" radius={[8, 8, 0, 0]}
                                                label={(props: any) => {
                                                    const { x, y, width: barWidth, index } = props;
                                                    const actual = opexBreakdownData[index]?.actualValue !== undefined ? opexBreakdownData[index].actualValue : props.value;
                                                    return (
                                                        <text x={Number(x) + Number(barWidth) / 2} y={Number(y) - 8} fill="#374151" textAnchor="middle" fontSize={12} fontWeight="bold">
                                                            {actual}
                                                        </text>
                                                    );
                                                }}
                                            >
                                                {opexBreakdownData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Cumulative Cash Flow */}
                            <div className="rounded-xl border bg-white p-6 shadow-sm">
                                <div className="mb-4 flex flex-col justify-between sm:flex-row sm:items-center">
                                    <h3 className="font-semibold text-gray-800">Arus Kas Kumulatif (NPV)</h3>
                                    <span className="mt-1 inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 sm:mt-0">
                                        Payback Period: {economicResults.metrics.paybackPeriod < 999 ? `${economicResults.metrics.paybackPeriod.toFixed(1)} Tahun` : '> 10 Tahun'}
                                    </span>
                                </div>
                                <div className="h-[300px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart
                                            data={economicResults.metrics.cumulativeCashFlows.map((val, idx) => ({ year: idx, value: val / 1e9 }))}
                                            margin={{ top: 10, right: 30, left: 0, bottom: 25 }}
                                        >
                                            <defs>
                                                {(() => {
                                                    const cf = economicResults.metrics.cumulativeCashFlows;
                                                    const min = Math.min(...cf);
                                                    const max = Math.max(...cf);
                                                    const offset = max <= 0 ? 0 : min >= 0 ? 1 : max / (max - min);
                                                    return (
                                                        <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                                                            <stop offset={`${offset * 100}%`} stopColor="#10b981" stopOpacity={0.05} />
                                                            <stop offset={`${offset * 100}%`} stopColor="#ef4444" stopOpacity={0.05} />
                                                            <stop offset="100%" stopColor="#ef4444" stopOpacity={0.4} />
                                                        </linearGradient>
                                                    );
                                                })()}
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="year" label={{ value: 'Tahun', position: 'insideBottom', offset: -10 }} />
                                            <YAxis label={{ value: 'Miliar IDR', angle: -90, position: 'insideLeft' }} />
                                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                            <Tooltip formatter={(value: any) => `Rp ${Number(value).toFixed(1)} M`} />
                                            <ReferenceLine y={0} stroke="#64748b" strokeDasharray="3 3" strokeWidth={2} />
                                            <Area type="monotone" dataKey="value" stroke="#374151" strokeWidth={2} fill="url(#splitColor)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>

                        {/* Unit Economics */}
                        <div className="rounded-xl border bg-white p-6 shadow-sm">
                            <h3 className="mb-4 font-semibold text-gray-800">Unit Economics</h3>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                <div className="rounded-lg bg-gray-50 p-4 border border-gray-200">
                                    <p className="text-sm text-gray-500">Harga Jual Produk</p>
                                    <p className="text-xl font-bold text-gray-800 font-mono">{formatRp(economicResults.productPricePerTon)}<span className="text-sm font-sans">/ton</span></p>
                                </div>
                                <div className="rounded-lg bg-gray-50 p-4 border border-gray-200">
                                    <p className="text-sm text-gray-500">Biaya Produksi</p>
                                    <p className="text-xl font-bold text-gray-800 font-mono">{formatRp(Math.round(economicResults.costPerTonProduct))}<span className="text-sm font-sans">/ton</span></p>
                                </div>
                                <div className="rounded-lg bg-gray-50 p-4 border border-gray-200">
                                    <p className="text-sm text-gray-500">Margin per Ton</p>
                                    <p className={`text-xl font-bold font-mono ${(economicResults.productPricePerTon - economicResults.costPerTonProduct) > 0 ? 'text-green-700' : 'text-red-600'}`}>
                                        {formatRp(Math.round(economicResults.productPricePerTon - economicResults.costPerTonProduct))}<span className="text-sm font-sans">/ton</span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Karakteristik Fisikokimia & Produksi - UPDATED for HPAL */}
                        {(() => {
                            const tailing = DEFAULT_TAILING[tailingType];
                            const isHpalRaw = tailingType === TAILING_TYPES.HPAL_RAW;
                            return (
                                <div className={`rounded-xl border-2 p-6 shadow-sm ${isHpalRaw ? 'border-red-300 bg-red-50/30' : 'border-amber-300 bg-amber-50/30'}`}>
                                    <div className="mb-4 flex items-center gap-3">
                                        <span className={`text-lg ${isHpalRaw ? 'text-red-600' : 'text-amber-600'}`}>
                                            {isHpalRaw ? '⚠️' : '✅'}
                                        </span>
                                        <h3 className="font-semibold text-gray-800">Karakteristik Fisikokimia & Produksi</h3>
                                        <span className={`rounded-full px-3 py-0.5 text-xs font-semibold ${isHpalRaw ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                                            {isHpalRaw ? 'Asam Bebas Tinggi (±30 gpl H₂SO₄)' : 'Pra-Netralisasi (Aman)'}
                                        </span>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Profil Kimia Tailing HPAL</p>
                                            <p className="mt-1 text-sm text-gray-700">{tailing.chemicalProfile}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Dampak terhadap Produksi Material Konstruksi</p>
                                            <p className="mt-1 text-sm text-gray-700">{tailing.biogeopolymerProductionImpact}</p>
                                        </div>
                                        <div className="flex items-center gap-2 rounded-lg bg-white/80 p-3 border border-gray-200">
                                            <span className="text-xs font-semibold text-gray-500">Biaya Pra-Perlakuan:</span>
                                            <span className="font-mono font-bold text-gray-800">{formatRp(tailing.preTreatmentCostPerTon)}<span className="text-sm font-sans font-normal">/ton tailing</span></span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })()}
                    </div>
                )}

                {/* ====== 3D VISUALIZATION TAB ====== */}
                {activeTab === 'visual' && (
                    <div className="h-full w-full rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <ReactorScene />
                    </div>
                )}

                {/* ====== RESEARCH TAB ====== */}
                {activeTab === 'research' && (
                    <div className="w-full">
                        <ResearchTab />
                    </div>
                )}
            </div>
        </div>
    );
}
