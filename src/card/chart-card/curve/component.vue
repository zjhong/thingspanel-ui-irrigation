<script lang="ts" setup>
import type { ICardData } from '@/components/panel/card';
import LineChart from '../modules/line-chart.vue';

const props = defineProps<{
  card: ICardData;
}>();
</script>

<template>
  <NCard :bordered="false" class="card-wrapper">
    <LineChart :card="props.card" />
  </NCard>
</template>
