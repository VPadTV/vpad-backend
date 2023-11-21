require('dotenv').config()
const { compilerOptions } = require('./tsconfig.json')
const { pathsToModuleNameMapper } = require('ts-jest')

module.exports = {
  bail: 1,
  clearMocks: true,
  coverageProvider: 'babel',
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: ['coverage', 'node_modules'],
  collectCoverageFrom: [
    'src/domain/functions/**/*',
    'src/infra/gateways/jwt.ts',
  ],
  coverageReporters: ['json', 'text', 'lcov', 'clover'],
  coverageThreshold: {
    global: {
      branches: 5,
      functions: 5,
      lines: 5,
      statements: 5,
    },
  },
  moduleDirectories: ['node_modules'],
  moduleFileExtensions: ['js', 'json', 'ts', 'node'],
  coveragePathIgnorePatterns: [
    '<rootDir>/src/domain/helpers'
  ],
  testPathIgnorePatterns: ['/node_modules/'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>',
  }),
  transform: {
    '.+\\.ts$': 'ts-jest',
  },
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/test/prismaMock.ts'],
}
