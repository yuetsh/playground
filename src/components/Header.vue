<template>
  <n-space justify="space-between" align="center">
    <n-space align="center">
      <n-dropdown placement="bottom-start" size="large" :options="menus">
        <n-button quaternary circle>
          <Icon icon="streamline-emojis:clipboard" width="20" />
        </n-button>
      </n-dropdown>
      <h2>徐越的练习册 - {{ getLevelLabel(step.level) }}</h2>
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
import { reset, selectLevel, step } from "../composables"
import { Level, getLevelLabel } from "../utils/types"

const props = defineProps<{
  count: number
}>()

const menus: DropdownOption[] = [
  {
    label: getLevelLabel(Level.basic),
    key: Level.basic,
    icon: () => h(Icon, { icon: "streamline-emojis:baby-bottle", width: 20 }),
    props: {
      onClick: () => selectLevel(Level.basic),
    },
  },
  {
    label: getLevelLabel(Level.advanced),
    key: Level.advanced,
    icon: () => h(Icon, { icon: "streamline-emojis:automobile", width: 20 }),
    props: {
      onClick: () => selectLevel(Level.advanced),
    },
  },
  {
    label: "高阶知识",
    key: "golden medal",
    icon: () => h(Icon, { icon: "streamline-emojis:rocket", width: 20 }),
    disabled: true,
    props: {
      onClick: () => {},
    },
  },
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
    label: "基础课",
    key: "book",
    icon: () => h(Icon, { icon: "streamline-emojis:open-book", width: 20 }),
    props: {
      onClick: () => window.open("https://python.xuyue.cc"),
    },
  },
]
</script>
