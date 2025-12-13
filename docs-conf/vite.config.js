import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { readFileSync } from 'fs'

// Custom plugin to handle SVG imports as data URLs
function svgDataUrlPlugin() {
  return {
    name: 'svg-data-url',
    enforce: 'pre',
    load(id) {
      if (id.endsWith('.svg')) {
        try {
          const svgContent = readFileSync(id, 'utf-8')
          const encoded = encodeURIComponent(svgContent)
            .replace(/'/g, '%27')
            .replace(/"/g, '%22')
          return `export default "data:image/svg+xml,${encoded}"`
        } catch {
          return 'export default ""'
        }
      }
    },
  }
}

export default defineConfig({
  plugins: [react(), svgDataUrlPlugin()],
  build: {
    outDir: resolve(__dirname, '../docs'),
    emptyOutDir: true,
  },
  root: resolve(__dirname),
})
