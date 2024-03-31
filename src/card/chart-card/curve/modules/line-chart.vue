<script lang="ts" setup>
import { ref, watch } from 'vue';
import { use } from 'echarts/core';
// import { CanvasRenderer } from 'echarts/renderers';
import { LineChart } from 'echarts/charts';
// import { LegendComponent, TitleComponent, TooltipComponent } from 'echarts/components';
import VChart from 'vue-echarts';
import * as echarts from 'echarts';
import type { ICardData } from '@/components/panel/card';
import { deviceTelemetryList } from '@/card/chart-card/curve/api';

use([LineChart]);
const chartRef = ref();

const props = defineProps<{
  card: ICardData;
  colorGroup: { name: string; top: string; bottom: string }[];
}>();

const devicrlits = ref<any[]>([
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

const d_end_time = new Date().getTime();
// 获取1小时前的时间
const d_start_time = d_end_time - 3600000;
const getTelemetryList = async (device_id, key, index) => {
  console.log('666');
  if (!device_id || !key) {
    console.log('4324324324');
    return;
  }
  console.log('777');
  const { data, error } = await deviceTelemetryList({
    device_id,
    key,
    start_time: d_start_time,
    end_time: d_end_time,
    aggregate_window: 'no_aggregate',
    time_range: 'custom'
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
    option.value.series[index].data = devicrlits.value[index];
  }
};

watch(
  () => props.card?.dataSource?.deviceSource,
  () => {
    option.value.series =
      props?.card?.dataSource?.deviceSource?.slice(0, props?.card?.dataSource?.deviceCount || 1).map((i, index) => {
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
          data: devicrlits.value[index]
        };
      }) || [];
  },
  { deep: true }
);
</script>

<template>
  <div class="m--6">
    <div class="mb-4 mt-2 flex justify-between">
      <div>曲线</div>
      <div class="flex justify-end">
        <p class="w-12px">1</p>
        <p class="w-12px">2</p>
        <p>3</p>
        <p class="w-12px">4</p>
        <p class="w-12px">5</p>
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
