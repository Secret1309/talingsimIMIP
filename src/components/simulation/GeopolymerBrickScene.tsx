"use client";

import React, { useRef, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html, Environment, PerspectiveCamera, ContactShadows, RoundedBox, Edges } from "@react-three/drei";
import * as THREE from "three";
import { useSimulationStore } from "@/lib/store";

// --- Helpers ---

/** Map compressive strength to a brick color gradient */
function getBrickColor(strength: number): string {
    if (strength >= 10) return "#6b5b4d";
    if (strength >= 7) return "#7d6e60";
    if (strength >= 4) return "#8f8073";
    return "#a09385";
}

// Colors representing the different substances mixed inside the brick
const SUBSTANCE_COLORS = [
    { color: "#8b7355", name: "Tailing HPAL" },       // brownish - tailing
    { color: "#a0a0a0", name: "Semen Portland" },      // grey - cement
    { color: "#c4b896", name: "Ca(OH)₂ Kapur" },      // yellowish - lime
    { color: "#6b8e6b", name: "Geopolimer Gel" },      // greenish - geopolymer
    { color: "#b0785a", name: "Agregat Halus" },       // reddish-brown - fine aggregate
    { color: "#7a9cbc", name: "Gipsum CaSO₄" },       // bluish - gypsum byproduct
];

// --- Sub-Components ---

/** Densely packed multi-colored spheres filling the brick shape */
function InteriorParticles() {
    const particles = useMemo(() => {
        const BRICK_W = 1.95;
        const BRICK_H = 0.95;
        const BRICK_D = 0.50;
        const result: { pos: [number, number, number]; size: number; colorIdx: number }[] = [];

        // Generate a dense grid-ish distribution within the brick bounds
        const count = 220;
        for (let i = 0; i < count; i++) {
            const x = (Math.random() - 0.5) * (BRICK_W - 0.08);
            const y = (Math.random() - 0.5) * (BRICK_H - 0.08);
            const z = (Math.random() - 0.5) * (BRICK_D - 0.08);
            const size = 0.025 + Math.random() * 0.04;
            const colorIdx = Math.floor(Math.random() * SUBSTANCE_COLORS.length);
            result.push({ pos: [x, y, z], size, colorIdx });
        }
        return result;
    }, []);

    return (
        <group>
            {particles.map((p, i) => (
                <mesh key={i} position={p.pos}>
                    <sphereGeometry args={[p.size, 8, 8]} />
                    <meshStandardMaterial
                        color={SUBSTANCE_COLORS[p.colorIdx].color}
                        roughness={0.8}
                        metalness={0.1}
                    />
                </mesh>
            ))}
        </group>
    );
}

/** The geopolymer brick — always rendered, visibility toggled cleanly */
function GeopolymerBrick({
    showCrossSection,
    showLabels,
}: {
    showCrossSection: boolean;
    showLabels: boolean;
}) {
    const groupRef = useRef<THREE.Group>(null);
    const { massBalanceResult } = useSimulationStore();

    const strength = massBalanceResult?.compressiveStrength ?? 0;
    const brickColor = getBrickColor(strength);

    // Brick dimensions (scaled from 390x190x100mm)
    const BRICK_W = 1.95;
    const BRICK_H = 0.95;
    const BRICK_D = 0.50;

    return (
        <group ref={groupRef}>
            {/* === SOLID BRICK — shown when cross-section is OFF === */}
            <group visible={!showCrossSection}>
                <RoundedBox
                    args={[BRICK_W, BRICK_H, BRICK_D]}
                    radius={0.02}
                    smoothness={4}
                    castShadow
                    receiveShadow
                >
                    <meshPhysicalMaterial
                        color={brickColor}
                        roughness={0.85}
                        metalness={0.05}
                        clearcoat={0.1}
                        clearcoatRoughness={0.8}
                    />
                </RoundedBox>
            </group>

            {/* === CROSS-SECTION VIEW — shown when cross-section is ON === */}
            <group visible={showCrossSection}>
                {/* Wireframe outline — dotted edge lines showing brick shape */}
                <mesh>
                    <boxGeometry args={[BRICK_W, BRICK_H, BRICK_D]} />
                    <meshBasicMaterial visible={false} />
                    <Edges
                        threshold={15}
                        color="#6b7280"
                        lineWidth={1}
                    />
                </mesh>

                {/* Semi-transparent shell so you can still see the brick outline */}
                <mesh>
                    <boxGeometry args={[BRICK_W, BRICK_H, BRICK_D]} />
                    <meshPhysicalMaterial
                        color={brickColor}
                        transparent
                        opacity={0.12}
                        roughness={0.9}
                        metalness={0.0}
                        side={THREE.DoubleSide}
                        depthWrite={false}
                    />
                </mesh>

                {/* Densely packed multi-colored spheres filling the brick volume */}
                <InteriorParticles />


            </group>

            {/* === DIMENSION LINES — shown only on solid view === */}
            {showLabels && !showCrossSection && (
                <>
                    <Html position={[0, -BRICK_H / 2 - 0.2, 0]} center distanceFactor={5} zIndexRange={[100, 0]}>
                        <div className="pointer-events-none select-none text-[8px] font-mono font-bold text-gray-500 whitespace-nowrap">
                            ← 390 mm →
                        </div>
                    </Html>
                    <Html position={[BRICK_W / 2 + 0.25, 0, 0]} center distanceFactor={5} zIndexRange={[100, 0]}>
                        <div className="pointer-events-none select-none text-[8px] font-mono font-bold text-gray-500 whitespace-nowrap" style={{ writingMode: 'vertical-rl' }}>
                            190 mm
                        </div>
                    </Html>
                    <Html position={[0, BRICK_H / 2 + 0.15, BRICK_D / 2 + 0.15]} center distanceFactor={5} zIndexRange={[100, 0]}>
                        <div className="pointer-events-none select-none text-[8px] font-mono font-bold text-gray-500 whitespace-nowrap">
                            100 mm
                        </div>
                    </Html>
                </>
            )}


        </group>
    );
}

/** Auto-rotating wrapper for the brick */
function BrickRotator({
    autoRotate,
    showCrossSection,
    showLabels,
}: {
    autoRotate: boolean;
    showCrossSection: boolean;
    showLabels: boolean;
}) {
    const groupRef = useRef<THREE.Group>(null);

    useFrame((_, delta) => {
        if (!groupRef.current || !autoRotate) return;
        groupRef.current.rotation.y += delta * 0.3;
    });

    return (
        <group ref={groupRef}>
            <GeopolymerBrick showCrossSection={showCrossSection} showLabels={showLabels} />
        </group>
    );
}

/** Reflective ground plane */
function GroundPlane() {
    return (
        <>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.8, 0]} receiveShadow>
                <planeGeometry args={[20, 20]} />
                <meshStandardMaterial
                    color="#f8f8f8"
                    roughness={0.5}
                    metalness={0.1}
                />
            </mesh>
            <ContactShadows
                position={[0, -0.79, 0]}
                opacity={0.4}
                scale={10}
                blur={2.5}
                far={4}
            />
        </>
    );
}

// --- Main Exported Component ---

export function GeopolymerBrickScene() {
    const [autoRotate, setAutoRotate] = useState(true);
    const [showCrossSection, setShowCrossSection] = useState(false);
    const [showLabels, setShowLabels] = useState(true);
    const { massBalanceResult, binderRatio } = useSimulationStore();
    const strength = massBalanceResult?.compressiveStrength ?? 0;
    const qualityGrade = massBalanceResult?.qualityGrade ?? "standar";

    return (
        <div className="relative h-full w-full overflow-hidden rounded-xl bg-gradient-to-br from-stone-100 via-gray-50 to-stone-200">
            {/* Toggle Controls */}
            <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                <button
                    onClick={() => setAutoRotate(v => !v)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold shadow-sm backdrop-blur-sm transition-all border ${
                        autoRotate
                            ? 'bg-gray-800/90 text-white border-gray-600'
                            : 'bg-white/90 text-gray-700 border-gray-300'
                    }`}
                >
                    {autoRotate ? '🔄 Auto-Rotate: ON' : '🔄 Auto-Rotate: OFF'}
                </button>
                <button
                    onClick={() => setShowCrossSection(v => !v)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold shadow-sm backdrop-blur-sm transition-all border ${
                        showCrossSection
                            ? 'bg-amber-700/90 text-white border-amber-500'
                            : 'bg-white/90 text-gray-700 border-gray-300'
                    }`}
                >
                    {showCrossSection ? '🔍 Cross-Section: ON' : '🔍 Cross-Section: OFF'}
                </button>
                <button
                    onClick={() => setShowLabels(v => !v)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold shadow-sm backdrop-blur-sm transition-all border ${
                        showLabels
                            ? 'bg-gray-800/90 text-white border-gray-600'
                            : 'bg-white/90 text-gray-700 border-gray-300'
                    }`}
                >
                    {showLabels ? '🏷️ Label: ON' : '🏷️ Label: OFF'}
                </button>
            </div>

            {/* Static Info Card — fixed on the left below toggles */}
            <div className="absolute top-40 left-4 z-10 pointer-events-none">
                <div className="min-w-[190px] rounded-xl border border-gray-300/50 bg-white/90 p-3 shadow-xl backdrop-blur-md pointer-events-auto">
                    <div className="flex items-center justify-between mb-2">
                        <div className="text-[11px] font-bold text-gray-800">
                            🧱 Batako Geopolimer
                        </div>
                        <span className={`rounded-full px-2 py-0.5 text-[8px] font-bold ${
                            qualityGrade === 'premium'
                                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                : 'bg-gray-100 text-gray-600 border border-gray-300'
                        }`}>
                            {qualityGrade === 'premium' ? '⭐ Premium' : 'Standar'}
                        </span>
                    </div>
                    <div className="space-y-1">
                        <div className="flex justify-between text-[9px]">
                            <span className="text-gray-500">Kuat Tekan</span>
                            <span className="font-mono font-bold text-gray-800">
                                {strength > 0 ? `${strength.toFixed(1)} MPa` : '— MPa'}
                            </span>
                        </div>
                        <div className="flex justify-between text-[9px]">
                            <span className="text-gray-500">Rasio Semen</span>
                            <span className="font-mono font-bold text-gray-800">{binderRatio}%</span>
                        </div>
                        <div className="flex justify-between text-[9px]">
                            <span className="text-gray-500">Dimensi SNI</span>
                            <span className="font-mono font-bold text-gray-800">390×190×100 mm</span>
                        </div>
                        <div className="flex justify-between text-[9px]">
                            <span className="text-gray-500">Output Harian</span>
                            <span className="font-mono font-bold text-gray-800">
                                {massBalanceResult
                                    ? `${massBalanceResult.dailyProductOutput.toFixed(1)} ton`
                                    : '— ton'}
                            </span>
                        </div>
                    </div>
                    {!massBalanceResult && (
                        <div className="mt-2 rounded-md bg-amber-50 border border-amber-200 px-2 py-1 text-[8px] text-amber-700 text-center">
                            Jalankan simulasi untuk data lengkap
                        </div>
                    )}
                </div>
            </div>

            {/* Static Cross-Section label — top center */}
            {showCrossSection && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
                    <div className="rounded-lg bg-gray-900/80 px-4 py-1.5 text-xs font-bold text-white border border-gray-500/40 backdrop-blur-sm whitespace-nowrap shadow-lg">
                        🔬 Komposisi Internal Batako
                    </div>
                </div>
            )}

            {/* 3D Canvas */}
            <Canvas
                shadows
                dpr={[1, 2]}
                gl={{ localClippingEnabled: true }}
            >
                <PerspectiveCamera makeDefault position={[2.5, 1.5, 3]} fov={35} />

                {/* Lighting */}
                <ambientLight intensity={0.6} />
                <directionalLight
                    position={[5, 8, 5]}
                    intensity={1.4}
                    castShadow
                    shadow-mapSize={[1024, 1024]}
                />
                <pointLight position={[-3, 3, 2]} intensity={0.4} color="#fef3c7" />
                <pointLight position={[3, 2, -2]} intensity={0.3} color="#e0f2fe" />

                {/* Environment */}
                <Environment preset="studio" />

                <React.Suspense fallback={null}>
                    <BrickRotator
                        autoRotate={autoRotate}
                        showCrossSection={showCrossSection}
                        showLabels={showLabels}
                    />
                    <GroundPlane />
                </React.Suspense>

                <OrbitControls
                    enablePan={true}
                    enableZoom={true}
                    enableRotate={true}
                    minPolarAngle={Math.PI / 6}
                    maxPolarAngle={Math.PI / 2.1}
                    maxDistance={12}
                    minDistance={2}
                />
            </Canvas>

            {/* Static Kuat Tekan label + Legend (bottom-right, stacked) */}
            <div className="absolute bottom-4 right-4 flex flex-col items-end gap-2 pointer-events-none">
                {/* Kuat Tekan — static label above the legend */}
                <div className="rounded-lg bg-white/90 p-3 text-xs shadow-sm backdrop-blur-sm border border-gray-300 pointer-events-auto text-center">
                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Kuat Tekan</div>
                    <div className="text-xl font-mono font-black text-gray-800">
                        {strength > 0 ? strength.toFixed(1) : '—'}
                    </div>
                    <div className="text-[10px] text-gray-500">MPa</div>
                    {strength > 0 && (
                        <div className={`mt-1 rounded-full px-2 py-0.5 text-[9px] font-bold ${
                            strength >= 10
                                ? 'bg-green-100 text-green-700'
                                : strength >= 2.5
                                    ? 'bg-amber-100 text-amber-700'
                                    : 'bg-red-100 text-red-700'
                        }`}>
                            {strength >= 10 ? '✓ Sangat Baik' : strength >= 2.5 ? '✓ Memenuhi SNI' : '✗ Bawah SNI'}
                        </div>
                    )}
                </div>

                {/* Kekuatan Brick Legend */}
                <div className="rounded-lg bg-white/90 p-3 text-xs shadow-sm backdrop-blur-sm pointer-events-auto border border-gray-300">
                    <div className="mb-2 font-bold text-gray-700">Kekuatan Brick</div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="block h-2 w-2 rounded-full" style={{ backgroundColor: '#6b5b4d' }}></span>
                        <span>Tinggi (≥10 MPa)</span>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="block h-2 w-2 rounded-full" style={{ backgroundColor: '#7d6e60' }}></span>
                        <span>Sedang (7-10 MPa)</span>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="block h-2 w-2 rounded-full" style={{ backgroundColor: '#8f8073' }}></span>
                        <span>Cukup (4-7 MPa)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="block h-2 w-2 rounded-full" style={{ backgroundColor: '#a09385' }}></span>
                        <span>Rendah (&lt;4 MPa)</span>
                    </div>
                    <div className="mt-2 pt-2 border-t border-gray-200 text-[10px] text-gray-500">
                        SNI Minimum: 2.5 MPa
                    </div>
                </div>

                {/* Substance color legend — visible when cross-section is on */}
                {showCrossSection && (
                    <div className="rounded-lg bg-white/90 p-3 text-xs shadow-sm backdrop-blur-sm pointer-events-auto border border-gray-300">
                        <div className="mb-2 font-bold text-gray-700">Komposisi Zat</div>
                        {SUBSTANCE_COLORS.map((s, i) => (
                            <div key={i} className="flex items-center gap-2 mb-1 last:mb-0">
                                <span className="block h-2 w-2 rounded-full" style={{ backgroundColor: s.color }}></span>
                                <span>{s.name}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="absolute bottom-4 left-4 rounded-lg bg-white/80 p-2 text-[10px] text-gray-500 backdrop-blur-sm pointer-events-none">
                Left Click: Rotate • Right Click: Pan • Scroll: Zoom
            </div>

            {/* Title badge */}
            <div className="absolute top-4 right-4 z-10 rounded-xl bg-white/90 border border-gray-200 px-4 py-2 shadow-sm backdrop-blur-sm">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">3D Preview</div>
                <div className="text-sm font-bold text-gray-800">Batako Geopolimer</div>
                <div className="text-[10px] text-gray-500">Berbasis Tailing HPAL Nikel</div>
            </div>
        </div>
    );
}
