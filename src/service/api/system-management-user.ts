import { Api } from '@/typings/api';
import { request } from '../request';

export const getSystemLogList = async (params: Api.SystemManage.SystemLogSearchParams) => {
  return await request.get<any>('/operation_logs', { params });
};
