import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: { alias: { "@": import.meta.dirname } },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "json-summary"],
      include: ["components/**/*.tsx", "lib/**/*.ts"],
      exclude: ["lib/gemini.ts", "lib/types.ts"],
      thresholds: { lines: 50, functions: 45, statements: 50, branches: 35 },
    },
  },
});
