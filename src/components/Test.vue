<template>
  <n-modal
    v-model:show="showTest"
    preset="card"
    style="width: 500px"
    title="限时测试进行中"
  >
    <n-flex align="center">
      <div>{{ classname }}</div>
      <n-button @click="toggle">{{ testStart ? "关闭" : "开启" }}</n-button>
      <n-button @click="resetAllUsers" v-if="!testStart">清空</n-button>
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
import { NButton, NModal } from "naive-ui"
import { computed, ref, watch } from "vue"
import { getSetting, listUsers, resetAllUsers, toggleStart } from "../api"
import { showTest, step, testStart, totalStep, users } from "../composables"

const { pause, resume } = useIntervalFn(async () => {
  users.value = await listUsers()
}, 5000)

const classname = ref("")
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
    }
  }
})

async function toggle() {
  const data = await toggleStart(!testStart.value, step.title, totalStep.value)
  testStart.value = data.start
  users.value = await listUsers()
}

const needRefresh = computed(() => testStart.value && showTest.value)

watch(needRefresh, function (v) {
  if (v) {
    resume()
  } else {
    pause()
  }
})
</script>
