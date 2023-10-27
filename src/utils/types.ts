export interface Step {
  last: number
  current: number
}

export interface Lesson {
  title: string
  content: string
  blank: string[]
  answer: string[]
  interactive: boolean
}
