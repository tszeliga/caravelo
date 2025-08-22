import { httpClient } from '../httpClient'
import { API_ENDPOINTS } from '@/constants/api'
import type { Subscriber, ApiResponse, QuotaAdjustment, QuotaAdjustmentResponse } from '@/types'

export interface QuotaServiceInterface {
  adjustQuota(adjustment: QuotaAdjustment): Promise<QuotaAdjustmentResponse>
  getSubscriber(subscriberId: string): Promise<ApiResponse<Subscriber>>
}

class QuotaService implements QuotaServiceInterface {

  /**
   * Adjust subscriber quota with business rule validation
   * @param adjustment - Complete quota adjustment data
   * @returns Promise with success status and updated quota information
   */
  async adjustQuota(adjustment: QuotaAdjustment): Promise<QuotaAdjustmentResponse> {
    try {
      // For development: use test endpoint from PRD
      const response = await httpClient.post<QuotaAdjustmentResponse>(
        API_ENDPOINTS.QUOTA.ADJUST,
        {
          subscriberId: adjustment.subscriberId,
          adjustmentValue: adjustment.adjustmentValue,
          reason: adjustment.reason
        }
      )

      return {
        success: true,
        data: response.data.data,
        message: `Quota adjusted successfully. New quota: ${response.data.data?.newQuota}`
      }
    } catch (error) {
      return this.handleQuotaError(error, 'Failed to adjust quota')
    }
  }

  /**
   * Get subscriber information including current quota
   * @param subscriberId - Unique subscriber identifier
   * @returns Promise with subscriber data
   */
  async getSubscriber(subscriberId: string): Promise<ApiResponse<Subscriber>> {
    try {
      const response = await httpClient.get<Subscriber>(
        API_ENDPOINTS.QUOTA.SUBSCRIBER(subscriberId)
      )

      return {
        success: true,
        data: response.data,
        message: 'Subscriber retrieved successfully'
      }
    } catch (error) {
      return this.handleError(error, 'Failed to retrieve subscriber')
    }
  }

  /**
   * Handle quota-specific errors with business context
   */
  private handleQuotaError(error: any, defaultMessage: string): QuotaAdjustmentResponse {
    const errorResponse = error.response?.data

    // Business rule violations
    if (error.response?.status === 400) {
      return {
        success: false,
        error: errorResponse?.message || 'Invalid quota adjustment',
        validationErrors: errorResponse?.validationErrors || []
      }
    }

    // Authorization issues
    if (error.response?.status === 403) {
      return {
        success: false,
        error: 'Insufficient permissions to adjust quotas'
      }
    }

    // Generic error handling
    return this.handleError(error, defaultMessage) as QuotaAdjustmentResponse
  }

  /**
   * Generic error handler for API responses
   */
  private handleError(error: any, defaultMessage: string): ApiResponse<any> {
    console.error('QuotaService Error:', error)

    if (error.response) {
      return {
        success: false,
        error: error.response.data?.message || defaultMessage,
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