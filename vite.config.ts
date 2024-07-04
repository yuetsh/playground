import legacy from "@vitejs/plugin-legacy"
import vue from "@vitejs/plugin-vue"
import { defineConfig } from "vite"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), legacy({ targets: ["chrome 66", "not IE 11"] })],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          md: ["marked"],
          hljs: ["highlight.js"],
          confetti: ["canvas-confetti"],
        },
      },
    },
  },
})
