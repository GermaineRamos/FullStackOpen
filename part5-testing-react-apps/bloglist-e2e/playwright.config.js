module.exports = {
  testDir: "tests",
  testMatch: "**/*.spec.js",
  timeout: 30000,
  use: {
    baseURL: "http://localhost:5173",
    headless: true,
    viewport: { width: 1280, height: 720 },
    video: "off",
    screenshot: "off",
  },
};
