<template>
  <n-space vertical class="container">
    <n-space justify="space-between" align="center">
      <h2>徐越的代码闯关</h2>
      <n-space align="center">
        <span>{{ step.current + 1 }} / {{ lessons.length }}</span>
        <n-button @click="reset">清除</n-button>
      </n-space>
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
        <n-button ghost @click="prev" v-if="step.current !== 0">
          上一个
        </n-button>
      </div>
      <n-space align="center">
        <n-icon
          v-if="status.error"
          :component="Lock"
          size="20"
          color="#d03050"
          class="icon"
        />
        <n-button ghost @click="next" v-if="step.current < lessons.length - 1">
          下一个
        </n-button>
        <n-button @click="bingo" v-else>全部完成</n-button>
      </n-space>
    </n-space>
  </n-space>
</template>

<script setup lang="ts">
import { NButton, NInput, NSpace, NCode, NCard, NIcon } from "naive-ui"
import { reactive, ref, watchEffect } from "vue"
// @ts-ignore
import confetti from "canvas-confetti"

import { storage } from "./utils/storage"
import { Lesson, Step } from "./utils/types"
import lessons from "./data/python.json"
import Lock from "./components/Lock.vue"

const KEY_STEP = "step"
const KEY_FINISHED = "finished"
const RE = /^\$+$/gi

const status = reactive({
  success: true,
  error: false,
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

function initLesson() {
  const lessonData = lessons[step.current]
  lesson.title = lessonData.title
  lesson.content = lessonData.content
  lesson.blank = lessonData.blank ?? []
  lesson.answer = lessonData.answer ?? []
  lesson.nonInteractive = !!lessonData.nonInteractive
  lesson.code = lessonData.code ?? []
}

watchEffect(() => {
  const cached = storage.get<Step>(KEY_STEP) || { last: 0, current: 0 }
  step.current = cached.current
  step.last = cached.last

  initLesson()
  status.success = step.current < step.last || !!lesson.nonInteractive
  status.error = false
  inputs.value = []

  if (status.success || storage.get(KEY_FINISHED)) {
    let j = 0
    lesson.blank!.forEach((it, i) => {
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
  status.error = false
  updateStorage(prevStep)
}

function next() {
  checkAnswer()
  if (!status.success) {
    status.error = true
    return
  }
  const nextStep = step.current + 1
  if (step.current >= lessons.length - 1) return
  step.current = nextStep
  status.success = step.last > nextStep
  status.error = false
  updateStorage(nextStep)
}

function checkAnswer() {
  if (lesson.nonInteractive) return
  const userAnswer = inputs.value.filter((it) => it !== "")
  status.success = userAnswer.toString() === lesson.answer!.toString()
}

function bingo() {
  checkAnswer()
  if (!status.success) {
    status.error = true
    return
  }
  confetti({
    particleCount: 400,
    startVelocity: 30,
    gravity: 0.5,
    spread: 350,
    origin: { x: 0.5, y: 0.4 },
  })
  storage.set(KEY_FINISHED, true)
}

function reset() {
  storage.remove(KEY_STEP)
  storage.remove(KEY_FINISHED)
  status.success = true
  status.error = false
  step.current = 0
  step.last = 0
  initLesson()
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

.icon {
  transform: translateY(3px);
}

@media screen and (max-width: 800px) {
  .container {
    width: 100vw;
    padding: 16px;
  }
}
</style>
