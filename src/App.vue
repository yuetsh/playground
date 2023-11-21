<template>
  <n-config-provider
    inline-theme-disabled
    :locale="zhCN"
    :date-locale="dateZhCN"
    :hljs="hljs"
    :theme-overrides="themeOverrides"
    :theme="isDark ? darkTheme : lightTheme"
  >
    <n-layout position="absolute">
      <n-layout-content>
        <n-space size="large" vertical class="container">
          <Header :count="count" />
          <Content />
          <Actions :count="count" />
        </n-space>
      </n-layout-content>
    </n-layout>
  </n-config-provider>
</template>

<script setup lang="ts">
import { computed, onMounted, watchEffect } from "vue"
import {
  zhCN,
  dateZhCN,
  NConfigProvider,
  NLayout,
  NLayoutContent,
  darkTheme,
  lightTheme,
} from "naive-ui"
import type { GlobalThemeOverrides } from "naive-ui"
import { usePreferredDark } from "@vueuse/core"
import shuffle from "lodash/shuffle"
import Header from "./components/Header.vue"
import Content from "./components/Content.vue"
import Actions from "./components/Actions.vue"
import { storage } from "./utils/storage"
import { Lesson, Level, Step, Type } from "./utils/types"
import { KEY_FINISHED, KEY_STEP, RE } from "./utils/constants"
import { step, status, lesson, inputs, chooses } from "./composables"
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
  Checkbox: {
    fontSizeMedium: "16px",
  },
  Radio: {
    fontSizeMedium: "16px",
  },
}

const isDark = usePreferredDark()

const count = computed(() => lessons[step.level].length)

onMounted(() => {
  status.success = step.current < step.last || lesson.skip
})

watchEffect(() => {
  const cached = storage.get<Step>(KEY_STEP) || {
    last: 0,
    current: 0,
    level: Level.basic,
  }
  step.current = cached.current
  step.last = cached.last
  step.level = cached.level

  const lessonData = lessons[step.level][step.current] as Lesson
  lesson.title = lessonData.title
  lesson.content = lessonData.content
  lesson.code = lessonData.code ?? []
  lesson.type = lessonData.type ?? Type.blank
  lesson.blank = lessonData.blank ?? []
  lesson.answer = lessonData.answer ?? []
  lesson.hint = lessonData.hint ?? ""
  lesson.skip = lesson.blank.length === 0

  if (lesson.type === Type.options) {
    // 把答案提取
    if (lesson.answer.length === 1) {
      // 单选题
      const alpha = lesson.answer[0] as string
      const index = alpha.toLowerCase().charCodeAt(0) - "a".charCodeAt(0)
      lesson.answer = [lesson.blank[index]]
    } else {
      const ans: string[] = []
      lesson.answer!.forEach((a) => {
        const alpha = a as string
        const index = alpha.toLowerCase().charCodeAt(0) - "a".charCodeAt(0)
        ans.push(lesson.blank[index])
      })
      lesson.answer = ans
    }
    // 把选项打乱
    lesson.blank = shuffle(lesson.blank)
  }

  // 重置用户输入框
  inputs.value = new Array(lesson.blank.length).fill("")

  // 重置选择题的选择
  chooses.value = lesson.answer.length === 1 ? "" : []

  // 刚开始没有做题的时候不用显示答案
  if (step.last === 0) return
  // 填充填空题的答案
  if (status.success || storage.get(KEY_FINISHED)) {
    if (lesson.type === Type.blank) {
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
    if (lesson.type === Type.options) {
      if (lesson.answer.length === 1) {
        // 单选题
        const index = lesson.blank.findIndex((b) => lesson.answer[0] === b)
        chooses.value = lesson.blank[index]
      } else {
        // 多选题
        const ans: string[] = []
        lesson.answer.forEach((a) => {
          const index = lesson.blank.findIndex((b) => a === b)
          ans.push(lesson.blank[index])
        })
        chooses.value = ans
      }
    }
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
