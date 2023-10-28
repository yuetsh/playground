<template>
  <n-space justify="space-between" align="center">
    <n-space align="center">
      <n-dropdown
        placement="bottom-start"
        :options="menus"
        @select="handleSelectMenu"
      >
        <n-button quaternary circle>
          <template #icon>
            <n-icon :component="Menu" size="20" />
          </template>
        </n-button>
      </n-dropdown>
      <h2>徐越的代码闯关</h2>
    </n-space>
    <n-space align="center">
      <span>{{ step.current + 1 }} / {{ props.lessons.length }}</span>
      <n-button secondary size="small" @click="reset">重来</n-button>
    </n-space>
  </n-space>
</template>
<script lang="ts" setup>
import { NIcon } from "naive-ui"
import type { DropdownOption } from "naive-ui"
import Menu from "../icons/Menu.vue"
import Lock from "../icons/Lock.vue"
import Play from "../icons/Play.vue"
import Done from "../icons/Done.vue"
import { KEY_FINISHED, KEY_STEP } from "../utils/constants"
import { Lesson } from "../utils/types"
import { storage } from "../utils/storage"
import { step } from "../composables"
import { h } from "vue"

const props = defineProps<{
  lessons: Lesson[]
}>()

const menus: DropdownOption[] = [
  { label: "基础语法", key: "1", icon: () => h(NIcon, { component: Done }) },
  { label: "进阶语法", key: "2", icon: () => h(NIcon, { component: Play }) },
  { label: "高级语法", key: "3", icon: () => h(NIcon, { component: Lock }) },
]

function handleSelectMenu() {}

function reset() {
  storage.set(KEY_STEP, { current: 0, last: 0 })
  storage.remove(KEY_FINISHED)
  window.location.reload()
}
</script>
../store
