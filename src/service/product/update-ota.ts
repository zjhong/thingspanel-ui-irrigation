import { request } from '../request'

export const getOtaTaskList = (params: any): Promise<any> => request.get('/ota/task', { params })
export const getDeviceList = (params: any): Promise<any> => request.get('/device', { params })
export const addOtaPackage = (data: any): Promise<any> => request.post('/ota/package', data)
export const editOtaPackage = (data: any): Promise<any> => request.put('/ota/package', data)
export const deleteOtaPackage = (id: number): Promise<any> => request.delete(`/ota/package/${id}`)
