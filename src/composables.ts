import { promiseTimeout, useTimeout, useWindowSize } from "@vueuse/core"
import confetti from "canvas-confetti"
import { computed, reactive, ref } from "vue"
import { getSetting, updateStep } from "./api"
import lessons from "./contents/python.json"
import { KEY_FINISHED, KEY_STEP } from "./utils/constants"
import { storage } from "./utils/storage"
import { Lesson, Step, Type, User } from "./utils/types"

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
  // @ts-ignore
  title: Object.keys(lessons)[0],
  current: 0,
  last: 0,
})
export const inputs = ref<string[]>([])
export const chooses = ref()
export const testStart = ref(false)
export const users = ref<User[]>([])
export const showUsername = ref(false)
export const showTest = ref(false)
export const currentUser = ref<User | null>(null)

export const contents = computed(() =>
  lesson.content.split("\n").filter((it) => it !== ""),
)
export const hints = computed(() =>
  lesson.hint.split("\n").filter((it) => it !== ""),
)
// @ts-ignore
export const totalStep = computed(() => lessons[step.title].length)

export function reset() {
  storage.set<Step>(KEY_STEP, { current: 0, last: 0, title: step.title })
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
  if (currentUser.value?.name) {
    updateStep(currentUser.value.name, step.current)
  }
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
    if (currentUser.value?.name) {
      updateStep(currentUser.value.name, step.current)
    }
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
    if (currentUser.value?.name) {
      updateStep(currentUser.value.name, totalStep.value)
    }
  }
}

export async function selectLesson(title: keyof typeof lessons) {
  if (title === step.title) return
  step.title = title
  storage.set<Step>(KEY_STEP, { current: 0, last: 0, title: step.title })
  storage.remove(KEY_FINISHED)
  const res = await getSetting()
  showUsername.value = res.start && res.level_title === step.title
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
    title: step.title,
    current,
    last: current > step.last ? current : step.last,
  })
}
