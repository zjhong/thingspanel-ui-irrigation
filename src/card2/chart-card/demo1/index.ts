import { defineAsyncComponent } from 'vue';
import type { CardItem } from '@/card2/card';
import poster from './poster.png';

export default {
  cardItemBase: {
    type: 'chart', // 卡片类型 'system' | 'plugins' | 'chart';
    id: 'chart-demo1', // 卡片唯一标识，按照card_type_cardName命名不会错
    cardName: 'chart-demo1',
    sourceNumber: 99, // 数据个数，必须限制，开发卡片时想好
    basicSettings: {
      defaultTitle: 'chart-demo1', // 卡片标题 尽量使用国际化标题
      showTitle: false
    }, // 初始标题 可以不定义

    scene: 'all', // 'mobile' | 'pc' | 'all'; 预留暂时都选all
    minWH: {
      minW: 4, // 卡片最小宽度,字符串单位为像素，数字则表示占几个格子，当前默认共48格
      minH: 4 // 卡片最小高度,字符串单位为像素，数字则表示占几个格子，当前默认共48格
    },
    preset: {} // 初始设定,可自定义,最终会暴露给卡片，请自行使用
  },
  poster, // 示例图 尺寸193*120
  component: defineAsyncComponent(() => import('./index.vue')), // 卡片组件，一般就是 ./component.vue
  configForm: defineAsyncComponent(() => import('./card-congig-form.vue')) // 卡片配置文件，一般就是 card-config.vue
} as CardItem;
