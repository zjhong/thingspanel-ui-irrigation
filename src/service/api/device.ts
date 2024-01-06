import type { AxiosInstance } from 'axios'

export default class Device {
  private readonly http: AxiosInstance

  constructor(http: AxiosInstance) {
    this.http = http
  }

  getData(name: string) {
    this.http.get('')
    return name
  }
}
