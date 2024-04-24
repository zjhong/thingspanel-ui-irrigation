<script lang="ts" setup>
import { ref } from 'vue';
import { NCard } from 'naive-ui';
import type { ICardData } from '@/components/panel/card';
import { deviceDatas } from './api';
const active: any = ref(false);
const props = defineProps<{
  card: ICardData;
}>();

const clickSwitch: () => void = async () => {
  const arr: any = props?.card?.dataSource;
  const device_id = arr.deviceSource[0]?.deviceId ?? '';
  console.log(props?.card, '测试4');
  const obj = {
    device_id,
    value: JSON.stringify({
      switch: false
    })
  };
  const res = await deviceDatas(obj);
  console.log(res, ' 相信');
};
</script>

<template>
  <NCard :bordered="false" class="card-wrapper">
    <n-switch v-model:value="active" @change="clickSwitch" />
    <div class="switch">开关</div>
  </NCard>
</template>

<style lang="scss">
.card-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;

  .switch {
    margin-top: 20px;
    text-align: center;
  }
}
</style>
