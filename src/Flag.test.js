/* eslint-disable fp/no-nil */
/* eslint-disable better/explicit-return */
/* eslint-disable fp/no-unused-expression */

import React from 'react'
import renderer from 'react-test-renderer'
import countries from 'svg-country-flags/countries.json'

import Flag from './Flag'

it('renders the norwegian flag correctly', () => {
  const flag = renderer.create(<Flag code="no" height="42" />).toJSON()
  expect(flag).toMatchSnapshot()
})

it('renders a fallback flag correctly', () => {
  const flag = renderer
    .create(
      <Flag code="xxx" height="42" fallback={<span>Does not exist.</span>} />
    )
    .toJSON()
  expect(flag).toMatchSnapshot()
})

it('renders nothing if code does not exist', () => {
  const flag = renderer.create(<Flag code="xxx" height="42" />).toJSON()
  expect(flag).toMatchSnapshot()
})

Object.keys(countries).map(c => {
  it('exports the ' + c + ' flag', () => {
    const flag = renderer.create(<Flag code={c} />).toJSON()
    expect(flag).toMatchSnapshot()
  })
})
