/* eslint-disable fp/no-nil */
/* eslint-disable better/explicit-return */
/* eslint-disable fp/no-unused-expression */

import flags from './flags'

describe('flags', () => {
  it('exports the norwegian flag', () => {
    expect(flags.flag_NO).toBeDefined()
  })
  it('exports the EU flag', () => {
    expect(flags.flag_EU).toBeDefined()
  })
})
