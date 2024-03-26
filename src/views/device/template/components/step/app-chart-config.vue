<script setup lang="tsx">
import { defineEmits, ref } from 'vue';
import { useDeviceDataStore } from '@/store/modules/device/index';
import { $t } from '@/locales';

const emit = defineEmits(['update:stepCurrent', 'update:modalVisible']);
const counterStore = useDeviceDataStore();

const props = defineProps({
  // 当前的步骤
  stepCurrent: {
    type: Number,
    required: true
  },
  // 添加用的模态框状态
  modalVisible: {
    type: Boolean,
    required: true
  },
  // 当前的设备模型id
  DeviceTemplateId: {
    type: String,
    required: true
  }
});
const DeviceTemplateId = ref<string>(props.DeviceTemplateId);

console.log(props, counterStore, '参数');

// 取消
const cancellation: () => void = () => {
  emit('update:modalVisible');
};
// 上一步
const back: () => void = () => {
  console.log('点击了上一步');
  counterStore.executeEdit(DeviceTemplateId);
  emit('update:stepCurrent', 2);
};
// 下一步
const next: () => void = () => {
  console.log('点击了下一步');
};
</script>

<template>
  <div>
    app图表配置
    <div class="box1 m-t2">
      <NButton @click="next">{{ $t('device_template.nextStep') }}</NButton>
      <NButton class="m-r3" @click="back">{{ $t('device_template.back') }}</NButton>
      <NButton class="m-r3" @click="cancellation">{{ $t('device_template.cancellation') }}</NButton>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.box1 {
  display: flex;
  flex-direction: row-reverse;
}
</style>
