import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { Home } from './Home'

describe('Home flow', () => {
  it('shows primary detection CTA', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    )
    expect(screen.getByRole('link', { name: /Start Free Detection/i })).toHaveAttribute('href', '/detect')
  })
})
