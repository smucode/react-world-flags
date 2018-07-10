/* eslint-disable fp/no-nil */
/* eslint-disable fp/no-this */
/* eslint-disable fp/no-class */
/* eslint-disable fp/no-mutation */
/* eslint-disable better/explicit-return */
/* eslint-disable fp/no-unused-expression */

import React from 'react'
import ReactDOM from 'react-dom'
import countries from 'svg-country-flags/countries.json'

import Flag from '../dist/react-world-flags'

class Flags extends React.Component {
  constructor(props) {
    super(props)
    this.state = { height: 50 }
  }
  render() {
    const flags = Object.keys(countries)
      .filter(c => {
        return (
          !this.props.query ||
          ~c.toLowerCase().indexOf(this.props.query.toLowerCase()) ||
          ~countries[c].toLowerCase().indexOf(this.props.query.toLowerCase())
        )
      })
      .map(c => {
        const key = c.replace('-', '_')
        const title = countries[c] + ' (' + key + ')'
        return (
          <Flag
            key={key}
            code={key}
            alt={title}
            title={title}
            style={{ margin: 10, boxShadow: '2px 2px 7px #ccc' }}
            height={this.state.height}
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
            value={this.state.height}
            style={{ width: '100%', padding: '10px 0' }}
            onChange={e => this.setState({ height: e.target.value })}
          />
        </div>
        {flags}
      </div>
    )
  }
}

const Search = ({ onChange, query }) => (
  <div>
    <input
      type="text"
      value={query}
      placeholder="Filter by country code or country name"
      onChange={e => onChange(e.target.value)}
      style={{ width: '300px', padding: '2px', 'font-size': '16px' }}
    />
  </div>
)

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = { query: '' }
  }
  render() {
    return (
      <div>
        <h1 style={{ display: 'flex', 'justify-content': 'space-between' }}>
          <div>
            <span>react-world-flags</span>
            <a
              style={{ 'padding-left': '5px' }}
              href="https://github.com/smucode/react-world-flags"
            >
              docs
            </a>
          </div>
          <Search
            onChange={query => this.setState({ query })}
            query={this.state.query}
          />
        </h1>
        <Flags query={this.state.query} />
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'))
