// jest.config.js
module.exports = {
  testEnvironment: 'node', // Important for Node.js tests
  testMatch: [
    '**/unittests/**/*.js?(x)', // Default test location
    '**/?(*.)+(spec|test).js?(x)', // Default test location
  ],
}
