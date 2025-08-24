import { useQuotaCalculations } from '@/features/quota-management/composables/useQuotaCalculations'
import {
  MAX_QUOTA,
  MIN_QUOTA
} from '@/features/quota-management/constants/quota'
import { REASON_OPTIONS } from '@/features/quota-management/constants/reasons'
import type { ReasonType } from '@/features/quota-management/types/quota'
import { computed, readonly, ref } from 'vue'

/**
 * Composable for managing quota form state and validation
 * Handles reason selection, quota adjustments, form validation, and UI state management
 * @param quota - The original quota value to manage adjustments against
 * @returns Object containing form state, validation, and management functions
 */
export function useQuotaManagement(quota: number) {
  const reason = ref<ReasonType>(null)
  const adjustedQuota = ref<number>(quota)
  const touched = ref(false)

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

  return {
    reasonOptions: readonly(reasonOptions),
    isFormValid: readonly(isFormValid),
    errors: readonly(errors),
    isReasonDisabled: readonly(isReasonDisabled),
    reason: readonly(reason),
    adjustedQuota: readonly(adjustedQuota),

    updateReason,
    updateAdjustedQuota,
    markTouched,
    reset: () => {
      reason.value = null
      adjustedQuota.value = quota
      touched.value = false
    }
  }
}
