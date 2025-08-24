import { API_ENDPOINTS } from '@shared/constants/api'
import { httpClient } from '@shared/services/api/httpClient'
import type { ApiResponse } from '@shared/types/api'
import { AxiosError } from 'axios'
import type { QuotaAdjustment, QuotaAdjustmentResponse } from '../types/quota'
export interface QuotaServiceInterface {
  adjustQuota(adjustment: QuotaAdjustment): Promise<QuotaAdjustmentResponse>
}

class QuotaService implements QuotaServiceInterface {
  async adjustQuota({
    subscriberId,
    newQuota,
    reason
  }: QuotaAdjustment): Promise<QuotaAdjustmentResponse> {
    try {
      const response = await httpClient.post<QuotaAdjustmentResponse>(
        API_ENDPOINTS.QUOTA.ADJUST,
        {
          subscriberId: subscriberId,
          newQuota: newQuota,
          reason: reason
        }
      )

      return {
        success: true,
        data: response.data.data,
        message: `Quota adjusted successfully. New quota: ${newQuota}`
      }
    } catch (error: unknown) {
      return this.handleError(error as AxiosError, 'Failed to adjust quota')
    }
  }

  private handleError(
    error: AxiosError,
    defaultMessage: string
  ): ApiResponse<QuotaAdjustment> {
    if (error.response) {
      return {
        success: false,
        error: defaultMessage,
        statusCode: error.response.status
      }
    }

    if (error.request) {
      return {
        success: false,
        error: 'Network error - please check your connection'
      }
    }

    return {
      success: false,
      error: error.message || defaultMessage
    }
  }
}

export const quotaService = new QuotaService()
