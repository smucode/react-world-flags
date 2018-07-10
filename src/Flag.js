import React from 'react'
import flags from './flags'
import { getAlphaTwoCode } from './country'

export default props => {
  // eslint-disable-next-line fp/no-nil
  const { code, fallback = null, ...rest } = props
  const alphaTwo = getAlphaTwoCode(code)
  const flag = flags['flag_' + alphaTwo.replace('-', '_')]
  return flag ? <img {...rest} src={flag} /> : fallback
}
