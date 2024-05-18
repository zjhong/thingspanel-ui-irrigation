<script setup lang="ts">
import { inject } from 'vue';
import type { CardData } from '@/components/tp-kan-ban/kan-ban';
import CardConfigFrom from './card-congig-form.vue';

const showModal = inject<boolean>('showModal');
// const toggleModal = inject<(f: boolean) => void>('toggleModal');

const props = defineProps<{
  view?: boolean;
  card: CardData;
}>();

const { card } = props;
const { config, cardItem, cardId, deviceList, xdata } = card;

console.log(config, cardItem, cardId, deviceList, xdata);

// const closeModal = () => {
//   toggleModal?.(false);
// };
</script>

<template>
  <div>{{ card?.cardId }}</div>

  <n-modal v-model:show="showModal as boolean">
    <!-- 弹窗内容 -->
    <n-card style="width: 600px">
      <CardConfigFrom />
    </n-card>
  </n-modal>
</template>

<style scoped></style>
