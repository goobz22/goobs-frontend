import { defineConfig } from 'vite'
import { resolve } from 'path'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import tsConfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [
    react(),
    tsConfigPaths(),
    dts({
      include: ['src'],
    }),
  ],
  build: {
    lib: {
      entry: resolve('src', 'index.ts'),
      name: 'unlimited-components',
      formats: ['es'],
      fileName: format => `unlimited-components.${format}.js`,
    },
    rollupOptions: {
      // dependecies to exclude in our library bundle. ie: packages that are expected to be manually installed in the consumer repository
      external: [
        'react',
        'react-dom',
        '@emotion/react',
        '@emotion/styled',
        '@mui/icons-material',
        '@mui/material',
        '@mui/system',
        '@mui/x-data-grid-pro',
        // '@fontsource/inter',
        // '@fontsource/material-icons',
        // '@fontsource/roboto',
      ],
      output: {
        globals: {
          // will need more external dependecies here
          react: 'React',
        },
      },
    },
  },
})
