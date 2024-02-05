import { request } from '../request'

/** 获取常规设置 - 主题设置 */
export const fetchThemeSetting = async () => {
  const data = await request.get<ApiGeneralSetting.Theme | null>('/logo')
  return data
}

/** 获取常规设置 - 主题编辑 */
export const editThemeSetting = async (params: any) => {
  const data = await request.put<BaseApi.Data>('/logo', params)
  return data
}

/** 获取常规设置 - 数据清理设置列表 */
export const fetchDataClearList = async (params: any) => {
  const data = await request.get<ApiGeneralSetting.DataClear | null>('/datapolicy', {
    params
  })
  return data
}

/** 编辑清理设置 */
export const editDataClear = async (params: any) => {
  const data = await request.put<BaseApi.Data>('/datapolicy', params)
  return data
}
