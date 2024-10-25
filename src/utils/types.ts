import lessons from "../data/python.json"

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
  skip: boolean
  code: string[]
  hint: string
}

export enum Type {
  blank = "填空",
  options = "选择",
}

export interface Step {
  title: keyof typeof lessons
  current: number
  last: number
}
