import { computed, reactive, ref } from "vue"
import { promiseTimeout, useWindowSize, useTimeout } from "@vueuse/core"
import { Lesson, Level, Step, Type } from "./utils/types"
import { KEY_FINISHED, KEY_STEP } from "./utils/constants"
import { storage } from "./utils/storage"
// @ts-ignore
import confetti from "canvas-confetti"

const { width } = useWindowSize()
export const { isPending, start, stop } = useTimeout(3000, { controls: true })
export const isDesktop = computed(() => width.value > 800)
export const status = reactive({
  success: false,
  error: false,
  errorLoading: false,
})
export const lesson = reactive<Lesson>({
  title: "",
  content: "",
  blank: [],
  answer: [],
  skip: false,
  code: [],
  type: Type.blank,
  hint: "",
})
export const step = reactive<Step>({
  level: Level.basic,
  current: 0,
  last: 0,
})
export const inputs = ref<string[]>([])
export const chooses = ref()
export const contents = computed(() =>
  lesson.content.split("\n").filter((it) => it !== ""),
)
export const hints = computed(() =>
  lesson.hint.split("\n").filter((it) => it !== ""),
)

export function reset() {
  storage.set<Step>(KEY_STEP, { current: 0, last: 0, level: step.level })
  storage.remove(KEY_FINISHED)
  window.location.reload()
}

export function prev() {
  const prevStep = step.current - 1
  if (prevStep <= -1) return
  step.current = prevStep
  status.success = step.last > prevStep
  status.error = false
  status.errorLoading = false
  updateStorage(prevStep)
}

export async function next(total: number) {
  checkAnswer()
  if (!status.success) {
    status.error = true
    storage.remove(KEY_FINISHED)
    status.errorLoading = true
    await promiseTimeout(1000)
    status.errorLoading = false
    return
  }
  // 下一步
  if (step.current < total - 1) {
    const nextStep = step.current + 1
    step.current = nextStep
    status.success = step.last > nextStep
    status.error = false
    status.errorLoading = false
    status.errorLoading = false
    updateStorage(nextStep)
  } else {
    // 最后一步
    start() // 禁用按钮，防止多次调用 confetti
    storage.set(KEY_FINISHED, true)
    confetti({
      particleCount: 300,
      startVelocity: 30,
      gravity: 0.5,
      spread: 350,
      origin: { x: 0.5, y: 0.4 },
    })
  }
}

export function selectLevel(lv: Level) {
  if (lv === step.level) return
  step.level = lv
  storage.set<Step>(KEY_STEP, { current: 0, last: 0, level: step.level })
  storage.remove(KEY_FINISHED)
}

function checkAnswer() {
  if (lesson.skip) {
    status.success = true
    return
  }
  // 填空题
  if (lesson.type === Type.blank) {
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
  } else {
    // 选择题
    if (lesson.answer.length === 1) {
      // 单选题
      status.success = chooses.value === lesson.answer[0]
    } else {
      // 多选题
      if (lesson.answer.length !== chooses.value.length) {
        status.success = false
        return
      }
      const ans = chooses.value
        .map((c: string) => lesson.blank.find((b) => c === b))
        .sort()
      status.success = ans.join() === lesson.answer.sort().join()
    }
  }
}

function updateStorage(current: number) {
  storage.set(KEY_STEP, {
    level: step.level,
    current,
    last: current > step.last ? current : step.last,
  })
}
