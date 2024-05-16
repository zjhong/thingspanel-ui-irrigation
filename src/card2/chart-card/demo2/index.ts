import { defineAsyncComponent } from 'vue';
import type { CardItem } from '@/card2/card';
import poster from './poster.png';

export default {
  type: 'chart', // 卡片类型
  id: 'card_chart_demo2', // 卡片唯一标识，按照card_type_cardName命名不会错
  component: defineAsyncComponent(() => import('./index.vue')), // 卡片组件，一般就是 ./component.vue
  configForm: defineAsyncComponent(() => import('./card-congig-form.vue')), // 卡片配置文件，一般就是 card-config.vue
  scene: 'mobile',
  poster, // 示例图 尺寸193*120
  basicSettings: {
    defaultTitle: 'demo2', // 卡片标题 尽量使用国际化标题
    showTitle: false
  },
  minWH: {
    minW: '200px', // 卡片最小宽度 必填，不限制填-1
    minH: '200px' // 卡片最小高度 必填，不限制填-1
  }
} as CardItem;
