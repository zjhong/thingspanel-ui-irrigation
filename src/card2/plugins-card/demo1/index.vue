<script setup lang="ts">
import type { CardData } from '@/components/tp-kan-ban/kan-ban';

const props = defineProps<{
  view?: boolean;
  card: CardData;
}>();

console.log(props);
</script>

<template>
  <div>
    <div>222</div>
    <div>{{ card?.config.title }}</div>
  </div>
</template>

<style scoped></style>
