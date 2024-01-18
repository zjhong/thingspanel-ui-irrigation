/** 用户相关模块 */
declare namespace Auth {
  /**
   * 用户角色类型(前端静态路由用角色类型进行路由权限的控制)
   * - super: 超级管理员(该权限具有所有路由数据)
   * - admin: 管理员
   * - user: 用户
   */
  type RoleType = 'super' | 'admin' | 'user'

  /** 用户信息 */
  interface UserInfo {
    /** 用户id */
    userId: string
    /** 用户名 */
    userName: string
    /** 用户角色类型 */
    userRole: RoleType
  }
}

declare namespace UserManagement {
  interface User extends ApiUserManagement.User {
    /** 序号 */
    index: number
    /** 表格的key（id） */
    key: string
  }

  /**
   * 用户性别
   * - 0: 女
   * - 1: 男
   */
  type GenderKey = NonNullable<User['gender']>

  /**
   * 用户状态
   * - 1: 启用
   * - 2: 禁用
   * - 3: 冻结
   * - 4: 软删除
   */
  type UserStatusKey = NonNullable<User['userStatus']>
}

/**
 * 规则引擎模块
 */
declare namespace RuleEngine {
  interface Rule extends ApiRuleEngine.Rule {
    /** 序号 */
    index: number
  }

  /**
   * 规则引擎状态
   * - 1: 已启用
   * - 2: 已暂停
   */
  type StatusKey = NonNullable<Rule['status']>
}

/**
 * 数据服务模块
 */
declare namespace DataService {
  interface Data extends ApiDataService.Data {
    /** 序号 */
    index: number
    /** SQL */
    SQL: string | null
    /** SQL编写辅助 */
    SQLWritingAid: string | null
  }

  /**
   * 签名方式
   * - 1: MD5
   * - 2: HAS256
   */
  type SignModeKey = NonNullable<Data['signMode']>

  /**
   * 接口支持标志
   * - 1: http接口
   * - 2: http和ws接口
   */
  type FlagKey = NonNullable<Data['flag']>

  /**
   * 规则引擎状态
   * - 1: 已启用
   * - 2: 已停止
   */
  type StatusKey = NonNullable<Data['status']>
}
