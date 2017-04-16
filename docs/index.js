/* eslint-disable fp/no-nil */
/* eslint-disable fp/no-this */
/* eslint-disable fp/no-class */
/* eslint-disable fp/no-mutation */
/* eslint-disable better/explicit-return */
/* eslint-disable fp/no-unused-expression */

import React from 'react'
import ReactDOM from 'react-dom'
import countries from 'svg-country-flags/countries.json'

import Flag from '../src/Flag'

class Flags extends React.Component {
  constructor(props) {
    super(props)
    this.state = { height: 50 }
  }
  render() {
    const flags = Object.keys(countries).map(c => (
      <Flag
        key={ c }
        code={ c }
        alt={ countries[c] }
        title={ countries[c] }
        style={{ margin: 10, boxShadow: '2px 2px 7px #ccc' }}
        height={ this.state.height }
      />
    ))
    return (
      <div style={{ paddingTop: 10 }}>
        <div>
          <input
            min="1"
            step="1"
            max="500"
            type="range"
            value={ this.state.height }
            style={{ width: '100%', padding: '10px 0' }}
            onChange={ e => this.setState({ height: e.target.value }) }
            />
        </div>
        { flags }
      </div>
    )
  }
}

const app = (
  <div>
    <h1>react-world-flags</h1>
    <p>SVG flags of the world for react</p>
    <a href="https://github.com/smucode/react-world-flags">Docs</a>
    <Flags/>
  </div>
)

ReactDOM.render(app, document.getElementById('app'))
