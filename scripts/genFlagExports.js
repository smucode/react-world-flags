import fs from 'fs'
import path from 'path'
import countries from 'svg-country-flags/countries.json'

const imports = Object.keys(countries).map(k => {
  return `import flag_${k} from 'svg-country-flags/svg/${k.toLowerCase()}.svg'`
})

const exports = Object.keys(countries).map(k => {
  return `flag_${k}`
})

const target = path.resolve(__dirname, '../src/flags.js')

fs.writeFileSync(target, imports.join('\n') + `\nexport default {${exports.join(', ')}}`)
