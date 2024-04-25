<script lang="ts" setup>
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { NCard } from 'naive-ui';
import type { ICardData } from '@/components/panel/card';
import { localStg } from '@/utils/storage';
import { deviceDatas } from './api';
import { createServiceConfig } from '~/env.config';

const active: any = ref(false);
const props = defineProps<{
  card: ICardData;
}>();
const socket: any = ref(null);
// sendMessage()
const setSeries: (obj: any) => void = async obj => {
  const arr: any = props?.card?.dataSource;
  const queryInfo = {
    device_id: obj.deviceSource[0]?.deviceId ?? '',
    keys: [arr.deviceSource[0].metricsId || 'externalVol'],
    token: localStg.get('token')
  };
  console.log(arr.deviceSource[0].metricsId, '11');
  if (socket.value && socket.value.readyState === WebSocket.OPEN) {
    socket.value.send(JSON.stringify(queryInfo)); // 将对象转换为JSON字符串后发送
  } else {
    console.error('WebSocket连接未建立或已关闭');
  }
};

const fun: () => void = () => {
  const { otherBaseURL } = createServiceConfig(import.meta.env);
  let wsUrl = otherBaseURL.demo.replace('http', 'ws');
  wsUrl += `/telemetry/datas/current/keys/ws`;
  socket.value = new WebSocket(wsUrl); // 替换为你的WebSocket URL

  socket.value.onopen = () => {
    setSeries(props?.card?.dataSource);
    console.log('WebSocket连接已打开');
  };

  socket.value.onmessage = event => {
    const receivedData = JSON.parse(event.data);
    active.value = receivedData.LightIntensity !== 0;
    console.log('接收到数据:', receivedData);
    // 在这里处理接收到的数据
  };

  socket.value.onerror = error => {
    console.error('WebSocket错误:', error);
  };

  socket.value.onclose = () => {
    console.log('WebSocket连接已关闭');
  };
};

const clickSwitch: () => void = async () => {
  const arr: any = props?.card?.dataSource;
  const device_id = arr.deviceSource[0]?.deviceId ?? '';
  console.log(arr.deviceSource[0], '测试4');
  const obj = {
    device_id,
    value: JSON.stringify({
      switch: active.value
    })
  };
  await deviceDatas(obj);
  fun();
};

watch(
  () => props.card?.dataSource?.deviceSource,
  () => {
    setSeries(props?.card?.dataSource);
  },
  { deep: true }
);
onMounted(() => {
  fun();
});
onUnmounted(() => {
  if (socket.value) {
    socket.value.close();
  }
});
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
