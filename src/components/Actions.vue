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
        <Icon
          v-if="status.error"
          icon="streamline-emojis:locked-with-key"
          width="30"
          :class="status.errorLoading && 'animate__animated animate__swing'"
        />
        <n-button
          :disabled="isPending"
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
import { Icon } from "@iconify/vue"
import { useMagicKeys } from "@vueuse/core"
import { NButton, NTag } from "naive-ui"
import { onMounted, watch } from "vue"
import {
  isDesktop,
  isPending,
  next,
  prev,
  status,
  step,
  stop,
} from "../composables"

const props = defineProps<{
  count: number
}>()

const { shift_left, shift_right } = useMagicKeys()

onMounted(stop)

watch(shift_right, (v) => {
  if (v) next(props.count)
})

watch(shift_left, (v) => {
  if (v) prev()
})
</script>

<style scoped>
.actions {
  margin-top: 16px;
}

.tag {
  opacity: 0.38;
}
</style>
