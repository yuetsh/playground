import { reactive, ref } from "vue"
import { Lesson } from "./utils/types"

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
