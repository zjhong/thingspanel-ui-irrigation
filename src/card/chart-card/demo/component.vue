<script setup lang="ts">
import { ref } from 'vue';
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

const token = localStg.get('token');

console.log(props.card, '325435435:', props?.card?.dataSource?.deviceSource?.[0]?.deviceId, token);
if (props?.card?.dataSource?.deviceSource && props?.card?.dataSource?.deviceSource?.[0]?.deviceId) {
  wsUrl += `/telemetry/datas/current/keys/ws`;
  const keys = [props?.card?.dataSource?.deviceSource?.[0]?.metricsId];
  const { status, data, send, open, close } = useWebSocket(wsUrl);
  console.log(status, data, send, open, close, keys);
}
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
