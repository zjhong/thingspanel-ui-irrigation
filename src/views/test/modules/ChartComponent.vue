<script setup lang="ts">
import { ref, watch } from 'vue';
import { BarChart, LineChart } from 'echarts/charts';
import { GridComponent, TooltipComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import type { EChartsCoreOption } from 'echarts/core';
import { useTpECharts } from '@/hooks/tp-chart/use-tp-echarts';

// Props
const props = defineProps<{
  initialOptions: EChartsCoreOption;
}>();

const chartRef = ref(null);
const requiredModules = [LineChart, BarChart, GridComponent, TooltipComponent, CanvasRenderer];

const { setOptions } = useTpECharts(chartRef, props.initialOptions, requiredModules);

watch(
  () => props.initialOptions,
  newOptions => {
    console.log(newOptions);
    if (newOptions) {
      setOptions(currentOptions => {
        // 这里进行深拷贝以确保图表配置完全更新
        return { ...currentOptions, ...newOptions };
      });
    }
  },
  { deep: true, immediate: true }
);
</script>

<template>
  <div ref="chartRef" style="width: 600px; height: 400px"></div>
</template>

<style scoped></style>
