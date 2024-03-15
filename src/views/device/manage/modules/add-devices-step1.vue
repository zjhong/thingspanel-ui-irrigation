<script setup lang="ts">
import {ref} from 'vue'
import {FormInst, useMessage} from 'naive-ui'

const props = defineProps<{
  configOptions: any[]
  prevCallback: () => void

}>()
const formRef = ref<FormInst | null>(null)
const message = useMessage()
const formValue = ref({
  name: '',
  age: '',
  phone: ''
})
const rules = {
  name: {
    required: true,
    message: '请输入姓名',
    trigger: 'blur'
  }
}

function handleValidateClick(e: MouseEvent) {
  e.preventDefault()
  formRef.value?.validate((errors) => {
    if (!errors) {
      message.success('Valid')
      props.prevCallback()
    } else {
      console.log(errors)
      message.error('Invalid')
    }
  })
}
</script>

<template>
  <div>
    <n-card :bordered="false">
      <n-form ref="formRef"
              :label-width="80"
              :model="formValue"
              :rules="rules"
              size="small">

        <n-form-item label="设备名称" path="name">
          <n-input v-model:value="formValue.name" placeholder="输入姓名"/>
        </n-form-item>
        <n-form-item label="标签" path="age">
          <n-input v-model:value="formValue.age" placeholder="输入年龄"/>
        </n-form-item>
        <n-form-item label="设备配置" path="phone">
          <n-select v-model:value="formValue.phone" placeholder="电话号码" :options="configOptions"/>
        </n-form-item>
        <n-form-item>
          <n-button attr-type="button" @click="handleValidateClick">
            完成
          </n-button>
        </n-form-item>
      </n-form>
    </n-card>
  </div>
</template>

<style scoped>

</style>
