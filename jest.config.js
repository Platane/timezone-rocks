module.exports = {
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/?(*.)+(spec|test).ts"],
  transform: { "\\.(js|jsx|ts|tsx)$": "@sucrase/jest-plugin" },
};
