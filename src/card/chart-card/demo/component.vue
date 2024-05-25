<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { useWebSocket } from '@vueuse/core';
import type { ICardData } from '@/components/panel/card';
import { localStg } from '@/utils/storage';
import { deviceDetail } from '../curve/modules/api';
// import icons from "./icon";
import { icons as iconOptions } from './icons';
import { createServiceConfig } from '~/env.config';

// const iconMap = new Map(icons.map((c) => [c.name, c.value]));
// 正式环境可根据api获取
const value = ref(1);
const detail: any = ref(null);
const intervalNum = ref();
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

const setSeries: (dataSource) => void = async dataSource => {
  const arr: any = dataSource;
  const querDetail = {
    device_id: dataSource.deviceSource[0]?.deviceId ?? '',
    keys: arr.deviceSource[0].metricsId
  };
  if (querDetail.device_id && querDetail.keys) {
    detail.value = await deviceDetail(querDetail);
  } else {
    // window.$message?.error("查询不到设备");
  }
};

watch(
  () => props.card?.dataSource?.deviceSource,
  () => {
    setSeries(props.card?.dataSource);
  },
  { deep: true }
);

onMounted(() => {
  // setSeries(props?.card?.dataSource);
  intervalNum.value = setInterval(() => {
    setSeries(props?.card?.dataSource);
  }, 500);
});

onUnmounted(() => {
  console.log(status.value);
  clearInterval(intervalNum.value);
  close();
});
</script>

<template>
  <div class="h-full">
    <!--
 <component
      :is="iconMap.get(card.config?.icon || 'm1')"
      class="text-lg"
      :style="{ color: card.config?.color }"
    /> 
-->
    <div class="h-full flex-col items-center">
      <!--
 <NCard
        v-if="card.dataSource?.origin === 'system'"
        :bordered="false"
        class="box"
      >
-->
      <NCard :bordered="false" class="box">
        <span class="name">
          {{ card?.dataSource?.deviceSource?.[0]?.metricsName }}
        </span>
        <NIcon class="iconclass" :color="props?.card?.config?.color || 'black'">
          <component :is="iconOptions[props?.card?.config?.iconName || 'ClipboardCode20Regular']" />
        </NIcon>
        <span class="value">{{ detail?.data && detail.data[0] ? detail.data[0]?.value : '' }}</span>
        <span class="unit">{{ detail?.data && detail.data[0] ? detail.data[0]?.unit : '' }}</span>
      </NCard>
    </div>
  </div>
</template>

<style scoped>
.items-center {
  padding: 0;
}
:deep(.n-card__content:first-child) {
  padding-top: 0;
}
.box {
  display: flex;
  position: relative;
  flex-direction: column;
  width: 100%;
  height: 100%;
}
.iconclass.n-icon svg {
  width: 100%;
  height: 100%;
}
.bt-data {
  margin-top: 20%;
  padding: 0 10%;
  position: relative;
}

.iconclass {
  position: absolute;
  bottom: 20%;
  left: 15%;
  width: 20%;
  height: 20%;
}

.unit {
  position: absolute;
  top: 30%;
  left: 70%;
  font-size: 2vw;
}

.name {
  position: absolute;
  top: 20%;
  left: 15%;
  font-size: 2vw;
}

.value {
  position: absolute;
  bottom: 18%;
  left: 55%;
  font-size: 5vw;
}
</style>
