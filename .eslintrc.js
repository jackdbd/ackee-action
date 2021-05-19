const github = {
  name: 'github',
  // the `plugin:github/recommended` preset configures 4 ESlint plugins.
  // https://github.com/github/eslint-plugin-github/blob/main/lib/configs/recommended.js
  // 1. https://github.com/github/eslint-plugin-github
  // 2. https://github.com/prettier/eslint-plugin-prettier
  // 3. https://github.com/mysticatea/eslint-plugin-eslint-comments
  // 4. https://github.com/benmosher/eslint-plugin-import
  extends: ['plugin:github/recommended'],
  // additional rules and preset overrides
  rules: {
    // in rare occasions I want to disable ESlint with eslint-disable, but I
    // definitely want to be reminded where this occurs.
    'eslint-comments/no-use': 'warn',
    'import/no-namespace': 'off'
  }
}

const jest = {
  name: 'jest',
  // https://github.com/jest-community/eslint-plugin-jest#rules
  extends: ['plugin:jest/recommended'],
  // additional rules and preset overrides
  rules: {
    // I quite like todos in tests. I wonder why this is not a default.
    'jest/prefer-todo': 'warn'
  }
}

const typescript = {
  name: '@typescript-eslint',
  // https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin#recommended-configs
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking'
  ],
  // https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/parser
  parser: '@typescript-eslint/parser',
  // additional rules and preset overrides. Many of these look like false
  // positives to me.
  // https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin#supported-rules
  rules: {
    '@typescript-eslint/no-unsafe-assignment': 'warn',
    '@typescript-eslint/no-unsafe-member-access': 'warn',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/restrict-template-expressions': 'warn'
  }
}

const config = {
  // https://eslint.org/docs/user-guide/configuring/language-options#specifying-environments
  env: {
    es6: true,
    node: true
  },

  extends: [
    // the `eslint:recommended` preset configure many rules
    // https://eslint.org/docs/rules/
    'eslint:recommended',
    ...github.extends,
    ...jest.extends,
    ...typescript.extends
  ],

  parser: typescript.parser,
  parserOptions: {
    project: ['./tsconfig.eslint.json']
  },

  plugins: [github.name, jest.name, typescript.name],

  rules: {
    ...github.rules,
    ...jest.rules,
    ...typescript.rules,
    'no-console': 'warn'
  }
}

module.exports = config
