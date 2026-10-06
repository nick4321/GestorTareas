module.exports = {
  preset: 'jest-expo',
  testMatch: ['<rootDir>/src/**/*.test.js'],
  collectCoverageFrom: [
    'src/utils/validators.js',
    'src/services/autenticacion.js',
    'src/components/TaskItem.js',
  ],
  coverageDirectory: 'coverage',
};
