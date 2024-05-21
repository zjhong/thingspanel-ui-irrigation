<script setup lang="ts">
import { reactive, watch } from 'vue';
import type { CardItem } from '@/cards2.0/card';
import type { CardData, CardView } from '@/components/tp-kan-ban/kan-ban';
import { useKanBanStore } from '@/cards2.0/store/kan-ban-store';

const { cardMap } = useKanBanStore();
const copy = (obj: object) => JSON.parse(JSON.stringify(obj));
const defData: CardData = {
  cardItem: {
    type: 'plugins',
    id: '',
    cardName: '',
    renderID: '',
    sourceNumber: 9
  },
  sourceNumber: 9,
  cardId: '',
  renderID: '',
  config: {
    title: '',
    showTitle: '',
    basis: { title: '', showTitle: false },
    source: {},
    cardUI: {}
  }
};

const state = reactive({
  selectCard: null as null | CardItem,
  data: copy(defData)
});

const emit = defineEmits<{
  (e: 'update', data: CardData): void;
}>();

watch(
  () => state.data.config,
  () => {
    emit('update', state.data as any);
  },
  { deep: true }
);

defineExpose({
  setCard: (data?: CardView) => {
    state.selectCard = null;
    state.data = copy(data?.data || defData);
    setTimeout(() => {
      state.selectCard = cardMap.get(state.data.cardId) || null;
    });
  }
});
</script>

<template>
  <div>
    <KanBanCardConfigCtx v-model:config="state.data.config" mode="insert">
      <component :is="state.selectCard?.configForm" :data="state.data" />
    </KanBanCardConfigCtx>
  </div>
</template>

<style scoped></style>
