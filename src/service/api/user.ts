import { adapter } from '@/utils'
import { request } from '../request_demo'
import { adapterOfFetchUserList } from './management.adapter'

/** 获取用户列表 */
export const fetchUserList = async (params: any) => {
  const data = await request.post<ApiUserManagement.User[] | null>('/user', params)
  return adapter(adapterOfFetchUserList, data)
}
