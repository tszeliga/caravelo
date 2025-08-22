import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'
import { useNotificationStore } from '@/stores/notifications'
import { appConfig } from '@/utils/appConfig'
import { HTTP_TIMEOUTS, HTTP_HEADERS } from '@/constants/api'

class HttpClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: appConfig.api.baseUrl,
      timeout: HTTP_TIMEOUTS.DEFAULT,
      headers: {
        'Content-Type': HTTP_HEADERS.CONTENT_TYPE,
        'Accept': HTTP_HEADERS.ACCEPT
      }
    })

    this.setupInterceptors()
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // Development mode: simulate API responses for quota endpoints
        if (import.meta.env.DEV && config.url?.includes('/quota/')) {
          return this.simulateQuotaApi(config)
        }

        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        return response
      },
      (error) => {
        const notifications = useNotificationStore()

        // Handle specific error scenarios
        if (error.response?.status === 403) {
          notifications.addError('You do not have permission to perform this action.')
        } else if (error.response?.status >= 500) {
          notifications.addError('Server error. Please try again later.')
        }

        return Promise.reject(error)
      }
    )
  }

  /**
   * Development simulation for quota API endpoints
   * Uses httpstat.us as specified in PRD for testing
   */
  private simulateQuotaApi(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {    
  
    config.url = `https://tools-httpstatus.pickup-services.com/${200}`
    config.params = { sleep: 1000 } // Simulate realistic API delay
    
    return config
  }

  // Public methods for HTTP operations
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.get<T>(url, config)
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.post<T>(url, data, config)
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.put<T>(url, data, config)
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.delete<T>(url, config)
  }
}

export const httpClient = new HttpClient()