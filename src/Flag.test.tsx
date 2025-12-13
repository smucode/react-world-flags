import { render, waitFor } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

import Flag from './Flag'

describe('Flag component', () => {
  it('renders a flag with valid code', async () => {
    const { container } = render(<Flag code="no" />)
    await waitFor(() => {
      const img = container.querySelector('img')
      expect(img).toBeTruthy()
      expect(img?.src).toBeTruthy()
    })
  })

  it('passes through props to img element', async () => {
    const { container } = render(<Flag code="us" height={42} width={100} alt="USA Flag" />)
    await waitFor(() => {
      const img = container.querySelector('img')
      expect(img).toBeTruthy()
      expect(img?.getAttribute('height')).toBe('42')
      expect(img?.getAttribute('width')).toBe('100')
      expect(img?.getAttribute('alt')).toBe('USA Flag')
    })
  })

  it('renders fallback when code is invalid and fallback is provided', async () => {
    const { container } = render(
      <Flag code="xxx" fallback={<span>Does not exist.</span>} />
    )
    // Wait a tick for the dynamic import to fail
    await waitFor(() => {
      const img = container.querySelector('img')
      const fallback = container.querySelector('span')
      expect(img).toBeNull()
      expect(fallback).toBeTruthy()
      expect(fallback?.textContent).toBe('Does not exist.')
    })
  })

  it('renders nothing when code is invalid and no fallback', async () => {
    const { container } = render(<Flag code="xxx" />)
    await waitFor(() => {
      const img = container.querySelector('img')
      expect(img).toBeNull()
      expect(container.firstChild).toBeNull()
    })
  })

  it('renders fallback when code is empty and fallback is provided', () => {
    const { container } = render(
      <Flag code="" fallback={<span>No code provided.</span>} />
    )
    const img = container.querySelector('img')
    const fallback = container.querySelector('span')
    expect(img).toBeNull()
    expect(fallback).toBeTruthy()
    expect(fallback?.textContent).toBe('No code provided.')
  })

  it('renders nothing when code is empty and no fallback', () => {
    const { container } = render(<Flag code="" />)
    expect(container.firstChild).toBeNull()
  })

  it('handles country code variations', async () => {
    // Test lowercase
    const { container: c1 } = render(<Flag code="no" />)
    await waitFor(() => expect(c1.querySelector('img')).toBeTruthy())

    // Test uppercase
    const { container: c2 } = render(<Flag code="NO" />)
    await waitFor(() => expect(c2.querySelector('img')).toBeTruthy())

    // Test ISO 3166-1 numeric
    const { container: c3 } = render(<Flag code="578" />) // Norway's numeric code
    await waitFor(() => expect(c3.querySelector('img')).toBeTruthy())
  })

  it('handles special country codes like GB-ENG', async () => {
    const { container } = render(<Flag code="gb-eng" />)
    await waitFor(() => {
      const img = container.querySelector('img')
      expect(img).toBeTruthy()
      expect(img?.src).toBeTruthy()
    })
  })

  it('renders EU flag', async () => {
    const { container } = render(<Flag code="eu" />)
    await waitFor(() => {
      const img = container.querySelector('img')
      expect(img).toBeTruthy()
      expect(img?.src).toBeTruthy()
    })
  })

  it('renders a sample of common flags', async () => {
    const commonFlags = ['us', 'gb', 'fr', 'de', 'jp', 'cn', 'ru', 'br']

    for (const code of commonFlags) {
      const { container } = render(<Flag code={code} />)
      await waitFor(() => {
        const img = container.querySelector('img')
        expect(img).toBeTruthy()
        expect(img?.src).toBeTruthy()
      })
    }
  })
})
