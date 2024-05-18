<script setup lang="ts">
import { reactive, watch } from 'vue';
import type { CardItem } from '@/card2/card';
import type { CardData, cardConfig } from '@/components/tp-kan-ban/kan-ban';
import { useKanBanStore } from '@/card2/kan-ban-store';

const { cardMap } = useKanBanStore();
const copy = (obj: object) => JSON.parse(JSON.stringify(obj));
const defData = {
  cardId: '',
  type: 'builtin',
  title: '',
  config: {} as cardConfig
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
    console.log(state.data.config, '879988');
    emit('update', state.data as any);
  },
  { deep: true }
);

defineExpose({
  setCard: (data?: CardData) => {
    console.log(3);
    state.selectCard = null;
    state.data = copy(data || defData);
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
