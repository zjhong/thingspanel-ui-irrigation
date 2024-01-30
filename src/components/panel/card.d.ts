export interface ICardData {
  type: ICardDefine['type']
  cardId: string
  // 组件自定义配置
  config?: Record<string, any>
  title: string
  // 基础配置
  basicSettings: {
    showTitle?: boolean
    title?: string
  }
  // 数据源
  dataSource?: {
    // 系统 或 设备
    origin: 'system' | 'device'
    sourceNum?: number // 不填写即为 1-任意多个，如需固定数量，填写整数
    systemSource?: { type?: number; name?: string }[]
    deviceSource?: { device?: string; norm?: string; name?: string }[]
  }
}
export interface ICardView {
  x: number
  y: number
  w: number
  h: number
  i: number
  data?: ICardData
}

export interface ICardDefine {
  component: any
  remoteId?: string
  id: string
  title: string
  poster: string // 示例图
  type: 'builtin' | 'device' | 'plugin' | 'chart'
  // 不存在就是all
  scene?: 'mobile' | 'pc' | 'all'
  configForm?: any
  // 初始化设置参数（可选）
  preset?: {
    config?: object
    dataSource?: ICardData['dataSource']
    basicSettings?: ICardData['basicSettings']
  }
}

export interface ICardFormIns {
  setCard: (card?: ICardData | null) => void
}
export interface IConfigCtx {
  config: Record<string, any>
  view?: boolean // 预览模式
}

export interface ICardRender {
  addCard(data: ICardData): void
}
