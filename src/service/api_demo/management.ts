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

/** 获取规则引擎列表 */
export const fetchDataServiceList = async () => {
  const data = await mockRequest.get<ApiDataService.Data[] | null>('/getDataServiceList')
  return adapter(adapterOfAddIndex, data)
}
