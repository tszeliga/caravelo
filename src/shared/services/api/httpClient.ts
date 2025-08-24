import { appConfig } from '@shared/utils/appConfig'
import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse
} from 'axios'

class HttpClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: appConfig.api.baseUrl
    })
  }

  async post<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.client.post<T>(url, data, config)
  }
}

export const httpClient = new HttpClient()
