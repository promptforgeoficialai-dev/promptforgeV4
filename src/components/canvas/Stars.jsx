import { useState, useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Preload } from "@react-three/drei";
import * as THREE from "three";

function GalacticVortex() {
  const ref = useRef();
  const [positions] = useState(() => {
    const p = new Float32Array(10000 * 3);
    for (let i = 0; i < 10000; i++) {
      const distance = Math.sqrt(Math.random()) * 4;
      const theta = THREE.MathUtils.randFloatSpread(360); 
      const phi = THREE.MathUtils.randFloatSpread(360);
      // Forma de galaxia en espiral
      p[i * 3] = distance * Math.sin(theta) * Math.cos(phi);
      p[i * 3 + 1] = distance * Math.sin(theta) * Math.sin(phi);
      p[i * 3 + 2] = distance * Math.cos(theta) * (Math.random() * 0.5);
    }
    return p;
  });

  useFrame((state, delta) => {
    ref.current.rotation.z += delta / 20;
    ref.current.rotation.x += (state.mouse.y * 0.01);
    ref.current.rotation.y += (state.mouse.x * 0.01);
  });

  return (
    <group rotation={[Math.PI / 4, 0, 0]}>
      <Points ref={ref} positions={positions} stride={3} frustumCulled>
        <PointMaterial
          transparent
          color="#A855F7"
          size={0.008}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  );
}

export default function StarsCanvas() {
  return (
    <div className="fixed inset-0 z-[-1] bg-[#000105]">
      <Canvas camera={{ position: [0, 0, 1] }}>
        <Suspense fallback={null}>
          <GalacticVortex />
        </Suspense>
        <Preload all />
      </Canvas>
    </div>
  );
}