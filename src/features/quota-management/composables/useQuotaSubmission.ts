import { quotaService } from '@/features/quota-management/services/managementApi'
import type { QuotaAdjustment } from '@/features/quota-management/types/quota'
import type { Subscriber } from '@/features/subscriber-management/types/subscriber'
import { ref } from 'vue'

/**
 * Composable for handling quota adjustment submissions
 * Provides reactive state management and API interaction for quota modifications
 */
export function useQuotaSubmission() {
  const isSubmitting = ref(false)
  const submissionError = ref<string | null>(null)

  /**
   * Submits quota adjustment request to the API
   * Handles loading state, error management, and success callbacks
   */
  const submitQuotaAdjustment = async (
    subscriber: Subscriber,
    formData: {
      reason: string
      adjustmentValue: number
      adjustedQuota: number
    },
    onSuccess?: (subscriberId: string, newQuota: number) => void
  ) => {
    isSubmitting.value = true
    submissionError.value = null

    try {
      const adjustmentData: QuotaAdjustment = {
        subscriberId: subscriber.id,
        newQuota: formData.adjustedQuota,
        reason: formData.reason
      }

      const response = await quotaService.adjustQuota(adjustmentData)

      if (response.success) {
        // Update store with the form data quota value
        // On production value should be taken from response
        if (onSuccess) {
          onSuccess(subscriber.id, formData.adjustedQuota)
        }

        return {
          success: true,
          data: response.data,
          message: response.message
        }
      } else {
        submissionError.value = response.error || 'Failed to adjust quota'
        return {
          success: false,
          error: response.error
        }
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? `Quota adjustment failed: ${error.message}`
          : 'An unexpected error occurred during quota adjustment'
      submissionError.value = errorMessage
      return {
        success: false,
        error: errorMessage
      }
    } finally {
      isSubmitting.value = false
    }
  }

  /**
   * Clears any existing submission error
   * Used to reset error state before new submission attempts
   */
  const clearError = () => {
    submissionError.value = null
  }

  return {
    isSubmitting,
    submissionError,
    submitQuotaAdjustment,
    clearError
  }
}
