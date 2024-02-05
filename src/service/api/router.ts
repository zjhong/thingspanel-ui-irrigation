import { request } from '../request'
import { adapterOfFetchRouterList } from './management.adapter'

/** 获取路由列表 */
export const fetchElementList = async (params: any = {}) => {
  const data = await request.get<ApiCustomRoute.Data>('/ui_elements', {
    params
  })
  // eslint-disable-next-line no-unused-expressions
  data.data && (data.data.list = adapterOfFetchRouterList(data.data))
  return data
}

/** 根据用户获取路由列表 */
export const fetchElementListByUser = async () => {
  const data = await request.get<ApiCustomRoute.Data>('/ui_elements/menu')
  // eslint-disable-next-line no-unused-expressions
  data.data && (data.data.list = adapterOfFetchRouterList(data.data))
  return data
}

/** 添加路由 */
export const addElement = async (params: any) => {
  const data = await request.post<BaseApi.Data>('/ui_elements', params)
  return data
}

/** 编辑路由 */
export const editElement = async (params: any) => {
  const data = await request.put<BaseApi.Data>('/ui_elements', params)
  return data
}

/** 删除路由 */
export const delElement = async (id: string) => {
  const data = await request.delete<BaseApi.Data>(`/ui_elements/${id}`)
  return data
}
