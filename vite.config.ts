import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      include: ['src'],
      exclude: ['**/*.stories.tsx', '**/*.stories.ts'],
    }),
    {
      name: 'add-use-client',
      generateBundle(options, bundle) {
        for (const fileName in bundle) {
          const chunk = bundle[fileName]
          if (chunk.type === 'chunk' && fileName.endsWith('.js')) {
            chunk.code = `'use client';\n${chunk.code}`
          }
        }
      },
    },
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'GoobsFrontend',
      formats: ['es', 'umd'],
      fileName: format => `goobs-frontend.${format}.js`,
    },
    cssCodeSplit: false,
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
      treeshake: {
        moduleSideEffects: true,
      },
    },
    minify: 'esbuild',
    sourcemap: true,
    target: 'esnext',
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
})
