import { defineConfig } from "@rsbuild/core"
import { pluginVue } from "@rsbuild/plugin-vue"

export default defineConfig({
  plugins: [pluginVue()],
  html: {
    template: "./index.html",
  },
  source: {
    entry: {
      index: "./src/main.ts",
    },
  },
  performance: {
    chunkSplit: {
      strategy: "split-by-experience",
      forceSplitting: {
        "lib-ui": /node_modules[\\/]naive-ui/,
        "lib-marked": /node_modules[\\/]marked/,
        "lib-hljs": /node_modules[\\/]highlight.js/,
        "lib-confetti": /node_modules[\\/]canvas-confetti/,
      },
    },
  },
})
