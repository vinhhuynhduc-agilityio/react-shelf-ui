import type { JestConfigWithTsJest } from 'ts-jest';

const jestConfig: JestConfigWithTsJest = {
  roots: ['<rootDir>/src'],
  preset: 'ts-jest',
  verbose: true,
  resetMocks: true,
  testEnvironment: 'jsdom',
  moduleDirectories: ['node_modules', 'src'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { useESM: true }],
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^ag-grid-community/styles': '<rootDir>/__mocks__/styleMock.ts',
    "^clsx$": "<rootDir>/__mocks__/clsx.ts",
  },
  transformIgnorePatterns: [
    'node_modules/(?!ag-grid-community)',
  ],
  setupFilesAfterEnv: ['<rootDir>/setupTests.ts']
};

export default jestConfig;
