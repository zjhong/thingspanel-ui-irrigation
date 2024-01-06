import { adapter } from '@/utils'
import { mockRequest } from '../request_demo'
import { adapterOfFetchUserList } from './management.adapter'

/** 获取用户列表 */
export const fetchUserList = async () => {
  const data = await mockRequest.post<ApiUserManagement.User[] | null>('/getAllUserList')
  return adapter(adapterOfFetchUserList, data)
}
