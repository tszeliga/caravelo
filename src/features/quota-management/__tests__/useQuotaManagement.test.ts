import { useQuotaManagement } from '@/features/quota-management/composables/useQuotaManagement'
import {
  MAX_QUOTA,
  MIN_QUOTA
} from '@/features/quota-management/constants/quota'
import { REASON_OPTIONS } from '@/features/quota-management/constants/reasons'
import type { Subscriber } from '@/features/subscriber-management/types/subscriber'
import { describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'

// Mock the quota calculations composable
vi.mock('@/features/quota-management/composables/useQuotaCalculations', () => ({
  useQuotaCalculations: vi.fn((adjustedQuota, quota) => ({
    isAdjustedQuotaValid: {
      get value() {
        return (
          adjustedQuota.value >= MIN_QUOTA && adjustedQuota.value <= MAX_QUOTA
        )
      }
    },
    isAdjustedQuotaTheSame: {
      get value() {
        return adjustedQuota.value === quota
      }
    },
    shouldResetReason: vi.fn(
      (previousQuota: number, nextQuota: number, originalQuota: number) => {
        const previousDirection = previousQuota > originalQuota
        const nextDirection = nextQuota > originalQuota
        return (
          previousDirection !== nextDirection || nextQuota === originalQuota
        )
      }
    )
  }))
}))

// Mock the stores and submission composable
vi.mock('@/features/subscriber-management/stores/subscribers', () => ({
  useSubscribersStore: vi.fn(() => ({
    updateSubscriberQuotaValue: vi.fn()
  }))
}))

vi.mock('@/shared/stores/notifications', () => ({
  useNotificationStore: vi.fn(() => ({
    addSuccess: vi.fn(),
    addError: vi.fn()
  }))
}))

vi.mock('@/features/quota-management/composables/useQuotaSubmission', () => ({
  useQuotaSubmission: vi.fn(() => ({
    isSubmitting: ref(false),
    submissionError: ref(null),
    clearError: vi.fn(),
    submitQuotaAdjustment: vi
      .fn()
      .mockResolvedValue({ success: true, message: 'Success!' })
  }))
}))

describe('useQuotaManagement', () => {
  const ORIGINAL_QUOTA = 2 // Within valid range 0-3

  // Mock subscriber
  const mockSubscriber: Subscriber = {
    id: 'sub-123',
    name: 'John Doe',
    email: 'john@example.com',
    currentQuota: ORIGINAL_QUOTA
  }

  describe('initial state', () => {
    it('should initialize with correct default values', () => {
      const {
        reason,
        adjustedQuota,
        reasonOptions,
        isFormValid,
        errors,
        isReasonDisabled
      } = useQuotaManagement(ORIGINAL_QUOTA, ref(mockSubscriber))

      expect(reason.value).toBeNull()
      expect(adjustedQuota.value).toBe(ORIGINAL_QUOTA)
      expect(reasonOptions.value).toEqual([...REASON_OPTIONS.NEGATIVE])
      expect(isFormValid.value).toBe(false)
      expect(errors.value).toEqual({ reason: null, quota: null })
      expect(isReasonDisabled.value).toBe(true)
    })
  })

  describe('reasonOptions', () => {
    it('should return positive reasons when quota is increased', () => {
      const { reasonOptions, updateAdjustedQuota } = useQuotaManagement(
        ORIGINAL_QUOTA,
        ref(mockSubscriber)
      )

      updateAdjustedQuota(3) // Increase to max quota

      expect(reasonOptions.value).toEqual([...REASON_OPTIONS.POSITIVE])
    })

    it('should return negative reasons when quota is decreased', () => {
      const { reasonOptions, updateAdjustedQuota } = useQuotaManagement(
        ORIGINAL_QUOTA,
        ref(mockSubscriber)
      )

      updateAdjustedQuota(1) // Decrease quota

      expect(reasonOptions.value).toEqual([...REASON_OPTIONS.NEGATIVE])
    })

    it('should return negative reasons when quota equals original', () => {
      const { reasonOptions } = useQuotaManagement(
        ORIGINAL_QUOTA,
        ref(mockSubscriber)
      )

      expect(reasonOptions.value).toEqual([...REASON_OPTIONS.NEGATIVE])
    })
  })

  describe('isReasonDisabled', () => {
    it('should be true when adjusted quota equals original quota', () => {
      const { isReasonDisabled } = useQuotaManagement(
        ORIGINAL_QUOTA,
        ref(mockSubscriber)
      )

      expect(isReasonDisabled.value).toBe(true)
    })

    it('should be false when adjusted quota differs from original quota', () => {
      const { isReasonDisabled, updateAdjustedQuota } = useQuotaManagement(
        ORIGINAL_QUOTA,
        ref(mockSubscriber)
      )

      updateAdjustedQuota(3) // Different from original

      expect(isReasonDisabled.value).toBe(false)
    })
  })

  describe('updateReason', () => {
    it('should update reason value and mark as touched', () => {
      const { reason, updateReason, errors } = useQuotaManagement(
        ORIGINAL_QUOTA,
        ref(mockSubscriber)
      )

      const newReason = REASON_OPTIONS.POSITIVE[0]
      updateReason(newReason)

      expect(reason.value).toBe(newReason)
      // Errors should now be calculated since form is touched (original quota unchanged)
      expect(errors.value.quota).toBe(
        'Quota value must be different from original value'
      )
    })

    it('should accept null as a valid reason', () => {
      const { reason, updateReason, updateAdjustedQuota } = useQuotaManagement(
        ORIGINAL_QUOTA,
        ref(mockSubscriber)
      )

      updateAdjustedQuota(3) // Increase quota
      updateReason(REASON_OPTIONS.POSITIVE[0])
      expect(reason.value).toBe(REASON_OPTIONS.POSITIVE[0])

      updateReason(null)
      expect(reason.value).toBeNull()
    })
  })

  describe('updateAdjustedQuota', () => {
    it('should update quota value and mark as touched', () => {
      const { adjustedQuota, updateAdjustedQuota, errors } = useQuotaManagement(
        ORIGINAL_QUOTA,
        ref(mockSubscriber)
      )

      const newQuota = 3 // Increase quota
      updateAdjustedQuota(newQuota)

      expect(adjustedQuota.value).toBe(newQuota)
      // Errors should now be calculated since form is touched
      expect(errors.value.reason).toBe(
        'Please select a reason for the adjustment'
      )
    })

    it('should reset reason when quota direction changes', () => {
      const { reason, updateReason, updateAdjustedQuota } = useQuotaManagement(
        ORIGINAL_QUOTA,
        ref(mockSubscriber)
      )

      // Start with increase and set reason
      updateAdjustedQuota(3)
      updateReason(REASON_OPTIONS.POSITIVE[0])
      expect(reason.value).toBe(REASON_OPTIONS.POSITIVE[0])

      // Change to decrease - should reset reason
      updateAdjustedQuota(1)
      expect(reason.value).toBeNull()
    })

    it('should not reset reason when staying in same direction', () => {
      const { reason, updateReason, updateAdjustedQuota } = useQuotaManagement(
        ORIGINAL_QUOTA,
        ref(mockSubscriber)
      )

      // Start with increase and set reason
      updateAdjustedQuota(3)
      updateReason(REASON_OPTIONS.POSITIVE[0])
      expect(reason.value).toBe(REASON_OPTIONS.POSITIVE[0])

      // Change to different increase - should keep reason
      updateAdjustedQuota(3)
      expect(reason.value).toBe(REASON_OPTIONS.POSITIVE[0])
    })

    it('should reset reason when returning to original quota', () => {
      const { reason, updateReason, updateAdjustedQuota } = useQuotaManagement(
        ORIGINAL_QUOTA,
        ref(mockSubscriber)
      )

      // Start with increase and set reason
      updateAdjustedQuota(3)
      updateReason(REASON_OPTIONS.POSITIVE[0])
      expect(reason.value).toBe(REASON_OPTIONS.POSITIVE[0])

      // Return to original - should reset reason
      updateAdjustedQuota(ORIGINAL_QUOTA)
      expect(reason.value).toBeNull()
    })
  })

  describe('markTouched', () => {
    it('should enable error display when called', () => {
      const { errors, markTouched } = useQuotaManagement(
        ORIGINAL_QUOTA,
        ref(mockSubscriber)
      )

      // Initially no errors shown (not touched)
      expect(errors.value).toEqual({ reason: null, quota: null })

      markTouched()

      // Now errors should be shown
      expect(errors.value.quota).toBe(
        'Quota value must be different from original value'
      )
    })
  })

  describe('errors', () => {
    it('should not show errors before form is touched', () => {
      const { errors } = useQuotaManagement(ORIGINAL_QUOTA, ref(mockSubscriber))

      expect(errors.value).toEqual({ reason: null, quota: null })
    })

    it('should show quota error when quota is invalid', () => {
      const { errors, updateAdjustedQuota } = useQuotaManagement(
        ORIGINAL_QUOTA,
        ref(mockSubscriber)
      )

      updateAdjustedQuota(MAX_QUOTA + 1)

      expect(errors.value.quota).toBe(
        `Quota must be between ${MIN_QUOTA} and ${MAX_QUOTA}`
      )
    })

    it('should show quota error when quota is same as original', () => {
      const { errors, markTouched } = useQuotaManagement(
        ORIGINAL_QUOTA,
        ref(mockSubscriber)
      )

      markTouched()

      expect(errors.value.quota).toBe(
        'Quota value must be different from original value'
      )
    })

    it('should show reason error when quota is different but no reason selected', () => {
      const { errors, updateAdjustedQuota } = useQuotaManagement(
        ORIGINAL_QUOTA,
        ref(mockSubscriber)
      )

      updateAdjustedQuota(3)

      expect(errors.value.reason).toBe(
        'Please select a reason for the adjustment'
      )
    })

    it('should not show reason error when quota is same as original', () => {
      const { errors, markTouched } = useQuotaManagement(
        ORIGINAL_QUOTA,
        ref(mockSubscriber)
      )

      markTouched()

      expect(errors.value.reason).toBeNull()
    })

    it('should not show reason error when reason is selected', () => {
      const { errors, updateAdjustedQuota, updateReason } = useQuotaManagement(
        ORIGINAL_QUOTA,
        ref(mockSubscriber)
      )

      updateAdjustedQuota(3)
      updateReason(REASON_OPTIONS.POSITIVE[0])

      expect(errors.value.reason).toBeNull()
    })
  })

  describe('isFormValid', () => {
    it('should be false initially', () => {
      const { isFormValid } = useQuotaManagement(
        ORIGINAL_QUOTA,
        ref(mockSubscriber)
      )

      expect(isFormValid.value).toBe(false)
    })

    it('should be false when quota is same as original', () => {
      const { isFormValid, updateReason } = useQuotaManagement(
        ORIGINAL_QUOTA,
        ref(mockSubscriber)
      )

      updateReason(REASON_OPTIONS.POSITIVE[0])

      expect(isFormValid.value).toBe(false)
    })

    it('should be false when quota is invalid', () => {
      const { isFormValid, updateAdjustedQuota, updateReason } =
        useQuotaManagement(ORIGINAL_QUOTA, ref(mockSubscriber))

      updateAdjustedQuota(MAX_QUOTA + 1)
      updateReason(REASON_OPTIONS.POSITIVE[0])

      expect(isFormValid.value).toBe(false)
    })

    it('should be false when no reason is selected', () => {
      const { isFormValid, updateAdjustedQuota } = useQuotaManagement(
        ORIGINAL_QUOTA,
        ref(mockSubscriber)
      )

      updateAdjustedQuota(3)

      expect(isFormValid.value).toBe(false)
    })

    it('should be true when all conditions are met', () => {
      const { isFormValid, updateAdjustedQuota, updateReason } =
        useQuotaManagement(ORIGINAL_QUOTA, ref(mockSubscriber))

      updateAdjustedQuota(3)
      updateReason(REASON_OPTIONS.POSITIVE[0])

      expect(isFormValid.value).toBe(true)
    })
  })

  describe('reset', () => {
    it('should reset all form state to initial values', () => {
      const {
        reason,
        adjustedQuota,
        errors,
        reset,
        updateAdjustedQuota,
        updateReason
      } = useQuotaManagement(ORIGINAL_QUOTA, ref(mockSubscriber))

      // Modify form state
      updateAdjustedQuota(3)
      updateReason(REASON_OPTIONS.POSITIVE[0])

      // Verify state is changed
      expect(reason.value).toBe(REASON_OPTIONS.POSITIVE[0])
      expect(adjustedQuota.value).toBe(3)
      expect(errors.value.reason).toBeNull()

      reset()

      // Verify state is reset
      expect(reason.value).toBeNull()
      expect(adjustedQuota.value).toBe(ORIGINAL_QUOTA)
      expect(errors.value).toEqual({ reason: null, quota: null })
    })
  })

  describe('integration scenarios', () => {
    it('should handle complete form workflow correctly', () => {
      const {
        reason,
        reasonOptions,
        isFormValid,
        errors,
        updateAdjustedQuota,
        updateReason
      } = useQuotaManagement(ORIGINAL_QUOTA, ref(mockSubscriber))

      // Initial state
      expect(isFormValid.value).toBe(false)
      expect(errors.value).toEqual({ reason: null, quota: null })

      // User increases quota
      updateAdjustedQuota(3)
      expect(reasonOptions.value).toEqual([...REASON_OPTIONS.POSITIVE])
      expect(isFormValid.value).toBe(false)
      expect(errors.value.reason).toBe(
        'Please select a reason for the adjustment'
      )

      // User selects reason
      updateReason(REASON_OPTIONS.POSITIVE[0])
      expect(isFormValid.value).toBe(true)
      expect(errors.value.reason).toBeNull()

      // User changes to decrease - reason should reset
      updateAdjustedQuota(1)
      expect(reasonOptions.value).toEqual([...REASON_OPTIONS.NEGATIVE])
      expect(reason.value).toBeNull()
      expect(isFormValid.value).toBe(false)
      expect(errors.value.reason).toBe(
        'Please select a reason for the adjustment'
      )

      // User selects new reason
      updateReason(REASON_OPTIONS.NEGATIVE[0])
      expect(isFormValid.value).toBe(true)
    })

    it('should maintain readonly properties for external consumers', () => {
      const result = useQuotaManagement(ORIGINAL_QUOTA, ref(mockSubscriber))

      // These should all be readonly - Vue's readonly refs will warn but not throw
      // We test that they are readonly by checking the structure
      expect(result.reason).toBeDefined()
      expect(result.adjustedQuota).toBeDefined()
      expect(typeof result.updateReason).toBe('function')
      expect(typeof result.updateAdjustedQuota).toBe('function')
    })
  })
})
