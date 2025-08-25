import {
  MAX_QUOTA,
  MIN_QUOTA
} from '@/features/quota-management/constants/quota'
import { computed, type Ref } from 'vue'

/**
 * Composable for quota-related calculations and validations
 * Provides reactive computations for quota validation, comparison, and UI state
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
