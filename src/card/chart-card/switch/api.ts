import { request } from '@/service/request/index';

export const deviceDatas = async (data: any) => {
  return await request.post<any>('/telemetry/datas/pub', data);
};
