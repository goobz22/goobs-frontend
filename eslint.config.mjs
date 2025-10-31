import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import globals from 'globals'

const eslintConfig = [
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
      'public/**',
      'src/data/**/*',
      '**/*.js',
      '**/*.mjs',
      '**/*.cjs',
      '**/*.d.ts',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'error',
      'no-unused-vars': 'off',
      'no-duplicate-imports': 'error',
      'linebreak-style': 'off', // Don't enforce line ending style - let .gitattributes handle it
      'eol-last': 'off', // Don't enforce newline at end of file
    },
  },
  {
    files: ['.storybook/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
]

export default eslintConfig
