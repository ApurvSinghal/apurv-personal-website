import { defineConfig } from "vitest/config";
import path from "node:path";

const rootDir = path.resolve(__dirname, "..");
const srcDir = path.join(rootDir, "src");

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: [path.join(rootDir, "src/tests/setup.ts")],
    include: ["src/tests/**/*.test.ts", "src/tests/**/*.test.tsx"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
    },
  },
  resolve: {
    alias: {
      "@": srcDir,
    },
  },
});
