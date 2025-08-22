import { ref } from 'vue'
import { quotaService } from '@/services/api/quota/managementApi'
import type { QuotaAdjustment, Subscriber } from '@/types'

export function useQuotaSubmission() {
  const isSubmitting = ref(false)
  const submissionError = ref<string | null>(null)

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

      console.log('Sending quota adjustment:', adjustmentData)
      
      const response = await quotaService.adjustQuota(adjustmentData)
      
      if (response.success) {
        console.log('Quota adjustment successful:', response)
        
        // Update store with the form data quota value
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
        console.error('Quota adjustment failed:', response.error)
        return {
          success: false,
          error: response.error,
          validationErrors: response.validationErrors
        }
      }
    } catch (error) {
      const errorMessage = 'An unexpected error occurred during quota adjustment'
      submissionError.value = errorMessage
      console.error('Error during quota adjustment:', error)
      return {
        success: false,
        error: errorMessage
      }
    } finally {
      isSubmitting.value = false
    }
  }

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