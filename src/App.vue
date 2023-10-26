<template>
  <n-config-provider :locale="zhCN" :date-locale="dateZhCN" :hljs="hljs">
    <n-space vertical class="container">
      <p>{{ step.current + 1 }} / {{ lessons.length }}</p>
      <h2 class="title">{{ lesson.title }}</h2>
      <p>{{ lesson.content }}</p>

      <div>
        <span v-for="(item, index) in lesson.blank" :key="index">
          <span v-if="item.includes('$')">
            <n-input
              placeholder=""
              autofocus
              :style="{ width: 50 * item.length + 'px' }"
              v-model="inputs[index]"
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
      </div>

      <n-space justify="space-between">
        <div>
          <n-button @click="prev" v-if="step.current !== 0">上一步</n-button>
        </div>
        <div>
          <n-button @click="next" v-if="step.current < lessons.length - 1">
            下一步
          </n-button>
          <n-button @click="bingo" v-else>全部完成</n-button>
        </div>
      </n-space>
    </n-space>
  </n-config-provider>
</template>

<script setup lang="ts">
import { zhCN, dateZhCN } from "naive-ui"
import { reactive, ref, watchEffect } from "vue"
import hljs from "highlight.js/lib/core"
import python from "highlight.js/lib/languages/python"
import c from "highlight.js/lib/languages/c"
import { storage } from "./utils/storage"
import { Step } from "./utils/types"
import lessons from "./data/python.json"

hljs.registerLanguage("python", python)
hljs.registerLanguage("c", c)

const KEY = "step"
const status = reactive({
  success: false,
  error: false,
})
const lesson = reactive({
  title: "",
  content: "",
  blank: [""],
  answer: [""],
})
const step = reactive({
  current: 0,
  last: 0,
})
const inputs = ref([''])

watchEffect(() => {
  const cached = storage.get<Step>(KEY) || { last: 0, current: 0 }
  step.current = cached.current
  step.last = cached.last

  lesson.title = lessons[step.current].title
  lesson.content = lessons[step.current].content
  lesson.blank = lessons[step.current].blank

  status.success = step.current < step.last
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

function bingo() {}

function updateStorage(current: number) {
  storage.set(KEY, {
    current,
    last: current > step.last ? current : step.last,
  })
}
</script>

<style>
.container {
  width: 40vw;
  min-width: 800px;
  margin: 0 auto;
}

.title {
  text-align: center;
}

.code {
  white-space: pre;
}
</style>
