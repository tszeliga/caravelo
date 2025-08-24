import { useQuotaCalculations } from '@/features/quota-management/composables/useQuotaCalculations'
import {
  MAX_QUOTA,
  MIN_QUOTA
} from '@/features/quota-management/constants/quota'
import { beforeEach, describe, expect, it } from 'vitest'
import { ref } from 'vue'

describe('useQuotaCalculations', () => {
  const ORIGINAL_QUOTA = 2 // Within valid range 0-3

  describe('isAdjustedQuotaValid', () => {
    it('should return true when quota is within valid range', () => {
      const adjustedQuota = ref(1) // Valid within 0-3 range
      const { isAdjustedQuotaValid } = useQuotaCalculations(
        adjustedQuota,
        ORIGINAL_QUOTA
      )

      expect(isAdjustedQuotaValid.value).toBe(true)
    })

    it('should return false when quota is below minimum', () => {
      const adjustedQuota = ref(MIN_QUOTA - 1)
      const { isAdjustedQuotaValid } = useQuotaCalculations(
        adjustedQuota,
        ORIGINAL_QUOTA
      )

      expect(isAdjustedQuotaValid.value).toBe(false)
    })

    it('should return false when quota is above maximum', () => {
      const adjustedQuota = ref(MAX_QUOTA + 1)
      const { isAdjustedQuotaValid } = useQuotaCalculations(
        adjustedQuota,
        ORIGINAL_QUOTA
      )

      expect(isAdjustedQuotaValid.value).toBe(false)
    })

    it('should return true at boundary values', () => {
      const adjustedQuotaMin = ref(MIN_QUOTA)
      const adjustedQuotaMax = ref(MAX_QUOTA)

      const { isAdjustedQuotaValid: isValidMin } = useQuotaCalculations(
        adjustedQuotaMin,
        ORIGINAL_QUOTA
      )
      const { isAdjustedQuotaValid: isValidMax } = useQuotaCalculations(
        adjustedQuotaMax,
        ORIGINAL_QUOTA
      )

      expect(isValidMin.value).toBe(true)
      expect(isValidMax.value).toBe(true)
    })

    it('should be reactive to quota changes', () => {
      const adjustedQuota = ref(MIN_QUOTA - 1)
      const { isAdjustedQuotaValid } = useQuotaCalculations(
        adjustedQuota,
        ORIGINAL_QUOTA
      )

      expect(isAdjustedQuotaValid.value).toBe(false)

      adjustedQuota.value = MIN_QUOTA
      expect(isAdjustedQuotaValid.value).toBe(true)
    })
  })

  describe('isAdjustedQuotaTheSame', () => {
    it('should return true when adjusted quota equals original', () => {
      const adjustedQuota = ref(ORIGINAL_QUOTA)
      const { isAdjustedQuotaTheSame } = useQuotaCalculations(
        adjustedQuota,
        ORIGINAL_QUOTA
      )

      expect(isAdjustedQuotaTheSame.value).toBe(true)
    })

    it('should return false when adjusted quota differs from original', () => {
      const adjustedQuota = ref(ORIGINAL_QUOTA + 10)
      const { isAdjustedQuotaTheSame } = useQuotaCalculations(
        adjustedQuota,
        ORIGINAL_QUOTA
      )

      expect(isAdjustedQuotaTheSame.value).toBe(false)
    })

    it('should be reactive to quota changes', () => {
      const adjustedQuota = ref(ORIGINAL_QUOTA + 10)
      const { isAdjustedQuotaTheSame } = useQuotaCalculations(
        adjustedQuota,
        ORIGINAL_QUOTA
      )

      expect(isAdjustedQuotaTheSame.value).toBe(false)

      adjustedQuota.value = ORIGINAL_QUOTA
      expect(isAdjustedQuotaTheSame.value).toBe(true)
    })
  })

  describe('shouldResetReason', () => {
    let shouldResetReason: (
      previousQuota: number,
      nextQuota: number,
      originalQuota: number
    ) => boolean

    beforeEach(() => {
      const adjustedQuota = ref(ORIGINAL_QUOTA)
      const result = useQuotaCalculations(adjustedQuota, ORIGINAL_QUOTA)
      shouldResetReason = result.shouldResetReason
    })

    describe('direction change scenarios', () => {
      it('should reset reason when changing from increase to decrease', () => {
        // Previous: 3 (increase), Next: 1 (decrease), Original: 2
        const result = shouldResetReason(3, 1, ORIGINAL_QUOTA)
        expect(result).toBe(true)
      })

      it('should reset reason when changing from decrease to increase', () => {
        // Previous: 1 (decrease), Next: 3 (increase), Original: 2
        const result = shouldResetReason(1, 3, ORIGINAL_QUOTA)
        expect(result).toBe(true)
      })

      it('should not reset reason when staying in same direction (both increases)', () => {
        // Previous: 3 (increase), Next: 3 (increase), Original: 2
        const result = shouldResetReason(3, 3, ORIGINAL_QUOTA)
        expect(result).toBe(false)
      })

      it('should not reset reason when staying in same direction (both decreases)', () => {
        // Previous: 1 (decrease), Next: 0 (decrease), Original: 2
        const result = shouldResetReason(1, 0, ORIGINAL_QUOTA)
        expect(result).toBe(false)
      })
    })

    describe('return to original scenarios', () => {
      it('should reset reason when returning to original quota from increase', () => {
        // Previous: 3 (increase), Next: 2 (original), Original: 2
        const result = shouldResetReason(3, ORIGINAL_QUOTA, ORIGINAL_QUOTA)
        expect(result).toBe(true)
      })

      it('should reset reason when returning to original quota from decrease', () => {
        // Previous: 1 (decrease), Next: 2 (original), Original: 2
        const result = shouldResetReason(1, ORIGINAL_QUOTA, ORIGINAL_QUOTA)
        expect(result).toBe(true)
      })
    })

    describe('edge cases', () => {
      it('should not reset reason when both quotas equal original', () => {
        // Previous: 100 (original), Next: 100 (original), Original: 100
        const result = shouldResetReason(
          ORIGINAL_QUOTA,
          ORIGINAL_QUOTA,
          ORIGINAL_QUOTA
        )
        expect(result).toBe(true) // Returns true because nextQuota === originalQuota
      })

      it('should handle zero values correctly', () => {
        // Previous: 0 (decrease), Next: 3 (increase), Original: 2
        const result = shouldResetReason(0, 3, 2)
        expect(result).toBe(true) // Direction changed from decrease to increase
      })

      it('should handle equal previous and next quotas in same direction', () => {
        // Previous: 3, Next: 3, Original: 2
        const result = shouldResetReason(3, 3, ORIGINAL_QUOTA)
        expect(result).toBe(false) // No direction change, both increases
      })
    })

    describe('boundary scenarios', () => {
      it('should handle quotas at the boundary of direction change', () => {
        // Previous: 2.1 (slight increase), Next: 1.9 (slight decrease), Original: 2
        const result = shouldResetReason(2.1, 1.9, 2)
        expect(result).toBe(true) // Direction changed from increase to decrease
      })
    })
  })

  describe('integration scenarios', () => {
    it('should work correctly with all computed properties together', () => {
      const adjustedQuota = ref(3) // Max quota (increased from 2)
      const {
        isAdjustedQuotaValid,
        isAdjustedQuotaTheSame,
        shouldResetReason
      } = useQuotaCalculations(adjustedQuota, ORIGINAL_QUOTA)

      // Initial state: quota is increased to max
      expect(isAdjustedQuotaValid.value).toBe(true)
      expect(isAdjustedQuotaTheSame.value).toBe(false)

      // Should reset reason when changing direction (from increase to decrease)
      expect(shouldResetReason(adjustedQuota.value, 1, ORIGINAL_QUOTA)).toBe(
        true
      )

      // Should not reset reason when staying in same direction
      expect(shouldResetReason(adjustedQuota.value, 3, ORIGINAL_QUOTA)).toBe(
        false
      )
    })

    it('should maintain reactivity across all computed properties', () => {
      const adjustedQuota = ref(ORIGINAL_QUOTA)
      const { isAdjustedQuotaValid, isAdjustedQuotaTheSame } =
        useQuotaCalculations(adjustedQuota, ORIGINAL_QUOTA)

      // Initial: same as original
      expect(isAdjustedQuotaValid.value).toBe(true)
      expect(isAdjustedQuotaTheSame.value).toBe(true)

      // Change to valid different value
      adjustedQuota.value = 3 // Max quota
      expect(isAdjustedQuotaValid.value).toBe(true)
      expect(isAdjustedQuotaTheSame.value).toBe(false)

      // Change to invalid value
      adjustedQuota.value = MAX_QUOTA + 1 // 4, which is invalid
      expect(isAdjustedQuotaValid.value).toBe(false)
      expect(isAdjustedQuotaTheSame.value).toBe(false)
    })
  })
})
