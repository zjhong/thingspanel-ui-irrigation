import { defineAsyncComponent } from 'vue';
import type { ICardDefine } from '@/components/panel/card';
import poster from './weather-station.png';
export default {
  id: 'weather-station',
  type: 'builtin',
  component: defineAsyncComponent(() => import('./component.vue')),
  poster,
<<<<<<< HEAD
  title: '气象站',
=======
  title: 'dashboard_panel.cardName.weatherStation',
>>>>>>> 34978ce13f9a54869388a77a92ec65d4492001ec
  w: 619,
  h: 498
} as ICardDefine;
