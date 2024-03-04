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
  return await request.get<any>('/device/group', { params });
};

/** 获取设备分组树 */
export const deviceGroupTree = async (params: any) => {
  return await request.get<DeviceManagement.TreeStructure | null>('/device/group/tree', params);
};
/** 新增设备分组 */
export const deviceGroup = async (params: { id: string; parent_id: string; name: string; description: string }) => {
  return await request.post<Api.BaseApi.Data>('/device/group', params);
};

/** 修改设备分组 */
export const putDeviceGroup = async (params: { id: string; parent_id: string; name: string; description: string }) => {
  return await request.put<Api.BaseApi.Data>('/device/group', params);
};

/** 删除设备分组 */
export const deleteDeviceGroup = async (params: { id: string }) => {
  return await request.delete<Api.BaseApi.Data>(`/device/group/${params.id}`);
};

/** 获取设备分详情 */
export const deviceGroupDetail = async (params: any) => {
  return await request.get<DeviceManagement.DetailData>(`/device/group/detail/${params.id}`);
};

/** 获取设备分组关系 */
export const deviceGroupList = async (params: any) => {
  return await request.get<DeviceManagement.GroupDeviceData>(`/device/group/relation/${params.id}`);
};

/** 获取设备列表 */
export const deviceList = async (params: any) => {
  return await request.get<DeviceManagement.DeviceDatas | null>(`/device`, { params });
};

/** 获取设备列表 */
export const deviceGroupRelation = async (params: any) => {
  return await request.post<Api.BaseApi.Data>(`/device/group/relation`, params);
};
