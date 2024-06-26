import * as esbuild from 'esbuild'

const sharedConfig = {
  entryPoints: ['src/index.ts'],
  bundle: true,
  minify: true,
  sourcemap: true,
  target: ['es2020'],
  external: ['react', 'react-dom', 'next', '@mui/material', 'jotai'],
}

// ESM build
await esbuild.build({
  ...sharedConfig,
  format: 'esm',
  outfile: 'dist/index.mjs',
})

// CJS build
await esbuild.build({
  ...sharedConfig,
  format: 'cjs',
  outfile: 'dist/index.js',
})

console.log('Build complete')
