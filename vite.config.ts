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
      // ESM config (`"type": "module"`): `__dirname` is a CJS global that Vite's
      // upcoming default `configLoader: 'native'` cannot provide (vite ≥8.2 warns).
      entry: resolve(import.meta.dirname, 'src/index.ts'),
      name: 'GoobsFrontend',
      formats: ['es', 'umd'],
      fileName: format => `goobs-frontend.${format}.js`,
    },
    cssCodeSplit: false,
    // Vite 8 (rolldown): `build.rollupOptions` is a @deprecated alias of
    // `build.rolldownOptions` (Vite shims `rolldownOptions ??= rollupOptions`).
    // Rolldown's `checks` is an INPUT option, so it lives here — a top-level
    // `checks` key is not a Vite UserConfig field and was silently ignored.
    rolldownOptions: {
      checks: {
        // Rolldown's plugin-timing heuristic flags any build where plugins
        // dominate wall-clock. For a library build that is ALWAYS the case:
        // unplugin-dts (declaration emit — required package output) is ~75%
        // of the build. The warning carries no actionable signal here.
        pluginTimings: false,
      },
      external: [/^react(\/.*)?$/, /^react-dom(\/.*)?$/, /^next(\/.*)?$/],
      output: {
        globals: {
          react: 'React',
          'react/jsx-runtime': 'ReactJSXRuntime',
          'react-dom': 'ReactDOM',
          'next/link': 'NextLink',
          'next/image': 'NextImage',
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
