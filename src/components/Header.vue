<template>
  <n-space justify="space-between" align="center">
    <n-space align="center">
      <n-dropdown placement="bottom-start" :options="menus">
        <n-button quaternary circle>
          <template #icon>
            <n-icon :component="Menu" size="20" />
          </template>
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
import { NIcon, NDropdown, NButton } from "naive-ui"
import type { DropdownOption } from "naive-ui"
import Menu from "../icons/Menu.vue"
import Python from "../icons/Python.vue"
import Loop from "../icons/Loop.vue"
import Medal from "../icons/Medal.vue"
import Cat from "../icons/Cat.vue"
import Dog from "../icons/Dog.vue"
import Book from "../icons/Book.vue"
import { step, reset, selectLevel } from "../composables"
import { h } from "vue"
import { Level, getLevelLabel } from "../utils/types"

const props = defineProps<{
  count: number
}>()

const menus: DropdownOption[] = [
  {
    label: getLevelLabel(Level.basic),
    key: Level.basic,
    icon: () => h(NIcon, { component: Python }),
    props: {
      onClick: () => selectLevel(Level.basic),
    },
  },
  {
    label: getLevelLabel(Level.advanced),
    key: Level.advanced,
    icon: () => h(NIcon, { component: Loop }),
    props: {
      onClick: () => selectLevel(Level.advanced),
    },
  },
  {
    label: "高阶知识",
    key: "golden medal",
    icon: () => h(NIcon, { component: Medal }),
    disabled: true,
    props: {
      onClick: () => {},
    },
  },
  {
    label: "判题狗",
    key: "oj",
    icon: () => h(NIcon, { component: Dog }),
    props: {
      onClick: () => window.open("https://oj.hyyz.izhai.net"),
    },
  },
  {
    label: "自测猫",
    key: "code",
    icon: () => h(NIcon, { component: Cat }),
    props: {
      onClick: () => window.open("https://code.hyyz.izhai.net"),
    },
  },
  {
    label: "编程书",
    key: "book",
    icon: () => h(NIcon, { component: Book }),
    props: {
      onClick: () => window.open("https://book.hyyz.izhai.net"),
    },
  },
]
</script>
