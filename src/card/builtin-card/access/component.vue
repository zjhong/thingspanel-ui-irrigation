<script setup lang="ts">
import { ref } from 'vue';
import { totalNumber } from '../../../service/api';
import { GradientBg } from './components';
defineOptions({ name: 'DashboardAnalysisDataCard' });
const deviceNum = ref<number>(0);

interface CardData {
  id: string;
  title: string;
  value: number;
  unit: string;
  colors: [string, string];
  icon: string;
}

const cardData: CardData[] = [
  {
    id: 'visit',
    title: '设备总数',
    value: 1000000,
    unit: '',
    colors: ['#ec4786', '#b955a4'],
    icon: 'ant-design:bar-chart-outlined'
  }
];

// 获取数据
const getData: () => void = async () => {
  try {
    const response: { data: any } = await totalNumber();
    if (response.data) {
      deviceNum.value = response.data.device_total;
    } else {
      console.error('Data does not contain the required properties or they are not numbers.');
    }
  } catch (error) {
    // 处理请求数据时的错误
    console.error('Error fetching data:', error);
  }
};

// 调用 getData 函数
getData();
</script>

<template>
  <GradientBg class="access" :start-color="cardData[0].colors[0]" :end-color="cardData[0].colors[1]">
    {{ deviceNum }}
    <h3 class="text-16px">{{ cardData[0].title }}</h3>
    <div class="flex justify-between pt-12px">
      <SvgIcon :icon="cardData[0].icon" class="text-32px" />
      <CountTo
        :prefix="cardData[0].unit"
        :start-value="1"
        :end-value="cardData[0].value"
        class="text-30px text-white dark:text-dark"
      />
    </div>
  </GradientBg>
</template>

<style scoped>
.access {
  width: 100%;
  height: 100%;
  min-width: max-content;
  min-height: max-content;
}
</style>
