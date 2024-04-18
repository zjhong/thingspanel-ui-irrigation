<script setup lang="ts">
import { ref, watch } from 'vue';
import AggregationSelector from '@/views/device/details/modules/telemetry/modules/AggregationSelector.vue';
import ChartComponent from './modules/ChartComponent.vue';

const initialOptions = ref({
  baseOption: undefined,
  options: [],
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: ['test_key']
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
          if (initialOptions.value.series) {
            initialOptions.value.series[0].type = 'line';
          }
        }
      },
      myTool2: {
        show: true,
        title: '切换朱庄图',
        icon: 'path://M-6.2277 -1.9018L-3.5491 -1.9018L-3.5491 4.8214L-6.2277 4.8214L-6.2277 -1.9018ZM-1.3527 -4.5536L1.3259 -4.5536L1.3259 4.8214L-1.3527 4.8214L-1.3527 -4.5536ZM3.5491 -7.5L6.2277 -7.5L6.2277 4.8214L3.5491 4.8214L3.5491 -7.5ZM-7.192 7.5L7.192 7.5\n',
        onclick: () => {
          if (initialOptions.value.series) {
            initialOptions.value.series[0].type = 'bar';
          }
        }
      },
      myTool3: {
        show: true,
        title: '切换散点图',
        icon: 'path://M6 6V42H42 M20 24C22.2091 24 24 22.2091 24 20C24 17.7909 22.2091 16 20 16C17.7909 16 16 17.7909 16 20C16 22.2091 17.7909 24 20 24Z M37 16C39.7614 16 42 13.7614 42 11C42 8.23858 39.7614 6 37 6C34.2386 6 32 8.23858 32 11C32 13.7614 34.2386 16 37 16Z M15 36C16.6569 36 18 34.6569 18 33C18 31.3431 16.6569 30 15 30C13.3431 30 12 31.3431 12 33C12 34.6569 13.3431 36 15 36Z M33 32C34.6569 32 36 30.6569 36 29C36 27.3431 34.6569 26 33 26C31.3431 26 30 27.3431 30 29C30 30.6569 31.3431 32 33 32Z\n',
        onclick: () => {
          if (initialOptions.value.series) {
            initialOptions.value.series[0].type = 'scatter';
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
      data: [] as any[],
      type: 'line',
      smooth: true
    }
  ]
});
const selectedOption = ref();
const refuse = () => {
  initialOptions.value.series.forEach(series => {
    console.log(series);
    series.data = [
      [120, 35],
      [220, 135],
      [10, 5],
      [420, 65],
      [180, 15]
    ];
  });
};

watch(
  selectedOption,
  v => {
    console.log(v.time_range);
    if (v.time_range === 'custom' && (!v.start_time || !v.end_time)) {
      window.NMessage.destroyAll();
      window.NMessage.info('当时间为自定义时， 必须选择时间范围');
      return;
    }
    refuse();
    // 这里可以放置当 selectedOption 变化时需要执行的逻辑
  },
  { deep: true }
);
</script>

<template>
  <div>
    <AggregationSelector v-model:value="selectedOption" device_id="test_device_id" thekey="test_device_key" />
    <NCard class="mt-18px w-600px">
      <NCode word-wrap :code="JSON.stringify(selectedOption, null, 2)" language="json" />
    </NCard>

    <ChartComponent :initial-options="initialOptions" />
  </div>
</template>
