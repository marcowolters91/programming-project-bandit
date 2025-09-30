/// <reference types="vitest" />
import { defineConfig } from "vite";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    include: ["tests/**/*.test.js"],
    coverage: {
      reporter: ["text", "html"], 
      reportsDirectory: "./coverage",
    },
  },
});
