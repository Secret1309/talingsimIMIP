"use client";

import React, { useRef, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html, useProgress, PerspectiveCamera, Environment, Sky } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";
import { useSimulationStore } from "@/lib/store";
import { TAILING_TYPES } from "@/lib/simulation/constants";

// --- Helpers ---

const getTempColor = (t: number) => {
    if (t <= 25) return "#9ca3af"; // Ambient (Grey)
    if (t <= 50) return "#d97706"; // Moderate (Amber)
    return "#dc2626"; // High (Red)
};

// --- Shared context for labels toggle ---
const LabelContext = React.createContext(true);

// --- Components ---

function Loader() {
    const { progress } = useProgress();
    return (
        <Html center zIndexRange={[100, 0]}>
            <div className="flex w-64 flex-col items-center justify-center rounded-xl border border-white/20 bg-white/10 p-6 shadow-xl backdrop-blur-md">
                <div className="mb-2 text-sm font-bold text-white">Loading TAILINGSIM 3D...</div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-700">
                    <motion.div
                        className="h-full bg-gray-400"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ type: "spring", stiffness: 50 }}
                    />
                </div>
                <div className="mt-1 text-xs text-gray-300">{progress.toFixed(0)}%</div>
            </div>
        </Html>
    );
}

// StraightPipe
function StraightPipe({ from, to, radius = 0.08, color = "#6b7280" }: {
    from: [number, number, number],
    to: [number, number, number],
    radius?: number,
    color?: string
}) {
    const dx = to[0] - from[0];
    const dy = to[1] - from[1];
    const dz = to[2] - from[2];
    const length = Math.sqrt(dx * dx + dy * dy + dz * dz);
    const midX = (from[0] + to[0]) / 2;
    const midY = (from[1] + to[1]) / 2;
    const midZ = (from[2] + to[2]) / 2;
    const dir = new THREE.Vector3(dx, dy, dz).normalize();
    const up = new THREE.Vector3(0, 1, 0);
    const quat = new THREE.Quaternion().setFromUnitVectors(up, dir);

    return (
        <mesh position={[midX, midY, midZ]} quaternion={quat}>
            <cylinderGeometry args={[radius, radius, length, 12]} />
            <meshStandardMaterial color={color} metalness={0.7} roughness={0.3} />
        </mesh>
    );
}

// Animated flow dots along a pipe
function FlowIndicator({ from, to, count = 5, speed = 0.4 }: {
    from: [number, number, number],
    to: [number, number, number],
    count?: number,
    speed?: number,
}) {
    const dotsRef = useRef<THREE.Group>(null);
    const tailingType = useSimulationStore(state => state.tailingType);

    // HPAL colors
    const isRaw = tailingType === TAILING_TYPES.HPAL_RAW;
    // HPAL Raw: Reddish (high acid) -> HPAL Neutralized: Greenish (safe)
    const dotColor = isRaw ? "#ef4444" : "#10b981";
    const emissiveColor = isRaw ? "#dc2626" : "#059669";

    useFrame(({ clock }) => {
        if (!dotsRef.current) return;
        const t = clock.getElapsedTime();
        dotsRef.current.children.forEach((dot, i) => {
            const phase = (t * speed + i / count) % 1;
            dot.position.set(
                from[0] + (to[0] - from[0]) * phase,
                from[1] + (to[1] - from[1]) * phase + 0.15,
                from[2] + (to[2] - from[2]) * phase,
            );
            const mat = (dot as THREE.Mesh).material as THREE.MeshStandardMaterial;
            if (mat) {
                mat.emissiveIntensity = 1.0 + 0.8 * Math.sin(t * 8 + i * 2.5);
            }
        });
    });

    const dots = useMemo(() => Array.from({ length: count }), [count]);

    return (
        <group ref={dotsRef}>
            {dots.map((_, i) => (
                <mesh key={i}>
                    <sphereGeometry args={[0.1, 12, 12]} />
                    <meshStandardMaterial
                        color={dotColor}
                        emissive={emissiveColor}
                        emissiveIntensity={1.5}
                        toneMapped={false}
                    />
                </mesh>
            ))}
        </group>
    );
}

// Smoke particles from chimney - dynamic count based on temp
function SmokeParticles({ position }: { position: [number, number, number] }) {
    const curingTemp = useSimulationStore(state => state.curingTemp);
    const particlesRef = useRef<THREE.Group>(null);
    
    // Smoke only active if temp > 25. More smoke if temp > 50.
    const isActive = curingTemp > 25;
    const count = curingTemp > 50 ? 24 : (curingTemp > 25 ? 14 : 0);

    // Initialise random offsets (max possible length to avoid hook issues)
    const MAX_PARTICLES = 24;
    const offsets = useMemo(() =>
        Array.from({ length: MAX_PARTICLES }, (_, i) => ({
            phase: i / MAX_PARTICLES,
            driftX: (Math.random() - 0.5) * 2,
            driftZ: (Math.random() - 0.5) * 2,
        })),
        []
    );

    // Wider spread for high temps
    const spreadFactor = curingTemp > 50 ? 2.5 : 1.0;

    useFrame(({ clock }) => {
        if (!particlesRef.current || !isActive) return;
        const t = clock.getElapsedTime();
        particlesRef.current.children.forEach((p, i) => {
            const o = offsets[i];
            const phase = (t * 0.25 + o.phase) % 1;
            const rise = phase * 3.0; // High rise
            
            // Multiply drift by spreadFactor
            const drift = Math.sin(t * 0.6 + o.driftX * 3) * (0.4 * spreadFactor) * phase;
            const driftZ = Math.cos(t * 0.5 + o.driftZ * 3) * (0.25 * spreadFactor) * phase;

            p.position.set(
                position[0] + drift,
                position[1] + rise,
                position[2] + driftZ,
            );

            const scale = 0.15 + phase * 0.45;
            p.scale.set(scale, scale, scale);

            const mat = (p as THREE.Mesh).material as THREE.MeshStandardMaterial;
            if (mat) {
                // Hide particles beyond the current count to allow dynamic adjustments
                mat.opacity = i < count ? Math.max(0, (1 - phase) * 0.55) : 0;
            }
        });
    });

    if (!isActive) return null;

    return (
        <group ref={particlesRef}>
            {offsets.map((_, i) => (
                <mesh key={i} position={[position[0], position[1], position[2]]}>
                    <sphereGeometry args={[1, 8, 8]} />
                    <meshStandardMaterial
                        color="#e5e7eb"
                        transparent
                        opacity={0.4}
                        depthWrite={false}
                    />
                </mesh>
            ))}
        </group>
    );
}

// Spinning motor with dark stripe to show rotation
function SpinningMotor({ position, speed = 2.0 }: { position: [number, number, number]; speed?: number }) {
    const motorRef = useRef<THREE.Group>(null);

    useFrame(({ clock }) => {
        if (!motorRef.current) return;
        // rotate around the cylinder's length axis (X because it's oriented with rotation Z=PI/2)
        motorRef.current.rotation.x = clock.getElapsedTime() * speed;
    });

    return (
        <group position={position} rotation={[0, 0, Math.PI / 2]}>
            <group ref={motorRef}>
                {/* Main motor cylinder */}
                <mesh>
                    <cylinderGeometry args={[0.4, 0.4, 1.2, 32]} />
                    <meshStandardMaterial color="#1f2937" metalness={0.8} />
                </mesh>
                {/* Dark stripe 1 - to show rotation */}
                <mesh rotation={[0, 0, 0]}>
                    <cylinderGeometry args={[0.42, 0.42, 0.08, 32]} />
                    <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.1} />
                </mesh>
                {/* Dark stripe 2 - offset to show rotation */}
                <mesh position={[0, 0.35, 0]}>
                    <cylinderGeometry args={[0.42, 0.42, 0.06, 32]} />
                    <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.1} />
                </mesh>
                {/* Dark stripe 3 */}
                <mesh position={[0, -0.35, 0]}>
                    <cylinderGeometry args={[0.42, 0.42, 0.06, 32]} />
                    <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.1} />
                </mesh>
            </group>
        </group>
    );
}

function DataLabel({ position, title, data }: { position: [number, number, number], title: string, data?: string[] }) {
    const showLabels = React.useContext(LabelContext);
    if (!showLabels) return null;
    return (
        <Html position={position} center distanceFactor={15} zIndexRange={[100, 0]}>
            <div className="pointer-events-none select-none flex flex-col items-start rounded-lg border border-gray-500/30 bg-gray-900/70 p-2 shadow-lg backdrop-blur-sm min-w-[120px]">
                <div className="mb-1 text-[10px] font-bold text-white/90 uppercase tracking-wider border-b border-gray-500/30 w-full pb-1">{title}</div>
                {data && data.map((line, idx) => (
                    <div key={idx} className="font-mono text-[9px] text-gray-300 whitespace-nowrap mt-0.5">
                        {line}
                    </div>
                ))}
            </div>
        </Html>
    );
}

function SmallLabel({ position, text }: { position: [number, number, number]; text: string }) {
    const showLabels = React.useContext(LabelContext);
    if (!showLabels) return null;
    return (
        <Html position={position} distanceFactor={10} center>
            <div className="rounded bg-gray-600/80 px-1.5 py-0.5 text-[8px] font-bold text-white border border-gray-400/30 whitespace-nowrap pointer-events-none">{text}</div>
        </Html>
    );
}

// 1. Tailing Silo
function TailingSilo() {
    const mass = useSimulationStore(state => state.inputMass);
    return (
        <group>
            <mesh position={[-6.5, 2.0, 0]}>
                <cylinderGeometry args={[1.0, 1.0, 4.0, 32]} />
                <meshStandardMaterial color="#94a3b8" metalness={0.6} roughness={0.25} />
            </mesh>
            <mesh position={[-6.5, 4.4, 0]}>
                <coneGeometry args={[1.0, 0.8, 32]} />
                <meshStandardMaterial color="#64748b" metalness={0.6} />
            </mesh>
            <mesh position={[-6.5, -0.4, 0]} rotation={[Math.PI, 0, 0]}>
                <coneGeometry args={[1.0, 0.8, 32]} />
                <meshStandardMaterial color="#64748b" metalness={0.6} />
            </mesh>
            <DataLabel position={[-6.5, 6.5, 0]} title="TAILING SILO" data={[`Kapasitas: ${mass} ton/hari`, "Tailing HPAL Nikel"]} />
        </group>
    );
}

// 2. NEW: Neutralization Tank
function NeutralizationTank() {
    const tailingType = useSimulationStore(state => state.tailingType);
    const isRaw = tailingType === TAILING_TYPES.HPAL_RAW;
    
    // Tank logic: if raw, it's very active (adding lime). If neutralized, it's passive buffer.
    const agitatorRef = useRef<THREE.Group>(null);
    useFrame(({ clock }) => {
        if (!agitatorRef.current) return;
        agitatorRef.current.rotation.y = clock.getElapsedTime() * (isRaw ? 4.0 : 1.0);
    });

    return (
        <group>
            <mesh position={[-2.5, 1.5, 0]}>
                <cylinderGeometry args={[1.2, 1.2, 3.0, 32]} />
                <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.3} />
            </mesh>
            <mesh position={[-2.5, 3.2, 0]}>
                <cylinderGeometry args={[1.2, 1.2, 0.4, 32]} />
                <meshStandardMaterial color="#334155" metalness={0.8} />
            </mesh>
            
            {/* Lime Hopper (Ca(OH)2) */}
            <mesh position={[-2.5, 4.0, 0.8]} rotation={[Math.PI, 0, 0]}>
                <coneGeometry args={[0.5, 1.0, 16]} />
                <meshStandardMaterial color="#cbd5e1" metalness={0.2} roughness={0.8} />
            </mesh>
            <SmallLabel position={[-2.5, 4.8, 0.8]} text="KAPUR IN" />

            {/* Agitator Motor on top */}
            <group position={[-2.5, 3.6, 0]}>
                <mesh>
                    <cylinderGeometry args={[0.3, 0.3, 0.6, 16]} />
                    <meshStandardMaterial color="#1e293b" metalness={0.9} />
                </mesh>
                {/* Rotating Shaft indicator */}
                <group ref={agitatorRef}>
                    <mesh position={[0, 0.4, 0]}>
                        <boxGeometry args={[0.8, 0.1, 0.1]} />
                        <meshStandardMaterial color="#0f172a" />
                    </mesh>
                </group>
            </group>

            <DataLabel
                position={[-2.5, 5.5, 0]}
                title="TANGKI NETRALISASI"
                data={[
                    "H₂SO₄ + Ca(OH)₂",
                    "pH Stabilisasi",
                    isRaw ? "Status: AKTIF" : "Status: BUFFER (Ternetralisasi)"
                ]}
            />
        </group>
    );
}

// 3. Mixer & Molder - with spinning motor
function MixerMolder() {
    const binderRatio = useSimulationStore(state => state.binderRatio);
    return (
        <group>
            {/* Main Machine Body */}
            <mesh position={[2.0, 1.25, 0]}>
                <boxGeometry args={[2.5, 2.5, 2.0]} />
                <meshStandardMaterial color="#374151" metalness={0.7} roughness={0.2} />
            </mesh>
            {/* Spinning Motor on Top */}
            <SpinningMotor position={[2.0, 2.8, 0]} speed={2.5} />

            {/* Binder Hopper */}
            <mesh position={[2.8, 3.2, 0.5]}>
                <cylinderGeometry args={[0.25, 0.35, 0.6, 16]} />
                <meshStandardMaterial color="#78716c" metalness={0.6} roughness={0.3} />
            </mesh>
            <mesh position={[2.8, 3.55, 0.5]}>
                <cylinderGeometry args={[0.38, 0.38, 0.08, 16]} />
                <meshStandardMaterial color="#6b7280" metalness={0.7} roughness={0.2} />
            </mesh>
            <mesh position={[2.8, 2.75, 0.5]}>
                <cylinderGeometry args={[0.08, 0.15, 0.35, 8]} />
                <meshStandardMaterial color="#57534e" metalness={0.6} />
            </mesh>

            <SmallLabel position={[3.5, 3.4, 0.5]} text="SEMEN IN" />

            <DataLabel
                position={[2.0, 5.5, 0]}
                title="MIXER & MOLDER"
                data={[
                    `Semen Ratio: ${binderRatio}%`,
                    "Mixing Tailing-Semen",
                    "Hydraulic Press"
                ]}
            />
        </group>
    );
}

// 4. Curing Chamber
function CuringChamber() {
    const curingTemp = useSimulationStore(state => state.curingTemp);
    const chamberColor = getTempColor(curingTemp);
    
    // Ambient is strictly light grey. Heated modes use a smooth dark grey base to avoid looking brown.
    const isAmbient = curingTemp <= 25;
    const baseColor = isAmbient ? "#9ca3af" : "#374151";

    return (
        <group>
            <mesh position={[7.5, 1.0, 0]}>
                <boxGeometry args={[3.0, 2.0, 2.0]} />
                <meshStandardMaterial
                    color={baseColor}
                    emissive={chamberColor}
                    emissiveIntensity={curingTemp > 50 ? 0.6 : (curingTemp > 25 ? 0.4 : 0)}
                    metalness={0.5}
                    roughness={0.4}
                />
            </mesh>
            {/* Chimney */}
            <mesh position={[8.5, 2.5, 0]}>
                <cylinderGeometry args={[0.15, 0.15, 1.0, 8]} />
                <meshStandardMaterial color="#4b5563" metalness={0.6} />
            </mesh>
            {/* Door */}
            <mesh position={[6.0, 1.0, 0.01]}>
                <boxGeometry args={[0.05, 1.6, 1.6]} />
                <meshStandardMaterial color="#1f2937" metalness={0.8} roughness={0.1} />
            </mesh>

            {/* Smoke from chimney */}
            <SmokeParticles position={[8.5, 3.1, 0]} />

            <DataLabel
                position={[7.5, 4.5, 0]}
                title="STEAM CURING"
                data={[
                    `Suhu: ${curingTemp}°C`,
                    curingTemp <= 25 ? "Mode: Ambient" : "Mode: Steam Aktif"
                ]}
            />
            <SmallLabel position={[9.2, 1.0, 0]} text="PRODUK SNI ✓" />
        </group>
    );
}

// Rotating equipment group - only the machines spin, floor stays
function EquipmentGroup({ autoRotate }: { autoRotate: boolean }) {
    const groupRef = useRef<THREE.Group>(null);

    useFrame((_, delta) => {
        if (!groupRef.current || !autoRotate) return;
        groupRef.current.rotation.y += delta * 0.15; // slow turntable
    });

    return (
        <group ref={groupRef}>
            <TailingSilo />
            <NeutralizationTank />
            <MixerMolder />
            <CuringChamber />

            {/* Pipes */}
            <StraightPipe from={[-5.5, 0.5, 0]} to={[-3.5, 0.5, 0]} />
            <StraightPipe from={[-1.5, 0.5, 0]} to={[0.5, 0.5, 0]} />
            <StraightPipe from={[3.5, 0.5, 0]} to={[5.5, 0.5, 0]} />

            {/* Animated flow dots on pipes */}
            <FlowIndicator from={[-5.5, 0.5, 0]} to={[-3.5, 0.5, 0]} count={4} speed={0.35} />
            <FlowIndicator from={[-1.5, 0.5, 0]} to={[0.5, 0.5, 0]} count={4} speed={0.35} />
            <FlowIndicator from={[3.5, 0.5, 0]} to={[5.5, 0.5, 0]} count={4} speed={0.35} />

            {/* Conveyor belts under pipes for aesthetic */}
            <mesh position={[-4.5, 0.1, 0]}>
                <boxGeometry args={[2.5, 0.1, 0.6]} />
                <meshStandardMaterial color="#4b5563" metalness={0.5} />
            </mesh>
            <mesh position={[-0.5, 0.1, 0]}>
                <boxGeometry args={[2.5, 0.1, 0.6]} />
                <meshStandardMaterial color="#4b5563" metalness={0.5} />
            </mesh>
            <mesh position={[4.5, 0.1, 0]}>
                <boxGeometry args={[2.5, 0.1, 0.6]} />
                <meshStandardMaterial color="#4b5563" metalness={0.5} />
            </mesh>
        </group>
    );
}

// Static floor - white rectangle fitted to equipment span, stays put during rotation
function StaticFloor() {
    return (
        <mesh position={[0.5, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[20, 16]} />
            <meshStandardMaterial color="#ffffff" />
        </mesh>
    );
}

// OrbitControls - manual interaction only, no camera auto-rotate
function SceneControls() {
    return (
        <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 2.1}
            maxDistance={35}
            minDistance={8}
        />
    );
}

export function ReactorScene() {
    const [autoRotate, setAutoRotate] = useState(true);
    const [showLabels, setShowLabels] = useState(true);

    return (
        <div className="relative h-full w-full overflow-hidden rounded-xl bg-gradient-to-br from-gray-100 to-gray-200">
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
            <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 5, 16], fov: 40 }}>
                <PerspectiveCamera makeDefault position={[0, 6, 22]} />

                <ambientLight intensity={0.7} />
                <directionalLight
                    position={[5, 10, 5]}
                    intensity={1.2}
                    castShadow
                    shadow-mapSize={[1024, 1024]}
                />
                {/* Extra point light to illuminate particles */}
                <pointLight position={[6, 5, 2]} intensity={0.5} color="#fff7ed" />

                <Sky sunPosition={[100, 20, 100]} inclination={0.6} azimuth={0.1} />
                <Environment preset="city" />

                <React.Suspense fallback={<Loader />}>
                    <LabelContext.Provider value={showLabels}>
                        <StaticFloor />
                        <EquipmentGroup autoRotate={autoRotate} />
                    </LabelContext.Provider>
                </React.Suspense>

                <SceneControls />
            </Canvas>

            {/* Legend */}
            <div className="absolute bottom-4 right-4 flex flex-col items-end gap-2 pointer-events-none">
                <div className="rounded-lg bg-white/90 p-3 text-xs shadow-sm backdrop-blur-sm pointer-events-auto border border-gray-300">
                    <div className="mb-2 font-bold text-gray-700">Suhu Curing</div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="block h-2 w-2 rounded-full bg-gray-400"></span>
                        <span>Ambient (≤25°C)</span>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="block h-2 w-2 rounded-full bg-amber-600"></span>
                        <span>Moderate (26-50°C)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="block h-2 w-2 rounded-full bg-red-600"></span>
                        <span>High (&gt;50°C)</span>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-4 left-4 rounded-lg bg-white/80 p-2 text-[10px] text-gray-500 backdrop-blur-sm pointer-events-none">
                Left Click: Rotate • Right Click: Pan • Scroll: Zoom
            </div>
        </div>
    );
}
