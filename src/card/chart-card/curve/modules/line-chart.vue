<script lang="ts" setup>
import { onMounted, reactive, ref, watch } from 'vue';
import type { SelectOption } from 'naive-ui';
import { use } from 'echarts/core';
// import { CanvasRenderer } from 'echarts/renderers';
import { LineChart } from 'echarts/charts';
// import { LegendComponent, TitleComponent, TooltipComponent } from 'echarts/components';
import VChart from 'vue-echarts';
import * as echarts from 'echarts';
import { DiscOutline, FilterCircleOutline, RefreshCircleOutline, TimeOutline } from '@vicons/ionicons5';
import type { ICardData } from '@/components/panel/card';
import { deviceTelemetryList } from '@/card/chart-card/curve/api';

use([LineChart]);
const chartRef = ref();
const isAggregate = ref<boolean>(false);
const props = defineProps<{
  card: ICardData;
  colorGroup: { name: string; top: string; bottom: string }[];
}>();

const d_end_time = new Date().getTime();
// 获取1小时前的时间
const d_start_time = d_end_time - 3600000;
const params = reactive({
  start_time: d_start_time,
  end_time: d_end_time,
  aggregate_window: 'no_aggregate',
  aggregate_function: 'avg',
  time_range: 'custom'
});
const timeOptions: SelectOption[] = [
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
  aggregateOptions.forEach((option, index, array) => {
    option.disabled = index <= (disableBeforeIndex[timeFrame] || 0);
    if (index <= (disableBeforeIndex[timeFrame] || 0)) {
      aggregateOptionsValue.value = array[index + 1].value as string;
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

  params.start_time = start_time.getTime();
  params.end_time = end_time.getTime();
};

const updateAggregate = (v: string) => {
  aggregateOptionsValue.value = v;
  params.aggregate_window = v;
};
const aggregateFunctionOptions: SelectOption[] = [
  { label: '平均数', value: 'avg' },
  { label: '最大值', value: 'max' }
];
const aggregateFunctionValue = ref<string>('avg');

const updateSggregateFunction = v => {
  aggregateFunctionValue.value = v;
  params.aggregate_function = v;
};

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

const option = ref({
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    legendData
  },
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
    type: 'time'
  },
  yAxis: {
    type: 'value'
  },
  series: [] as any[]
});
const reFresh = () => {
  isAggregate.value = false;
  params.start_time = d_start_time;
  params.end_time = d_end_time;
  params.aggregate_window = 'no_aggregate';
  params.aggregate_function = 'avg';
  params.time_range = 'custom';
};
const getTelemetryList = async (device_id, key, index) => {
  if (!device_id || !key) {
    return;
  }
  const { data, error } = await deviceTelemetryList({
    device_id,
    key,
    ...params
  });
  if (!error) {
    if (data && data.time_series && data.time_series.length > 0) {
      option.value.series[index].data = data.time_series.map(item => {
        return [item.x, item.y];
      });
    } else {
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
    option.value.series[index].data = deviceList.value[index];
  }
};
const setSeries = dataSource => {
  if (dataSource) {
    option.value.series =
      dataSource.deviceSource?.slice(0, dataSource.deviceCount || 1).map((i, index) => {
        let str: any = '';
        str = `${i?.metricsId || '-'}_${i?.metricsName || '-'}`;

        legendData.value.push(str as string);
        console.log('888');
        getTelemetryList(i.deviceId, i.metricsId, index);
        console.log('888');
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
                color: props.colorGroup[index].top
              },
              {
                offset: 1,
                color: props.colorGroup[index].bottom
              }
            ])
          },
          emphasis: {
            focus: 'series'
          },
          data: deviceList.value[index]
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
</script>

<template>
  <div class="m--6">
    <div class="mb-4 mt-4 flex justify-between">
      <div>曲线</div>
      <div class="flex justify-end">
        <n-popselect class="mr-4px" :options="timeOptions" trigger="hover" scrollable @update:value="updateTime">
          <n-icon size="24" class="hover:text-primary-500">
            <TimeOutline />
          </n-icon>
        </n-popselect>

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
    <VChart :key="option.series.length" ref="chartRef" class="chart" :option="option" autoresize />
  </div>
</template>

<style scoped>
.chart {
  min-height: 300px;
}
</style>
