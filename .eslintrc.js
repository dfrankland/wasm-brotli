module.exports = {
  env: {
    node: true,
  },
  parser: 'babel-eslint',
  extends: ['airbnb-base', 'prettier'],
  plugins: ['prettier', 'jest'],
  rules: {
    'prettier/prettier': 'error',
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: ['benchmark.ts', 'update-package-json.ts'],
      },
    ],
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.ts'],
      },
    },
  },
  overrides: [
    {
      files: ['*.ts'],
      parser: '@typescript-eslint/parser',
      extends: [
        'plugin:@typescript-eslint/recommended',
        'prettier/@typescript-eslint',
      ],
      plugins: ['@typescript-eslint'],
    },
    {
      files: ['**/__tests__/**/*'],
      env: {
        jest: true,
      },
    },
  ],
};
