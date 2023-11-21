require('dotenv').config()
const { compilerOptions } = require('./tsconfig.json')
const { pathsToModuleNameMapper } = require('ts-jest')

module.exports = {
  bail: 1,
  clearMocks: true,
  coverageProvider: 'babel',
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: ['coverage', 'node_modules'],
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
  testPathIgnorePatterns: ['/node_modules/'],
  modulePathIgnorePatterns: ["<rootDir>/src/domain/helpers"],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>',
  }),
  transform: {
    '.+\\.ts$': 'ts-jest',
  },
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/test/prismaMock.ts'],
}
