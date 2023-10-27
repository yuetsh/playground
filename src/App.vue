<template>
  <n-config-provider
    inline-theme-disabled
    :locale="zhCN"
    :date-locale="dateZhCN"
    :hljs="hljs"
    :theme="darkTheme"
  >
    <n-layout  position="absolute">
      <n-layout-content>
        <n-space vertical class="container">
          <p>{{ step.current + 1 }} / {{ lessons.length }}</p>
          <n-card>
            <template #header>{{ lesson.title }}</template>
            {{ lesson.content }}
          </n-card>

          <n-card v-if="lesson.interactive && lesson.blank.length">
            <span v-for="(item, index) in lesson.blank" :key="index">
              <span v-if="item.includes('$')">
                <n-input
                  placeholder=""
                  autofocus
                  :style="{ width: 50 * item.length + 'px' }"
                  v-model:value="inputs[index]"
                />
              </span>
              <br v-else-if="item === '\\n'" />
              <n-code
                inline
                :trim="false"
                language="python"
                class="code"
                :code="item"
                v-else
              ></n-code>
            </span>
          </n-card>

          <n-space justify="space-between">
            <div>
              <n-button @click="prev" v-if="step.current !== 0"
                >上一个</n-button
              >
            </div>
            <div>
              <n-button @click="next" v-if="step.current < lessons.length - 1">
                下一个
              </n-button>
              <n-button @click="bingo" v-else>全部完成</n-button>
            </div>
          </n-space>
        </n-space>
      </n-layout-content>
    </n-layout>
  </n-config-provider>
</template>

<script setup lang="ts">
import { zhCN, dateZhCN, darkTheme } from "naive-ui"
import { computed, reactive, ref, watchEffect } from "vue"
// @ts-ignore
import confetti from "canvas-confetti"
import hljs from "highlight.js/lib/core"
import python from "highlight.js/lib/languages/python"
import c from "highlight.js/lib/languages/c"
import { storage } from "./utils/storage"
import { Lesson, Step } from "./utils/types"
import lessons from "./data/python.json"

hljs.registerLanguage("python", python)
hljs.registerLanguage("c", c)

// const themeOverrides: GlobalThemeOverrides = {
  // common: {
  //   fontSize: "24px",
  // },
  // Card: {
  //   titleFontSizeMedium: '30px'
  // },
  // Input: {
  //   fontSizeMedium: '24px'
  // }
// }

const KEY = "step"
const status = reactive({
  success: false,
  error: false,
})
const lesson = reactive<Lesson>({
  title: "",
  content: "",
  blank: [],
  answer: [],
  interactive: true,
})
const step = reactive({
  current: 0,
  last: 0,
})
const inputs = ref<string[]>([])

watchEffect(() => {
  const cached = storage.get<Step>(KEY) || { last: 0, current: 0 }
  step.current = cached.current
  step.last = cached.last

  const lessonData = lessons[step.current]

  lesson.title = lessonData.title
  lesson.content = lessonData.content
  lesson.blank = lessonData.blank
  lesson.answer = lessonData.answer

  status.success = step.current < step.last || lesson.interactive === false

  inputs.value = []
})

const userAnswers = computed(() => inputs.value.filter((it) => it !== ""))

function prev() {
  const prevStep = step.current - 1
  if (prevStep <= -1) return
  step.current = prevStep
  status.success = step.last > prevStep
  status.error = false
  updateStorage(prevStep)
}

function next() {
  if (!status.success) {
    status.error = true
  }
  const nextStep = step.current + 1
  if (step.current >= lessons.length - 1) return
  step.current = nextStep
  status.success = step.last > nextStep
  status.error = false
  updateStorage(nextStep)
}

function bingo() {
  console.log(userAnswers.value)
  confetti({
    particleCount: 400,
    startVelocity: 30,
    gravity: 0.5,
    spread: 350,
    origin: {
      x: 0.5,
      y: 0.4,
    },
  })
}

function updateStorage(current: number) {
  storage.set(KEY, {
    current,
    last: current > step.last ? current : step.last,
  })
}
</script>

<style>
.container {
  box-sizing: border-box;
  width: 50vw;
  height: 100vh;
  max-width: 800px;
  margin: 0 auto;
}

.code {
  white-space: pre;
}

@media screen and (max-width: 800px) {
  .container {
    width: 100vw;
    padding: 16px;
  }
}
</style>
