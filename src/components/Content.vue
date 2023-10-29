<template>
  <n-space size="large" vertical>
    <n-card>
      <template #header>{{ lesson.title }}</template>
      <p class="content" v-for="item in contents">{{ item }}</p>
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
import { inputs, lesson, contents } from "../composables"
import { RE } from "../utils/constants"
</script>
<style scoped>
.code {
  white-space: pre;
}

.content {
  margin-top: 0;
}

.content:last-child {
  margin-bottom: 0;
}
</style>
../store
