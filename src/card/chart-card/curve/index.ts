import { defineAsyncComponent } from 'vue';
import poster from '@/components/panel/chart-card/demo/poster.jpg';
import type { ICardDefine } from '@/components/panel/card';

export default {
  id: 'chart-curve',
  type: 'chart',
  component: defineAsyncComponent(() => import('./component.vue')),
  poster,
  title: '曲线',
  configForm: defineAsyncComponent(() => import('./card-config.vue')),
  preset: {
    dataSource: {
      origin: 'device',
      sourceNum: 1,
      systemSource: [{}],
      deviceSource: [{}]
    },
    config: {
      name: '123'
    },
    iCardViewDefault: {
      w: 6,
      h: 8
    }
  }
} as ICardDefine;
