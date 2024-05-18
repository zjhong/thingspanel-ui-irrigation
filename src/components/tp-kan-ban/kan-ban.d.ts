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
  [propName: string]: any;
};

export interface CardData {
  cardItem: CardItemBase; // 和组件相关的东西
  cardId: string; // 卡片id
  // 渲染id，请确保当前看板的唯一性  没有就是cardId
  config: cardConfig; // 配置数据
  deviceList?: deviceParams[]; // 和设备有关的卡片才需要这个
  xdata?: {
    dataSource: 'sys' | 'device' | 'other' | ''; // 数据的数据源 系统  设备  其他
    data: string; // 一定是json字符串
  }[]; // 外部数据，数据源可共同存在，使用欠判断dataSource
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
  config: Record<string, any>;
  view?: boolean; // 预览模式
}
