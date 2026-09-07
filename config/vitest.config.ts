import { defineConfig } from "vitest/config";
import path from "node:path";

const rootDir = path.resolve(__dirname, "..");
const srcDir = path.join(rootDir, "src");

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["src/tests/**/*.test.ts"],
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
