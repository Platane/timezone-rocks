module.exports = {
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/?(*.)+(spec|test).ts"],
  transform: {
    "\\.(jsx|ts|tsx)$": "@sucrase/jest-plugin",
  },
};
