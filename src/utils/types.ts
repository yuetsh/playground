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

export enum Level {
  basic = "basic",
  advanced = "advanced",
}

export function getLevelLabel(lv: Level) {
  return { [Level.basic]: "基础必会", [Level.advanced]: "进阶提高" }[lv]
}

export interface Step {
  level: Level
  current: number
  last: number
}
