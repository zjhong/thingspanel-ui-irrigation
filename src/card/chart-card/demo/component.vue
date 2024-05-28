<script setup lang="ts">
import { onBeforeUnmount, onMounted, onUnmounted, ref, watch } from 'vue';
import { useWebSocket } from '@vueuse/core';
import type { ICardData } from '@/components/panel/card';
import { localStg } from '@/utils/storage';
import { deviceDetail } from '../curve/modules/api';
import { icons as iconOptions } from './icons';
import { createServiceConfig } from '~/env.config';

// 正式环境可根据api获取
const value = ref(1);
const detail: any = ref(null);
const intervalNum = ref();
const props = defineProps<{
  card: ICardData;
}>();
const fontSize = ref('14px');

const myCard = ref<any | null>(null); // 创建一个ref来引用NCard
let resizeObserver: ResizeObserver | null = null;

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

const handleResize = entries => {
  for (const entry of entries) {
    // 根据卡片宽度动态调整字体大小，这里仅为示例逻辑，实际应用中需按需调整
    const dFontSize = `${entry.contentRect.width / 20}px`; // 假设字体大小与宽度成反比，20为比例系数
    console.log('font size:', dFontSize);
    fontSize.value = dFontSize;
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
  // 确保DOM已经挂载后再初始化ResizeObserver
  if (myCard.value) {
    resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(myCard.value.$el);
  }
});

onBeforeUnmount(() => {
  // 组件卸载前清除观察器
  if (resizeObserver) {
    resizeObserver.disconnect();
    resizeObserver = null;
  }
});

onUnmounted(() => {
  console.log(status.value);
  clearInterval(intervalNum.value);
  close();
});
</script>

<template>
  <div class="h-full">
    <div class="h-full flex-col items-center">
      <NCard ref="myCard" :bordered="false" class="box">
        <div class="bt-data" :style="'font-size:' + fontSize">
          <span class="name">
            {{ card?.dataSource?.deviceSource?.[0]?.metricsName }}
          </span>
          <NIcon class="iconclass" :color="props?.card?.config?.color || 'black'">
            <component :is="iconOptions[props?.card?.config?.iconName || 'ClipboardCode20Regular']" />
          </NIcon>
          <div class="value-wrap">
            <span class="value">{{ detail?.data && detail.data[0] ? detail.data[0]?.value : '' }}</span>
            <span class="unit">
              {{ props?.card?.config?.unit || (detail?.data && detail.data[0] ? detail.data[0]?.unit : '') }}
            </span>
          </div>
        </div>
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
  width: 100%;
  height: 100%;
}

.iconclass {
  position: absolute;
  bottom: 20%;
  left: 15%;
  width: 25%;
  height: 25%;
}

.value-wrap {
  position: absolute; /* 新增: 使得 .unit 可以相对于此元素定位 */
  display: inline-block; /* 确保包裹元素不影响外部布局 */
  bottom: 16%;
  left: 60%;
  width: 40%;
}

.unit {
  position: absolute;
  top: -10%; /* 调整数值以适应你的具体需求 */
  right: 10%; /* 调整数值以适应你的具体需求 */
  font-size: 1em;
  transform: translateY(-50%); /* 可选: 微调垂直对齐 */
}

.name {
  position: absolute;
  top: 15%;
  left: 15%;
  font-size: 1.2em;
}

.value {
  font-size: 2.5em;
}
</style>
