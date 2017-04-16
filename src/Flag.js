import React from 'react'
import flags from './flags'
import { getAlphaTwoCode } from './country'

export default props => {
  const { code, ...rest } = props
  const alphaTwo = getAlphaTwoCode(code)
  return !!alphaTwo && (
    <img {...rest} src={ flags['flag_' + alphaTwo] } />
  )
}
