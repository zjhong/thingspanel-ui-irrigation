import { request } from '../request';

/** 获取设备总数和激活数 */
export const totalNumber = async () => {
  const data = await request.get<Api.BaseApi.Data | null>('/board/device');
  return data;
};

/** 获取租户总数、昨日新增、本月新增以及月历史数据 */
export const tenant = async () => {
  const data = await request.get<Api.BaseApi.Data | null>('/board/tenant');
  return data;
};
