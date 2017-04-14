import fs from 'fs'
import path from 'path'
import countries from 'svg-country-flags/countries.json'

const exports = Object.keys(countries).map(k => {
  const filename = k.toLowerCase()
  return `import flag_${k} from 'svg-country-flags/svg/${filename}.svg'\nexport { flag_${k} }`
})

const target = path.resolve(__dirname, '../src/flags.js')

fs.writeFileSync(target, exports.join('\n'))
