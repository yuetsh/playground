<template>
  <n-space class="actions" justify="space-between">
    <div>
      <n-button secondary @click="prev" v-if="step.current !== 0">
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
      <n-button
        secondary
        @click="next"
        v-if="step.current < props.lessons.length - 1"
      >
        下一个
      </n-button>
      <n-button @click="bingo" v-else>全部完成</n-button>
    </n-space>
  </n-space>
</template>
<script lang="ts" setup>
import { step, status, lesson, inputs } from "../composables"
import Lock from "../icons/Lock.vue"
import { storage } from "../utils/storage"
import { KEY_FINISHED, KEY_STEP } from "../utils/constants"
// @ts-ignore
import confetti from "canvas-confetti"
import { Lesson } from "../utils/types"

const props = defineProps<{
  lessons: Lesson[]
}>()

function prev() {
  const prevStep = step.current - 1
  if (prevStep <= -1) return
  step.current = prevStep
  status.success = step.last > prevStep
  status.error = false
  updateStorage(prevStep)
  inputs.value = []
}

function next() {
  checkAnswer()
  if (!status.success) {
    status.error = true
    storage.remove(KEY_FINISHED)
    return
  }
  const nextStep = step.current + 1
  if (step.current >= props.lessons.length - 1) return
  step.current = nextStep
  status.success = step.last > nextStep
  status.error = false
  updateStorage(nextStep)
  inputs.value = []
}

function bingo() {
  checkAnswer()
  if (!status.success) {
    status.error = true
    storage.remove(KEY_FINISHED)
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

function checkAnswer() {
  if (lesson.nonInteractive) {
    status.success = true
    return
  }
  const userAnswer = inputs.value.filter((it) => it !== "")
  status.success = userAnswer.toString() === lesson.answer!.toString()
}

function updateStorage(current: number) {
  storage.set(KEY_STEP, {
    current,
    last: current > step.last ? current : step.last,
  })
}
</script>

<style scoped>
.icon {
  transform: translateY(3px);
}

.actions {
  margin-top: 16px;
}
</style>
../store../composables
