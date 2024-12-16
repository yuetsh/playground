<template>
  <n-flex size="large" vertical>
    <n-card>
      <template #header>
        <n-flex align="center">
          {{ lesson.title }}
          <n-popover
            v-if="lesson.hint"
            :show-arrow="false"
            :placement="isDesktop ? 'right' : 'bottom'"
          >
            <template #trigger>
              <n-button
                quaternary
                circle
                class="animate__animated animate__heartBeat animate__infinite"
              >
                <template #icon>
                  <Icon icon="streamline-emojis:folded-hands-2" width="20" />
                </template>
              </n-button>
            </template>
            <div v-for="(item, index) in hints" :key="index">{{ item }}</div>
          </n-popover>
        </n-flex>
      </template>
      <n-p
        v-for="(item, index) in contents"
        :key="index"
        v-html="marked.parseInline(item)"
      />
    </n-card>
    <n-card v-for="(item, index) in lesson.code" :key="index">
      <n-code language="python" :code="item" show-line-numbers />
    </n-card>
    <n-card v-if="!lesson.skip">
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
        <n-flex vertical>
          <Component
            :is="lesson.answer.length === 1 ? NRadio : NCheckbox"
            v-for="(item, index) in lesson.blank"
            :key="index"
            :value="item"
            :label="item"
          />
        </n-flex>
      </Component>
    </n-card>
  </n-flex>

</template>
<script lang="ts" setup>
import { Icon } from "@iconify/vue"
import { useMagicKeys } from "@vueuse/core"
import { marked } from "marked"
import {
  NButton,
  NCard,
  NCheckbox,
  NCheckboxGroup,
  NCode,
  NInput,
  NP,
  NPopover,
  NRadio,
  NRadioGroup,
} from "naive-ui"
import { ref, watch } from "vue"
import { getSetting, listUsers, toggleStart } from "../api"
import {
  chooses,
  contents,
  hints,
  inputs,
  isDesktop,
  lesson,
} from "../composables"
import { RE } from "../utils/constants"
import { Type } from "../utils/types"
</script>
<style scoped>
.code {
  white-space: pre;
}
</style>
