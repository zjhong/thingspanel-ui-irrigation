interface UserModel extends Auth.UserInfo {
  token: string
  refreshToken: string
  password: string
}

export const userModel: UserModel[] = [
  {
    token: '__TOKEN_SOYBEAN__',
    refreshToken: '__REFRESH_TOKEN_SOYBEAN__',
    id: '0',
    userName: 'Soybean',
    authority: 'SYS_ADMIN',
    password: 'soybean123'
  },
  {
    token: '__TOKEN_SOYBEAN__',
    refreshToken: '__REFRESH_TOKEN_SOYBEAN__',
    id: '100',
    userName: 'super@super.cn',
    authority: 'SYS_ADMIN',
    password: '123456'
  },
  {
    token: '__TOKEN_SUPER__',
    refreshToken: '__REFRESH_TOKEN_SUPER__',
    id: '1',
    userName: 'Super',
    authority: 'SYS_ADMIN',
    password: 'super123'
  },
  {
    token: '__TOKEN_ADMIN__',
    refreshToken: '__REFRESH_TOKEN_ADMIN__',
    id: '2',
    userName: 'Admin',
    authority: 'TENANT_ADMIN',
    password: 'admin123'
  },
  {
    token: '__TOKEN_USER01__',
    refreshToken: '__REFRESH_TOKEN_USER01__',
    id: '3',
    userName: 'User01',
    authority: 'TENANT_USER',
    password: 'user01123'
  }
]
