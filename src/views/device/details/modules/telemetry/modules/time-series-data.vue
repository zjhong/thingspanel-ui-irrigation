<script setup lang="ts">
import { defineProps, onMounted, reactive, ref } from 'vue';
import type { SelectOption } from 'naive-ui';
import { useMessage } from 'naive-ui';
import VChart from 'vue-echarts';
import { DiscOutline, FilterCircleOutline, RefreshCircleOutline, TimeOutline } from '@vicons/ionicons5';
import { use } from 'echarts/core';
import { BarChart, LineChart, ScatterChart } from 'echarts/charts';
import { GridComponent, LegendComponent, ToolboxComponent, TooltipComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import type { ComposeOption } from 'echarts/core';
import type { LineSeriesOption } from 'echarts/charts';
import type {
  GridComponentOption,
  LegendComponentOption,
  ToolboxComponentOption,
  TooltipComponentOption
} from 'echarts/components';
import { useFullscreen } from '@vueuse/core';
import { addMonths } from 'date-fns';
import dayjs from 'dayjs';
import { deviceTelemetryList } from '@/card/chart-card/curve/api';
import { useLoading } from '~/packages/hooks';

const tableData = ref<any[]>([]);

const chartRef = ref();
const { isFullscreen, toggle } = useFullscreen(chartRef);
const dateRange = ref<[number, number] | null>(null);
const message = useMessage();

use([
  TooltipComponent,
  LegendComponent,
  ToolboxComponent,
  GridComponent,
  LineChart,
  BarChart,
  ScatterChart,
  CanvasRenderer
]);

type EChartsOption = ComposeOption<
  TooltipComponentOption | LegendComponentOption | ToolboxComponentOption | GridComponentOption | LineSeriesOption
>;

interface Created {
  deviceId: string;
  theKey: string;
}

const props = defineProps<Created>();
const isAggregate = ref<boolean>(false);
const isTimeSelect = ref<boolean>(false);
const { loading, startLoading, endLoading } = useLoading();
const columns = [
  { title: '时间', key: 'x', render: row => dayjs(row.x).format('YYYY-MM-DD HH:mm:ss') },
  { title: '值', key: 'y' }
];
const pagination = reactive({
  page: 1,
  pageSize: 5,
  pageCount: 1,
  onChange: (page: number) => {
    pagination.page = page;
  }
});
const option = ref<EChartsOption>({
  baseOption: undefined,
  options: [],
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: [props.theKey]
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  toolbox: {
    right: 44,
    feature: {
      myTool1: {
        show: true,
        title: '切换折线图',
        icon: 'path://M-7.5 -1.036L-5.428 -1.036L-2.714 -7.4562L-0.5545 3.6333L2.2763 -2.1158L3.1518 1.6196L7.5 1.6196M-7.5 7.4562L7.5 7.4562',
        onclick: () => {
          if (option.value.series) {
            option.value.series[0].type = 'line';
          }
        }
      },
      myTool2: {
        show: true,
        title: '切换朱庄图',
        icon: 'path://M-6.2277 -1.9018L-3.5491 -1.9018L-3.5491 4.8214L-6.2277 4.8214L-6.2277 -1.9018ZM-1.3527 -4.5536L1.3259 -4.5536L1.3259 4.8214L-1.3527 4.8214L-1.3527 -4.5536ZM3.5491 -7.5L6.2277 -7.5L6.2277 4.8214L3.5491 4.8214L3.5491 -7.5ZM-7.192 7.5L7.192 7.5\n',
        onclick: () => {
          if (option.value.series) {
            option.value.series[0].type = 'bar';
          }
        }
      },
      myTool3: {
        show: true,
        title: '切换散点图',
        icon: 'path://M6 6V42H42 M20 24C22.2091 24 24 22.2091 24 20C24 17.7909 22.2091 16 20 16C17.7909 16 16 17.7909 16 20C16 22.2091 17.7909 24 20 24Z M37 16C39.7614 16 42 13.7614 42 11C42 8.23858 39.7614 6 37 6C34.2386 6 32 8.23858 32 11C32 13.7614 34.2386 16 37 16Z M15 36C16.6569 36 18 34.6569 18 33C18 31.3431 16.6569 30 15 30C13.3431 30 12 31.3431 12 33C12 34.6569 13.3431 36 15 36Z M33 32C34.6569 32 36 30.6569 36 29C36 27.3431 34.6569 26 33 26C31.3431 26 30 27.3431 30 29C30 30.6569 31.3431 32 33 32Z\n',
        onclick: () => {
          if (option.value.series) {
            option.value.series[0].type = 'scatter';
          }
        }
      }
    }
  },
  xAxis: {
    boundaryGap: false,
    type: 'time' as 'category'
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: [],
      type: 'line',
      smooth: true
    }
  ]
});
const d_end_time = new Date().getTime();
// 获取1小时前的时间
const d_start_time = d_end_time - 3600000;
const params = reactive({
  device_id: props.deviceId,
  key: props.theKey,
  start_time: d_start_time,
  end_time: d_end_time,
  aggregate_function: '',
  aggregate_window: 'no_aggregate',
  time_range: 'custom'
});
const timeOptions: SelectOption[] = [
  { label: '自定义', value: 0 },
  { label: '最近5分钟', value: 300000 },
  { label: '最近15分钟', value: 900000 },
  { label: '最近30分钟', value: 1800000 },
  { label: '最近1小时', value: 3600000 },
  { label: '最近3小时', value: 10800000 },
  { label: '最近6小时', value: 21600000 },
  { label: '最近12小时', value: 43200000 },
  { label: '最近24小时', value: 86400000 },
  { label: '最近3天', value: 259200000 },
  { label: '最近7天', value: 604800000 },
  { label: '最近15天', value: 1296000000 },
  { label: '最近30天', value: 2592000000 },
  { label: '最近60天', value: 5184000000 },
  { label: '最近90天', value: 7776000000 },
  { label: '最近6个月', value: 15811200000 },
  { label: '最近1年', value: 31536000000 },
  { label: '今天', value: 28740000 },
  { label: '昨天', value: 86400000 },
  { label: '前天', value: 172800000 },
  { label: '上周今日', value: 604800000 },
  { label: '本周', value: 518400000 },
  { label: '上周', value: 604800000 },
  { label: '本月', value: 2592000000 },
  { label: '上个月', value: 2592000000 },
  { label: '今年', value: 7776000000 },
  { label: '去年', value: 31536000000 }
];

const aggregateOptions: SelectOption[] = [
  { label: '不聚合', value: 'no_aggregate', disabled: false },
  { label: '30秒', value: '30s', disabled: false },
  { label: '1分钟', value: '1m', disabled: false },
  { label: '2分钟', value: '2m', disabled: false },
  { label: '5分钟', value: '5m', disabled: false },
  { label: '10分钟', value: '10m', disabled: false },
  { label: '30分钟', value: '30m', disabled: false },
  { label: '1小时', value: '1h', disabled: false },
  { label: '3小时', value: '3h', disabled: false },
  { label: '6小时', value: '6h', disabled: false },
  { label: '1天', value: '1d', disabled: false },
  { label: '7天', value: '7d', disabled: false },
  { label: '1月', value: '1mo', disabled: false }
];
const aggregateOptionsValue = ref<string>('');
const aggregateFunctionOptions: SelectOption[] = [
  { label: '平均数', value: 'avg' },
  { label: '最大值', value: 'max' }
];
const aggregateFunctionValue = ref<string>('avg');
const getTelemetryList = async () => {
  if (!props.deviceId || !props.theKey) {
    return;
  }

  startLoading();

  const { data, error } = await deviceTelemetryList({
    ...params
  });
  if (!error) {
    if (option.value.series) {
      tableData.value = data;
      pagination.pageCount = Math.ceil(data?.length || 1 / pagination.pageSize);
      option.value.series[0].data = data.map(item => {
        return [item.x, item.y];
      });
      endLoading();
    }
  }
};
const updateSggregateFunction = v => {
  aggregateFunctionValue.value = v;
  params.aggregate_function = v;
  getTelemetryList();
};

const updateDisabledOptions = (timeFrame: string) => {
  const disableBeforeIndex: { [key: string]: number } = {
    最近3小时: 1, // 30秒
    最近6小时: 2, // 1分钟
    最近12小时: 3, // 2分钟
    最近24小时: 4, // 5分钟
    最近3天: 5, // 10分钟
    最近7天: 6, // 30分钟
    最近15天: 7, // 1小时
    最近30天: 7, // 1小时
    最近60天: 8, // 3小时
    最近90天: 9, // 6小时
    最近6个月: 9, // 6小时
    最近1年: 12, // 1月
    今天: 4, // 5分钟
    昨天: 4, // 5分钟
    前天: 4, // 5分钟
    上周今日: 4, // 5分钟
    本周: 6, // 30分钟
    上周: 6, // 30分钟
    本月: 7, // 1小时
    上个月: 7, // 1小时
    今年: 12, // 1月
    去年: 12 // 1月
  };
  aggregateFunctionValue.value = 'avg';
  params.aggregate_function = 'avg';
  // 默认不禁用“不聚合”，根据时间范围禁用其余选项
  // eslint-disable-next-line @typescript-eslint/no-shadow
  aggregateOptions.forEach((item, index, array) => {
    item.disabled = index <= (disableBeforeIndex[timeFrame] || 0);
    if (index <= (disableBeforeIndex[timeFrame] || 0)) {
      aggregateOptionsValue.value = array[index + 1].value as string;
      params.aggregate_window = aggregateOptionsValue.value;
    }
  });
};

const updateTime = (v: number, o: SelectOption) => {
  let now = new Date();
  let start_time: Date;
  let end_time: Date = new Date();
  isAggregate.value = true;
  updateDisabledOptions(o.label as string);
  switch (o.label) {
    case '自定义':
      isTimeSelect.value = true;
      isAggregate.value = false;
      return;
    case '今天':
      start_time = new Date(now.setHours(0, 0, 0, 0));
      now = new Date(); // 重新获取当前时间，避免修改
      end_time = new Date(now.setHours(23, 59, 59, 999));
      break;
    case '昨天':
      start_time = new Date();
      start_time.setDate(now.getDate() - 1);
      start_time.setHours(0, 0, 0, 0);
      end_time = new Date(start_time);
      end_time.setHours(23, 59, 59, 999);
      break;
    case '前天':
      start_time = new Date();
      start_time.setDate(start_time.getDate() - 2); // 设置为两天前的日期
      start_time.setHours(0, 0, 0, 0); // 那一天的开始
      end_time = new Date(start_time);
      end_time.setHours(23, 59, 59, 999); // 那一天的结束一天的结束
      break;
    case '本周':
      // eslint-disable-next-line no-case-declarations
      const currentDayOfWeek = now.getDay(); // 当前是周几，周日为0
      // eslint-disable-next-line no-case-declarations
      const distanceToMonday = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek; // 计算到周一需要回退的天数
      start_time = new Date();
      start_time.setDate(now.getDate() + distanceToMonday); // 设置为本周一
      start_time.setHours(0, 0, 0, 0); // 本周一的开始
      end_time = new Date(); // 本周的当前时间
      break;
    case '上周':
      // eslint-disable-next-line no-case-declarations
      const daysToLastMonday = now.getDay() === 0 ? -6 : 1; // 如果今天是周日，则上周一是6天前
      start_time = new Date();
      start_time.setDate(now.getDate() - now.getDay() - daysToLastMonday);
      start_time.setHours(0, 0, 0, 0);
      end_time = new Date(start_time);
      end_time.setDate(start_time.getDate() + 6);
      end_time.setHours(23, 59, 59, 999);
      break;
    case '本月':
      start_time = new Date(now.getFullYear(), now.getMonth(), 1);
      end_time = now;
      break;
    case '上个月':
      start_time = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      end_time = new Date(now.getFullYear(), now.getMonth(), 0);
      break;
    case '今年':
      start_time = new Date(now.getFullYear(), 0, 1);
      end_time = now;
      break;
    case '去年':
      start_time = new Date(now.getFullYear() - 1, 0, 1);
      end_time = new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59, 999);
      break;
    default:
      start_time = new Date(now.getTime() - v);
      end_time = new Date();
  }
  isTimeSelect.value = false;

  params.start_time = start_time.getTime();
  params.end_time = end_time.getTime();
  getTelemetryList();
};
const checkDateRange = value => {
  const [start, end] = value;
  if (start && end && addMonths(start, 1) < end) {
    dateRange.value = null;
    message.error('日期范围不能超过一个月');
  } else {
    params.start_time = start;
    params.end_time = end;
    getTelemetryList();
  }
};
const updateAggregate = (v: string) => {
  aggregateOptionsValue.value = v;
  params.aggregate_window = v;
  aggregateFunctionValue.value = 'avg';
  params.aggregate_function = 'avg';
  getTelemetryList();
};

const reFresh = () => {
  isAggregate.value = false;
  params.start_time = d_start_time;
  params.end_time = d_end_time;
  params.aggregate_window = 'no_aggregate';
  params.aggregate_function = '';
  params.time_range = 'custom';
  pagination.page = 1;
  getTelemetryList();
};

onMounted(getTelemetryList);
</script>

<template>
  <div ref="chartRef" class="m--6 ml--4 mr--4">
    <div :class="`${isFullscreen ? 'm-0' : 'mb-4 mt--16'} flex items-center justify-between`">
      <div class="relative top-56px z-9999 ml-4 w-300px flex justify-start">
        <n-popselect class="mr-4px" :options="timeOptions" trigger="hover" scrollable @update:value="updateTime">
          <n-icon size="24" class="hover:text-primary-500">
            <TimeOutline />
          </n-icon>
        </n-popselect>
        <n-date-picker
          v-if="isTimeSelect"
          v-model:value="dateRange"
          class="w-300px"
          type="datetimerange"
          @update:value="checkDateRange"
        />
        <n-popselect
          v-if="isAggregate"
          v-model:value="aggregateOptionsValue"
          class="mr-4px"
          :options="aggregateOptions"
          trigger="hover"
          scrollable
          @update:value="updateAggregate"
        >
          <n-icon size="24" class="hover:text-primary-500">
            <DiscOutline />
          </n-icon>
        </n-popselect>
        <n-popselect
          v-if="isAggregate"
          v-model:value="aggregateFunctionValue"
          class="mr-4px"
          :options="aggregateFunctionOptions"
          trigger="hover"
          scrollable
          @update:value="updateSggregateFunction"
        >
          <n-icon size="24" class="hover:text-primary-500">
            <FilterCircleOutline />
          </n-icon>
        </n-popselect>
        <n-icon size="24" class="hover:text-primary-500" @click="reFresh">
          <RefreshCircleOutline />
        </n-icon>
      </div>
      <div class="relative top-56px z-9999">
        <FullScreen v-if="!isFullscreen" :full="isFullscreen" @click="toggle" />
      </div>
    </div>
    <VChart :class="`${isFullscreen ? 'h-full' : 'h-320px'}  p-2 bg-container`" :option="option" autoresize />
  </div>

  <div class="mt-8">
    <n-data-table :loading="loading" :columns="columns" :data="tableData" :pagination="pagination" />
  </div>
</template>

<style scoped></style>
