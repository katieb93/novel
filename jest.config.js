// jest.config.js

module.exports = {
    // Automatically clear mock calls, instances and results before every test
    clearMocks: true,
  
    // The test environment that will be used for testing
    testEnvironment: 'jsdom',
  
    // A map from regular expressions to paths to transformers
    transform: {
      '^.+\\.[tj]sx?$': 'babel-jest',  // Use Babel for transforming JS, JSX, TS, TSX files
    },
  
    // An array of regexp pattern strings that are matched against all source file paths, matched files will skip transformation
    transformIgnorePatterns: [
      '/node_modules/(?!axios|some-other-package)/',  // List packages that need to be transformed
    ],
  
    // A list of paths to modules that run some code to configure or set up the testing environment before each test
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],  // Add this file if you need additional setup (optional)
  };
  