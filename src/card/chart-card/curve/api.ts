import { request } from '@/service/request/index';

export const deviceList = async (params: any) => {
  return await request.get<DeviceManagement.TreeStructure | null>('/device/tenant/list', params);
};
