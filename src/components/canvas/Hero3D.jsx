import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { MeshTransmissionMaterial, Float, Icosahedron, MeshDistortMaterial } from '@react-three/drei'

function QuantumCore() {
  const mainRef = useRef();
  const wireRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    mainRef.current.rotation.x = t * 0.2;
    mainRef.current.rotation.y = t * 0.3;
    wireRef.current.rotation.x = -t * 0.4;
    wireRef.current.rotation.y = -t * 0.2;
  });

  return (
    <Float speed={4} rotationIntensity={1} floatIntensity={2}>
      {/* NÚCLEO DE CRISTAL LÍQUIDO */}
      <mesh ref={mainRef}>
        <icosahedronGeometry args={[1, 15]} />
        <MeshTransmissionMaterial
          backside
          samples={10}
          thickness={1.5}
          chromaticAberration={0.15} // Efecto de arcoiris real
          anisotropy={0.3}
          distortion={0.4}
          distortionScale={0.5}
          temporalDistortion={0.2}
          color="#7C3AED"
          attenuationDistance={0.5}
          attenuationColor="#ffffff"
        />
      </mesh>

      {/* REJILLA TECNOLÓGICA INTERNA */}
      <mesh ref={wireRef}>
        <icosahedronGeometry args={[1.1, 2]} />
        <meshStandardMaterial 
          color="#22d3ee" 
          wireframe 
          transparent 
          opacity={0.3} 
          emissive="#22d3ee" 
          emissiveIntensity={2} 
        />
      </mesh>

      <pointLight position={[0, 0, 0]} intensity={15} color="#A855F7" />
    </Float>
  )
}

export default function Hero3D() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 5], fov: 35 }}>
        <ambientLight intensity={0.2} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} />
        <pointLight position={[-10, -10, -5]} color="#22d3ee" intensity={2} />
        <QuantumCore />
      </Canvas>
    </div>
  )
}