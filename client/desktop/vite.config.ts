import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src/"),
    },
  },
  base: "./",
  build: {
    outDir: "dist/renderer",
  },
  // server: {
  //   port: 5173,
  //   strictPort: true,
  // },
});
