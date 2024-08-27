import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  build: {
    rollupOptions: {
      output: {
        dir: "dist/",
        entryFileNames: "content-script.js",
        assetFileNames: "styles.css",
      },
    },
  },

  preview: {
    port: 3000,
  },

  server: {
    port: 3001,
  },

  plugins: [svgr(), react()],
});
