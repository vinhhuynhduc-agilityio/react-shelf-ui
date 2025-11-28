import type { JestConfigWithTsJest } from "ts-jest";

const jestConfig: JestConfigWithTsJest = {
  roots: ["<rootDir>/src"],
  preset: "ts-jest",
  verbose: true,
  resetMocks: true,
  testEnvironment: "jsdom",
  moduleDirectories: ["node_modules", "src"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "^clsx$": "<rootDir>/__mocks__/clsx.ts",
  },
  setupFilesAfterEnv: ["<rootDir>/setupTests.ts"],

  coveragePathIgnorePatterns: [
    "<rootDir>/src/constants/",
    "<rootDir>/src/pages/index.ts",
    "<rootDir>/src/components/index.ts",
    "<rootDir>/src/components/common/index.ts",
  ],
};

export default jestConfig;
