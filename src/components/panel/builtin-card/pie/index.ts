import { defineAsyncComponent } from 'vue';
import type { ICardDefine } from '@/components/panel/card';
import poster from './pie.png';
export default {
  id: 'pie',
  type: 'builtin',
  component: defineAsyncComponent(() => import('./component.vue')),
  poster,
<<<<<<< HEAD
  title: '设备总数（饼图）'
=======
  title: 'dashboard_panel.cardName.deviceNumPie'
>>>>>>> 34978ce13f9a54869388a77a92ec65d4492001ec
} as ICardDefine;
