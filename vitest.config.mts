import { defineConfig } from "vitest/config";

// Unit tests for the lib modules only — no component rendering, so no jsdom
// and no React plugin. tsconfigPaths is what makes the `@/` alias resolve.
export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
