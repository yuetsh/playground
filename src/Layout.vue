<template>
  <n-config-provider
    inline-theme-disabled
    :locale="zhCN"
    :date-locale="dateZhCN"
    :hljs="hljs"
    :theme="darkTheme"
  >
    <n-layout position="absolute">
      <n-layout-content>
        <App />
      </n-layout-content>
    </n-layout>
  </n-config-provider>
</template>
<script lang="ts" setup>
import {
  zhCN,
  dateZhCN,
  darkTheme,
  NConfigProvider,
  NLayout,
  NLayoutContent,
} from "naive-ui"

import hljs from "highlight.js/lib/core"
import python from "highlight.js/lib/languages/python"
// import c from "highlight.js/lib/languages/c"

import App from "./App.vue"

hljs.registerLanguage("python", python)
// hljs.registerLanguage("c", c)
</script>
