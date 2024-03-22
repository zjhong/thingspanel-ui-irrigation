import { defineAsyncComponent } from 'vue';
import type { ICardDefine } from '@/components/panel/card';
import poster from './water-region.png';
export default {
  id: 'water-region',
  type: 'builtin',
  component: defineAsyncComponent(() => import('./component.vue')),
  poster,
<<<<<<< HEAD
  title: '浇灌区域',
=======
  title: 'dashboard_panel.cardName.irrigationArea',
>>>>>>> 34978ce13f9a54869388a77a92ec65d4492001ec
  w: 1000,
  h: 755
} as ICardDefine;
