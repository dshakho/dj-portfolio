'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { vertexShader } from './shaders/vertex.glsl'
import { fragmentShader } from './shaders/fragment.glsl'
import { useExplosion } from './useExplosion'

interface SphereProps {
  scale?: number
}

export function Sphere({ scale = 1 }: SphereProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.ShaderMaterial>(null)

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uNoiseScale: { value: 1.5 },
      uDisplacement: { value: 0.3 },
    }),
    []
  )

  const { particlesRef, isExploding, triggerExplosion } = useExplosion(meshRef)

  useFrame((_, delta) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value += delta
    }
    if (meshRef.current && !isExploding) {
      meshRef.current.rotation.y += delta * 0.1
    }
  })

  return (
    <group scale={scale}>
      <mesh
        ref={meshRef}
      >
        <icosahedronGeometry args={[1, 64]} />
        <shaderMaterial
          ref={materialRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent
          depthWrite={false}
        />
      </mesh>
      {isExploding && (
        <points ref={particlesRef}>
          <bufferGeometry />
          <pointsMaterial
            size={0.02}
            color="#8b5cf6"
            transparent
            opacity={0.8}
            sizeAttenuation
          />
        </points>
      )}
    </group>
  )
}
