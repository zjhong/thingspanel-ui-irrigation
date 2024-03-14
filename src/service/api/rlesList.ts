import { request } from '../request';

/** 获取角色管理分页列表 */
export const rlesList = async (params: any) => {
  const data = await request.get<Api.UserManagement.Data | null>('role', {
    params
  });
  return data;
};

/** 更新角色管理 */
export const addrles = async (params: any) => {
  const data = await request.post<Api.BaseApi.Data>('/role', params);
  return data;
};

/** 创建角色管理 */
export const editrles = async (params: any) => {
  const data = await request.put<Api.BaseApi.Data>('/role', params);
  return data;
};

/** 删除角色管理 */
export const delrles = async (id: string) => {
  const data = await request.delete<Api.BaseApi.Data>(`/role/${id}`);
  return data;
};
