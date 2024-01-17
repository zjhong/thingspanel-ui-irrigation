export interface ICardData {
  type: ICardDefine['type']
  cardId: string
  config?: Record<string, any>
  title: string
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
  type: 'builtin' | 'device' | 'dependence'
  // 不存在就是all
  scene?: 'mobile' | 'pc' | 'all'
  configForm?: any
}

export interface ICardRender {
  addCard(data: ICardDefine, config: Record<string, any>): void
}
