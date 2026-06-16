"use client";

import React, { useRef, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html, Environment, PerspectiveCamera, ContactShadows, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { useSimulationStore } from "@/lib/store";

// --- Helpers ---

/** Map compressive strength to a brick color gradient */
function getBrickColor(strength: number): string {
    if (strength >= 10) return "#6b5b4d"; // Dark brownish-grey (strong)
    if (strength >= 7) return "#7d6e60";  // Medium
    if (strength >= 4) return "#8f8073";  // Lighter
    return "#a09385";                     // Light (weak)
}

function getAggregateColor(strength: number): string {
    if (strength >= 10) return "#4a3f35";
    if (strength >= 7) return "#5c5046";
    return "#6e6257";
}

// --- Sub-Components ---

/** Floating particle specs inside the brick cross-section to show tailing aggregate */
function TailingParticles({ visible }: { visible: boolean }) {
    const groupRef = useRef<THREE.Group>(null);

    const particles = useMemo(() =>
        Array.from({ length: 40 }, (_, i) => ({
            pos: [
                (Math.random() - 0.5) * 1.6,
                (Math.random() - 0.5) * 0.7,
                (Math.random() - 0.5) * 0.35,
            ] as [number, number, number],
            size: 0.02 + Math.random() * 0.04,
            phase: i * 0.3,
        })),
        []
    );

    useFrame(({ clock }) => {
        if (!groupRef.current || !visible) return;
        const t = clock.getElapsedTime();
        groupRef.current.children.forEach((child, i) => {
            const p = particles[i];
            if (!p) return;
            const mat = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
            if (mat) {
                mat.emissiveIntensity = 0.3 + 0.3 * Math.sin(t * 2 + p.phase);
            }
        });
    });

    if (!visible) return null;

    return (
        <group ref={groupRef}>
            {particles.map((p, i) => (
                <mesh key={i} position={p.pos}>
                    <sphereGeometry args={[p.size, 8, 8]} />
                    <meshStandardMaterial
                        color="#8b7355"
                        emissive="#d4a574"
                        emissiveIntensity={0.4}
                        roughness={0.9}
                        metalness={0.1}
                    />
                </mesh>
            ))}
        </group>
    );
}

/** The geopolymer brick with optional cross-section */
function GeopolymerBrick({
    showCrossSection,
    showLabels,
}: {
    showCrossSection: boolean;
    showLabels: boolean;
}) {
    const groupRef = useRef<THREE.Group>(null);
    const { massBalanceResult, binderRatio } = useSimulationStore();

    const strength = massBalanceResult?.compressiveStrength ?? 0;
    const brickColor = getBrickColor(strength);
    const aggregateColor = getAggregateColor(strength);
    const qualityGrade = massBalanceResult?.qualityGrade ?? "standar";

    // Brick dimensions (scaled from 390x190x100mm)
    const BRICK_W = 1.95; // width (390/200)
    const BRICK_H = 0.95; // height (190/200)
    const BRICK_D = 0.50; // depth (100/200)

    // Cross-section clipping
    const clippingPlane = useMemo(
        () => new THREE.Plane(new THREE.Vector3(-1, 0, 0), 0),
        []
    );

    return (
        <group ref={groupRef}>
            {/* === FULL BRICK (outer shell) === */}
            {!showCrossSection && (
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
            )}

            {/* === CROSS-SECTION VIEW === */}
            {showCrossSection && (
                <group>
                    {/* Outer shell — clipped to show interior */}
                    <mesh castShadow receiveShadow>
                        <boxGeometry args={[BRICK_W, BRICK_H, BRICK_D]} />
                        <meshPhysicalMaterial
                            color={brickColor}
                            roughness={0.85}
                            metalness={0.05}
                            side={THREE.DoubleSide}
                            clippingPlanes={[clippingPlane]}
                            clipShadows
                        />
                    </mesh>

                    {/* Inner cross-section face */}
                    <mesh position={[0, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
                        <planeGeometry args={[BRICK_D, BRICK_H]} />
                        <meshStandardMaterial
                            color={aggregateColor}
                            roughness={0.95}
                            metalness={0.0}
                            side={THREE.DoubleSide}
                        />
                    </mesh>

                    {/* Tailing aggregate particles visible in cross-section */}
                    <TailingParticles visible={showCrossSection} />

                    {/* Inner layer indicator — slightly darker ring */}
                    <mesh position={[0.3, 0, 0]}>
                        <boxGeometry args={[BRICK_W * 0.45, BRICK_H * 0.75, BRICK_D * 0.7]} />
                        <meshStandardMaterial
                            color={aggregateColor}
                            roughness={0.95}
                            transparent
                            opacity={0.6}
                            clippingPlanes={[clippingPlane]}
                            clipShadows
                        />
                    </mesh>

                    {/* Cross-section labels */}
                    {showLabels && (
                        <>
                            <Html position={[0.5, 0.25, 0.35]} center distanceFactor={5} zIndexRange={[100, 0]}>
                                <div className="pointer-events-none select-none rounded-md bg-amber-900/80 px-2 py-1 text-[9px] font-bold text-amber-100 border border-amber-600/40 backdrop-blur-sm whitespace-nowrap">
                                    Geopolimer Matrix
                                </div>
                            </Html>
                            <Html position={[0.3, -0.2, 0.35]} center distanceFactor={5} zIndexRange={[100, 0]}>
                                <div className="pointer-events-none select-none rounded-md bg-stone-800/80 px-2 py-1 text-[9px] font-bold text-stone-200 border border-stone-500/40 backdrop-blur-sm whitespace-nowrap">
                                    Tailing HPAL Aggregate
                                </div>
                            </Html>
                        </>
                    )}
                </group>
            )}

            {/* === DIMENSION LINES === */}
            {showLabels && !showCrossSection && (
                <>
                    {/* Width label */}
                    <Html position={[0, -BRICK_H / 2 - 0.2, 0]} center distanceFactor={5} zIndexRange={[100, 0]}>
                        <div className="pointer-events-none select-none text-[8px] font-mono font-bold text-gray-500 whitespace-nowrap">
                            ← 390 mm →
                        </div>
                    </Html>
                    {/* Height label */}
                    <Html position={[BRICK_W / 2 + 0.25, 0, 0]} center distanceFactor={5} zIndexRange={[100, 0]}>
                        <div className="pointer-events-none select-none text-[8px] font-mono font-bold text-gray-500 whitespace-nowrap" style={{ writingMode: 'vertical-rl' }}>
                            190 mm
                        </div>
                    </Html>
                    {/* Depth label */}
                    <Html position={[0, BRICK_H / 2 + 0.15, BRICK_D / 2 + 0.15]} center distanceFactor={5} zIndexRange={[100, 0]}>
                        <div className="pointer-events-none select-none text-[8px] font-mono font-bold text-gray-500 whitespace-nowrap">
                            100 mm
                        </div>
                    </Html>
                </>
            )}

            {/* === MAIN INFO CARD === */}
            {showLabels && (
                <Html position={[0, BRICK_H / 2 + 0.65, 0]} center distanceFactor={5} zIndexRange={[100, 0]}>
                    <div className="pointer-events-none select-none min-w-[180px] rounded-xl border border-gray-300/50 bg-white/90 p-3 shadow-xl backdrop-blur-md">
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
                </Html>
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

/** Strength meter visualization next to the brick */
function StrengthMeter() {
    const { massBalanceResult } = useSimulationStore();
    const strength = massBalanceResult?.compressiveStrength ?? 0;

    // SNI thresholds
    const sniMin = 2.5; // SNI minimum for batako
    const maxDisplay = 15;
    const fillRatio = Math.min(strength / maxDisplay, 1);

    const barRef = useRef<THREE.Mesh>(null);

    useFrame(() => {
        if (!barRef.current) return;
        const targetScale = fillRatio > 0 ? fillRatio : 0.01;
        barRef.current.scale.y += (targetScale - barRef.current.scale.y) * 0.05;
        barRef.current.position.y = -0.6 + (targetScale * 1.2) / 2;
    });

    const barColor = strength >= 10 ? "#16a34a" : strength >= sniMin ? "#d97706" : "#dc2626";

    return (
        <group position={[1.8, 0, 0]}>
            {/* Background bar */}
            <mesh position={[0, 0, 0]}>
                <boxGeometry args={[0.12, 1.2, 0.12]} />
                <meshStandardMaterial color="#e5e7eb" roughness={0.9} />
            </mesh>

            {/* Filled bar */}
            <mesh ref={barRef} position={[0, -0.6, 0.01]}>
                <boxGeometry args={[0.12, 1.2, 0.12]} />
                <meshStandardMaterial
                    color={barColor}
                    emissive={barColor}
                    emissiveIntensity={0.3}
                    roughness={0.7}
                />
            </mesh>

            {/* SNI threshold line */}
            <mesh position={[0, -0.6 + (sniMin / maxDisplay) * 1.2, 0.08]}>
                <boxGeometry args={[0.2, 0.008, 0.01]} />
                <meshStandardMaterial color="#dc2626" />
            </mesh>

            {/* Labels */}
            <Html position={[0, 0.85, 0]} center distanceFactor={5} zIndexRange={[100, 0]}>
                <div className="pointer-events-none select-none text-center">
                    <div className="text-[8px] font-bold text-gray-500 uppercase tracking-wider">Kuat Tekan</div>
                    <div className="text-[12px] font-mono font-black text-gray-800">
                        {strength > 0 ? `${strength.toFixed(1)}` : '—'}
                    </div>
                    <div className="text-[8px] text-gray-500">MPa</div>
                </div>
            </Html>

            <Html position={[0.25, -0.6 + (sniMin / maxDisplay) * 1.2, 0]} center distanceFactor={5} zIndexRange={[100, 0]}>
                <div className="pointer-events-none select-none text-[7px] font-bold text-red-600 whitespace-nowrap">
                    SNI Min
                </div>
            </Html>
        </group>
    );
}

// --- Main Exported Component ---

export function GeopolymerBrickScene() {
    const [autoRotate, setAutoRotate] = useState(true);
    const [showCrossSection, setShowCrossSection] = useState(false);
    const [showLabels, setShowLabels] = useState(true);

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
                    <StrengthMeter />
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

            {/* Legend */}
            <div className="absolute bottom-4 right-4 flex flex-col items-end gap-2 pointer-events-none">
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
