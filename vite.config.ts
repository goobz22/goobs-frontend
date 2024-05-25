import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'
import tsConfigPaths from 'vite-tsconfig-paths'
import { libInjectCss } from 'vite-plugin-lib-inject-css'

export default defineConfig({
  plugins: [
    react(),
    tsConfigPaths(),
    dts({
      include: ['src'],
      insertTypesEntry: true,
    }),
    libInjectCss(),
  ],
  build: {
    sourcemap: false, // Disable sourcemap generation
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'goobs-repo',
      formats: ['es', 'umd'],
      fileName: format => `goobs-repo.${format}.js`,
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        '@mui/material',
        '@mui/icons-material',
        'jotai',
        '@emotion/react', 
      ],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          '@mui/material': 'MaterialUI',
          '@mui/icons-material': 'MaterialIcons',
          jotai: 'Jotai',
          '@emotion/react': 'emotionReact',
        },
      },
    },
  },
  optimizeDeps: {
    include: ['@mui/material', '@mui/icons-material', 'jotai'],
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
})