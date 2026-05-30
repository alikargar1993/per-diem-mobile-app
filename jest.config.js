const preset = require('@react-native/jest-preset/jest-preset');

module.exports = {
  ...preset,
  setupFiles: [...preset.setupFiles, '<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    ...preset.moduleNameMapper,
    '^@assets/svg/.*\\.svg$': '<rootDir>/__mocks__/svgMock.tsx',
    '^@assets/(.*)$': '<rootDir>/assets/$1',
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.svg$': '<rootDir>/__mocks__/svgMock.tsx',
    '^react-redux$': '<rootDir>/node_modules/react-redux/dist/cjs/index.js',
  },
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|@react-navigation|@reduxjs|immer)/)',
  ],
};
