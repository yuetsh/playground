<template>
  <n-modal
    v-model:show="showTest"
    preset="card"
    :mask-closable="false"
    style="width: 500px"
    :title="'限时测试' + (testStart ? '进行中' : '即将开始')"
  >
    <n-flex align="center">
      <n-dropdown :options="options" @select="chooseClassname">
        <n-button>{{ classname }}</n-button>
      </n-dropdown>
      <n-button @click="toggle">{{ testStart ? "结束" : "开启" }}</n-button>
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
    <n-flex style="margin-top: 16px">
      <n-button
        style="width: 100px"
        :type="user.current_step === totalStep ? 'primary' : 'default'"
        v-for="user in users"
        :key="user.id"
      >
        {{ user.name }} - {{ user.current_step }}
      </n-button>
    </n-flex>
  </n-modal>
</template>
<script setup lang="ts">
import { useIntervalFn, useMagicKeys } from "@vueuse/core"
import type { DropdownOption } from "naive-ui"
import { NButton, NDropdown, NGradientText, NModal } from "naive-ui"
import { computed, reactive, ref, watch } from "vue"
import {
  getSetting,
  listUsers,
  resetAllUsers,
  toggleStart,
  updateSettingClassname,
} from "../api"
import { showTest, step, testStart, totalStep, users } from "../composables"
import { User } from "../utils/types"

const classname = ref("")
const info = reactive({
  total: users.value.length ?? 0,
  finished: 0,
  personPercent: "0",
  problemPercent: "0",
})

const keys = useMagicKeys()
const shiftCtrlZ = keys["Shift+Ctrl+Z"]
const options: DropdownOption[] = [
  { label: "23计算机3班", key: "23计算机3班" },
  { label: "23计算机4班", key: "23计算机4班" },
  // { label: "24计算机1班", key: "24计算机1班" },
  // { label: "24计算机2班", key: "24计算机2班" },
  // { label: "24计算机3班", key: "24计算机3班" },
  // { label: "24计算机4班", key: "24计算机4班" },
]

watch(shiftCtrlZ, async (v) => {
  if (v) {
    showTest.value = true
    const data = await getSetting()
    classname.value = data.classname
    testStart.value = data.start
    users.value = await listUsers()
    getInfo(users.value)
  }
})

async function chooseClassname(item: string) {
  classname.value = item
  await updateSettingClassname(item)
  users.value = await listUsers()
  info.total = users.value.length
  info.finished = 0
  info.personPercent = "0"
  info.problemPercent = "0"
}

async function toggle() {
  const data = await toggleStart(!testStart.value, step.title, totalStep.value)
  testStart.value = data.start
  users.value = await listUsers()
}

const needRefresh = computed(() => testStart.value && showTest.value)

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
  info.personPercent = "0"
  info.problemPercent = "0"
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
