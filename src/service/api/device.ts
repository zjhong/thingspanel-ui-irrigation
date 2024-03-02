import type { AxiosInstance } from 'axios';
import { request } from '../request';
export default class Device {
  private readonly http: AxiosInstance;

  constructor(http: AxiosInstance) {
    this.http = http;
  }

  getData(name: string) {
    this.http.get('');
    return name;
  }
}

/** 获取设备分组 */
export const getDeviceGroup = async (params: any) => {
  const data = await request.get<any>('/device/group', { params });
  return data;
};

/** 获取设备分组树 */
export const deviceGroupTree = async (params: any) => {
  const data = await request.get<DeviceManagement.TreeStructure | null>('/device/group/tree', params);
  return data;
};
/** 新增设备分组 */
export const deviceGroup = async (params: { id: string; parent_id: string; name: string; description: string }) => {
  const data = await request.post<Api.BaseApi.Data>('/device/group', params);
  return data;
};

/** 删除设备分组 */
export const deleteDeviceGroup = async (params: { id: string }) => {
  const data = await request.delete<Api.BaseApi.Data>(`/device/group/${params.id}`);
  return data;
};

/** 获取设备分详情 */
export const deviceGroupDetail = async (params: any) => {
  const data = await request.get<DeviceManagement.TreeStructure | null>(`/device/group/detail/${params.id}`);
  return data;
};
