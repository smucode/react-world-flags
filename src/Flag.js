/* eslint-disable fp/no-nil */
/* eslint-disable fp/no-rest-parameters */
/* eslint-disable better/no-ifs */

import React from 'react'
import flags from './flags'
import { getAlphaTwoCode } from './country'

export default (props) => {
  const { code, fallback = null, ...rest } = props
  if (!code) return fallback
  const alphaTwo = getAlphaTwoCode(code)
  const flag = flags['flag_' + alphaTwo.replace('-', '_')]
  return flag ? <img {...rest} src={flag} /> : fallback
}
