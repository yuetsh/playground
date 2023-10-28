<template>
  <n-space size="large" vertical>
    <n-card>
      <template #header>{{ lesson.title }}</template>
      {{ lesson.content }}
    </n-card>
    <n-card
      v-if="lesson.nonInteractive"
      v-for="(item, index) in lesson.code"
      :key="index"
    >
      <n-code language="python" :code="item" show-line-numbers />
    </n-card>
    <n-card v-else>
      <span v-for="(item, index) in lesson.blank" :key="index">
        <span v-if="item.match(RE)">
          <n-input
            placeholder=""
            :style="{ width: 40 * item.length + 'px' }"
            v-model:value="inputs[index]"
          />
        </span>
        <br v-else-if="item === '\\n'" />
        <n-code
          v-else
          inline
          :trim="false"
          language="python"
          class="code"
          :code="item"
        />
      </span>
    </n-card>
  </n-space>
</template>
<script lang="ts" setup>
import { inputs, lesson } from "../composables"
import { RE } from "../utils/constants"
</script>
<style scoped>
.code {
  white-space: pre;
}
</style>
../store
