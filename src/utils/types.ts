export interface Step {
  last: number
  current: number
}

export interface Lesson {
  title: string
  content: string
  type: string
  blank: string[]
  answer: string[] | string[][]
  nonInteractive: boolean
  code: string[]
}

export enum Type {
  blank = "填空",
  options = "选择",
}
