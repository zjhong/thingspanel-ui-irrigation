import { defineAsyncComponent } from "vue";
import type { ICardDefine } from "@/components/panel/card";
import poster from "./recent-weather.png";
export default {
  id: "recent-weather",
  type: "builtin",
  component: defineAsyncComponent(() => import("./component.vue")),
  poster,
<<<<<<< HEAD
  title: "天气概况",
=======
  title: 'dashboard_panel.cardName.weatherOverview',
>>>>>>> 34978ce13f9a54869388a77a92ec65d4492001ec
  w: 619,
  h: 233,
} as ICardDefine;
