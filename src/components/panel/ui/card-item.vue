<script lang="ts" setup>
import { computed } from 'vue';
import { usePanelStore } from '@/store/modules/panel';
// import type { ICardData } from "@/components/panel/card";

const props = defineProps<{
  view?: boolean;
  data: any;
}>();
const cardId = computed(() => props.data?.cardId);
const store = usePanelStore();
const findCardComponent = (id: string) => {
  console.log('zh_favor', id);
  const cIds = id.split('-');
  const cId = `${cIds[0]}-${cIds[1]}`;
  return store.$state.cardMap.get(cId)?.component || null;
};
</script>

<template>
  <NCard class="relative h-full w-full" content-style="padding: 0px">
    <div
      v-if="data.basicSettings?.showTitle"
      class="h-7 w-full truncate border-b border-gray-200 px-2 text-sm leading-7 dark:border-gray-200/10"
    >
      {{ data.basicSettings?.title }}
    </div>
    <div class="w p-4">
      <component
        :is="findCardComponent(cardId || '')"
        class="relative h-full w-full"
        :card="props.data"
        :view="view"
        @drag.stop="console.log(1)"
      />
    </div>
  </NCard>
</template>

<style scoped>
.w {
  width: 100%;
  height: 100%;
}
</style>
