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
      <h2>徐越的练习册</h2>
    </n-space>
    <n-space align="center">
      <span>{{ step.current + 1 }} / {{ props.count }}</span>
      <n-button tertiary @click="reset">再次挑战</n-button>
    </n-space>
  </n-space>
</template>
<script lang="ts" setup>
import { NIcon, NDropdown, NButton } from "naive-ui"
import type { DropdownOption } from "naive-ui"
import Menu from "../icons/Menu.vue"
import Cat from "../icons/Cat.vue"
import Dog from "../icons/Dog.vue"
import Book from "../icons/Book.vue"
import { step, reset } from "../composables"
import { h } from "vue"

const props = defineProps<{
  count: number
}>()

const menus: DropdownOption[] = [
  {
    label: "判题狗",
    key: "1",
    icon: () => h(NIcon, { component: Dog }),
    props: {
      onClick: () => window.open("https://oj.hyyz.izhai.net"),
    },
  },
  {
    label: "自测猫",
    key: "2",
    icon: () => h(NIcon, { component: Cat }),
    props: {
      onClick: () => window.open("https://code.hyyz.izhai.net"),
    },
  },
  {
    label: "编程书",
    key: "3",
    icon: () => h(NIcon, { component: Book }),
    props: {
      onClick: () => window.open("https://book.hyyz.izhai.net"),
    },
  },
]
</script>
