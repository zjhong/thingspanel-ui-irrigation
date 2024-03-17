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

/** 获取设备列表 */
export const deviceList = async (params: any) => {
  return await request.get<DeviceManagement.DeviceDatas | any>(`/device`, { params });
};

/** 获取设备列表 */
export const deviceGroupRelation = async (params: any) => {
  return await request.post<Api.BaseApi.Data>(`/device/group/relation`, params);
};

/** 获取设备模板列表 */
export const deviceTemplate = async (params: any) => {
  return await request.get<Api.BaseApi.Data | any>(`/device/template`, { params });
};

/** 获取设备模板列表 */
export const deviceTemplateDetail = async (params: any) => {
  return await request.get<Api.BaseApi.Data | any>(`/device/template/detail/${params.id}`);
};

/** 获取设备配置列表 */
export const deviceConfig = async (params: any) => {
  return await request.get<Api.BaseApi.Data | any>(`/device_config`, { params });
};

/** 创建设备配置 */
export const deviceConfigAdd = async (params: any) => {
  return await request.post<Api.BaseApi.Data | any>(`/device_config`, params);
};

/** 更新设备配置 */
export const deviceConfigEdit = async (params: any) => {
  return await request.put<Api.BaseApi.Data | any>(`/device_config`, params);
};

/** 获取设备配置 */
export const deviceConfigInfo = async (params: any) => {
  return await request.get<Api.BaseApi.Data | any>(`device_config/${params.id}`);
};
/** 删除设备配置 */
export const deviceConfigDel = async (params: any) => {
  return await request.delete<Api.BaseApi.Data | any>(`device_config/${params.id}`);
};
/** 设备配置-连接凭证 */
export const deviceConfigConnect = async (params: any) => {
  return await request.get<Api.BaseApi.Data | any>(`device_config/connect`, { params });
};
/** 批量新设备配置关联的设备 */
export const deviceConfigBatch = async (params: any) => {
  return await request.put<Api.BaseApi.Data | any>(`/device_config/batch`, params);
};

/** 获取设备列表 */
export const deleteDeviceGroupRelation = async (params: any) => {
  return await request.delete2<Api.BaseApi.Data>(`/device/group/relation`, params);
};

/** 获取设备连接信息 */
export const getDeviceConnectInfo = async (params: any) => {
  return await request.get<Api.BaseApi.Data | any>(`/device/connect/info`, { params });
};

/** 获取设备配置列表 */
export const getDeviceConfigList = async (params: any) => {
  return await request.get<DeviceManagement.ConfigDatas>(`/device_config`, { params });
};

/** 更新设备凭证 */
export const updateDeviceVoucher = async (params: any) => {
  return await request.post<any>(`/device/update/voucher`, params);
};
export const deviceAdd = async (params: any) => {
  return await request.post<any>(`/device`, params);
};
export const devicCeonnectForm = async (params: any) => {
  return await request.get<any>(`/device/connect/form`, { params });
};

export const checkDevice = async (deviceNumber: { deviceNumber: any }) => {
  const url = `/device/check/${deviceNumber}`;
  return await request.get<any>(url);
};
export const deleteDevice = async (params: any) => {
  return await request.delete<Api.BaseApi.Data | any>(`/device/${params.id}`);
};
/** 获取数据处理列表 */
export const getDataScriptList = async (params: any) => {
  return await request.get<DeviceManagement.ConfigDatas | any>(`/data_script`, { params });
};

/** 创建数据处理 */
export const dataScriptAdd = async (params: any) => {
  return await request.post<Api.BaseApi.Data | any>(`/data_script`, params);
};

/** 更新数据处理 */
export const dataScriptEdit = async (params: any) => {
  return await request.put<Api.BaseApi.Data | any>(`/data_script`, params);
};

/** 调试数据处理 */
export const dataScriptQuiz = async (params: any) => {
  return await request.post<Api.BaseApi.Data | any>(`/data_script/quiz`, params);
};
/** 删除数据处理 */
export const dataScriptDel = async (params: any) => {
  return await request.delete<Api.BaseApi.Data | any>(`data_script/${params.id}`);
};
