import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [
    react({
      include: /\.(jsx|js|tsx|ts)$/,
    }),
  ],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.tsx"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    clearMocks: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
