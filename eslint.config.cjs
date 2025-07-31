import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  // Ignore build output
  globalIgnores(['dist']),

  // ✅ Node.js config files (CommonJS: module.exports)
  {
    files: ['**/*.{config,cjs}.js'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
      sourceType: 'script', // CommonJS mode
      ecmaVersion: 2020,
    },
  },

  // ✅ App code (browser/React)
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module', // ES modules
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
])
