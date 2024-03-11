import { request } from '../request';
export const getSystemLogList = async (params: Api.SystemManage.SystemLogSearchParams) => {
  return await request.get<Api.SystemManage.SystemLogList[]>('/operation_logs', { params });
};
