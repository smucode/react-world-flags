import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'fs'
import { resolve } from 'path'

// Custom plugin to handle SVG imports as data URLs
function svgDataUrlPlugin() {
  return {
    name: 'svg-data-url',
    load(id) {
      if (id.endsWith('.svg')) {
        const svgContent = readFileSync(id, 'utf-8')
        // Encode SVG as data URL (no quotes, similar to svg-url-loader with noquotes: true)
        const encoded = encodeURIComponent(svgContent)
          .replace(/'/g, '%27')
          .replace(/"/g, '%22')
        return `export default "data:image/svg+xml,${encoded}"`
      }
    },
  }
}

export default defineConfig({
  root: __dirname,
  plugins: [react(), svgDataUrlPlugin()],
  build: {
    outDir: '.',
    emptyOutDir: false,
    rollupOptions: {
      input: resolve(__dirname, 'index.html'),
      output: {
        entryFileNames: 'build.js',
        format: 'iife',
        inlineDynamicImports: true,
      },
    },
  },
})
