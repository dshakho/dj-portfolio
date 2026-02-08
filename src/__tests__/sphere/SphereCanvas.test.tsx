import { render } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

// mock r3f since jsdom doesn't support webgl
vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="r3f-canvas">{children}</div>
  ),
  useFrame: vi.fn(),
  useThree: vi.fn(() => ({ size: { width: 800, height: 600 } })),
}))

vi.mock('@react-three/drei', () => ({
  AdaptiveDpr: () => null,
}))

import { SphereCanvas } from '@/components/sphere/SphereCanvas'

describe('SphereCanvas', () => {
  it('renders without crashing', () => {
    const { container } = render(<SphereCanvas />)
    expect(container).toBeTruthy()
  })

  it('renders the r3f canvas wrapper', () => {
    const { getByTestId } = render(<SphereCanvas />)
    expect(getByTestId('r3f-canvas')).toBeInTheDocument()
  })
})
