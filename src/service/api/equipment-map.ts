/*
 * @Descripttion:
 * @version:
 * @Author: zhaoqi
 * @Date: 2024-03-23 09:35:32
 * @LastEditors: zhaoqi
 * @LastEditTime: 2024-03-31 10:02:04
 */
import { request } from "../request";

/** 获取空间列表 */
export const spacesList = async (params: any): Promise<any> => {
  return await request.get<Api.BaseApi.Data>(
    "http://47.251.45.205:9999/api/v1/irrigation/spaces",
    { params },
  );
};

/** 获取区域列表 */
export const areasList = async (params: any): Promise<any> => {
  return await request.get<Api.BaseApi.Data>(
    "http://47.251.45.205:9999/api/v1/irrigation/districts",
    { params },
  );
};

/** 获取区域详情 */
export const areaDetail = async (id: any): Promise<any> => {
  return await request.get<Api.BaseApi.Data>(
    "http://47.251.45.205:9999/api/v1/irrigation/districts/" + id,
  );
};
/** 获取空间详情 */
export const apaceDetail = async (id: any): Promise<any> => {
  return await request.get<Api.BaseApi.Data>(
    "http://47.251.45.205:9999/api/v1/irrigation/spaces/" + id,
  );
};
/** 修改空间 */
export const editSpaces = async (id: any) => {
  const data = await request.put<any>(
    "http://47.251.45.205:9999/api/v1/irrigation/spaces/" + id,
  );
  return data;
};
/** 添加空间 */
export const addSpace = async (data: any): Promise<any> => {
  return await request.post<Api.BaseApi.Data>(
    "http://47.251.45.205:9999/api/v1/irrigation/spaces",
    data,
  );
};

//添加区域
export const addArea = async (data: any): Promise<any> => {
  return await request.post<Api.BaseApi.Data>(
    "http://47.251.45.205:9999/api/v1/irrigation/districts",
    data,
  );
};

/** 删除区域 */
export const deleteArea = async (id: any): Promise<any> => {
  return await request.delete<Api.BaseApi.Data>(
    "http://47.251.45.205:9999/api/v1/irrigation/districts/" + id,
  );
};

/** 设备地图-空间区域列表筛选
 */

export const spacesData = async (params: any): Promise<any> => {
  return await request.get(
    "http://47.251.45.205:9999/api/v1/irrigation/devices/spaces",
    { params },
  );
};

/** 设备地图-设备总数
 */

export const sumData = async (params: any): Promise<any> => {
  return await request.get(
    "http://47.251.45.205:9999/api/v1/board/tenant/device/info",
    { params },
  );
};
/** 获取区域详情 */
export const areaData = async (id: any): Promise<any> => {
  return await request.get<Api.BaseApi.Data>(
    "http://47.251.45.205:9999/api/v1/irrigation/districts/" + id,
  );
};
