import { defineAsyncComponent } from 'vue';
import type { ICardDefine } from '@/components/panel/card';
import poster from './line.png';
export default {
  id: 'line',
  type: 'builtin',
  component: defineAsyncComponent(() => import('./component.vue')),
  poster,
<<<<<<< HEAD
  title: '租户数量（折线图）'
=======
  title: 'dashboard_panel.cardName.tenantNumLine'
>>>>>>> 34978ce13f9a54869388a77a92ec65d4492001ec
} as ICardDefine;
