<template>
  <n-form :model="ctx.config">
    <n-form-item path="username" label="用户">
      <n-input v-model:value="ctx.config.username" />
    </n-form-item>
    <n-form-item path="age" label="年龄">
      <n-input v-model:value="ctx.config.age" @keydown.enter.prevent />
    </n-form-item>
  </n-form>
</template>
<script lang="ts" setup>
import { inject } from 'vue'
import type { IConfigCtx } from '@/components/panel/card'
const ctx = inject<IConfigCtx>('config-ctx')!
</script>
