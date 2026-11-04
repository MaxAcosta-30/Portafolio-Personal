import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  workers: 2,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:3100",
    browserName: "chromium",
    launchOptions: {
      executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined,
    },
    trace: "retain-on-failure",
  },
  projects: [
    { name: "content", testMatch: "content.spec.ts" },
    { name: "desktop", testMatch: ["design-system.spec.ts", "homepage.spec.ts", "home-motion.spec.ts", "hangar.spec.ts", "taskflow.spec.ts"], use: { viewport: { width: 1440, height: 800 } } },
    { name: "mobile", testMatch: ["design-system.spec.ts", "homepage.spec.ts", "home-motion.spec.ts", "hangar.spec.ts", "taskflow.spec.ts"], use: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } },
  ],
  webServer: {
    command: "node node_modules/serve/build/main.js out --listen tcp://127.0.0.1:3100 --no-clipboard",
    url: "http://127.0.0.1:3100/design-system",
    reuseExistingServer: false,
  },
});
