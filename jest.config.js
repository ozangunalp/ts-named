module.exports = {
  transform: {
    '.(ts|tsx)': require.resolve('ts-jest/dist'),
  },
  transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx)$'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  collectCoverageFrom: ['src/**/*.{ts,tsx}'],
  testMatch: ['**/test/**/*.(spec|test).{ts,tsx}'],
  testURL: 'http://localhost',
  watchPlugins: [require.resolve('jest-watch-typeahead/filename'), require.resolve('jest-watch-typeahead/testname')],
};
