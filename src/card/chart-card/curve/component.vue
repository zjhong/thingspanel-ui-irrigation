<script lang="ts" setup>
import { watch } from 'vue';
import { NCard } from 'naive-ui';
import type { ICardData } from '@/components/panel/card';
import LineChart from '../modules/line-chart.vue';
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
  <NCard :bordered="false" class="card-wrapper">
    <LineChart :card="props.card" :color-group="props?.card?.config?.colorGroups?.colorGroup || colorGroups" />
  </NCard>
</template>
