import countries from 'world-countries'

export const getAlphaTwoCode = code => {
  const uc = String(code).toUpperCase()
  const country = countries.find(
    c => c.cca2 === uc || c.ccn3 === uc || c.cca3 == uc
  )
  return (country && country.cca2) || code
}
