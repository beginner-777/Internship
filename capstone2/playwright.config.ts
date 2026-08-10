import { defineConfig, devices } from "@playwright/test";

const testPort = 3100;
const testBaseUrl = `http://127.0.0.1:${testPort}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  expect: { timeout: 10_000 },
  retries: process.env.CI ? 2 : 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: testBaseUrl,
    trace: "retain-on-failure",
  },
  webServer: {
    command: process.env.TRACE_SANDBOX_MEMORY_FALLBACK === "1"
      ? `NODE_OPTIONS='--require=./scripts/memory-usage-fallback.cjs' npm run build && NODE_OPTIONS='--require=./scripts/memory-usage-fallback.cjs' npm run start -- --port ${testPort}`
      : `npm run build && npm run start -- --port ${testPort}`,
    url: `${testBaseUrl}/api/health`,
    reuseExistingServer: false,
    timeout: 180_000,
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["iPhone 13"], browserName: "chromium" } },
  ],
});
