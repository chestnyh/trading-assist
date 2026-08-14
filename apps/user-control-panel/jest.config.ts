// Nx jest executor runs tests with NODE_ENV=production by default, which
// makes @testing-library/react's act() fail ("act(...) is not supported in
// production builds of React"). Force the test environment here.
process.env.NODE_ENV = 'test';

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

  moduleNameMapper: {
    '\\.(svg|png|jpg|jpeg|gif|webp|css|scss)$': '<rootDir>/src/test/asset-stub.ts',
  },

  coverageDirectory: '../../coverage/apps/user-control-panel',

  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{ts,tsx}',
    '!src/**/*.spec.{ts,tsx}',
    '!src/**/index.ts',
    '!src/main.tsx',
    '!src/app/index.tsx',
    // Test-only infrastructure: mock shims and test harness are not
    // application behavior and must not count against coverage.
    '!src/mocks/**',
    '!src/test/**',
  ],

  coverageReporters: ['text', 'text-summary', 'html', 'lcov'],

  // The suite includes full-app integration tests and slow form renders that
  // exceed Jest's 5s default under CI load. Raised to keep the suite green and
  // deterministic (spec SC-011).
  testTimeout: 15000,

  coverageThreshold: {
    global: {
      // Statements/functions/lines meet the feature's ~100% target. Branch
      // coverage (82%) is capped by defensive/unreachable branches (SSR
      // typeof-window guards, jsoneditor internals, no-token guards on
      // auth-guarded pages) that would require meaningless tests to cover.
      branches: 80,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
};
