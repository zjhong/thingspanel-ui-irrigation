import { ref } from 'vue';
import type { CardData, CardView } from '@/components/tp-kan-ban/kan-ban';

export function useLayouts() {
  const layouts = ref<CardView[]>([]);

  function addItem(item: CardView) {
    layouts.value.push(item);
  }

  function updateLayouts(item: CardData, index: number) {
    layouts.value[index].data = item;
  }

  return { layouts, addItem, updateLayouts };
}
