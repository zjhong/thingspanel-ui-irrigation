<template>
  <n-form :ref="ctx.formRef" :model="ctx.model" :rules="rules">
    <n-form-item path="username" label="用户">
      <n-input v-model:value="ctx.model.username" />
    </n-form-item>
    <n-form-item path="age" label="年龄">
      <n-input v-model:value="ctx.model.age" @keydown.enter.prevent />
    </n-form-item>
  </n-form>
</template>
<script lang="ts" setup>
import { inject } from 'vue'
import type { FormItemRule, FormRules } from 'naive-ui'
import type { IConfigCtx } from '@/components/panel/card'
const ctx = inject<IConfigCtx>('config-ctx')!
const rules: FormRules = {
  username: [
    {
      required: true,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      validator(rule: FormItemRule, value: string) {
        if (!value) {
          return new Error('请输入用户名')
        }
        return true
      }
    }
  ],
  age: [
    {
      required: true,
      pattern: /^\d+$/,
      message: '请输入数字'
    }
  ]
}
</script>
