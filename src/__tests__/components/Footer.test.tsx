import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Footer } from '@/components/layout/Footer'

describe('Footer', () => {
  it('renders the year', () => {
    render(<Footer />)
    expect(screen.getByText(/2026/)).toBeInTheDocument()
  })

  it('renders "all rights reserved"', () => {
    render(<Footer />)
    expect(screen.getByText(/all rights reserved/i)).toBeInTheDocument()
  })

  it('renders "berlin"', () => {
    render(<Footer />)
    expect(screen.getByText(/berlin/i)).toBeInTheDocument()
  })

  it('renders a timezone string', () => {
    render(<Footer />)
    // jsdom returns GMT+X instead of CET/CEST, so match either format
    expect(screen.getByText(/CE[S]?T|GMT[+-]\d/)).toBeInTheDocument()
  })
})
