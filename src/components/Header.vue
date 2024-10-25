<template>
  <n-space justify="space-between" align="center">
    <n-space align="center">
      <n-dropdown placement="bottom-start" size="large" :options="menus">
        <n-button quaternary circle>
          <Icon icon="streamline-emojis:clipboard" width="20" />
        </n-button>
      </n-dropdown>
      <h2>徐越的练习册 - {{ step.title }}</h2>
    </n-space>
    <n-space align="center">
      <span>{{ step.current + 1 }} / {{ props.count }}</span>
      <n-button
        :class="
          step.current === props.count - 1 &&
          'animate__animated animate__headShake animate__infinite'
        "
        tertiary
        @click="reset"
      >
        再次挑战
      </n-button>
    </n-space>
  </n-space>
</template>
<script lang="ts" setup>
import { Icon } from "@iconify/vue"
import type { DropdownOption } from "naive-ui"
import { NButton, NDropdown } from "naive-ui"
import { h } from "vue"
import { reset, selectLesson, step } from "../composables"
import lessons from "../data/python.json"

const props = defineProps<{
  count: number
}>()

const menus: DropdownOption[] = [
  ...Object.keys(lessons).map((title: any, i: number) => ({
    label: title,
    key: title,
    icon: () => h(Icon, { icon: `tabler:number-${i+1}-small`, width: 20 }),
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
</script>
