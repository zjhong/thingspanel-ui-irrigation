<script lang="ts" setup>
import { inject, reactive, watch } from 'vue';
import type { ICardData, IConfigCtx } from '@/components/panel/card';
import { deviceDatas } from './api';
const form: any = reactive({
  active0: '',
  active1: ''
});
const ctx = inject<IConfigCtx>('config-ctx')!;

const props = defineProps<{
  // card: ICardData,
  data: ICardData;
}>();

const clickSwitch: () => void = async () => {
  const arr: any = props?.data?.dataSource;
  const device_id = arr.deviceSource[0]?.deviceId ?? '';
  const obj = {
    device_id,
    value: JSON.stringify({
      switch: form.active1 ?? form.active0
    })
  };
  await deviceDatas(obj);
  form.active1 = () => {
    return '';
  };
  form.active0 = () => {
    return '';
  };
};

watch(
  () => props.data?.dataSource?.deviceSource,
  () => {
    console.log(props?.data?.dataSource, '测试');
  },
  { deep: true, immediate: true }
);
</script>

<template>
  <div>
    <div class="title">设置设备默认的开启状态</div>
    <NForm :model="ctx.config">
      <NFormItem label="开启：">
        <n-input-number
          v-model:value="form.active1"
          placeholder="开启是1"
          min="1"
          max="1"
          :disabled="form.active0 === 0"
        />
      </NFormItem>
      <NFormItem label="关闭：">
        <n-input-number
          v-model:value="form.active0"
          placeholder="关闭是0"
          min="0"
          max="0"
          :disabled="form.active1 === 1"
        />
        <n-button type="info" class="btn" @click="clickSwitch">确定</n-button>
      </NFormItem>
    </NForm>
  </div>
</template>

<style lang="scss">
.title {
  font-weight: 900;
  font-size: 20px;
  margin-bottom: 20px;
}

.n-input-number > .n-input > .n-input-wrapper > .n-input__suffix {
  display: none !important;
}

.btn {
  margin-left: 20px;
}
</style>
