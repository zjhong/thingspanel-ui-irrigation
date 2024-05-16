export type CardType = 'system' | 'plugins' | 'chart';
export type SceneType = 'mobile' | 'pc' | 'all';

export interface CardItemBase {
  type: CardType; // 卡片类型
  id: string; // 卡片唯一标识，按照card_type_cardName命名不会错
  sourceNumber: number; // 数据个数，必须限制，开发卡片时想好
  basicSettings?: {
    defaultTitle?: string; // 卡片标题 尽量使用国际化标题
    showTitle?: boolean;
  }; // 初始标题 可以不定义
  poster: any; // 示例图 尺寸193*120
  scene: SceneType; // 'mobile' | 'pc' | 'all';
  minWH: {
    minW: number | string | -1; // 卡片最小宽度,字符串单位为像素，数字则表示占几个格子，当前默认共48格
    minH: number | string | -1; // 卡片最小高度,字符串单位为像素，数字则表示占几个格子，当前默认共48格
  };
  preset?: Record<string, any>; // 初始设定,可自定义
}

export interface CardItem extends CardItemBase {
  component: any; // 卡片组件，一般就是 ./component.vue
  configForm: any; // 卡片配置文件，一般就是 card-config.vue
}
