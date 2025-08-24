import { useQuotaSubmission } from '@/features/quota-management/composables/useQuotaSubmission'
import { useSubscribersStore } from '@/features/subscriber-management/stores/subscribers'
import type { Subscriber } from '@/features/subscriber-management/types/subscriber'
import { useNotificationStore } from '@/shared/stores/notifications'
import { computed, ref, type Ref } from 'vue'

interface FormData {
  reason: string | null
  adjustmentValue: number
  isFormValid: boolean
  adjustedQuota: number
}

export function useQuotaForm(subscriber: Ref<Subscriber | null>) {
  const subscribersStore = useSubscribersStore()
  const notificationStore = useNotificationStore()

  // Composables
  const { isSubmitting, submissionError, submitQuotaAdjustment, clearError } =
    useQuotaSubmission()

  // Form state
  const isFormValid = ref(false)
  const formData = ref<FormData | null>(null)

  // Computed properties
  const adjustmentValue = computed(() => subscriber.value?.currentQuota ?? 0)

  /**
   * Handles form data updates from QuotaManageForm component
   */
  const handleFormUpdate = (data: FormData) => {
    formData.value = data
    isFormValid.value = data.isFormValid
  }

  /**
   * Handles the save operation for quota adjustment
   */
  const handleSave = async (): Promise<{ success: boolean }> => {
    if (!subscriber.value || !formData.value || !formData.value.reason) {
      return { success: false }
    }

    clearError()

    const result = await submitQuotaAdjustment(
      subscriber.value,
      {
        reason: formData.value.reason,
        adjustmentValue: formData.value.adjustmentValue,
        adjustedQuota: formData.value.adjustedQuota
      },
      // Store update callback
      (subscriberId: string, newQuota: number) => {
        subscribersStore.updateSubscriberQuotaValue(subscriberId, newQuota)
      }
    )

    if (result.success) {
      notificationStore.addSuccess(
        result.message || 'Quota adjustment successful!'
      )

      // Clear form data on success
      formData.value = null
      isFormValid.value = false

      return { success: true }
    } else {
      // API call failed
      notificationStore.addError(
        submissionError.value || result.error || 'Failed to adjust quota'
      )
      return { success: false }
    }
  }

  /**
   * Clears form data and errors
   */
  const clearForm = () => {
    formData.value = null
    isFormValid.value = false
    clearError()
  }

  return {
    // State
    isSubmitting,
    isFormValid,
    adjustmentValue,

    // Methods
    handleFormUpdate,
    handleSave,
    clearForm
  }
}
