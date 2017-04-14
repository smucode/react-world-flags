import React from 'react'
import * as flags from './flags'
import countries from 'world-countries'

export default props => {
  const { code, ...rest } = props
  const country = countries.find(c => c.cca2 === code || c.ccn3 === code || c.cca3 == code || c.cioc === code)
  return !!country && !!country.cca2 && (
    <img {...rest} src={ flags['flag_' + country.cca2] } />
  )
}
