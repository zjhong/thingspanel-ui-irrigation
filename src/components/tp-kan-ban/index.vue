<script setup lang="ts">
import { ref } from 'vue';
import { useFullscreen } from '@vueuse/core';
import { useAppStore } from '@/store/modules/app';
import type { CardView } from '@/components/tp-kan-ban/kan-ban';

const appStore = useAppStore();
const fullUI = ref();
const { isFullscreen, toggle } = useFullscreen(fullUI);
const active = ref(false);

const layout = ref<CardView[]>([
  { x: 0, y: 0, w: 2, h: 2, i: '0' },
  { x: 2, y: 0, w: 2, h: 4, i: '1' }
]);

const saveKanBan = async () => {
  console.log('ss');
};
</script>

<template>
  <div class="w-full">
    <div
      v-show="!appStore.fullContent"
      class="flex items-center justify-between border-b border-gray-200 p-0 dark:border-gray-200/10"
    >
      <KanBanHeader
        v-model:active="active"
        :toggle="toggle"
        :is-fullscreen="isFullscreen"
        :save-kan-ban="saveKanBan"
        tittle="xxx看板"
        class="w-full"
      />
    </div>
    <div
      ref="fullUI"
      :class="!layout.length ? 'h-[calc(100vh-226px)] flex-col items-center justify-center' : 'h-[calc(100vh-228px)] '"
    >
      <KanBanRender v-model:layout="layout" v-model:active="active" />
    </div>
  </div>
</template>

<style scoped></style>
