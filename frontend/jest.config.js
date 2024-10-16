module.exports = {
  roots: ["<rootDir>"],
  collectCoverage: false,
  collectCoverageFrom: ["src/**/*.{js,jsx,ts,tsx}"],
  coverageDirectory: "coverage",
  preset: "ts-jest",
  transform: {
    "^.+\\.(tsx|js|ts)$": ["ts-jest", { isolatedModules: true }],
    "^.+\\.(js|jsx)$": "babel-jest",
    ".+\\.(png|scss|ttf)$": "<rootDir>/node_modules/jest-transform-stub",
  },

  transformIgnorePatterns: [
    "<rootDir>/node_modules/",
    "node_modules/(?!react-markdown)",
    "node_modules/(?!axios)",
  ],
  testEnvironment: "jsdom",
  setupFilesAfterEnv: [
    "<rootDir>/src/setupTests.ts",
    "<rootDir>/__tests__/setup.js",
  ],
  testRegex: "(/tests/.*|(\\.|/)(test|spec))\\.tsx?$",
  moduleDirectories: ["node_modules", "<rootDir>/src"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "ttf"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@services/(.*)$": "<rootDir>/src/services/$1",
    "^@components/(.*)$": "<rootDir>/src/components/$1",
    "^@pages/(.*)$": "<rootDir>/src/pages/$1",
    "^@validators/(.*)$": "<rootDir>/src/validators/$1",
    "^@global/(.*)$": "<rootDir>/src/global/$1",
  },
  testTimeout: 30000,
};
