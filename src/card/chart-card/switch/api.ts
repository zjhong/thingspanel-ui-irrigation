import { request } from "@/service/request/index";

export const deviceDatas = async (data: any) => {
  return await request.post<any>("/telemetry/datas/pub", data);
};

// 获取当前设备的详情
export const deviceDetails = async (data: any) => {
  return await request.get<any>("/telemetry/datas/current/ws", data);
};
