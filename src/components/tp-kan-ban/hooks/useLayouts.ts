import { ref } from 'vue';
import type { CardView } from '@/components/tp-kan-ban/kan-ban';

export function useLayouts() {
  const layouts = ref<CardView[]>([]);

  function addItem(item: CardView) {
    layouts.value.push(item);
  }

  function updateLayouts(item: CardView, index: number) {
    layouts.value[index] = item;
  }

  return { layouts, addItem, updateLayouts };
}
