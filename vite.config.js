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

function preserveUseClientForFlag() {
  return {
    name: 'preserve-use-client-flag',
    renderChunk(code, chunk) {
      if (chunk.facadeModuleId && chunk.facadeModuleId.endsWith('Flag.tsx')) {
        return `'use client';\n${code}`
      }
      return null
    },
  }
}

export default defineConfig(({ command }) => {
  const isTest = command === 'test'

  return {
    plugins: [
      ...(isTest ? [] : [svgDataUrlPlugin()]),
      ...(isTest ? [] : [preserveUseClientForFlag()]),
      ...(isTest ? [] : [dts({ rollupTypes: true })]),
    ],
    build: {
      lib: {
        entry: resolve(__dirname, 'src/main.ts'),
        formats: ['es'],
        // fileName: () => 'react-world-flags.js',
      },
      rollupOptions: {
        external: ['react', 'react-dom', 'react/jsx-runtime'],
        output: {
          format: 'es',
          chunkFileNames: 'flags/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash][extname]',
        },
        input: {
          main: 'src/main.ts',
          Flag: 'src/Flag.tsx',
          country: 'src/country.ts',
        },
        preserveModules: true,
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
