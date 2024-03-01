<script lang="ts" setup>
import { computed } from 'vue';
import { usePanelStore } from '@/store/modules/panel';
import type { ICardData } from '@/components/panel/card';

const props = defineProps<{
  view?: boolean;
  data: ICardData;
}>();

const cardId = computed(() => props.data?.cardId);
const store = usePanelStore();
const findCardComponent = (id: string) => {
  return store.$state.cardMap.get(id)?.component || null;
};
</script>

<template>
  <NCard class="h-full w-full relative" content-style="padding: 0px">
    <div
      v-if="data.basicSettings?.showTitle"
      class="h-7 leading-7 text-sm px-2 border-b dark:border-gray-200/10 border-gray-200 w-full truncate"
    >
      {{ data.basicSettings?.title }}
    </div>
    <div class="p-4">
      <component :is="findCardComponent(cardId || '')" :card="data" :view="view" />
    </div>
  </NCard>
</template>
