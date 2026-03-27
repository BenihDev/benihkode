import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

describe('Example Test', () => {
  it('should pass', () => {
    expect(true).toBe(true)
  })

  it('should verify test environment is working', () => {
    const { container } = render(<div>Hello, World!</div>)
    expect(container.textContent).toBe('Hello, World!')
  })
})
