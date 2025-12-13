import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { readFileSync } from 'fs'
import { resolve } from 'path'

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

export default defineConfig(({ command }) => {
  const isTest = command === 'test'

  return {
    plugins: [
      ...(isTest ? [] : [svgDataUrlPlugin()]),
      ...(isTest ? [] : [dts({ rollupTypes: true })]),
    ],
    build: {
      lib: {
        entry: resolve(__dirname, 'src/main.ts'),
        formats: ['es'],
        fileName: () => 'react-world-flags.js',
      },
      rollupOptions: {
        external: ['react', 'react-dom', 'react/jsx-runtime'],
        output: {
          format: 'es',
          chunkFileNames: 'flags/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash][extname]',
        },
      },
      outDir: 'dist',
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: [],
    },
  }
})
