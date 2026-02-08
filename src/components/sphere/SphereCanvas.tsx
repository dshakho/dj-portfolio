'use client'

import { Canvas } from '@react-three/fiber'
import { Sphere } from './Sphere'

interface SphereCanvasProps {
  scale?: number
  onClick?: () => void
}

export function SphereCanvas({ scale = 1, onClick }: SphereCanvasProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 3], fov: 50 }}
      dpr={[1, 2]}
      style={{ background: 'transparent' }}
      gl={{ alpha: true, antialias: true, preserveDrawingBuffer: true }}
    >
      <Sphere scale={scale} onClick={onClick} />
    </Canvas>
  )
}
