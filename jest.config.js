export default {
  testEnvironment: 'jsdom',
  resolver: '<rootDir>/jest/raw-resolver.cjs',
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      tsconfig: {
        target: 'ES2022',
        module: 'commonjs',
        esModuleInterop: true,
        isolatedModules: true,
      },
    }],
    '\\.(hbs|scss)$': '<rootDir>/jest/raw-transformer.cjs',
  },
};
