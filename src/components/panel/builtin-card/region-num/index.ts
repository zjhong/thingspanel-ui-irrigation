import { defineAsyncComponent } from 'vue';
import type { ICardDefine } from '@/components/panel/card';
import poster from './region-num.png';
export default {
  id: 'region-num',
  type: 'builtin',
  component: defineAsyncComponent(() => import('./component.vue')),
  poster,
  title: 'region-num',
  w: 475,
  h: 165
} as ICardDefine;
