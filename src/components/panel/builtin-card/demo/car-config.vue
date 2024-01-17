<template>
  <n-form ref="formRef" :model="model" :rules="rules">
    <n-form-item path="username" label="用户">
      <n-input v-model:value="model.username" />
    </n-form-item>
    <n-form-item path="age" label="年龄">
      <n-input v-model:value="model.age" @keydown.enter.prevent />
    </n-form-item>
  </n-form>
</template>
<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import type { FormInst, FormItemRule, FormRules } from 'naive-ui'
const formRef = ref<FormInst | null>(null)

const props = defineProps<{
  config: Record<string, any>
}>()

defineExpose({
  validate: () => formRef.value?.validate()
})

const emit = defineEmits<{
  (e: 'update:config', value: Record<string, any>): void
}>()

const model = ref({
  username: '',
  age: ''
})

onMounted(() => {
  if (props.config) {
    model.value = Object.assign(model.value, props.config)
  }
})
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

watch(
  model,
  v => {
    emit('update:config', v)
  },
  { deep: true }
)
</script>
