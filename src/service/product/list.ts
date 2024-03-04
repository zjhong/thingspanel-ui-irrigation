import { request } from '../request';

export const getProductList = (params: any): Promise<any> => request.get('/product', { params });
export const getDeviceList = (params: any): Promise<any> => request.get('/device', { params });
export const addProduct = (data: any): Promise<any> => request.post('/product', data);
export const editProduct = (data: any): Promise<any> => request.put('/product', data);
export const deleteProduct = (id: string): Promise<any> => request.delete(`/product/${id}`);
// /device/Reeegiprrst;
export const addDevice = (data: any): Promise<any> => request.post('/device/preRegister', data);
// /device/preRegister/export
export const exportDevice = (data: any): Promise<any> => request.post('/device/preRegister/export', data);
