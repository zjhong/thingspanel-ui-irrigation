import { request } from '../request'

export const getProductList = (params: any): Promise<any> => request.get('/product', { params })
export const getDeviceList = (params: any): Promise<any> => request.get('/device', { params })
export const addProduct = (data: any): Promise<any> => request.post('/product', data)
export const editProduct = (data: any): Promise<any> => request.put('/product', data)
export const deleteProduct = (id: number): Promise<any> => request.delete(`/product/${id}`)
