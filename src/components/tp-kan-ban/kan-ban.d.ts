import type { LayoutItem } from 'grid-layout-plus';
import type { CardItemBase } from '@/card2/card';

export type deviceParams = {
  deviceId: string;
  indicate: string;
  [propName: string]: any;
};
export type cardConfig = {
  title: string;
  showTitle: boolean;
  basis: Record<string, any>;
  source: Record<string, any>;
  cardUI: Record<string, any>;
  [propName: string]: any;
};

export interface CardData {
  cardItem: CardItemBase; // 和组件相关的东西
  cardId: string; // 卡片id
  // 渲染id，请确保当前看板的唯一性  没有就是cardId
  config: cardConfig; // 配置数据
  deviceList?: deviceParams[]; // 和设备有关的卡片才需要这个
  xdata?: string; // 卡片数据 json字符串
}

export interface CardView extends LayoutItem {
  x: number;
  y: number;
  w: number;
  h: number;
  i: string | number; // cardId
  data?: CardData;
}

export interface CardRender {
  addCard(data: CardData): void;
}

export interface CardFormIns {
  setCard: (card?: CardData | null) => void;
}

export interface IConfigCtx {
  config: cardConfig;
  view?: boolean; // 预览模式
}
