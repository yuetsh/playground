import axios from "axios"
import { Setting } from "./utils/types"

const http = axios.create({ baseURL: "https://playapi.xuyue.cc/api/core" })

export async function getSetting() {
  const res = await http.get<Setting>("/setting")
  return res.data
}

export async function toggleStart(start: boolean, title: string, step: number) {
  const res = await http.put("/setting", {
    start,
    level_title: title,
    total_step: step,
  })
  return res.data
}

export async function updateSettingClassname(classname: string) {
  const res = await http.put("/setting/classname", {
    classname,
  })
  return res.data
}

export async function getUser(name: string, classname: string) {
  const res = await http.get("/user", {
    params: {
      name,
      classname,
    },
  })
  return res.data
}

export async function listUsers() {
  const res = await http.get("/users")
  return res.data
}

export async function updateStep(name: string, step: number) {
  const res = await http.put("/user", {
    name,
    step,
  })
  return res.data
}

export async function resetAllUsers() {
  await http.put("/clear")
  return
}
