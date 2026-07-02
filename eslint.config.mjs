import { defineConfig, globalIgnores } from 'eslint/config'
import { fixupConfigRules } from '@eslint/compat'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import storybook from 'eslint-plugin-storybook'

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
  ...storybook.configs['flat/recommended'],
  {
    // Peer-authored, still-untracked story batch (repo rule R13: flag, never
    // edit another agent's in-flight files). They pre-date the Wave-0 standard;
    // remove this whole block once their author commits + migrates them.
    files: [
      'src/components/Card/card.stories.tsx',
      'src/components/Filter/Section/filterSection.stories.tsx',
      'src/components/Metric/Accordion/metricsAccordion.stories.tsx',
    ],
    rules: {
      'storybook/no-renderer-packages': 'off',
      'storybook/no-redundant-story-name': 'off',
    },
  },
  {
    files: ['src/**/*.stories.tsx'],
    // Peer-authored, still-untracked story batch (repo rule R13: flag, never
    // edit another agent's in-flight files). These three contain the banned
    // patterns below; remove this carve-out once their author commits them
    // and the patterns are migrated.
    ignores: [
      'src/components/Card/card.stories.tsx',
      'src/components/Filter/Section/filterSection.stories.tsx',
      'src/components/Metric/Accordion/metricsAccordion.stories.tsx',
    ],
    rules: {
      'no-restricted-properties': [
        'error',
        {
          object: 'window',
          property: 'alert',
          message:
            'Banned in stories — wedges any interaction runner. Use fn() from storybook/test.',
        },
        {
          object: 'window',
          property: 'confirm',
          message: 'Banned in stories — use fn() from storybook/test.',
        },
        {
          object: 'window',
          property: 'prompt',
          message: 'Banned in stories — use fn() from storybook/test.',
        },
      ],
      'no-restricted-globals': [
        'error',
        {
          name: 'alert',
          message:
            'Banned in stories — wedges any interaction runner. Use fn() from storybook/test.',
        },
        {
          name: 'confirm',
          message: 'Banned in stories — use fn() from storybook/test.',
        },
        {
          name: 'prompt',
          message: 'Banned in stories — use fn() from storybook/test.',
        },
      ],
      'no-restricted-syntax': [
        'error',
        {
          selector:
            "Property[key.name='backgrounds'] Property[key.name='default']",
          message:
            'parameters.backgrounds.default is a dead SB8 API the SB10 runtime ignores. Pin the canvas via story globals: { backgrounds: { value: ... } }.',
        },
        {
          selector: "Property[key.name='tags'] Literal[value='autodocs']",
          message:
            'autodocs is tagged globally in .storybook/preview.tsx. Never re-tag per meta.',
        },
      ],
    },
  },
  {
    files: ['.storybook/**/*.{ts,tsx}'],
    rules: { 'storybook/no-uninstalled-addons': 'error' },
  },
])

export default eslintConfig
