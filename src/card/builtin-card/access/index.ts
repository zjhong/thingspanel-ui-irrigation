import { defineAsyncComponent } from 'vue';
import type { ICardDefine } from '@/components/panel/card';
import poster from './device-num.png';
export default {
  id: 'device-num3',
  type: 'builtin',
  component: defineAsyncComponent(() => import('./component.vue')),
  poster,
  title: '访问量',

  preset: {
    iCardViewDefault: {
      w: 5,
      h: 2,
      minH: 2,
      minW: 5
    }
  }
} as ICardDefine;
