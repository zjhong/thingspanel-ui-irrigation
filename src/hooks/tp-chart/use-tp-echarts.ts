import type { Ref } from 'vue';
import { computed, onUnmounted, ref, watch } from 'vue';
import * as echarts from 'echarts/core';
import type { ECharts } from 'echarts/core';
import { GridComponent, TooltipComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { BarChart, LineChart, PieChart } from 'echarts/charts';
import { useThemeStore } from '@/store/modules/theme';

export function useTpECharts(
  elRef: Ref<HTMLElement | null>,
  options: echarts.EChartsCoreOption,
  charts = [LineChart, PieChart, BarChart]
) {
  const themeStore = useThemeStore();
  const chartInstance = ref<ECharts | null>(null);

  echarts.use([...charts, GridComponent, TooltipComponent, CanvasRenderer]);

  const currentTheme = computed(() => (themeStore.darkMode ? 'dark' : 'light'));

  const initChart = () => {
    if (!elRef.value || chartInstance.value) return;

    chartInstance.value = echarts.init(elRef.value, currentTheme.value, { renderer: 'canvas' });
    chartInstance.value.setOption(options);
  };

  watch(
    elRef,
    () => {
      initChart();
    },
    { immediate: true }
  );

  watch(currentTheme, () => {
    if (chartInstance.value) {
      chartInstance.value.dispose();
      initChart();
    }
  });

  onUnmounted(() => {
    if (chartInstance.value) {
      chartInstance.value.dispose();
      chartInstance.value = null;
    }
  });

  const setOptions = (updateFn: (options: echarts.EChartsCoreOption) => echarts.EChartsCoreOption) => {
    if (chartInstance.value) {
      const currentOptions = chartInstance.value.getOption();
      const updatedOptions = updateFn(currentOptions);
      chartInstance.value.setOption(updatedOptions, true); // 强制完全覆盖旧配置
    }
  };

  return { chartInstance, setOptions, initChart };
}
