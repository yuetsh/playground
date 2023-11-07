<template>
  <n-space size="large" vertical>
    <n-card>
      <template #header>{{ lesson.title }}</template>
      <n-p
        v-for="(item, index) in contents"
        :key="index"
        v-html="marked.parseInline(item)"
      />
    </n-card>
    <n-card
      v-if="lesson.skip"
      v-for="(item, index) in lesson.code"
      :key="index"
    >
      <n-code language="python" :code="item" show-line-numbers />
    </n-card>
    <n-card v-else>
      <span
        v-if="lesson.type === Type.blank"
        v-for="(item, index) in lesson.blank"
        :key="index"
      >
        <span v-if="item.match(RE)">
          <n-input
            placeholder=""
            :style="{ width: 45 * item.length + 'px' }"
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
      <Component
        v-else
        :is="lesson.answer.length === 1 ? NRadioGroup : NCheckboxGroup"
        v-model:value="chooses"
      >
        <n-space vertical>
          <Component
            :is="lesson.answer.length === 1 ? NRadio : NCheckbox"
            v-for="(item, index) in lesson.blank"
            :key="index"
            :value="item"
            :label="item"
          />
        </n-space>
      </Component>
    </n-card>
  </n-space>
</template>
<script lang="ts" setup>
import { marked } from "marked"
import { Type } from "../utils/types"
import { inputs, chooses, lesson, contents } from "../composables"
import { RE } from "../utils/constants"
import {
  NCheckboxGroup,
  NRadioGroup,
  NCheckbox,
  NRadio,
  NCard,
  NCode,
  NInput,
  NP,
} from "naive-ui"
</script>
<style scoped>
.code {
  white-space: pre;
}
</style>
