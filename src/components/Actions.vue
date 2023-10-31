<template>
  <n-space class="actions" justify="space-between">
    <div>
      <n-space vertical align="start" v-if="step.current !== 0">
        <n-button secondary @click="prev">上一个</n-button>
        <n-tag v-if="width > 800" class="tag" size="small" :bordered="false">
          方向键左键
        </n-tag>
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
        <n-button secondary @click="() => next(props.count)">
          {{ step.current < props.count - 1 ? "下一步" : "全部完成" }}
        </n-button>
      </n-space>
      <n-tag v-if="width > 800" class="tag" size="small" :bordered="false">
        方向键右键
      </n-tag>
    </n-space>
  </n-space>
</template>
<script lang="ts" setup>
import { watch } from "vue"
import { useMagicKeys, useWindowSize } from "@vueuse/core"
import { step, status, next, prev } from "../composables"
import Lock from "../icons/Lock.vue"

const props = defineProps<{
  count: number
}>()

const { left, right } = useMagicKeys()
const { width } = useWindowSize()

watch(right, (v) => {
  if (v) next(props.count)
})

watch(left, (v) => {
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
