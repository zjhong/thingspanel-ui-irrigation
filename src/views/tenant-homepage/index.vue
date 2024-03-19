<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { ICardView } from '@/components/panel/card';
import { fetchHomeData } from '@/service/api';

const layout = ref<ICardView[]>([]);
const getLayout = async () => {
  const { data, error } = await fetchHomeData({});

  if (!error) {
    if (data && data.config) {
      const configJson = JSON.parse(data.config);
      layout.value = [...configJson, ...layout.value];
    }
  }
  console.log(data);
};

onMounted(getLayout);
</script>

<template>
  <CardRender
    ref="cr"
    v-model:layout="layout"
    :is-preview="true"
    :col-num="12"
    :default-card-col="4"
    :row-height="65"
  />
</template>

<style scoped></style>
