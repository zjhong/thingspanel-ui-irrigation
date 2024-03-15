import { request } from '../request';

export const getBoardList = async (params: Panel.RequestParams) => {
  return await request.get<Panel.Data>('/board', { params });
};

export const getBoard = async (params: string) => {
  return await request.get<Panel.Board>(`/board/${params}`);
};

export const PostBoard = async (params: any) => {
  return await request.post<any>('/board', params);
};

/** 修改设备分组 */
export const PutBoard = async (params: any) => {
  return await request.put<any>('/board', params);
};

/** 删除设备分组 */
export const DelBoard = async (params: string) => {
  return await request.delete<any>(`/board/${params}`);
};
