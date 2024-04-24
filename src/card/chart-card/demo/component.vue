<script setup lang="ts">
import { onUnmounted, ref, watch } from 'vue';
import { useWebSocket } from '@vueuse/core';
import { ClipboardCode20Regular } from '@vicons/fluent';
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

watch(
  () => data.value,
  newVal => {
    if (newVal === 'pong') {
      console.log('心跳');
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
  <div class="h-full">
    <component :is="iconMap.get(card.config?.icon || 'm1')" class="text-lg" :style="{ color: card.config?.color }" />
    <div class="h-full flex-col items-center">
      <NCard v-if="card.dataSource?.origin === 'system'" class="box">
        <div class="top-data">
          <span class="name">
            {{ card.dataSource.deviceSource?.[0]?.metricsName }}
          </span>
          <!--
 <span class="unit">{{
            card.dataSource.unit ? card.dataSource.unit : "_/_"
          }}</span>
-->
        </div>
        <div class="bt-data">
          <NIcon size="44"><ClipboardCode20Regular /></NIcon>
          <div>
            <span class="value">{{ card.dataSource.sourceNum }}</span>
          </div>
          <span class="unit">_/_</span>
        </div>
      </NCard>
      <!--
 <div v-if="card.dataSource?.origin === 'system'">
        <div class="bt-data">
          <NIcon size="24"><ClipboardCode20Filled /></NIcon>
          <div class="text-center text-24px">{{ value }}</div>
        </div>
        数据名：{{ card.dataSource.deviceSource?.[0]?.metricsName }}
      </div>
-->
      <!--
 <NCard :bordered="false">
        <div class="text-center text-24px">{{ value }}</div>
      </NCard>
-->
    </div>
  </div>
</template>

<style scoped>
.items-center {
  padding: 0;
}
.box {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 50px;
  border-radius: 10px;
}
.top-data,
.bt-data {
  display: flex;
  padding: 0 30px;
  width: 100%;
  justify-content: space-between;
  align-items: center;
}

.bt-data {
  margin-top: 30px;
  position: relative;
}

.unit {
  position: absolute;
  top: 0;
  right: 30px;
}

.name {
  font-size: 20px;
}

.value {
  font-size: 48px;
  margin-right: 40px;
}
</style>
