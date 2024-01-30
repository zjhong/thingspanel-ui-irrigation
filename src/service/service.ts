import type { AxiosInstance } from 'axios'
import axios from 'axios'
import { localStg } from '@/utils'
import Device from '@/service/api/device'

// 先不用封装那么复杂，根据需要配置
const http = axios.create({
  baseURL: '/',
  transformRequest: (data, headers) => {
    const token = localStg.get('token')
    headers.set('Authorization', token)
    return data
  }
})

interface HttpModule {
  new (instance: AxiosInstance): object
}

type ApiInstance<T extends Record<string, any>> = {
  [P in keyof T]: InstanceType<T[P]>
}

const modules = {
  device: Device
}

export const Api = Object.fromEntries(
  Object.entries(modules).map((item: [string, HttpModule]) => [item[0], new item[1](http)])
) as ApiInstance<typeof modules>
