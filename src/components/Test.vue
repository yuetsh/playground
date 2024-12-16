<template>
  <n-modal
    v-model:show="showTest"
    preset="card"
    style="width: 500px"
    :title="'限时测试' + (testStart ? '进行中' : '即将开始')"
  >
    <n-flex align="center">
      <div>{{ classname }}</div>
      <n-button @click="toggle">{{ testStart ? "关闭" : "开启" }}</n-button>
      <n-button @click="clearAll" v-if="!testStart">清空</n-button>
    </n-flex>
    <n-flex style="margin-top: 16px">
      <n-gradient-text size="24">总人数：{{ info.total }}</n-gradient-text>
      <n-gradient-text size="24">全部完成：{{ info.finished }}</n-gradient-text>
      <n-gradient-text size="24">
        占比：{{ info.personPercent }}%
      </n-gradient-text>
    </n-flex>
    <n-flex style="margin-top: 16px">
      <n-gradient-text size="24">
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
import { NButton, NGradientText, NModal } from "naive-ui"
import { computed, reactive, ref, watch } from "vue"
import { getSetting, listUsers, resetAllUsers, toggleStart } from "../api"
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

watch(shiftCtrlZ, async (v) => {
  if (v) {
    showTest.value = true
    const data = await getSetting()
    classname.value = data.classname
    if (data.level_title !== step.title) {
      testStart.value = false
      users.value = []
    } else {
      testStart.value = data.start
      users.value = await listUsers()
      getInfo(users.value)
    }
  }
})

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
  info.personPercent = (info.finished / info.total).toFixed(2)
}

function clearAll() {
  resetAllUsers()
  info.finished = 0
  info.personPercent = "0"
  info.problemPercent = "0"
}
const { pause, resume } = useIntervalFn(async () => {
  users.value = await listUsers()
  getInfo(users.value)
}, 5000)

watch(needRefresh, function (v) {
  if (v) {
    resume()
  } else {
    pause()
  }
})
</script>
