import { $t } from '@/locales'
import { transformObjectToOption } from './_shared'

export const loginModuleLabels: Record<UnionKey.LoginModule, string> = {
  'pwd-login': $t('page.login.pwdLogin.title'),
  'code-login': $t('page.login.codeLogin.title'),
  register: $t('page.login.register.title'),
  'reset-pwd': $t('page.login.resetPwd.title'),
  'bind-wechat': $t('page.login.bindWeChat.title')
}

export const userRoleLabels: Record<Auth.RoleType, string> = {
  super: $t('page.login.pwdLogin.superAdmin'),
  admin: $t('page.login.pwdLogin.admin'),
  user: $t('page.login.pwdLogin.user')
}
export const userRoleOptions = transformObjectToOption(userRoleLabels)

/** 用户性别 */
export const genderLabels: Record<UserManagement.GenderKey, string> = {
  0: '女',
  1: '男'
}
export const genderOptions = transformObjectToOption(genderLabels)

/** 用户状态 */
export const userStatusLabels: Record<UserManagement.UserStatusKey, string> = {
  1: '启用',
  2: '禁用',
  3: '冻结',
  4: '软删除'
}
export const userStatusOptions = transformObjectToOption(userStatusLabels)

/** 规则引擎状态状态 */
export const ruleEngineStatusLabels: Record<RuleEngine.StatusKey, string> = {
  1: '已启动',
  2: '已暂停'
}
export const ruleEngineStatusOptions = transformObjectToOption(ruleEngineStatusLabels)

/** 数据服务-签名方式 */
export const dataServiceSignModeLabels: Record<DataService.SignModeKey, string> = {
  1: 'MD5',
  2: 'HAS256'
}

export const dataServiceSignModeOptions = transformObjectToOption(dataServiceSignModeLabels)

/** 数据服务-接口支持标志 */
export const dataServiceFlagLabels: Record<DataService.FlagKey, string> = {
  1: 'http接口',
  2: 'http和ws接口'
}
export const dataServiceFlagOptions = transformObjectToOption(dataServiceFlagLabels)

/** 数据服务-状态 */
export const dataServiceStatusLabels: Record<DataService.StatusKey, string> = {
  1: '已启动',
  2: '已停止'
}
export const dataServiceStatusOptions = transformObjectToOption(dataServiceStatusLabels)

/** 应用管理 - 服务管理 - 服务管理类别 */
export const serviceManagementTypeLabels: Record<ServiceManagement.ServiceTypeKey, string> = {
  1: '接入协议',
  2: '通知服务',
  3: '接入服务'
}
export const serviceManagementTypeOptions = transformObjectToOption(serviceManagementTypeLabels)

/** 应用管理 - 服务管理 - 服务管理类别 */
export const serviceManagementStatusLabels: Record<ServiceManagement.StatusKey, string> = {
  1: '运行中',
  2: '已停止'
}
export const serviceManagementStatusOptions = transformObjectToOption(serviceManagementStatusLabels)

/** 系统管理 - 常规设置 - 数据清理 清理类型 */
export const dataClearSettingCleanupTypeLabels: Record<GeneralSetting.CleanupTypeKey, string> = {
  1: '设备数据',
  2: '操作日志'
}
