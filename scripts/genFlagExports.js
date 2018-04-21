import fs from "fs";
import path from "path";
import countries from "svg-country-flags/countries.json";

const imports = Object.keys(countries).map(k => {
  const key = k.replace("-", "_");
  return `import flag_${key} from 'svg-country-flags/svg/${k.toLowerCase()}.svg'`;
});

const exports = Object.keys(countries).map(k => {
  const key = k.replace("-", "_");
  return `flag_${key}`;
});

const target = path.resolve(__dirname, "../src/flags.js");

fs.writeFileSync(
  target,
  imports.join("\n") + `\nexport default {${exports.join(", ")}}`
);
