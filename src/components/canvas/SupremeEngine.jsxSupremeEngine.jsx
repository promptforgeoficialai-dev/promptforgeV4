import { useRef, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { MeshTransmissionMaterial, Float, Environment, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'

function QuantumObject() {
  const mesh = useRef()
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    mesh.current.rotation.x = THREE.MathUtils.lerp(mesh.current.rotation.x, Math.cos(t / 2) / 4 + 0.25, 0.1)
    mesh.current.rotation.y = THREE.MathUtils.lerp(mesh.current.rotation.y, Math.sin(t / 4) / 4, 0.1)
    mesh.current.position.y = THREE.MathUtils.lerp(mesh.current.position.y, (1 + Math.sin(t / 1.5)) / 10, 0.1)
  })

  return (
    <Float speed={4} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={mesh} castShadow receiveShadow>
        <torusKnotGeometry args={[1, 0.35, 256, 32]} />
        <MeshTransmissionMaterial
          backside
          samples={16}
          thickness={1}
          chromaticAberration={0.5}
          anisotropy={0.3}
          distortion={0.5}
          distortionScale={0.5}
          temporalDistortion={0.1}
          iridescence={1}
          iridescenceIOR={1}
          iridescenceThicknessRange={[0, 1400]}
          color="#9333ea"
          roughness={0}
          transmission={1}
        />
      </mesh>
    </Float>
  )
}

export default function SupremeEngine() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas shadows camera={{ position: [0, 0, 5], fov: 35 }}>
        <color attach="background" args={['#020617']} />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} castShadow />
        <pointLight position={[-10, -10, -5]} color="#22d3ee" intensity={2} />
        <Suspense fallback={null}>
          <QuantumObject />
          <Environment preset="city" />
          <ContactShadows position={[0, -1.5, 0]} opacity={0.4} scale={20} blur={2} far={4.5} />
        </Suspense>
      </Canvas>
    </div>
  )
}