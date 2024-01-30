<template>
  <n-form :model="ctx.config">
    <n-form-item label="选择icon">
      <div class="space-x-3 flex">
        <div
          v-for="item in icons"
          :key="item.name"
          :class="`text-lg cursor-pointer p-1 rounded border ${
            item.name === ctx.config.icon ? 'border-blue-500' : 'border-transparent'
          }`"
          @click="ctx.config.icon = item.name"
        >
          <component :is="item.value" />
        </div>
      </div>
    </n-form-item>
    <n-form-item label="颜色">
      <n-color-picker v-model:value="ctx.config.color" :show-alpha="false" />
    </n-form-item>
  </n-form>
</template>
<script lang="ts" setup>
import { inject } from 'vue'
import type { IConfigCtx } from '@/components/panel/card'
import icons from './icon'
const ctx = inject<IConfigCtx>('config-ctx')!
</script>
