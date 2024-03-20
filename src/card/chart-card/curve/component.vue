<script lang="ts" setup>
import type { ICardData } from '@/components/panel/card';
import LineChart from '../modules/line-chart.vue';

defineProps<{
  card: ICardData;
}>();
</script>

<template>
  <NCard :bordered="false" class="card-wrapper">
    <LineChart />
  </NCard>
</template>
