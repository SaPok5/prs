/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/tests'], // Look for tests in src and a new tests directory
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx|js)',
    '**/?(*.)+(spec|test).+(ts|tsx|js)',
  ],
  transform: {
    '^.+\.(ts|tsx)$': ['ts-jest', {
      tsconfig: 'tsconfig.json', // Or your specific tsconfig for tests if you have one
    }],
  },
  moduleNameMapper: {
    // Handle module aliases (if you have them in tsconfig.paths)
    // e.g., '^@/(.*)$': '<rootDir>/src/$1'
    // Handle .js extensions in imports from .ts files
    '^(.*)\.js$': '$1',
  },
  // Automatically clear mock calls, instances, contexts and results before every test
  clearMocks: true,
  // The directory where Jest should output its coverage files
  coverageDirectory: "coverage",
  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: "v8",
};
