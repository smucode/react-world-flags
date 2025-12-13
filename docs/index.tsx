import { useState, ChangeEvent } from 'react'
import { createRoot } from 'react-dom/client'
import countries from 'svg-country-flags/countries.json' with { type: 'json' }

import Flag from '../src/Flag'

interface FlagsProps {
  query: string
}

const Flags = ({ query }: FlagsProps) => {
  const [height, setHeight] = useState(50)

  const flags = Object.keys(countries)
    .filter((c) => {
      return (
        !query ||
        c.toLowerCase().includes(query.toLowerCase()) ||
        (countries as Record<string, string>)[c].toLowerCase().includes(query.toLowerCase())
      )
    })
    .map((c) => {
      const key = c.replace('-', '_')
      const title = (countries as Record<string, string>)[c] + ' (' + key + ')'
      return (
        <Flag
          key={key}
          code={key}
          alt={title}
          title={title}
          style={{ margin: 10, boxShadow: '2px 2px 7px #ccc' }}
          height={height}
        />
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
          onChange={(e: ChangeEvent<HTMLInputElement>) => setHeight(Number(e.target.value))}
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
      placeholder="Filter by country code or country name"
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
