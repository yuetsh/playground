import { computed, reactive, ref } from "vue"
import { Lesson } from "./utils/types"
import { KEY_FINISHED, KEY_STEP } from "./utils/constants"
import { storage } from "./utils/storage"
// @ts-ignore
import confetti from "canvas-confetti"

export const status = reactive({
  success: false,
  error: false,
})
export const lesson = reactive<Lesson>({
  title: "",
  content: "",
  blank: [],
  answer: [],
  nonInteractive: false,
  code: [],
})
export const step = reactive({
  current: 0,
  last: 0,
})
export const inputs = ref<string[]>([])
export const contents = computed(() =>
  lesson.content.split("\n").filter((it) => it !== ""),
)

export function reset() {
  storage.set(KEY_STEP, { current: 0, last: 0 })
  storage.remove(KEY_FINISHED)
  window.location.reload()
}

export function prev() {
  const prevStep = step.current - 1
  if (prevStep <= -1) return
  step.current = prevStep
  status.success = step.last > prevStep
  status.error = false
  updateStorage(prevStep)
}

export function next(total: number) {
  checkAnswer()
  if (!status.success) {
    status.error = true
    storage.remove(KEY_FINISHED)
    return
  }
  if (step.current < total - 1) {
    const nextStep = step.current + 1
    step.current = nextStep
    status.success = step.last > nextStep
    status.error = false
    updateStorage(nextStep)
  } else {
    if (storage.get(KEY_FINISHED)) return
    confetti({
      particleCount: 400,
      startVelocity: 30,
      gravity: 0.5,
      spread: 350,
      origin: { x: 0.5, y: 0.4 },
    })
    storage.set(KEY_FINISHED, true)
  }
}

function checkAnswer() {
  if (lesson.nonInteractive) {
    status.success = true
    return
  }
  const userAnswer = inputs.value.filter((it) => it !== "")
  for (let i = 0; i < userAnswer.length; i++) {
    if (Array.isArray(lesson.answer[i])) {
      const answers = lesson.answer[i] as string[]
      status.success = answers.some((a) => userAnswer[i] === a)
    } else {
      status.success = userAnswer[i] == lesson.answer[i]
    }
    if (!status.success) break
  }
}

function updateStorage(current: number) {
  storage.set(KEY_STEP, {
    current,
    last: current > step.last ? current : step.last,
  })
}
