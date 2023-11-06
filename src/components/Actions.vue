<template>
  <n-space class="actions" justify="space-between">
    <div>
      <n-space vertical align="start" v-if="step.current !== 0">
        <n-button tertiary type="success" size="large" @click="prev">
          上一个
        </n-button>
        <n-tag v-if="isDesktop" class="tag" :bordered="false">SHIFT+←</n-tag>
      </n-space>
    </div>
    <n-space vertical align="end">
      <n-space align="center">
        <n-icon
          v-if="status.error"
          :component="Lock"
          size="20"
          color="#d03050"
          class="icon"
        />
        <n-button
          tertiary
          type="success"
          size="large"
          @click="() => next(props.count)"
        >
          {{ step.current < props.count - 1 ? "下一个" : "全部完成" }}
        </n-button>
      </n-space>
      <n-tag v-if="isDesktop" class="tag" :bordered="false">SHIFT+→</n-tag>
    </n-space>
  </n-space>
</template>
<script lang="ts" setup>
import { computed, watch } from "vue"
import { NTag, NIcon, NButton } from "naive-ui"
import { useMagicKeys, useWindowSize } from "@vueuse/core"
import { step, status, next, prev } from "../composables"
import Lock from "../icons/Lock.vue"

const props = defineProps<{
  count: number
}>()

const { shift_left, shift_right } = useMagicKeys()
const { width } = useWindowSize()

const isDesktop = computed(() => width.value > 800)

watch(shift_right, (v) => {
  if (v) next(props.count)
})

watch(shift_left, (v) => {
  if (v) prev()
})
</script>

<style scoped>
.icon {
  transform: translateY(3px);
}

.actions {
  margin-top: 16px;
}

.tag {
  opacity: 0.38;
}
</style>
