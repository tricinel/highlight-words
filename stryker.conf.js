module.exports = function(config) {
  config.set({
    mutator: 'typescript',
    packageManager: 'yarn',
    reporters: ['clear-text', 'progress'],
    testRunner: 'jest',
    coverageAnalysis: 'off',
    tsconfigFile: 'tsconfig.json',
    mutate: ['src/**/*.ts', '!src/uid.ts', '!src/**/*.test.ts'],
    babel: {
      optionsFile: '.babelrc'
    }
  });
};
