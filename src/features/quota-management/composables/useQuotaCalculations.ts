import {
  MAX_QUOTA,
  MIN_QUOTA
} from '@/features/quota-management/constants/quota'
import { computed, type Ref } from 'vue'

/**
 * Composable for quota-related calculations and validations
 * Provides reactive computations for quota validation, comparison, and UI state
 * @param adjustedQuota - Reactive reference to the adjusted quota value
 * @param quota - The original quota value for comparison
 * @returns Object containing computed validation states and utility functions
 */
export function useQuotaCalculations(
  adjustedQuota: Ref<number>,
  quota: number
) {
  /** Validates if adjusted quota is within allowed MIN/MAX range */
  const isAdjustedQuotaValid = computed((): boolean => {
    return adjustedQuota.value >= MIN_QUOTA && adjustedQuota.value <= MAX_QUOTA
  })

  /** Checks if adjusted quota equals the original quota (no change) */
  const isAdjustedQuotaTheSame = computed((): boolean => {
    return adjustedQuota.value === quota
  })

  /**
   * Determines if the reason should be reset based on quota change logic
   * @param previousQuota - The quota value currently set in the form
   * @param nextQuota - The new quota value the user is trying to set
   * @param originalQuota - The original quota value (baseline)
   * @returns true if reason should be reset, false otherwise
   */
  const shouldResetReason = (
    previousQuota: number,
    nextQuota: number,
    originalQuota: number
  ): boolean => {
    const previousDirection = previousQuota > originalQuota
    const nextDirection = nextQuota > originalQuota

    return previousDirection !== nextDirection || nextQuota === originalQuota
  }

  return {
    isAdjustedQuotaValid,
    isAdjustedQuotaTheSame,
    shouldResetReason
  }
}
