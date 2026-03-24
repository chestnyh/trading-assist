export default {
  displayName: 'user-control-panel',
  preset: '../../jest.preset.cjs',

  testEnvironment: 'jsdom',

  setupFilesAfterEnv: ['<rootDir>/src/test/setupTests.ts'],

  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nx/react/plugins/jest',
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nx/react/babel'] }],
  },

  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],

  coverageDirectory: '../../coverage/apps/user-control-panel',

  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{ts,tsx}',
    '!src/**/*.spec.{ts,tsx}',
    '!src/**/index.ts',
    '!src/main.tsx',
    '!src/app/index.tsx',
  ],

  coverageReporters: ['text', 'text-summary', 'html', 'lcov'],

  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};
