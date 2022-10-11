module.exports = {
  root: true,
  env: {
    node: true
  },
  plugins: ['prettier'],
  extends: [
    'plugin:vue/vue3-essential', // 防止错误或意外行为的规则
    'plugin:vue/vue3-strongly-recommended', // 加上大大提高代码可读性和/或开发体验的规则
    'plugin:vue/vue3-recommended', // 强制执行主观社区默认值的规则，以确保一致性
    'eslint:recommended',
    // '@vue/standard',
    // '@vue/eslint-config-prettier'
  ],
  parserOptions: {
    parser: '@babel/eslint-parser'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
  },
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)'
      ],
      env: {
        jest: true
      }
    }
  ]
}
