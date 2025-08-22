import js from '@eslint/js'
import vueTsEslintConfig from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'

export default [
  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  ...vueTsEslintConfig(),
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      '.git/**',
      'coverage/**',
      '*.d.ts',
      'tsconfig.tsbuildinfo'
    ]
  }
]