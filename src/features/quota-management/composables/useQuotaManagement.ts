import { useQuotaCalculations } from '@/features/quota-management/composables/useQuotaCalculations'
import { useQuotaSubmission } from '@/features/quota-management/composables/useQuotaSubmission'
import {
  MAX_QUOTA,
  MIN_QUOTA
} from '@/features/quota-management/constants/quota'
import { REASON_OPTIONS } from '@/features/quota-management/constants/reasons'
import type { ReasonType } from '@/features/quota-management/types/quota'
import { useSubscribersStore } from '@/features/subscriber-management/stores/subscribers'
import type { Subscriber } from '@/features/subscriber-management/types/subscriber'
import { useNotificationStore } from '@/shared/stores/notifications'
import { computed, readonly, ref, type Ref } from 'vue'

/**
 * Composable for managing quota form state, validation, and submission
 * Handles reason selection, quota adjustments, form validation, UI state management, and form submission
 * @param quota - The original quota value to manage adjustments against
 * @param subscriber - Reactive reference to the subscriber object for submission
 * @returns Object containing form state, validation, submission methods, and management functions
 */
export function useQuotaManagement(quota: number, subscriber: Ref<Subscriber>) {
  const reason = ref<ReasonType>(null)
  const adjustedQuota = ref<number>(quota)
  const touched = ref(false)

  // Submission-related composables
  const subscribersStore = useSubscribersStore()
  const notificationStore = useNotificationStore()
  const submissionComposable = useQuotaSubmission()

  /**
   * Computed property that returns appropriate reason options based on quota direction
   * Shows positive reasons when increasing quota, negative reasons when decreasing
   */
  const reasonOptions = computed(() => {
    const isAddingQuota = adjustedQuota.value > quota
    const { POSITIVE, NEGATIVE } = REASON_OPTIONS
    return [...(isAddingQuota ? POSITIVE : NEGATIVE)]
  })
  const { isAdjustedQuotaValid, isAdjustedQuotaTheSame, shouldResetReason } =
    useQuotaCalculations(adjustedQuota, quota)

  /** Determines if reason input should be disabled (when quota unchanged) */
  const isReasonDisabled = computed((): boolean => {
    return isAdjustedQuotaTheSame.value
  })

  /**
   * Marks the form as touched to trigger validation display
   * Called when user interacts with form elements
   */
  const markTouched = () => {
    touched.value = true
  }

  /**
   * Updates the selected reason and marks form as touched
   * @param value - The new reason value to set
   */
  const updateReason = (value: ReasonType) => {
    touched.value = true
    reason.value = value
  }

  /**
   * Updates the adjusted quota value and handles reason reset logic
   * Automatically clears reason if quota direction changes
   * @param value - The new quota value to set
   */
  const updateAdjustedQuota = (value: number) => {
    touched.value = true

    if (shouldResetReason(adjustedQuota.value, value, quota)) {
      reason.value = null
    }

    adjustedQuota.value = value
  }

  /**
   * Computed validation errors for form fields
   * Only shows errors after form has been touched
   * @returns Object with reason and quota error messages (null if valid)
   */
  const errors = computed(() => {
    if (!touched.value) {
      return { reason: null, quota: null }
    }

    let quotaError = null
    if (!isAdjustedQuotaValid.value) {
      quotaError = `Quota must be between ${MIN_QUOTA} and ${MAX_QUOTA}`
    } else if (isAdjustedQuotaTheSame.value) {
      quotaError = 'Quota value must be different from original value'
    }

    return {
      reason:
        !isAdjustedQuotaTheSame.value && reason.value === null
          ? 'Please select a reason for the adjustment'
          : null,
      quota: quotaError
    }
  })

  /**
   * Computed boolean indicating if the form is valid and can be submitted
   * Requires: reason selected, valid quota range, and quota different from original
   */
  const isFormValid = computed(() => {
    return (
      reason.value !== null &&
      isAdjustedQuotaValid.value &&
      !isAdjustedQuotaTheSame.value
    )
  })

  /**
   * Handles the save operation for quota adjustment
   */
  const handleSave = async (): Promise<{ success: boolean }> => {
    if (!reason.value) {
      return { success: false }
    }

    submissionComposable.clearError()

    const result = await submissionComposable.submitQuotaAdjustment(
      subscriber.value,
      {
        reason: reason.value,
        adjustmentValue: quota,
        adjustedQuota: adjustedQuota.value
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
      return { success: true }
    } else {
      notificationStore.addError(
        submissionComposable.submissionError.value ||
          result.error ||
          'Failed to adjust quota'
      )
      return { success: false }
    }
  }

  /**
   * Clears form data and errors
   */
  const clearForm = () => {
    submissionComposable.clearError()
    reason.value = null
    adjustedQuota.value = quota
    touched.value = false
  }

  return {
    reasonOptions: readonly(reasonOptions),
    isFormValid: readonly(isFormValid),
    errors: readonly(errors),
    isReasonDisabled: readonly(isReasonDisabled),
    reason: readonly(reason),
    adjustedQuota: readonly(adjustedQuota),

    isSubmitting: submissionComposable.isSubmitting,
    adjustmentValue: computed(() => subscriber.value.currentQuota),

    updateReason,
    updateAdjustedQuota,
    markTouched,
    reset: () => {
      reason.value = null
      adjustedQuota.value = quota
      touched.value = false
    },

    handleSave,
    clearForm
  }
}
