<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useScriptTag } from '@vueuse/core';
import { TENCENT_MAP_SDK_URL } from '@/constants/map-sdk';

const { load } = useScriptTag(TENCENT_MAP_SDK_URL);
const emit = defineEmits(['position-selected']);
const domRef = ref<HTMLDivElement | null>(null);
let map;

async function renderMap() {
  await load(true);
  if (!domRef.value) return;

  map = new TMap.Map(domRef.value, {
    center: new TMap.LatLng(39.98412, 116.307484),
    zoom: 12
  });

  map.on('click', event => {
    emit('position-selected', { lat: event.latLng.getLat(), lng: event.latLng.getLng() });
  });
}

onMounted(() => {
  renderMap();
});
</script>

<template>
  <div ref="domRef" class="h-400px w-400px"></div>
</template>

<style scoped></style>
