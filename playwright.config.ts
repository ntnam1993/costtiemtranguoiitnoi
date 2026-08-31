import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  retries: 0,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:4173",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "npm run preview",
    port: 4173,
    reuseExistingServer: false,
  },
  projects: [
    {
      name: "iphone-14-pro",
      use: {
        browserName: "chromium",
        viewport: { width: 393, height: 852 },
        deviceScaleFactor: 3,
        hasTouch: true,
        isMobile: true,
      },
    },
    { name: "desktop-chrome", use: { ...devices["Desktop Chrome"] } },
  ],
});
