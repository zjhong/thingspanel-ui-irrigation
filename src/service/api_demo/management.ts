import { adapter } from '@/utils'
import { mockRequest } from '../request_demo'
import { adapterOfFetchUserList, adapterOfAddIndex } from './management.adapter'

/** 获取用户列表 */
export const fetchUserList = async () => {
  const data = await mockRequest.post<ApiUserManagement.User[] | null>('/getAllUserList')
  return adapter(adapterOfFetchUserList, data)
}

/** 获取规则引擎列表 */
export const fetchRuleEngineList = async () => {
  const data = await mockRequest.get<ApiRuleEngine.Rule[] | null>('/getRuleEngineList')
  return adapter(adapterOfAddIndex, data)
}

/** 获取数据服务列表 */
export const fetchDataServiceList = async () => {
  const data = await mockRequest.get<ApiDataService.Data[] | null>('/getDataServiceList')
  return adapter(adapterOfAddIndex, data)
}

/** 获取应用管理 - 服务管理列表 */
export const fetchServiceManagementList = async () => {
  const data = await mockRequest.get<ApiApplyManagement.Service[] | null>('/getServiceManagementList')
  return adapter(adapterOfAddIndex, data)
}

/** 获取常规设置 - 主题设置对象 */
export const fetchThemeSetting = async () => {
  const data = await mockRequest.get<ApiGeneralSetting.ThemeSetting | null>('/getThemeSetting')
  return data
}

/** 获取常规设置 - 数据清理设置列表 */
export const fetchDataClearList = async () => {
  const data = await mockRequest.get<ApiGeneralSetting.DataClearSetting[] | null>('/getDataClearList')
  return data
}
