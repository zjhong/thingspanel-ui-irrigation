import { ref } from 'vue';
import type { CardData, CardView } from '@/components/tp-kan-ban/kan-ban';
import { getBoard } from '@/service/api';

export function useLayouts(panelId: string | undefined) {
  const layouts = ref<CardView[]>([]);

  const panelDate = ref<Panel.Board>();

  function addItem(item: CardView) {
    layouts.value.push(item);
  }

  function updateLayouts(item: CardData, index: number) {
    layouts.value[index].data = item;
  }

  async function initLayouts() {
    if (panelId) {
      const { data } = await getBoard(panelId);
      if (data) {
        panelDate.value = data;
        if (data.config) {
          const configJson = JSON.parse(data.config);

          layouts.value = [...configJson];
        }
      }
    } else {
      window.NMessage.destroyAll();
      window.NMessage.error('无效的看板id');
    }
  }
  initLayouts().then();

  return { layouts, addItem, updateLayouts, panelDate };
}
