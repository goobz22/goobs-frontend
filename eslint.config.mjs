import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    'node_modules/**',
    '.next/**',
    '.storybook/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    'public/**',
    'src/data/**/*',
    'fix-explicit-any.ts',
    'eslint.config.mjs',
    'scripts/**',
  ]),
  {
    rules: {
      // TypeScript-aware unused vars rule - set to warn to allow incremental cleanup
      '@typescript-eslint/no-unused-vars': 'error',
      // Disable no-explicit-any - too many existing usages to fix immediately
      '@typescript-eslint/no-explicit-any': 'off',
      // Disable empty object type - use Record<string, never> or {} as needed
      '@typescript-eslint/no-empty-object-type': 'error',
      // Disable React Compiler plugin rules - too strict for current codebase
      'react-hooks/purity': 'off',
      'react-hooks/immutability': 'error',
      'react-hooks/static-components': 'error',
      'react-hooks/set-state-in-render': 'error',
      'no-duplicate-imports': 'error',
      // Flag comments mentioning legacy or compat patterns
      'no-warning-comments': [
        'error',
        {
          terms: [
            'backward compatibility',
            'backwards compatibility',
            'legacy alias',
            'for backward',
            'for backwards',
          ],
          location: 'anywhere',
        },
      ],
    },
  },
])

export default eslintConfig
