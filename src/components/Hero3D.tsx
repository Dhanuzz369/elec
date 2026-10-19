"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, RoundedBox } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import type { Group } from "three";

// A procedural oil-filled distribution transformer: tank, radiator fins,
// three HV bushings, four LV bushings, conservator and skid.
// It turns slowly on its own (unless reduced motion is set) and settles in on
// load. With a mouse you can drag it; on touch screens the canvas leaves
// vertical swipes to the page so the hero never traps scrolling.

const TANK = "#d6d6d2";
const STEEL = "#9b9b97";
const PORCELAIN = "#1c1c1c";
const COPPER = "#b87333";

function Bushing({ x, z, height, sheds }: { x: number; z: number; height: number; sheds: number }) {
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, height / 2, 0]}>
        <cylinderGeometry args={[0.07, 0.09, height, 20]} />
        <meshStandardMaterial color={PORCELAIN} roughness={0.35} />
      </mesh>
      {Array.from({ length: sheds }).map((_, i) => (
        <mesh key={i} position={[0, 0.12 + (i * (height - 0.2)) / sheds, 0]}>
          <cylinderGeometry args={[0.16, 0.16, 0.035, 24]} />
          <meshStandardMaterial color={PORCELAIN} roughness={0.35} />
        </mesh>
      ))}
      <mesh position={[0, height + 0.05, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.12, 12]} />
        <meshStandardMaterial color={COPPER} metalness={0.8} roughness={0.3} />
      </mesh>
    </group>
  );
}

function Radiator({ side }: { side: 1 | -1 }) {
  return (
    <group position={[side * 0.98, 0, 0]}>
      {Array.from({ length: 9 }).map((_, i) => (
        <mesh key={i} position={[side * 0.18, 0, -0.56 + i * 0.14]}>
          <boxGeometry args={[0.36, 1.25, 0.03]} />
          <meshStandardMaterial color={TANK} metalness={0.35} roughness={0.55} />
        </mesh>
      ))}
      {[0.55, -0.55].map((y) => (
        <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.035, 0.035, 1.25, 12]} />
          <meshStandardMaterial color={STEEL} metalness={0.5} roughness={0.4} />
        </mesh>
      ))}
    </group>
  );
}

function Transformer({ spin }: { spin: boolean }) {
  // Keep the whole unit in frame on narrow stages.
  const width = useThree((s) => s.viewport.width);
  const scale = Math.min(1, width / 3.6);
  const turn = useRef<Group>(null);
  const settle = useRef(0);

  useFrame((_, dt) => {
    const g = turn.current;
    if (!g) return;
    // Entrance: rise 0.25 units and grow from 92% with a critically damped ease.
    settle.current += (1 - settle.current) * Math.min(1, dt * 3.2);
    const k = settle.current;
    g.position.y = (1 - k) * -0.25;
    g.scale.setScalar(0.92 + 0.08 * k);
    if (spin) g.rotation.y += dt * 0.14;
  });

  return (
    <group ref={turn}>
    <group position={[0, -0.35, 0]} rotation={[0.12, -0.6, 0]} scale={scale}>
      <RoundedBox args={[1.9, 1.5, 1.2]} radius={0.05} smoothness={4}>
        <meshStandardMaterial color={TANK} metalness={0.35} roughness={0.5} />
      </RoundedBox>
      <mesh position={[0, 0.79, 0]}>
        <boxGeometry args={[2.0, 0.08, 1.3]} />
        <meshStandardMaterial color={STEEL} metalness={0.5} roughness={0.4} />
      </mesh>
      <Radiator side={1} />
      <Radiator side={-1} />
      <group position={[0, 0.83, 0]}>
        {[-0.55, 0, 0.55].map((x) => (
          <Bushing key={`hv${x}`} x={x} z={-0.25} height={0.9} sheds={6} />
        ))}
        {[-0.6, -0.2, 0.2, 0.6].map((x) => (
          <Bushing key={`lv${x}`} x={x} z={0.35} height={0.42} sheds={3} />
        ))}
      </group>
      <group position={[0, 1.45, -0.5]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.22, 0.22, 1.3, 32]} />
          <meshStandardMaterial color={TANK} metalness={0.35} roughness={0.5} />
        </mesh>
        {[-0.45, 0.45].map((x) => (
          <mesh key={x} position={[x, -0.32, 0]}>
            <boxGeometry args={[0.05, 0.5, 0.05]} />
            <meshStandardMaterial color={STEEL} />
          </mesh>
        ))}
      </group>
      <mesh position={[0, -0.82, 0]}>
        <boxGeometry args={[2.1, 0.14, 1.0]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.15, 0.605]}>
        <planeGeometry args={[0.42, 0.28]} />
        <meshStandardMaterial color="#efefef" metalness={0.6} roughness={0.3} />
      </mesh>
    </group>
    </group>
  );
}

export default function Hero3D() {
  const [still, setStill] = useState(false);
  const [fine, setFine] = useState(false);
  const [visible, setVisible] = useState(true);
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => {
      setStill(motion.matches);
      setFine(pointer.matches);
    };
    sync();
    motion.addEventListener("change", sync);
    pointer.addEventListener("change", sync);
    return () => {
      motion.removeEventListener("change", sync);
      pointer.removeEventListener("change", sync);
    };
  }, []);

  // Stop rendering while the hero is scrolled out of view.
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrap} className="hero-canvas" style={{ touchAction: fine ? "none" : "pan-y" }}>
      <Canvas
        frameloop={visible ? "always" : "never"}
        camera={{ position: [0, 1.1, 5.2], fov: 38 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        aria-label="A 3D model of an oil-filled distribution transformer."
        role="img"
      >
        <ambientLight intensity={0.55} />
        <directionalLight position={[4, 6, 5]} intensity={2.2} />
        <directionalLight position={[-5, 2, -3]} intensity={0.6} color="#d6fff0" />
        <Transformer spin={!still} />
        {fine && (
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 1.9}
            enableDamping
            dampingFactor={0.08}
          />
        )}
      </Canvas>
    </div>
  );
}
