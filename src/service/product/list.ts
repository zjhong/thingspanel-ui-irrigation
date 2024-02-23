import { request } from '../request'

export const getProductList = (params: any): Promise<any> => request.get('/product', { params })
