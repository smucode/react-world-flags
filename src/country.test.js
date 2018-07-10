/* eslint-disable fp/no-nil */
/* eslint-disable better/explicit-return */
/* eslint-disable fp/no-unused-expression */

import { getAlphaTwoCode } from './country'

describe('getAlphaTwoCode', () => {
  it('supports alpha two as input', () => {
    const code = getAlphaTwoCode('NO')
    expect(code).toBe('NO')
  })
  it('supports lowercase alpha two as input', () => {
    const code = getAlphaTwoCode('no')
    expect(code).toBe('NO')
  })
  it('supports alpha three as input', () => {
    const code = getAlphaTwoCode('NOR')
    expect(code).toBe('NO')
  })
  it('supports lowercase alpha three as input', () => {
    const code = getAlphaTwoCode('Nor')
    expect(code).toBe('NO')
  })
  it('supports numeric input', () => {
    const code = getAlphaTwoCode(162)
    expect(code).toBe('CX')
  })
  it('supports numeric string input', () => {
    const code = getAlphaTwoCode('004')
    expect(code).toBe('AF')
  })
  it('supports non country codes', () => {
    const code = getAlphaTwoCode('GB-ENG')
    expect(code).toBe('GB-ENG')
  })
})
