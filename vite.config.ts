import vue from "@vitejs/plugin-vue"
import { defineConfig } from "vite"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
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
