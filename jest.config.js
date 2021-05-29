const config = {
  clearMocks: true,
  globals: {
    // https://huafu.github.io/ts-jest/user/config/
    'ts-jest': {
      tssonfig: 'tsconfig.json'
    }
  },
  moduleFileExtensions: ['js', 'ts'],
  setupFilesAfterEnv: ['./jest.setup.js'],
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'],
  testRunner: 'jest-circus/runner',
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  verbose: true
}

// console.log('=== jest config ===', config)

module.exports = config
