import { useState, ChangeEvent } from 'react'
import { createRoot } from 'react-dom/client'
import Flag from '../src/Flag'
import { getAlphaTwoCode, countries, getCountryByAlpha2 } from '../src/country'

// Read country.ts to extract all alpha-2 codes from lookup tables
// Try to read the file as raw text
let countryContent: string = ''
try {
  const countryFileModules = import.meta.glob('../src/country.ts', {
    query: '?raw',
    eager: true,
  })
  const countryFile = Object.values(countryFileModules)[0]
  // Handle different possible return types - ensure it's always a string
  if (typeof countryFile === 'string') {
    countryContent = countryFile
  } else if (countryFile != null) {
    // Try to extract string from various possible structures
    const value = (countryFile as any).default ?? countryFile
    countryContent = typeof value === 'string' ? value : String(value || '')
  }
} catch (e) {
  console.warn('Failed to read country.ts, falling back to SVG files', e)
  countryContent = ''
}

// Ensure countryContent is always a string
if (typeof countryContent !== 'string') {
  countryContent = String(countryContent || '')
}

// Get SVG file codes as fallback
const svgModules = import.meta.glob<{ default: string }>('../src/svgs/*.svg')
const svgCodes = Object.keys(svgModules)
  .map((path) => {
    const match = path.match(/\/([^/]+)\.svg$/)
    return match ? match[1].toLowerCase() : null
  })
  .filter((code): code is string => code !== null)

// Extract all unique alpha-2 codes from alpha3 and numeric lookup tables
const getCountryCodes = (): string[] => {
  const codes = new Set<string>()

  if (!countryContent || typeof countryContent !== 'string') {
    // Fallback to SVG files if country.ts parsing failed
    return svgCodes.sort()
  }

  // Extract codes from alpha3 object (values are alpha-2 codes)
  // Pattern: ABW: 'AW' or ABW: 'AW', (with optional comma)
  const alpha3Match = countryContent.match(
    /const alpha3: Record<string, string> = \{([\s\S]+?)\}/m
  )
  if (alpha3Match) {
    const alpha3Content = alpha3Match[1]
    const alpha3Pairs = alpha3Content.matchAll(/\w+:\s*'(\w+)'/g)
    for (const pair of alpha3Pairs) {
      codes.add(pair[1].toLowerCase()) // Add alpha-2 code (value)
    }
  }

  // Extract codes from numeric object (values are alpha-2 codes)
  // Pattern: '100': 'BG' or '100': 'BG', (with optional comma)
  const numericMatch = countryContent.match(
    /const numeric: Record<string, string> = \{([\s\S]+?)\}/m
  )
  if (numericMatch) {
    const numericContent = numericMatch[1]
    const numericPairs = numericContent.matchAll(/'(\d+)':\s*'(\w+)'/g)
    for (const pair of numericPairs) {
      codes.add(pair[2].toLowerCase()) // Add alpha-2 code (value)
    }
  }

  // Add special codes that might exist in SVG files but not in lookup tables
  const specialCodes = [
    'eu',
    'gb-eng',
    'gb-sct',
    'gb-wls',
    'gb-nir',
    'xk',
    'xx',
    'arab',
    'asean',
    'cefta',
    'eac',
    'un',
    'ic',
    'cp',
    'dg',
    'pc',
    'sh-ac',
    'sh-hl',
    'sh-ta',
    'es-ct',
    'es-ga',
    'es-pv',
  ]
  specialCodes.forEach((code) => codes.add(code))

  // If we didn't extract any codes, fallback to SVG files
  if (codes.size === 0) {
    return svgCodes.sort()
  }

  return Array.from(codes).sort()
}

const countryCodes = getCountryCodes()

// Build reverse lookup maps from country.ts content for getting all codes
let alpha2ToAlpha3: Record<string, string> = {}
let alpha2ToNumeric: Record<string, string> = {}

if (countryContent && typeof countryContent === 'string') {
  // Extract alpha-3 -> alpha-2 mappings
  const alpha3Match = countryContent.match(
    /const alpha3: Record<string, string> = \{([\s\S]+?)\}/m
  )
  if (alpha3Match) {
    const alpha3Content = alpha3Match[1]
    const alpha3Pairs = alpha3Content.matchAll(/(\w+):\s*'(\w+)'/g)
    for (const pair of alpha3Pairs) {
      const a3 = pair[1] // e.g., 'USA'
      const a2 = pair[2] // e.g., 'US'
      alpha2ToAlpha3[a2] = a3
    }
  }

  // Extract numeric -> alpha-2 mappings
  const numericMatch = countryContent.match(
    /const numeric: Record<string, string> = \{([\s\S]+?)\}/m
  )
  if (numericMatch) {
    const numericContent = numericMatch[1]
    const numericPairs = numericContent.matchAll(/'(\d+)':\s*'(\w+)'/g)
    for (const pair of numericPairs) {
      const num = pair[1] // e.g., '840'
      const a2 = pair[2] // e.g., 'US'
      alpha2ToNumeric[a2] = num
    }
  }
}

// Helper to get all codes for a given code
const getAllCodes = (
  code: string | number
): { alpha2: string; alpha3?: string; numeric?: string } => {
  const alpha2 = getAlphaTwoCode(code)
  const alpha3Code = alpha2ToAlpha3[alpha2]
  const numericCode = alpha2ToNumeric[alpha2]

  return {
    alpha2: alpha2.toLowerCase(),
    alpha3: alpha3Code,
    numeric: numericCode,
  }
}

interface FlagsProps {
  query: string
}

const Flags = ({ query }: FlagsProps) => {
  const [height, setHeight] = useState(50)

  // Create a map of all codes (including special codes) to country info
  const codeToCountry = new Map<
    string,
    {
      name?: string
      codes: { alpha2: string; alpha3?: string; numeric?: string }
    }
  >()

  // Add countries from the countries array
  countries.forEach((country) => {
    codeToCountry.set(country.alpha2.toLowerCase(), {
      name: country.name,
      codes: {
        alpha2: country.alpha2,
        alpha3: country.alpha3,
        numeric: country.numeric,
      },
    })
  })

  // Add special codes that might not be in the countries array
  countryCodes.forEach((code) => {
    if (!codeToCountry.has(code)) {
      const codes = getAllCodes(code)
      codeToCountry.set(code, {
        codes: {
          alpha2: codes.alpha2,
          alpha3: codes.alpha3,
          numeric: codes.numeric,
        },
      })
    }
  })

  const flags = countryCodes
    .filter((code) => {
      if (!query) return true
      const queryLower = query.toLowerCase()
      const countryInfo = codeToCountry.get(code)
      const codes = countryInfo?.codes || getAllCodes(code)

      // Search in all code types and country name
      return (
        codes.alpha2.includes(queryLower) ||
        codes.alpha3?.toLowerCase().includes(queryLower) ||
        codes.numeric?.includes(queryLower) ||
        countryInfo?.name?.toLowerCase().includes(queryLower)
      )
    })
    .map((code) => {
      const countryInfo = codeToCountry.get(code)
      const codes = countryInfo?.codes || getAllCodes(code)
      const codeString = [codes.alpha2, codes.alpha3, codes.numeric]
        .filter(Boolean)
        .join('/')
      const title = countryInfo?.name || codeString
      // Flag width is approximately 4:3 aspect ratio (height * 4/3)
      const flagWidth = (height * 4) / 3
      return (
        <div
          key={code}
          style={{ display: 'inline-block', textAlign: 'center', margin: 10 }}
        >
          <Flag
            code={code}
            alt={title}
            title={title}
            style={{ boxShadow: '2px 2px 7px #ccc', display: 'block' }}
            height={height}
          />
          <div
            style={{
              fontSize: '12px',
              marginTop: '4px',
              color: '#666',
              width: flagWidth,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {countryInfo?.name || codeString}
          </div>
        </div>
      )
    })

  return (
    <div style={{ paddingTop: 10 }}>
      <div>
        <input
          min="1"
          step="1"
          max="500"
          type="range"
          value={height}
          style={{ width: '100%', padding: '10px 0' }}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setHeight(Number(e.target.value))
          }
        />
      </div>
      {flags}
    </div>
  )
}

interface SearchProps {
  onChange: (value: string) => void
  query: string
}

const Search = ({ onChange, query }: SearchProps) => (
  <div>
    <input
      type="text"
      value={query}
      placeholder="Filter by country name or code (alpha-2, alpha-3, or numeric)"
      onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
      style={{ width: '300px', padding: '2px', fontSize: '16px' }}
    />
  </div>
)

const App = () => {
  const [query, setQuery] = useState('')

  return (
    <div>
      <h1 style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <span>react-world-flags</span>
          <a
            style={{ paddingLeft: '5px' }}
            href="https://github.com/smucode/react-world-flags"
          >
            docs
          </a>
        </div>
        <Search onChange={setQuery} query={query} />
      </h1>
      <Flags query={query} />
    </div>
  )
}

const root = createRoot(document.getElementById('app')!)
root.render(<App />)
