<template>
  <n-modal
    v-model:show="showTest"
    preset="card"
    :mask-closable="false"
    style="width: 520px"
    :title="title"
  >
    <n-flex align="center">
      <n-dropdown :options="options" @select="chooseClassname">
        <n-button>{{ classname }}</n-button>
      </n-dropdown>
      <n-dropdown :options="timers" @select="chooseTimer">
        <n-button>{{ timer }}分钟</n-button>
      </n-dropdown>
      <n-button @click="testStart ? END() : START()">
        {{ testStart ? "结束" : "开启" }}
      </n-button>
      <n-button @click="clearAll" v-if="!testStart">清空</n-button>
    </n-flex>
    <n-flex style="margin-top: 16px">
      <n-gradient-text size="24" type="warning">
        总人数：{{ info.total }}
      </n-gradient-text>
      <n-gradient-text size="24" type="primary">
        全部完成：{{ info.finished }}
      </n-gradient-text>
      <n-gradient-text size="24" type="info">
        占比：{{ info.personPercent }}%
      </n-gradient-text>
    </n-flex>
    <n-flex style="margin-top: 16px">
      <n-gradient-text size="24" type="danger">
        掌握程度：{{ info.problemPercent }}%
      </n-gradient-text>
    </n-flex>
    <n-flex style="margin-top: 16px" v-if="showAnalyze">
      <div v-html="marked.parse(mockMessage)"></div>
    </n-flex>
    <n-flex style="margin-top: 16px" v-else>
      <n-button
        style="width: 100px"
        :type="user.current_step === totalStep ? 'primary' : 'default'"
        v-for="user in users"
        :key="user.id"
      >
        {{ user.name }} - {{ user.current_step }}
      </n-button>
    </n-flex>
    <n-flex style="margin-top: 16px">
      <n-button
        type="primary"
        block
        @click="analyze"
        :loading="showAnalyze && !mockMessage"
      >
        自动分析
      </n-button>
    </n-flex>
  </n-modal>
</template>
<script setup lang="ts">
import { useIntervalFn, useMagicKeys } from "@vueuse/core"
import type { DropdownOption } from "naive-ui"
import { NButton, NDropdown, NGradientText, NModal } from "naive-ui"
import { computed, reactive, ref, watch } from "vue"
import { marked } from "marked"
import {
  getSetting,
  listUsers,
  resetAllUsers,
  toggleStart,
  updateSettingClassname,
} from "../api"
import { showTest, step, testStart, totalStep, users } from "../composables"
import { mock } from "../utils/constants"
import { User } from "../utils/types"

let timeId: any = null
const options: DropdownOption[] = [
  { label: "23计算机3班", key: "23计算机3班" },
  { label: "23计算机4班", key: "23计算机4班" },
]
const timers: DropdownOption[] = [
  { label: "3分钟", key: "3" },
  { label: "5分钟", key: "5" },
  { label: "8分钟", key: "8" },
]

const classname = ref("")
const timer = ref(timers[0].key)
const remaining = ref(Number(timer.value) * 60)
const info = reactive({
  total: users.value.length ?? 0,
  finished: 0,
  personPercent: "0.00",
  problemPercent: "0.00",
})
const showAnalyze = ref(false)
const mockMessage = ref("")

const title = computed(() => {
  if (testStart.value) {
    return `限时测试进行中，剩余${remaining.value}秒`
  } else {
    return "限时测试"
  }
})
const needRefresh = computed(() => testStart.value && showTest.value)

const keys = useMagicKeys()
const shiftCtrlZ = keys["Shift+Ctrl+Z"]

watch(shiftCtrlZ, async (v) => {
  if (v) {
    showTest.value = true
    const data = await getSetting()
    classname.value = data.classname
    testStart.value = data.start
    users.value = await listUsers()
    getInfo(users.value)
    showAnalyze.value = false
  }
})

async function chooseClassname(item: string) {
  classname.value = item
  await updateSettingClassname(item)
  users.value = await listUsers()
  info.total = users.value.length
  info.finished = 0
  info.personPercent = "0.00"
  info.problemPercent = "0.00"
}

function chooseTimer(item: string) {
  timer.value = item
}

async function START() {
  timeId = setInterval(() => {
    remaining.value = remaining.value - 1
    if (remaining.value === 0) {
      remaining.value = Number(timer.value) * 60
      clearInterval(timeId)
      END()
    }
  }, 1000)
  const data = await toggleStart(true, step.title, totalStep.value)
  testStart.value = data.start
  users.value = await listUsers()
}

async function END() {
  remaining.value = Number(timer.value) * 60
  if (timeId) clearInterval(timeId)

  const data = await toggleStart(false, step.title, totalStep.value)
  testStart.value = data.start
  users.value = await listUsers()
}

function getInfo(users: User[]) {
  info.total = users.length
  info.finished = users.filter(
    (it) => it.current_step === totalStep.value,
  ).length
  info.personPercent = ((info.finished / info.total) * 100).toFixed(2)
  const totalProblems = users.length * totalStep.value
  if (!users.length) return
  const solvedProblems = users
    .map((it) => it.current_step)
    .reduce((prev, curr) => prev + curr)
  if (solvedProblems / totalProblems >= 1) {
    info.problemPercent = "100.00"
  } else {
    info.problemPercent = ((solvedProblems / totalProblems) * 100).toFixed(2)
  }
}

async function clearAll() {
  await resetAllUsers()
  users.value = users.value.map((it) => {
    it.current_step = 0
    return it
  })
  info.total = users.value.length
  info.finished = 0
  info.personPercent = "0.00"
  info.problemPercent = "0.00"
  timeId = null
  remaining.value = Number(timer.value) * 60
}

async function analyze() {
  showAnalyze.value = true
  let n = setTimeout(() => {
    mockMessage.value = mock
    clearTimeout(n)
  }, 6000)
}

const { pause, resume } = useIntervalFn(
  async () => {
    users.value = await listUsers()
    getInfo(users.value ?? [])
  },
  5000,
  { immediate: false },
)

watch(needRefresh, function (v) {
  if (v) {
    resume()
  } else {
    pause()
  }
})
</script>
