<template>
  <n-flex justify="space-between" align="center">
    <n-flex align="center">
      <n-dropdown placement="bottom-start" size="large" :options="menus">
        <n-button quaternary circle>
          <Icon icon="streamline-emojis:clipboard" width="20" />
        </n-button>
      </n-dropdown>
      <h2>限时鸭 - {{ step.title }}</h2>
    </n-flex>
    <n-flex align="center">
      <span>{{ step.current + 1 }} / {{ totalStep }}</span>
      <n-button
        :class="
          step.current === totalStep - 1 &&
          'animate__animated animate__headShake animate__infinite'
        "
        tertiary
        @click="reset"
        v-if="false"
      >
        再次挑战
      </n-button>
      <n-button v-if="showUsername && !showTest" @click="chooseUser">
        {{ currentUser ? currentUser.name : "选择用户" }}
      </n-button>
    </n-flex>
  </n-flex>
  <n-modal
    preset="card"
    v-model:show="show"
    title="请选择（只能选一次哦）"
    style="width: 500px"
    :mask-closable="false"
    :closable="false"
  >
    <n-flex>
      <n-button
        v-for="item in users"
        @click="submit(item)"
        :key="item.id"
        :type="
          !!currentUser && currentUser.name === item.name
            ? 'primary'
            : 'default'
        "
      >
        {{ item.name }}
      </n-button>
    </n-flex>
    <template #footer>
      <n-flex justify="center">
        <n-button block type="primary" @click="show = false">确定</n-button>
      </n-flex>
    </template>
  </n-modal>
</template>
<script lang="ts" setup>
import { Icon } from "@iconify/vue"
import type { DropdownOption } from "naive-ui"
import { NButton, NDropdown, NModal } from "naive-ui"
import { h, onMounted, ref } from "vue"
import { getSetting, getUser, listUsers } from "../api"
import {
  currentUser,
  reset,
  selectLesson,
  showTest,
  showUsername,
  step,
  totalStep,
  users,
} from "../composables"
import lessons from "../contents/python.json"
import { USER } from "../utils/constants"
import { storage } from "../utils/storage"
import { User } from "../utils/types"

const show = ref(false)

const menus: DropdownOption[] = [
  ...Object.keys(lessons).map((title: any, i: number) => ({
    label: title,
    key: title,
    icon: () => h(Icon, { icon: `tabler:number-${i + 1}-small`, width: 20 }),
    props: {
      onClick: () => selectLesson(title),
    },
  })),
  {
    key: "分割线",
    type: "divider",
  },
  {
    label: "判题狗",
    key: "oj",
    icon: () => h(Icon, { icon: "streamline-emojis:dog-face", width: 20 }),

    props: {
      onClick: () => window.open("https://oj.xuyue.cc"),
    },
  },
  {
    label: "自测猫",
    key: "code",
    icon: () => h(Icon, { icon: "streamline-emojis:cat-face", width: 20 }),
    props: {
      onClick: () => window.open("https://code.xuyue.cc"),
    },
  },
  {
    label: "编程书",
    key: "book",
    icon: () => h(Icon, { icon: "streamline-emojis:open-book", width: 20 }),
    props: {
      onClick: () => window.open("https://book.xuyue.cc"),
    },
  },
]

async function chooseUser() {
  if (currentUser.value && currentUser.value.name) return
  show.value = true
  users.value = await listUsers()
}

async function submit(item: User) {
  currentUser.value = item
  showUsername.value = true
  storage.set(USER, item)
  const res = await getUser(item.name, item.classname)
  step.title = res.level_title
  step.current = res.current_step
}

onMounted(async () => {
  const res = await getSetting()
  selectLesson(res.level_title || "输入输出")
  currentUser.value = storage.get(USER)
  showUsername.value = !!currentUser.value
  if (res.start && !currentUser.value) {
    show.value = true
    users.value = await listUsers()
  }
})
</script>
