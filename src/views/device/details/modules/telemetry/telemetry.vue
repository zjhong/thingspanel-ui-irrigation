<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue';
import type { NumberAnimationInst } from 'naive-ui';
import dayjs from 'dayjs';
import { DocumentOnePage24Regular, Timer16Regular } from '@vicons/fluent';
import { useWebSocket } from '@vueuse/core';
import { getTelemetryLogList, telemetryDataCurrent, telemetryDataPub } from '@/service/api';
import { localStg } from '@/utils/storage';
import HistoryData from './modules/history-data.vue';
import TimeSeriesData from './modules/time-series-data.vue';
import { useLoading } from '~/packages/hooks';
import { createServiceConfig } from '~/env.config';

const props = defineProps<{
  id: string;
}>();

const { otherBaseURL } = createServiceConfig(import.meta.env);
let wsUrl = otherBaseURL.demo.replace('http', 'ws').replace('http', 'ws');
wsUrl += `/telemetry/datas/current/ws`;
// eslint-disable-next-line no-constant-binary-expression

const { data, status, send, close } = useWebSocket(wsUrl, {
  heartbeat: {
    message: 'ping',
    interval: 8000,
    pongTimeout: 3000
  }
});
const showDialog = ref(false);
const showHistory = ref(false);
const telemetryId = ref();
const telemetryKey = ref();
const modelType = ref<string>('');

const formValue = ref('');
const operationType = ref('');
const sendResult = ref('');
const tableData = ref([]);

const telemetryData = ref<DeviceManagement.telemetryData[]>([]);
const numberAnimationInstRef = ref<NumberAnimationInst[] | []>([]);
const telemetry = ref<any>({});
const nowTime = ref<any>();
const { loading, startLoading, endLoading } = useLoading();
const total = ref(0);

const operationOptions = [
  { label: '全部', value: '' },
  { label: '手动操作', value: '1' },
  { label: '触发操作', value: '2' }
  // 其他操作类型选项...
];
const resultOptions = [
  { label: '全部', value: '' },
  { label: '成功', value: '1' },
  { label: '失败', value: '2' }
  // 其他发送结果选项...
];
const cardHeight = ref(160); // 卡片的高度
const cardMargin = ref(15); // 卡片的间距
const log_page = ref(1);
const columns = [
  { title: '指令', key: 'data' },
  {
    title: '操作类型',
    key: 'operation_type',
    render: row => (row.operation_type === '1' ? '手动操作' : '自动触发')
  },
  { title: '操作用户', key: 'user_id' },
  {
    title: '操作时间',
    key: 'created_at',
    render: row => dayjs(row.created_at).format('YYYY-MM-DD HH:mm:ss')
  },
  {
    title: '发送结果',
    key: 'status',
    render: row => (row.status === '1' ? '成功' : '失败')
  }
];

const openDialog = () => {
  showDialog.value = true;
};
const fetchData = async () => {
  startLoading();
  // eslint-disable-next-line @typescript-eslint/no-shadow
  const { data, error } = await getTelemetryLogList({
    page: log_page.value,
    page_size: 5,
    device_id: props.id,
    operation_type: operationType.value,
    status: sendResult.value
  });
  if (!error) {
    tableData.value = data?.value || data.list;
    total.value = Math.ceil(data.count / 5);
    endLoading();
  }
};

const sends = async () => {
  // 发送属性的逻辑...
  const { error } = await telemetryDataPub({
    device_id: props.id,
    value: formValue.value
  });
  if (!error) {
    showDialog.value = false;
    fetchData();
  }
};

const token = localStg.get('token');

const fetchTelemetry = async () => {
  // eslint-disable-next-line @typescript-eslint/no-shadow
  const { data, error } = await telemetryDataCurrent(props.id);
  if (!error && data) {
    telemetryData.value = data;

    const dataw = {
      // eslint-disable-next-line no-constant-binary-expression
      device_id: props.id,
      token
    };
    send(JSON.stringify(dataw));
  }
};
const setItemRef = el => {
  console.log(el);

  if (el) {
    const index = el.$attrs['data-index'];
    numberAnimationInstRef.value[index] = el;
  }
};
onMounted(() => {
  fetchData();
  fetchTelemetry();
});
onUnmounted(() => {
  if (status.value === 'OPEN') {
    close();
  }
});
watch(
  () => data.value,
  newVal => {
    if (newVal === 'pong') {
      console.log('心跳');
    } else {
      telemetry.value = JSON.parse(newVal);
      nowTime.value = dayjs().format('YYYY-MM-DD HH:mm:ss');
      numberAnimationInstRef.value.forEach(i => {
        i?.play();
      });
    }
  }
);
</script>

<template>
  <n-card class="w-full">
    <!-- 第一行 -->
    <n-button type="primary" class="mb-4" @click="openDialog">下发控制</n-button>
    <n-modal v-model:show="showDialog" title="下发属性" class="w-[400px]">
      <n-card>
        <n-form>
          <n-form-item label="属性">
            <n-input v-model:value="formValue" type="textarea" />
          </n-form-item>
          <n-space align="end">
            <n-button @click="showDialog = false">取消</n-button>
            <n-button @click="sends">发送</n-button>
          </n-space>
        </n-form>
      </n-card>
    </n-modal>

    <n-modal v-model:show="showHistory" title="遥测历史数据" class="w-[600px]">
      <NCard>
        <HistoryData v-if="modelType === '历史'" :device-id="telemetryId" :the-key="telemetryKey" />
        <TimeSeriesData v-if="modelType === '时序'" :device-id="telemetryId" :the-key="telemetryKey" />
      </NCard>
    </n-modal>
    <!-- 第二行 -->
    <n-card class="mb-4">
      <n-grid :x-gap="cardMargin" :y-gap="cardMargin" cols="1 600:2 900:3 1200:4">
        <n-gi v-for="(i, index) in telemetryData" :key="i.tenant_id">
          <n-card header-class="border-b h-36px" hoverable :style="{ height: cardHeight + 'px' }">
            <div class="card-body">
              <!--              <span>{{ telemetry[i.key] || i.value }}</span>-->
              <span>
                <n-number-animation
                  :ref="setItemRef"
                  :data-index="index"
                  :precision="1"
                  :duration="800"
                  :from="0.0"
                  :to="telemetry[i.key] || i.value"
                />
              </span>

              <span>{{ i.unit }}</span>
            </div>
            <template #header>
              <div class="line1" :title="i.key">
                <template v-if="i.lable">
                  <span v-if="i.lable">{{ i.lable }}</span>
                  <span>({{ i.key }})</span>
                </template>
                <template v-else>
                  <span>{{ i.key }}</span>
                </template>
              </div>
            </template>
            <template #footer>
              <div class="flex justify-end">
                {{ telemetry[i.key] ? nowTime : dayjs(i.ts).format('YYYY-MM-DD HH:mm:ss') }}
              </div>
            </template>
            <template #header-extra>
              <div class="h-24px w-120px flex items-center justify-end">
                <NIcon
                  size="24"
                  @click="
                    () => {
                      modelType = '历史';
                      telemetryKey = i.key;
                      telemetryId = i.device_id;
                      showHistory = true;
                    }
                  "
                >
                  <DocumentOnePage24Regular />
                </NIcon>

                <NDivider vertical />
                <NIcon
                  size="24"
                  @click="
                    () => {
                      modelType = '时序';
                      telemetryKey = i.key;
                      telemetryId = i.device_id;
                      showHistory = true;
                    }
                  "
                >
                  <Timer16Regular />
                </NIcon>
              </div>
            </template>
          </n-card>
        </n-gi>
      </n-grid>
    </n-card>
    <!-- 第三行 -->
    <n-space>
      <n-select
        v-model:value="operationType"
        :options="operationOptions"
        style="width: 200px"
        @update:value="fetchData"
      />
      <n-select v-model:value="sendResult" :options="resultOptions" style="width: 200px" @update:value="fetchData" />
    </n-space>

    <!-- 第四行 -->

    <n-data-table :loading="loading" class="mt-4" :columns="columns" :data="tableData" :pagination="false" />
    <div class="mt-4 w-full flex justify-end">
      <n-pagination
        :page-count="total"
        :page-size="5"
        @update:page="
          page => {
            log_page = page;
            fetchData();
          }
        "
      />
    </div>
  </n-card>
</template>

<style scoped>
.line1 {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  span {
    &:nth-child(2) {
      color: #ccc;
      padding-left: 5px;
    }
  }
}

.card-body {
  padding: 10px 0 10px;
  display: flex;
  align-items: end;
  gap: 4px;

  span {
    &:first-child {
      font-size: 32px;
      line-height: 1;
    }
  }
}
</style>
