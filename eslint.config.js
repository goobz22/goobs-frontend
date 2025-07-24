import js from '@eslint/js'
import tseslint from '@typescript-eslint/eslint-plugin'
import tseslintParser from '@typescript-eslint/parser'
import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import prettierPlugin from 'eslint-plugin-prettier'
import nextPlugin from '@next/eslint-plugin-next'
import unusedImports from 'eslint-plugin-unused-imports'
import _globals from 'globals'

// Combine globals from the 'globals' package:
const combinedGlobals = {
  ..._globals.browser,
  ..._globals.es2021,
  ..._globals.node,
}

export default [
  {
    files: ['**/*.{js,mjs,cjs,jsx,ts,tsx}'],

    plugins: {
      '@typescript-eslint': tseslint,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      prettier: prettierPlugin,
      '@next/next': nextPlugin,
      'unused-imports': unusedImports,
    },

    languageOptions: {
      parser: tseslintParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: combinedGlobals,
    },

    settings: {
      react: {
        version: 'detect',
      },
    },

    rules: {
      // Core ESLint rules
      'no-unused-vars': 'off',
      'no-undef': 'warn',
      'no-empty': 'warn',
      'no-unreachable': 'error',
      'no-unreachable-loop': 'error',
      'no-fallthrough': 'error',

      // unused-imports plugin rules (main feature)
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'error',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],

      // TypeScript rules (non-type-aware)
      '@typescript-eslint/no-unused-vars': 'off', // handled by unused-imports
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',

      // React rules
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/display-name': 'warn',
      'react/no-unescaped-entities': 'warn',

      // React Hooks
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'error',

      // Prettier
      'prettier/prettier': 'warn',

      // Misc
      'no-case-declarations': 'warn',
      'no-useless-catch': 'warn',
    },
  },
]
