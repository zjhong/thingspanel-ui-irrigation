import { request } from '../request'

/**
 * 登录
 * @param userName - 用户名
 * @param password - 密码
 */
export function fetchLogin(email: string, password: string) {
  return request.post<ApiAuth.Token>('/login', { email, password })
}

/** 获取用户信息 */
export function fetchUserInfo() {
  return request.get<ApiAuth.UserInfo>('/user/detail')
}
