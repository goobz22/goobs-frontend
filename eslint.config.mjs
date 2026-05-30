import { defineConfig, globalIgnores } from 'eslint/config'
import { fixupConfigRules } from '@eslint/compat'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

// eslint-config-next still bundles eslint-plugin-react (7.37.x), which calls
// context methods removed in ESLint 10 (getFilename → filename, etc.). Wrap the
// Next configs with @eslint/compat's fixupConfigRules, which re-adds those
// removed methods to each rule's context so the v9-era plugin runs under
// ESLint 10. Remove once eslint-plugin-react ships native ESLint 10 support
// (tracked: jsx-eslint/eslint-plugin-react#3977).
const eslintConfig = defineConfig([
  ...fixupConfigRules(nextVitals),
  ...fixupConfigRules(nextTs),
  globalIgnores([
    'node_modules/**',
    '.next/**',
    '.storybook/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    // Generated build artifacts: `tsc` emits declaration/JS files next to the
    // sources (declaration:true, noEmit:false, no outDir) and .gitignore
    // ignores them. eslint-config-next 16.2.6 stopped auto-ignoring .d.ts, so
    // ignore the generated declarations here too — `var` is valid in a .d.ts.
    'src/**/*.d.ts',
    'src/**/*.d.ts.map',
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
