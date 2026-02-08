import { render, screen, act, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// mock SphereCanvas since it needs webgl
vi.mock('@/components/sphere/SphereCanvas', () => ({
  SphereCanvas: () => (
    <div data-testid="sphere-canvas" />
  ),
}))

// helper to create motion element mock
function createMotionElement(tag: string) {
  return function MotionElement({ children, ...props }: Record<string, unknown>) {
    const htmlProps = Object.fromEntries(
      Object.entries(props).filter(
        ([key]) =>
          !['animate', 'initial', 'exit', 'transition', 'layout', 'whileHover', 'whileTap'].includes(key) &&
          !key.startsWith('onAnimation')
      )
    )
    const Tag = tag as keyof JSX.IntrinsicElements
    return <Tag {...htmlProps}>{children as React.ReactNode}</Tag>
  }
}

// mock motion to avoid animation complexity in tests
vi.mock('motion/react', () => ({
  motion: {
    div: createMotionElement('div'),
    p: createMotionElement('p'),
    nav: createMotionElement('nav'),
    span: createMotionElement('span'),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}))

import { PortfolioShell } from '@/components/layout/PortfolioShell'

function renderShell() {
  const result = render(<PortfolioShell />)
  // flush the mounted useEffect
  act(() => {
    vi.advanceTimersByTime(0)
  })
  return result
}

describe('PortfolioShell', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('starts in landing state', () => {
    renderShell()
    expect(screen.getByText('mtmrfoz')).toBeInTheDocument()
    expect(screen.getByTestId('sphere-canvas')).toBeInTheDocument()
  })

  it('does not show nav in landing state', () => {
    renderShell()
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
  })

  it('transitions to content state after 3.5s', async () => {
    renderShell()

    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()

    await act(async () => {
      vi.advanceTimersByTime(3600)
    })

    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })

  it('transitions early on sphere wrapper click', () => {
    renderShell()

    // click the wrapper div around the sphere (fallback for r3f click)
    fireEvent.click(screen.getByTestId('sphere-canvas').parentElement!)

    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })

  it('keeps sphere visible after transition', async () => {
    renderShell()
    expect(screen.getByTestId('sphere-canvas')).toBeInTheDocument()

    await act(async () => {
      vi.advanceTimersByTime(3600)
    })

    // same sphere instance stays mounted
    expect(screen.getByTestId('sphere-canvas')).toBeInTheDocument()
  })

  it('shows footer in both states', async () => {
    renderShell()
    expect(screen.getByText(/2026/)).toBeInTheDocument()

    await act(async () => {
      vi.advanceTimersByTime(3600)
    })

    expect(screen.getByText(/2026/)).toBeInTheDocument()
  })
})
