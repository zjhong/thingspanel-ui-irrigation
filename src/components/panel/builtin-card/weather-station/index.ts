import { defineAsyncComponent } from 'vue';
import type { ICardDefine } from '@/components/panel/card';
import poster from './weather-station.png';
export default {
  id: 'weather-station',
  type: 'builtin',
  component: defineAsyncComponent(() => import('./component.vue')),
  poster,
  title: '气象站',
  w: 619,
  h: 498
} as ICardDefine;
