import UAParser from 'ua-parser-js'
import { useAuthStore } from '@/store'
import { isArray, isString } from '@/utils'

/** 获取设备信息 */
export function useDeviceInfo() {
  const parser = new UAParser()
  const result = parser.getResult()
  return result
}

/** 权限判断 */
export function usePermission() {
  const auth = useAuthStore()

  function hasPermission(permission: Auth.RoleType | Auth.RoleType[]) {
    const { authority } = auth.userInfo

    let has = authority === 'SYS_ADMIN'
    if (!has) {
      if (isArray(permission)) {
        has = (permission as Auth.RoleType[]).includes(authority)
      }
      if (isString(permission)) {
        has = (permission as Auth.RoleType) === authority
      }
    }
    return has
  }

  return {
    hasPermission
  }
}
