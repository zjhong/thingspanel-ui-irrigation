<script setup lang="ts">
import { ref } from 'vue';
import type { FormInst } from 'naive-ui';
import { useMessage } from 'naive-ui';
import { deviceAdd } from '@/service/api/device';

const props = defineProps<{
  configOptions: any[];
  nextCallback: () => void;
  setIdCallback: (dId, cId) => void;
}>();
const formRef = ref<FormInst | null>(null);
const message = useMessage();
const formValue = ref({
  name: '',
  lable: [],
  device_config_id: ''
});
const rules = {
  name: {
    required: true,
    message: '请输入姓名',
    trigger: 'blur'
  }
};

function handleValidateClick(e: MouseEvent) {
  e.preventDefault();
  formRef.value?.validate(async errors => {
    if (!errors) {
      const res = await deviceAdd({ ...formValue.value, lable: formValue.value.lable.join(','), access_way: 'A' });
      const configId = formValue.value.device_config_id;
      const deviceId = res.data.id;
      props.setIdCallback(deviceId, configId);
      props.nextCallback();
    } else {
      console.log(errors);
      message.error('验证失败');
    }
  });
}
</script>

<template>
  <div>
    <n-card :bordered="false">
      <n-form ref="formRef" :label-width="80" :model="formValue" :rules="rules" size="small">
        <n-form-item label="设备名称" path="name">
          <n-input v-model:value="formValue.name" placeholder="输入设备名称" />
        </n-form-item>
        <n-form-item label="标签" path="lable">
          <n-dynamic-tags v-model:value="formValue.lable" />
        </n-form-item>
        <n-form-item label="设备配置" path="device_config_id">
          <n-select v-model:value="formValue.device_config_id" placeholder="选择设备配置" :options="configOptions" />
        </n-form-item>
        <n-form-item>
          <n-button type="primary" attr-type="button" @click="handleValidateClick">完成</n-button>
        </n-form-item>
      </n-form>
    </n-card>
  </div>
</template>

<style scoped></style>
