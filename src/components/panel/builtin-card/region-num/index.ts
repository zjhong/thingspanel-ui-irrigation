import { defineAsyncComponent } from 'vue';
import type { ICardDefine } from '@/components/panel/card';
import poster from './region-num.png';
export default {
  id: 'region-num',
  type: 'builtin',
  component: defineAsyncComponent(() => import('./component.vue')),
  poster,
<<<<<<< HEAD
  title: '区域总数',
=======
  title: 'dashboard_panel.cardName.regionNum',
>>>>>>> 34978ce13f9a54869388a77a92ec65d4492001ec
  w: 475,
  h: 165
} as ICardDefine;
