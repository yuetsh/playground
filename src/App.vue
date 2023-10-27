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
        <n-space vertical class="container">
          <n-space justify="space-between" align="center">
            <h2>徐越的代码闯关</h2>
            <span>{{ step.current + 1 }} / {{ lessons.length }}</span>
          </n-space>
          <n-card>
            <template #header>{{ lesson.title }}</template>
            {{ lesson.content }}
          </n-card>
          <n-card
            v-if="lesson.nonInteractive"
            v-for="(item, index) in lesson.code"
            :key="index"
          >
            <n-code language="python" :code="item" show-line-numbers />
          </n-card>
          <n-card v-else>
            <span v-for="(item, index) in lesson.blank" :key="index">
              <span v-if="item.match(RE)">
                <n-input
                  placeholder=""
                  :style="{ width: 40 * item.length + 'px' }"
                  v-model:value="inputs[index]"
                />
              </span>
              <br v-else-if="item === '\\n'" />
              <n-code
                v-else
                inline
                :trim="false"
                language="python"
                class="code"
                :code="item"
              />
            </span>
          </n-card>
          <n-space justify="space-between">
            <div>
              <n-button @click="prev" v-if="step.current !== 0">
                上一个
              </n-button>
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
import { reactive, ref, watchEffect } from "vue"
// @ts-ignore
import confetti from "canvas-confetti"
import hljs from "highlight.js/lib/core"
import python from "highlight.js/lib/languages/python"
// import c from "highlight.js/lib/languages/c"
import { storage } from "./utils/storage"
import { Lesson, Step } from "./utils/types"
import lessons from "./data/python.json"

hljs.registerLanguage("python", python)
// hljs.registerLanguage("c", c)

const KEY_STEP = "step"
const KEY_FINISHED = "finished"
const RE = /^\$+$/gi
const status = reactive({
  success: true,
})
const lesson = reactive<Lesson>({
  title: "",
  content: "",
  blank: [],
  answer: [],
  nonInteractive: false,
  code: [],
})
const step = reactive({
  current: 0,
  last: 0,
})
const inputs = ref<string[]>([])

watchEffect(() => {
  const cached = storage.get<Step>(KEY_STEP) || { last: 0, current: 0 }
  step.current = cached.current
  step.last = cached.last

  const lessonData = lessons[step.current]

  lesson.title = lessonData.title
  lesson.content = lessonData.content
  lesson.blank = lessonData.blank ?? []
  lesson.answer = lessonData.answer ?? []
  lesson.nonInteractive = !!lessonData.nonInteractive
  lesson.code = lessonData.code ?? []

  status.success = step.current < step.last || !!lesson.nonInteractive

  inputs.value = []

  if (status.success || storage.get(KEY_FINISHED)) {
    let j = 0
    lesson.blank.forEach((it, i) => {
      if (it.match(RE)) {
        inputs.value[i] = lesson.answer![j++]
      }
    })
  }
})

function prev() {
  const prevStep = step.current - 1
  if (prevStep <= -1) return
  step.current = prevStep
  status.success = step.last > prevStep
  updateStorage(prevStep)
}

function next() {
  checkAnswer()
  if (!status.success) return
  const nextStep = step.current + 1
  if (step.current >= lessons.length - 1) return
  step.current = nextStep
  status.success = step.last > nextStep
  updateStorage(nextStep)
}

function checkAnswer() {
  if (lesson.nonInteractive) return
  const userAnswer = inputs.value.filter((it) => it !== "")
  status.success = userAnswer.toString() === lesson.answer!.toString()
}

function bingo() {
  checkAnswer()
  if (!status.success) return
  confetti({
    particleCount: 400,
    startVelocity: 30,
    gravity: 0.5,
    spread: 350,
    origin: { x: 0.5, y: 0.4 },
  })
  storage.set(KEY_FINISHED, true)
}

function updateStorage(current: number) {
  storage.set(KEY_STEP, {
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
