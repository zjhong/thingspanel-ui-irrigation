<script lang="ts" setup>
import { onUpdated, ref, watchEffect } from 'vue';
import { use } from 'echarts/core';
// import { CanvasRenderer } from 'echarts/renderers';
import { LineChart } from 'echarts/charts';
// import { LegendComponent, TitleComponent, TooltipComponent } from 'echarts/components';
import VChart from 'vue-echarts';
import * as echarts from 'echarts';
import type { ICardData } from '@/components/panel/card';

use([LineChart]);
const chartRef = ref();
const props = defineProps<{
  card: ICardData;
}>();
onUpdated(() => {
  console.log(props.card, '432432432434');
});

const devicrlits = [
  [20, 32, 11, 34, 90, 30, 10],
  [120, 132, 101, 134, 90, 230, 210],
  [232, 282, 291, 334, 390, 430, 510],
  [220, 182, 191, 234, 290, 330, 310],
  [150, 232, 201, 154, 190, 330, 410],
  [320, 332, 301, 334, 390, 330, 320],
  [820, 932, 901, 934, 1290, 1330, 1320],
  [720, 832, 801, 834, 1190, 1230, 1220],
  [920, 1032, 1001, 1034, 1390, 1430, 1420]
];
const data = ref<any[]>([]);
const colorGroups = [
  { top: 'rgb(255, 227, 157)', bottom: 'rgb(255, 182, 185)' },
  { top: 'rgb(157, 236, 255)', bottom: 'rgb(102, 153, 255)' },
  { top: 'rgb(182, 255, 187)', bottom: 'rgb(153, 255, 204)' },
  { top: 'rgb(255, 197, 157)', bottom: 'rgb(255, 159, 128)' },
  { top: 'rgb(206, 255, 157)', bottom: 'rgb(159, 255, 128)' },
  { top: 'rgb(255, 157, 224)', bottom: 'rgb(255, 128, 191)' },
  { top: 'rgb(197, 157, 255)', bottom: 'rgb(159, 128, 255)' },
  { top: 'rgb(255, 224, 157)', bottom: 'rgb(255, 204, 128)' },
  { top: 'rgb(157, 224, 255)', bottom: 'rgb(128, 204, 255)' }
];

const option = ref({
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data
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
    type: 'category',
    boundaryGap: false,
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
    type: 'value'
  },
  dataZoom: [
    {
      type: 'inside',
      start: 0,
      end: 100
    },
    {
      start: 0,
      end: 100
    }
  ],
  series: [] as any[]
});

watchEffect(() => {
  option.value.series =
    // eslint-disable-next-line vue/no-mutating-props
    props.card?.dataSource?.deviceSource?.slice(0, props.card?.dataSource?.deviceCount || 1).map((i, index) => {
      let str: any = '';
      str = i?.metricsId || '-';
      str += i?.metricsName || '-';
      data.value.push(str as string);
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
              color: colorGroups[index].top
            },
            {
              offset: 1,
              color: colorGroups[index].bottom
            }
          ])
        },
        emphasis: {
          focus: 'series'
        },
        data: devicrlits[index]
      };
    }) || [];
});
</script>

<template>
  <VChart :key="option.series.length" ref="chartRef" class="chart" :option="option" autoresize />
</template>

<style scoped>
.chart {
  min-height: 300px;
}
</style>
