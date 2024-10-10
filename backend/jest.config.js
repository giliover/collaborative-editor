module.exports = {
  bail: true,
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.ts"],
  coverageDirectory: "<rootDir>/__tests__/coverage/",
  coveragePathIgnorePatterns: ["/node_modules/", "/db/"],
  coverageReporters: ["text", "lcov"],
  testEnvironment: "node",
  testMatch: ["<rootDir>/__tests__/**/*.spec.ts"],
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
};
