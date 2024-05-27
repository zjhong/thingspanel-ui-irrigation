<script lang="ts" setup>
import { onMounted, onUnmounted, reactive, ref, watch } from 'vue';
import type { SelectOption } from 'naive-ui';
import { useMessage } from 'naive-ui';
import { use } from 'echarts/core';
import { LineChart } from 'echarts/charts';
import { v4 as uuid4 } from 'uuid';
import VChart from 'vue-echarts';
import * as echarts from 'echarts';
import { DiscOutline, FilterCircleOutline, RefreshCircleOutline, TimeOutline } from '@vicons/ionicons5';
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
import { addMonths } from 'date-fns';
import { $t } from '@/locales';
import { localStg } from '@/utils/storage';
import { deviceTelemetryList } from '@/card/chart-card/curve/api';
import type { ICardData } from '@/components/panel/card';
import { deviceDetail } from './api';

type EChartsOption = ComposeOption<
  TooltipComponentOption | LegendComponentOption | ToolboxComponentOption | GridComponentOption | LineSeriesOption
>;
use([TooltipComponent, LegendComponent, ToolboxComponent, GridComponent, LineChart, CanvasRenderer]);
const chartRef = ref();
const isAggregate = ref<boolean>(false);
const isTimeSelect = ref<boolean>(false);
const dateRange = ref<[number, number] | null>(null);

const socket: any = ref(null);
const detail: any = ref(null);
// const intervalNum = ref();

const props = defineProps<{
  card: ICardData;
  colorGroup: { name: string; top: string; bottom: string }[];
}>();
const message = useMessage();
const deviceList = ref<any[]>([
  [20, 32, 11, 34, 90, 30, 10],
  [120, 132, 101, 134, 90, 230, 210],
  [232, 282, 291, 334, 390, 430, 510],
  [220, 182, 191, 234, 290, 330, 310],
  [150, 232, 201, 154, 190, 330, 410],
  [320, 332, 301, 334, 390, 330, 320],
  [820, 932, 901, 934, 1290, 1330, 1320],
  [720, 832, 801, 834, 1190, 1230, 1220],
  [920, 1032, 1001, 1034, 1390, 1430, 1420]
]);
const legendData = ref<any[]>([]);
const name = ref('');

const option = ref<EChartsOption>({
  tooltip: {
    trigger: 'axis'
    // formatter(datas) {
    //   return datas[0].value[1] + detail.value.data[0].unit;
    // }
  },
  legend: {
    data: legendData.value
  },
  dataZoom: [
    // 1.横向使用滚动条
    {
      type: 'slider', // 有单独的滑动条，用户在滑动条上进行缩放或漫游。inside是直接可以是在内部拖动显示
      show: true, // 是否显示 组件。如果设置为 false，不会显示，但是数据过滤的功能还存在。
      start: 0, // 数据窗口范围的起始百分比0-100
      end: 100, // 数据窗口范围的结束百分比0-100
      xAxisIndex: [0], // 此处表示控制第一个xAxis，设置 dataZoom-slider 组件控制的 x轴 可是已数组[0,2]表示控制第一，三个；xAxisIndex: 2 ，表示控制第二个。yAxisIndex属性同理
      bottom: 10 // 距离底部的距离
    },
    // 2.在内部可以横向拖动
    {
      type: 'inside', // 内置于坐标系中
      start: 0,
      end: 30,
      xAxisIndex: [0]
    }
  ],
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  toolbox: {
    feature: {
      saveAsImage: {}
    }
  },
  xAxis: {
    boundaryGap: false,
    type: 'time' as 'category'
  },
  yAxis: {
    type: 'value'
  },
  series: [] as any[]
});
const d_end_time = new Date().getTime();
// 获取1小时前的时间
const d_start_time = d_end_time - 3600000;
const params = reactive({
  start_time: d_start_time,
  end_time: d_end_time,
  aggregate_window: 'no_aggregate',
  aggregate_function: '',
  time_range: 'custom'
});
const timeOptions: SelectOption[] = [
  { label: $t('common.custom'), value: 300000 },
  { label: $t('common.last_15m'), value: 900000 },
  { label: $t('common.last_30m'), value: 1800000 },
  { label: $t('common.lastHours1'), value: 3600000 },
  { label: $t('common.lastHours3'), value: 10800000 },
  { label: $t('common.lastHours6'), value: 21600000 },
  { label: $t('common.lastHours12'), value: 43200000 },
  { label: $t('common.lastHours24'), value: 86400000 },
  { label: $t('common.lastDays3'), value: 259200000 },
  { label: $t('common.lastDays7'), value: 604800000 },
  { label: $t('common.lastDays15'), value: 1296000000 },
  { label: $t('common.lastDays30'), value: 2592000000 },
  { label: $t('common.lastDays60'), value: 5184000000 },
  { label: $t('common.lastDays90'), value: 7776000000 },
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
const timeOptionsValue = ref();
const aggregateOptions: SelectOption[] = [
  { label: $t('common.notAggre'), value: 'no_aggregate', disabled: false },
  { label: $t('common.seconds30'), value: '30s', disabled: false },
  { label: $t('common.minute1'), value: '1m', disabled: false },
  { label: $t('common.minute2'), value: '2m', disabled: false },
  { label: $t('common.minutes5'), value: '5m', disabled: false },
  { label: $t('common.minutes10'), value: '10m', disabled: false },
  { label: $t('common.minutes30'), value: '30m', disabled: false },
  { label: $t('common.hours1'), value: '1h', disabled: false },
  { label: $t('common.hours3'), value: '3h', disabled: false },
  { label: $t('common.hours6'), value: '6h', disabled: false },
  { label: $t('common.days1'), value: '1d', disabled: false },
  { label: $t('common.days7'), value: '7d', disabled: false },
  { label: '1月', value: '1mo', disabled: false }
];
const aggregateOptionsValue = ref<string>('');
const aggregateFunctionOptions: SelectOption[] = [
  { label: $t('common.average'), value: 'avg' },
  { label: $t('generate.max-value'), value: 'max' }
];
const aggregateFunctionValue = ref<string>('avg');
const getTelemetryList = async (device_id, key, index) => {
  if (!device_id || !key) {
    return;
  }
  if (option.value.series) {
    const { data, error } = await deviceTelemetryList({
      device_id,
      key,
      ...params
    });
    if (!error) {
      if (data) {
        // eslint-disable-next-line require-atomic-updates
        option.value.series[index].data = data.map(item => {
          return [item.x, item.y];
        });
      } else {
        // eslint-disable-next-line require-atomic-updates
        option.value.series[index].data = [
          {
            x: '2024-03-20T16:31:10.508174Z',
            y: Math.floor(Math.random() * 201)
          },
          {
            x: '2024-03-20T16:31:10.095501Z',
            y: Math.floor(Math.random() * 201)
          },
          {
            x: '2024-03-20T16:31:09.924351Z',
            y: Math.floor(Math.random() * 201)
          },
          {
            x: '2024-03-20T16:31:09.770282Z',
            y: Math.floor(Math.random() * 201)
          },
          {
            x: '2024-03-20T16:31:09.580654Z',
            y: Math.floor(Math.random() * 201)
          },
          {
            x: '2024-03-20T16:31:09.42025Z',
            y: Math.floor(Math.random() * 201)
          },
          {
            x: '2024-03-20T16:31:09.166655Z',
            y: Math.floor(Math.random() * 201)
          },
          {
            x: '2024-03-20T16:31:08.991563Z',
            y: Math.floor(Math.random() * 201)
          },
          {
            x: '2024-03-20T16:31:03.970267Z',
            y: Math.floor(Math.random() * 201)
          },
          {
            x: '2024-03-20T16:31:03.723987Z',
            y: Math.floor(Math.random() * 201)
          },
          {
            x: '2024-03-20T16:31:03.468516Z',
            y: Math.floor(Math.random() * 201)
          }
        ].map(item => {
          return [item.x, item.y];
        });
      }
    } else {
      // eslint-disable-next-line require-atomic-updates
      option.value.series[index].data = deviceList.value[index];
    }
  }
};
const updateSggregateFunction = v => {
  aggregateFunctionValue.value = v;
  params.aggregate_function = v;
};
const updateAggregate = (v: string) => {
  aggregateOptionsValue.value = v;
  params.aggregate_window = v;
  if (v !== 'no_aggregate') {
    aggregateFunctionValue.value = 'avg';
    params.aggregate_function = 'avg';
  } else {
    aggregateFunctionValue.value = '';
    params.aggregate_function = '';
  }
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

  // 默认不禁用“不聚合”，根据时间范围禁用其余选项
  aggregateOptions.forEach((item, index, array) => {
    if (!disableBeforeIndex[timeFrame]) {
      item.disabled = false;
      aggregateOptionsValue.value = 'no_aggregate';
      params.aggregate_window = aggregateOptionsValue.value;
      return;
    }

    item.disabled = index < (disableBeforeIndex[timeFrame] || 0);
    if (index < (disableBeforeIndex[timeFrame] || 0)) {
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
  timeOptionsValue.value = v;
  updateDisabledOptions(o.label as string);
  switch (o.label) {
    case $t('common.custom'):
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
};
const checkDateRange = value => {
  const [start, end] = value;
  if (start && end && addMonths(start, 1) < end) {
    dateRange.value = null;
    message.error($t('common.withinOneMonth'));
  } else {
    params.start_time = start;
    params.end_time = end;
  }
};

const reFresh = () => {
  timeOptionsValue.value = '';
  isAggregate.value = false;
  params.start_time = d_start_time;
  params.end_time = d_end_time;
  params.aggregate_window = 'no_aggregate';
  params.aggregate_function = 'avg';
  params.time_range = 'custom';
};
const setSeries: (dataSource) => void = async dataSource => {
  const arr: any = dataSource;
  const querDetail = {
    device_id: dataSource.deviceSource[0]?.deviceId ?? '',
    keys: arr.deviceSource[0].metricsId
  };
  if (querDetail.device_id && querDetail.keys) {
    detail.value = await deviceDetail(querDetail);
    const queryInfo = {
      device_id: dataSource.deviceSource[0]?.deviceId ?? '',
      keys: [arr.deviceSource[0].metricsId || 'externalVol'],
      token: localStg.get('token')
    };
    console.log(arr.deviceSource[0].metricsId, '11');
    if (socket.value && socket.value.readyState === WebSocket.OPEN) {
      socket.value.send(JSON.stringify(queryInfo)); // 将对象转换为JSON字符串后发送
    } else {
      console.error('WebSocket连接未建立或已关闭');
    }
  } else {
    // window.$message?.error("查询不到设备");
  }
  if (dataSource) {
    option.value.series =
      dataSource.deviceSource?.slice(0, dataSource.deviceCount || 1).map((i, index) => {
        let str: any = '';
        // str = `${i?.metricsId || '-'}_${i?.metricsName || '-'}`;
        str = `${i?.metricsName || '-'}`;
        name.value = str;
        legendData.value.push(str as string);
        getTelemetryList(i.deviceId, i.metricsId, index);
        return {
          name: str,
          type: 'line',
          stack: 'Total',
          smooth: true,
          lineStyle: {
            width: 0
          },
          showSymbol: false,
          areaStyle: {
            opacity: 0.8,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: props.colorGroup[1].top
              },
              {
                offset: 1,
                color: props.colorGroup[1].bottom
              }
            ])
          },
          emphasis: {
            focus: 'series'
          },
          data: deviceList.value[index],
          // Mouse moves into add unit
          tooltip: {
            valueFormatter(value) {
              return value + detail?.value?.data[0]?.unit;
            }
          }
        };
      }) || [];
  }
};

watch(
  () => params,
  () => {
    setSeries(props?.card?.dataSource);
  },
  { deep: true }
);
watch(
  () => props.card?.dataSource?.deviceSource,
  () => {
    setSeries(props?.card?.dataSource);
  },
  { deep: true }
);
onMounted(() => {
  setSeries(props?.card?.dataSource);
});
onUnmounted(() => {
  // clearInterval(intervalNum.value);
});
</script>

<template>
  <div class="m--6 h-full flex flex-col">
    <div class="mb-4 mt-4 flex justify-between">
      <div class="name-unit">
        {{ name }}
      </div>
      <div class="flex justify-end">
        <n-popselect
          v-model:value="timeOptionsValue"
          class="mr-4px"
          :options="timeOptions"
          trigger="hover"
          scrollable
          @update:value="updateTime"
        >
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
    </div>
    <VChart :key="uuid4()" ref="chartRef" class="chart flex-1" :option="option" autoresize />
  </div>
</template>

<style scoped>
.chart {
  min-height: 300px;
}
.name-unit {
  font-size: 18px;
}
</style>
