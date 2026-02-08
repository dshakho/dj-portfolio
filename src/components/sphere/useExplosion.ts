'use client'

import { useRef, useState, useCallback } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function useExplosion(meshRef: React.RefObject<THREE.Mesh | null>) {
  const particlesRef = useRef<THREE.Points>(null)
  const [isExploding, setIsExploding] = useState(false)
  const velocitiesRef = useRef<Float32Array | null>(null)
  const originalPositionsRef = useRef<Float32Array | null>(null)
  const phaseRef = useRef<'scatter' | 'reconstruct'>('scatter')
  const timerRef = useRef(0)

  const triggerExplosion = useCallback(() => {
    if (isExploding || !meshRef.current) return

    const geometry = meshRef.current.geometry
    const positions = geometry.attributes.position.array as Float32Array
    const count = positions.length

    // store original positions
    originalPositionsRef.current = new Float32Array(positions)

    // create particle positions (copy of mesh vertices)
    const particlePositions = new Float32Array(positions)

    // random velocities along normals + noise
    const velocities = new Float32Array(count)
    const normals = geometry.attributes.normal.array as Float32Array
    for (let i = 0; i < count; i += 3) {
      velocities[i] = normals[i] * 2 + (Math.random() - 0.5) * 0.5
      velocities[i + 1] = normals[i + 1] * 2 + (Math.random() - 0.5) * 0.5
      velocities[i + 2] = normals[i + 2] * 2 + (Math.random() - 0.5) * 0.5
    }
    velocitiesRef.current = velocities

    // set up particles geometry
    if (particlesRef.current) {
      const bufferGeometry = new THREE.BufferGeometry()
      bufferGeometry.setAttribute(
        'position',
        new THREE.BufferAttribute(particlePositions, 3)
      )
      particlesRef.current.geometry = bufferGeometry
    }

    phaseRef.current = 'scatter'
    timerRef.current = 0
    setIsExploding(true)
  }, [isExploding, meshRef])

  useFrame((_, delta) => {
    if (!isExploding || !particlesRef.current || !velocitiesRef.current) return

    timerRef.current += delta
    const positions = particlesRef.current.geometry.attributes.position
      ?.array as Float32Array | undefined

    if (!positions) return

    if (phaseRef.current === 'scatter') {
      // scatter outward with damping
      for (let i = 0; i < positions.length; i += 3) {
        positions[i] += velocitiesRef.current[i] * delta
        positions[i + 1] += velocitiesRef.current[i + 1] * delta
        positions[i + 2] += velocitiesRef.current[i + 2] * delta

        // damping
        velocitiesRef.current[i] *= 0.97
        velocitiesRef.current[i + 1] *= 0.97
        velocitiesRef.current[i + 2] *= 0.97
      }

      if (timerRef.current > 1.5) {
        phaseRef.current = 'reconstruct'
        timerRef.current = 0
      }
    } else {
      // lerp back to original positions
      const original = originalPositionsRef.current!
      const t = Math.min(timerRef.current / 1.0, 1.0)
      const ease = t * t * (3 - 2 * t) // smoothstep

      for (let i = 0; i < positions.length; i++) {
        positions[i] = positions[i] + (original[i] - positions[i]) * ease * delta * 3
      }

      if (t >= 1.0) {
        setIsExploding(false)
      }
    }

    particlesRef.current.geometry.attributes.position.needsUpdate = true
  })

  return { particlesRef, isExploding, triggerExplosion }
}
