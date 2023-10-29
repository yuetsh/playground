<template>
  <n-space class="actions" justify="space-between">
    <div>
      <n-button secondary @click="prev" v-if="step.current !== 0">
        上一个
      </n-button>
    </div>
    <n-space align="center">
      <n-icon
        v-if="status.error"
        :component="Lock"
        size="20"
        color="#d03050"
        class="icon"
      />
      <n-button
        v-if="step.current < props.count - 1"
        secondary
        @click="() => next(props.count)"
      >
        下一个
      </n-button>
      <n-button @click="bingo" v-else>全部完成</n-button>
    </n-space>
  </n-space>
</template>
<script lang="ts" setup>
import { step, status, bingo, next, prev } from "../composables"
import Lock from "../icons/Lock.vue"

const props = defineProps<{
  count: number
}>()
</script>

<style scoped>
.icon {
  transform: translateY(3px);
}

.actions {
  margin-top: 16px;
}
</style>
