import type {
  QuotaAdjustment,
  QuotaAdjustmentResponse
} from '@quota/types/quota'
import { API_ENDPOINTS } from '@shared/constants/api'
import { httpClient } from '@shared/services/api/httpClient'
import type { ApiResponse } from '@shared/types/api'
import { AxiosError } from 'axios'

/**
 * Quota Service Interface
 *
 * @description Defines the contract for quota management operations.
 * Ensures type safety and consistent API across implementations.
 */
export interface QuotaServiceInterface {
  /**
   * Adjust a subscriber's quota
   */
  adjustQuota(adjustment: QuotaAdjustment): Promise<QuotaAdjustmentResponse>
}

/**
 * Quota Service Implementation
 *
 * @description Handles all quota-related API operations using the HTTP client.
 * Provides error handling, type-safe responses, and business logic abstraction.
 */
class QuotaService implements QuotaServiceInterface {
  /**
   * Adjust a subscriber's quota
   *
   * @description Makes API call to update subscriber quota with proper error handling.
   * Transforms API response into standardized format for UI consumption.
   */
  async adjustQuota({
    subscriberId,
    newQuota,
    reason
  }: QuotaAdjustment): Promise<QuotaAdjustmentResponse> {
    try {
      // Make API call to quota adjustment endpoint
      const response = await httpClient.post<QuotaAdjustmentResponse>(
        API_ENDPOINTS.QUOTA.ADJUST,
        {
          subscriberId: subscriberId,
          newQuota: newQuota,
          reason: reason
        }
      )

      // Transform successful response into standardized format
      return {
        success: true,
        data: response.data.data,
        message: `Quota adjusted successfully. New quota: ${newQuota}`
      }
    } catch (error: unknown) {
      return this.handleError(error as AxiosError, 'Failed to adjust quota')
    }
  }

  /**
   * Handle HTTP and network errors
   *
   * @description Centralizes error handling logic for API calls.
   * Categorizes errors into response, network, and unknown types.
   * Provides user-friendly error messages while preserving technical details.
   */
  private handleError(
    error: AxiosError,
    defaultMessage: string
  ): ApiResponse<QuotaAdjustment> {
    // HTTP response error (4xx, 5xx status codes)
    if (error.response) {
      return {
        success: false,
        error: defaultMessage,
        statusCode: error.response.status // Preserve status code for debugging
      }
    }

    // Network error (no response received)
    if (error.request) {
      return {
        success: false,
        error: 'Network error - please check your connection'
      }
    }

    // Request setup error or unknown error
    return {
      success: false,
      error: error.message || defaultMessage
    }
  }
}

/**
 * Quota Service Instance
 *
 * @description Singleton instance of the QuotaService class.
 * Ready-to-use service for quota management operations throughout the application.
 */
export const quotaService = new QuotaService()
