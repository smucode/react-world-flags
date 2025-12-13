import { render, waitFor } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { readFileSync, readdirSync } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

import Flag from './Flag'
import { getAlphaTwoCode } from './country'

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
    const { container } = render(
      <Flag code="us" height={42} width={100} alt="USA Flag" />
    )
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

describe('Flag files sync', () => {
  it('ensures all country codes have corresponding SVG files', () => {
    const __filename = fileURLToPath(import.meta.url)
    const __dirname = dirname(__filename)
    const svgsDir = join(__dirname, 'svgs')
    const countryFile = join(__dirname, 'country.ts')

    // Read all SVG files
    const svgFiles = readdirSync(svgsDir)
      .filter((file) => file.endsWith('.svg'))
      .map((file) => file.replace('.svg', ''))

    // Extract all unique alpha-2 codes from country.ts
    const countryContent = readFileSync(countryFile, 'utf-8')

    // Extract alpha-2 codes from alpha3 lookup table
    const alpha3Match = countryContent.match(
      /const alpha3: Record<string, string> = \{([^}]+)\}/s
    )
    const alpha3Codes = new Set<string>()
    if (alpha3Match) {
      const alpha3Content = alpha3Match[1]
      const pairs = alpha3Content.matchAll(/(\w+):\s*'(\w+)'/g)
      for (const pair of pairs) {
        alpha3Codes.add(pair[2]) // Add the alpha-2 code (value)
      }
    }

    // Extract alpha-2 codes from numeric lookup table
    const numericMatch = countryContent.match(
      /const numeric: Record<string, string> = \{([^}]+)\}/s
    )
    const numericCodes = new Set<string>()
    if (numericMatch) {
      const numericContent = numericMatch[1]
      const pairs = numericContent.matchAll(/'(\d+)':\s*'(\w+)'/g)
      for (const pair of pairs) {
        numericCodes.add(pair[2]) // Add the alpha-2 code (value)
      }
    }

    // Combine all codes
    const allCodes = new Set([...alpha3Codes, ...numericCodes])

    // Add special codes
    const specialCodes = ['EU', 'GB-ENG', 'GB-SCT', 'GB-WLS', 'GB-NIR', 'XK']
    specialCodes.forEach((code) => allCodes.add(code))

    // Convert codes to expected filename format (lowercase, replace underscore with hyphen)
    const expectedFiles = Array.from(allCodes).map((code) =>
      code.toLowerCase().replace(/_/g, '-')
    )

    // Check each code has a corresponding SVG file
    const missingFiles: string[] = []
    for (const expectedFile of expectedFiles) {
      if (!svgFiles.includes(expectedFile)) {
        missingFiles.push(expectedFile)
      }
    }

    if (missingFiles.length > 0) {
      throw new Error(
        `Missing SVG files for country codes: ${missingFiles.join(', ')}\n` +
          `Total expected: ${expectedFiles.length}, Found: ${svgFiles.length}`
      )
    }

    // Also verify we're not missing any obvious ones by checking a sample
    expect(svgFiles.length).toBeGreaterThan(200) // Should have many flags
  })
})
