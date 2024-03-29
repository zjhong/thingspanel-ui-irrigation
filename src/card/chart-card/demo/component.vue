<script setup lang="ts">
import { onUnmounted, ref, watch } from 'vue';
import { useWebSocket } from '@vueuse/core';
import type { ICardData } from '@/components/panel/card';
import { localStg } from '@/utils/storage';
import icons from './icon';
import { createServiceConfig } from '~/env.config';

const iconMap = new Map(icons.map(c => [c.name, c.value]));
// 正式环境可根据api获取
const value = ref(1);
const props = defineProps<{
  card: ICardData;
  // mode: IConfigCtx['view'];
}>();
console.log(props.card);
const { otherBaseURL } = createServiceConfig(import.meta.env);
let wsUrl = otherBaseURL.demo.replace('http', 'ws').replace('http', 'ws');
wsUrl += `/telemetry/datas/current/keys/ws`;
// eslint-disable-next-line no-constant-binary-expression
const keys = ['externalVol' || props?.card?.dataSource?.deviceSource?.[0]?.metricsId];
const { data, status, send, close } = useWebSocket(wsUrl, {
  heartbeat: {
    message: 'ping',
    interval: 8000,
    pongTimeout: 3000
  }
});

if (props?.card?.dataSource?.deviceSource && props?.card?.dataSource?.deviceSource?.[0]?.deviceId) {
  const token = localStg.get('token');
  const dataw = {
    // eslint-disable-next-line no-constant-binary-expression
    device_id: '84fd5c8f-9c6c-ea57-a7b7-d32dce6b65af' || props?.card?.dataSource?.deviceSource?.[0]?.deviceId,
    keys,
    token
  };
  send(JSON.stringify(dataw));
}

function useRandomInt(min, max) {
  const randomInt = ref(Math.floor(Math.random() * (max - min + 1)) + min);
  return randomInt;
}

watch(
  () => data.value,
  newVal => {
    if (newVal === 'pong') {
      console.log('心跳');
      value.value = useRandomInt(1, 24).value as number;
    } else {
      value.value = JSON.parse(newVal)[keys[0]] as number;
      console.log(newVal);
    }
  }
);
onUnmounted(() => {
  console.log(status.value);
  close();
});
</script>

<template>
  <div class="h-full flex items-center">
    <component :is="iconMap.get(card.config?.icon || 'm1')" class="text-lg" :style="{ color: card.config?.color }" />
    <span v-if="card.dataSource?.origin === 'system'" class="ml-2">
      数据名：{{ card.dataSource.systemSource?.[0]?.name }}
    </span>
    <span class="ml-2">值：{{ value }}</span>
  </div>
</template>
