<script lang="ts" setup>
import { watch } from 'vue';
import type { ICardData } from '@/components/panel/card';
import LineChart from '@/card/chart-card/curve/modules/line-chart.vue';
import { colorGroups } from './theme';

const props = defineProps<{
  card: ICardData;
}>();

watch(
  () => props.card,
  newVal => {
    console.log('newVal', newVal);
  }
);
</script>

<template>
  <LineChart :card="props.card" :color-group="props?.card?.config?.colorGroups?.colorGroup || colorGroups" />
</template>

<style scoped>
:deep(.n-card__content) {
  width: 100%;
}
</style>
