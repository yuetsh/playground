<template>
  <n-config-provider
    inline-theme-disabled
    :locale="zhCN"
    :date-locale="dateZhCN"
    :hljs="hljs"
    :theme="darkTheme"
    :theme-overrides="themeOverrides"
  >
    <n-layout position="absolute" ref="wrap">
      <n-layout-content>
        <n-space size="large" vertical class="container">
          <Header :count="lessons.length" />
          <Content />
          <Actions :count="lessons.length" />
        </n-space>
      </n-layout-content>
    </n-layout>
  </n-config-provider>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, watchEffect } from "vue"
import { zhCN, dateZhCN, darkTheme } from "naive-ui"
import type { GlobalThemeOverrides } from "naive-ui"
import { useSwipe } from "@vueuse/core"
import Header from "./components/Header.vue"
import Content from "./components/Content.vue"
import Actions from "./components/Actions.vue"
import { storage } from "./utils/storage"
import { Step } from "./utils/types"
import { KEY_FINISHED, KEY_STEP, RE } from "./utils/constants"
import { step, status, lesson, inputs, next, prev } from "./composables"
import lessons from "./data/python.json"

import hljs from "highlight.js/lib/core"
import python from "highlight.js/lib/languages/python"
// import c from "highlight.js/lib/languages/c"

hljs.registerLanguage("python", python)
// hljs.registerLanguage("c", c)

const themeOverrides: GlobalThemeOverrides = {
  common: {
    fontSize: "16px",
  },
  Card: {
    titleFontSizeMedium: "20px",
  },
  Input: {
    fontSizeMedium: "16x",
  },
  Code: {
    fontSize: "16px",
  },
}

const wrap = ref(null)
const { direction } = useSwipe(wrap)

onMounted(() => {
  status.success = step.current < step.last || !!lesson.nonInteractive
})

watchEffect(() => {
  const cached = storage.get<Step>(KEY_STEP) || { last: 0, current: 0 }
  step.current = cached.current
  step.last = cached.last

  const lessonData = lessons[step.current]
  lesson.title = lessonData.title
  lesson.content = lessonData.content
  lesson.blank = lessonData.blank || []
  lesson.answer = lessonData.answer || []
  lesson.nonInteractive = !!lessonData.nonInteractive
  lesson.code = lessonData.code || []

  // 重置用户输入框
  inputs.value = new Array(lesson.blank.length).fill("")

  // 显示答案
  // 刚开始
  if (step.last === 0) return
  if (status.success || storage.get(KEY_FINISHED)) {
    let j = 0
    lesson.blank.forEach((it, i) => {
      if (it.match(RE)) {
        const a = lesson.answer[j++]
        if (Array.isArray(a)) {
          inputs.value[i] = a[0]
        } else {
          inputs.value[i] = a
        }
      }
    })
  }
})

watch(direction, () => {
  if (direction.value === "left") {
    next(lessons.length)
  }
  if (direction.value === "right") {
    prev()
  }
})
</script>

<style scoped>
.container {
  box-sizing: border-box;
  width: 60vw;
  max-width: 800px;
  padding: 0 16px 16px;
  margin: 0 auto;
}

@media screen and (max-width: 800px) {
  .container {
    width: 100vw;
    padding: 16px;
  }
}
</style>
