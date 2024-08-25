module.exports = {
    roots: ['<rootDir>'],
    transform: {
      '^.+\.(t|j)s$': 'ts-jest',
    },
    moduleFileExtensions: ['js', 'json', 'ts'],
    testEnvironment: 'node',
    testMatch: ['**/*.e2e-spec.ts'], 
    verbose: true,
  };