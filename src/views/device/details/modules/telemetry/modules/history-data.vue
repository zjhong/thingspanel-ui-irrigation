<script setup lang="ts">
import { defineProps, onMounted, reactive, ref } from 'vue';
import { useMessage } from 'naive-ui';
import dayjs from 'dayjs';
import { addMonths } from 'date-fns';
import { telemetryHistoryData } from '@/service/api';
import { useLoading } from '~/packages/hooks';

interface Created {
  deviceId: string;
  theKey: string;
}

const props = defineProps<Created>();

interface Params {
  device_id: string;
  end_time: number;
  start_time: number;
  export_excel: boolean;
  key: string;
}

interface HistoryData {
  key: string;
  ts: string;
  value: number;
}

const { loading, startLoading, endLoading } = useLoading();
const currentDate = new Date();
const startTime = new Date(currentDate);

// 获取上一天的时间戳（毫秒）
currentDate.setDate(currentDate.getDate() - 1); // 设置日期为上一天
// 获取当前具体时间的毫秒数
const end_time = dayjs().valueOf();

// 获取上一天当前时刻的毫秒数
const start_time = dayjs().subtract(1, 'day').valueOf();

const params = reactive<Params>({
  device_id: props.deviceId,
  end_time,
  start_time,
  export_excel: false,
  key: props.theKey
});
const message = useMessage();
const pagination = reactive({
  page: 1,
  pageSize: 5,
  pageCount: 1,
  onChange: (page: number) => {
    pagination.page = page;
  }
});

const dateRange = ref<[number, number] | null>(null);
const tableData = ref<HistoryData[]>([]);
const columns = [
  { title: '时间', key: 'time', render: row => dayjs(row.ts).format('YYYY-MM-DD HH:mm:ss') },
  { title: '数据标识符', key: 'key' },
  { title: '值', key: 'value' }
];
const getTelemetryHistoryData = async () => {
  if (!props.deviceId && !props.theKey) {
    tableData.value = [];
    return;
  }
  startLoading();
  const { data, error } = await telemetryHistoryData(params);

  if (params.export_excel) {
    endLoading();
  }
  if (!error && !params.export_excel) {
    tableData.value = data || [];
    pagination.pageCount = Math.ceil(data?.length || 1 / pagination.pageSize);
    endLoading();
  }
};
const checkDateRange = value => {
  const [start, end] = value;
  if (start && end && addMonths(start, 1) < end) {
    dateRange.value = null;
    message.error('日期范围不能超过一个月');
  } else {
    params.start_time = start;
    params.end_time = end;
    params.export_excel = false;
    getTelemetryHistoryData();
  }
};

const refresh = () => {
  params.end_time = currentDate.getTime();
  params.start_time = startTime.getTime();
  params.export_excel = false;
  dateRange.value = null;
  pagination.page = 1;
  getTelemetryHistoryData();
};
onMounted(getTelemetryHistoryData);
</script>

<template>
  <n-card>
    <n-flex justify="space-between" align="center">
      <n-flex justify="space-between" align="center">
        <n-date-picker v-model:value="dateRange" class="w-300px" type="daterange" @update:value="checkDateRange" />
        <n-button class="ml-2" @click="refresh">刷新</n-button>
      </n-flex>

      <n-button
        type="primary"
        @click="
          () => {
            params.export_excel = true;
            getTelemetryHistoryData();
          }
        "
      >
        导出
      </n-button>
    </n-flex>
    <div class="mt-4">
      <n-text v-if="!dateRange" depth="3">！默认查询最近24小时的数据</n-text>
      <n-data-table :loading="loading" :columns="columns" :data="tableData" :pagination="pagination" />
    </div>
  </n-card>
</template>

<style scoped></style>
