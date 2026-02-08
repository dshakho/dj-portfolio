'use client'

import { Canvas } from '@react-three/fiber'
import { Sphere } from './Sphere'

interface SphereCanvasProps {
  scale?: number
}

export function SphereCanvas({ scale = 1 }: SphereCanvasProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 3], fov: 50 }}
      dpr={[1, 2]}
      style={{ background: 'transparent' }}
      gl={{ alpha: true, antialias: true, preserveDrawingBuffer: true }}
    >
      <Sphere scale={scale} />
    </Canvas>
  )
}
