<script setup lang="ts">
import { ref, watch } from 'vue';
import AggregationSelector from '@/views/device/details/modules/telemetry/modules/AggregationSelector.vue';
import ChartComponent from './modules/ChartComponent.vue';

const initialOptions = ref({
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: [820, 932, 901, 934, 1290, 1330, 1320],
      type: 'line'
    },
    {
      data: [820, 932, 901, 934, 1290, 1330, 1320],
      type: 'bar'
    },
    {
      data: [820, 932, 901, 934, 1290, 1330, 1320],
      type: 'line'
    }
  ]
});
const selectedOption = ref();
const refuse = () => {
  initialOptions.value.series.forEach(series => {
    series.data = series.data.map(() => Math.floor(Math.random() * 801) + 100);
    series.type = series.type === 'bar' ? 'line' : 'bar';
  });
};

watch(
  selectedOption,
  () => {
    refuse();
    // 这里可以放置当 selectedOption 变化时需要执行的逻辑
  },
  { deep: true }
);
</script>

<template>
  <div>
    <AggregationSelector v-model:value="selectedOption" device_id="0" thekey="rere" />
    <NCard class="w-600px">
      <NCode word-wrap :code="JSON.stringify(selectedOption, null, 2)" language="json" />
    </NCard>

    <ChartComponent :initial-options="initialOptions" />
  </div>
</template>
