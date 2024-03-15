import { defineAsyncComponent } from "vue";
import type { ICardDefine } from "@/components/panel/card";
import poster from "./user-num.png";
export default {
  id: "user-num",
  type: "builtin",
  component: defineAsyncComponent(() => import("./component.vue")),
  poster,
  title: "user-num",
  w: 475,
  h: 165,
} as ICardDefine;
