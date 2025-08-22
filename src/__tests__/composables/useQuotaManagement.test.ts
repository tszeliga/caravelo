import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useQuotaManagement } from '@/composables/useQuotaManagement'
import type { Subscriber } from '@/types'

// Mock the stores and services
vi.mock('@/stores/notifications', () => ({
  useNotificationStore: () => ({
    addError: vi.fn(),
    addSuccess: vi.fn()
  })
}))

vi.mock('@/stores/subscribers', () => ({
  useSubscribersStore: () => ({
    updateSubscriberQuota: vi.fn()
  })
}))

vi.mock('@/services/api/quota/managementApi', () => ({
  quotaService: {
    adjustQuota: vi.fn(() => Promise.resolve({ success: true }))
  }
}))

const mockSubscriber: Subscriber = {
  id: 'sub-123',
  name: 'John Doe',
  email: 'john@example.com',
  currentQuota: 2
}

describe('useQuotaManagement Composable', () => {
  let quotaManagement: ReturnType<typeof useQuotaManagement>

  beforeEach(() => {
    quotaManagement = useQuotaManagement()
  })

  describe('Initial State', () => {
    it('initializes with correct default values', () => {
      expect(quotaManagement.currentSubscriber.value).toBeNull()
      expect(quotaManagement.isLoading.value).toBe(false)
      expect(quotaManagement.isModalOpen.value).toBe(false)
    })

    it('has empty quota adjustment by default', () => {
      expect(quotaManagement.quotaAdjustment.value.adjustmentValue).toBe(0)
      expect(quotaManagement.quotaAdjustment.value.reason).toBe('')
    })
  })

  describe('Subscriber Management', () => {
    it('sets subscriber correctly', () => {
      quotaManagement.setSubscriber(mockSubscriber)
      
      expect(quotaManagement.currentSubscriber.value).toEqual(mockSubscriber)
      expect(quotaManagement.quotaAdjustment.value.subscriberId).toBe('sub-123')
      expect(quotaManagement.quotaAdjustment.value.currentQuota).toBe(2)
    })
  })

  describe('Quota Calculations', () => {
    beforeEach(() => {
      quotaManagement.setSubscriber(mockSubscriber)
    })

    it('calculates new quota correctly for positive adjustment', () => {
      quotaManagement.updateAdjustmentValue(1)
      expect(quotaManagement.newQuota.value).toBe(3)
    })

    it('calculates new quota correctly for negative adjustment', () => {
      quotaManagement.updateAdjustmentValue(-1)
      expect(quotaManagement.newQuota.value).toBe(1)
    })

    it('shows raw calculated value even when exceeding maximum', () => {
      quotaManagement.updateAdjustmentValue(5)
      expect(quotaManagement.newQuota.value).toBe(7) // 2 + 5 = 7 (raw value)
      expect(quotaManagement.isQuotaWithinLimits.value).toBe(false)
    })

    it('shows raw calculated value even when below minimum', () => {
      quotaManagement.updateAdjustmentValue(-5)
      expect(quotaManagement.newQuota.value).toBe(-3) // 2 + (-5) = -3 (raw value)
      expect(quotaManagement.isQuotaWithinLimits.value).toBe(false)
    })

    it('correctly identifies when quota is within limits', () => {
      quotaManagement.updateAdjustmentValue(1)
      expect(quotaManagement.newQuota.value).toBe(3) // 2 + 1 = 3
      expect(quotaManagement.isQuotaWithinLimits.value).toBe(true)
    })
  })

  describe('Validation Logic', () => {
    beforeEach(() => {
      quotaManagement.setSubscriber(mockSubscriber)
    })

    it('requires non-zero adjustment value', () => {
      quotaManagement.updateAdjustmentValue(0)
      quotaManagement.updateReason('Some reason')
      
      expect(quotaManagement.isValidAdjustment.value).toBe(false)
      expect(quotaManagement.validationMessages.value).toContain('Adjustment value cannot be zero')
    })

    it('requires reason selection', () => {
      quotaManagement.updateAdjustmentValue(1)
      quotaManagement.updateReason('')
      
      expect(quotaManagement.isValidAdjustment.value).toBe(false)
      expect(quotaManagement.validationMessages.value).toContain('Please select a reason for the adjustment')
    })

    it('validates when both adjustment and reason are provided', () => {
      quotaManagement.updateAdjustmentValue(1)
      quotaManagement.updateReason('Customer compensation')
      
      expect(quotaManagement.isValidAdjustment.value).toBe(true)
      expect(quotaManagement.validationMessages.value).toHaveLength(0)
    })

    it('shows validation errors when trying to exceed maximum quota', () => {
      // Set subscriber at max quota (3)
      const maxQuotaSubscriber = { ...mockSubscriber, currentQuota: 3 }
      quotaManagement.setSubscriber(maxQuotaSubscriber)
      
      // Try to add +1 (would be 4, exceeding limit)
      quotaManagement.updateAdjustmentValue(1)
      quotaManagement.updateReason('Customer compensation')
      
      // Should show raw value and validation error
      expect(quotaManagement.newQuota.value).toBe(4) // UI shows raw calculated value
      expect(quotaManagement.isQuotaWithinLimits.value).toBe(false) // Outside limits
      expect(quotaManagement.isValidAdjustment.value).toBe(false) // Validation fails
      expect(quotaManagement.validationMessages.value).toContain('Quota cannot exceed 3 flights')
    })

    it('shows validation errors when trying to go below minimum quota', () => {
      // Set subscriber at min quota (0)  
      const minQuotaSubscriber = { ...mockSubscriber, currentQuota: 0 }
      quotaManagement.setSubscriber(minQuotaSubscriber)
      
      // Try to subtract -1 (would be -1, below minimum)
      quotaManagement.updateAdjustmentValue(-1)
      quotaManagement.updateReason('Some issue')
      
      // Should show raw value and validation error
      expect(quotaManagement.newQuota.value).toBe(-1) // UI shows raw calculated value
      expect(quotaManagement.isQuotaWithinLimits.value).toBe(false) // Outside limits
      expect(quotaManagement.isValidAdjustment.value).toBe(false) // Validation fails
      expect(quotaManagement.validationMessages.value).toContain('Quota cannot be negative (minimum: 0)')
    })
  })

  describe('Reason Options', () => {
    beforeEach(() => {
      quotaManagement.setSubscriber(mockSubscriber)
    })

    it('shows positive reasons for positive adjustments', () => {
      quotaManagement.updateAdjustmentValue(1)
      const reasons = quotaManagement.reasonOptions.value
      
      expect(reasons).toContain('Subscriber canceled flight')
      expect(reasons).toContain('Airline canceled flight')
      expect(reasons).toContain('Customer compensation')
    })

    it('shows negative reasons for negative adjustments', () => {
      quotaManagement.updateAdjustmentValue(-1)
      const reasons = quotaManagement.reasonOptions.value
      
      expect(reasons).toContain('Flight not redeposited after a flight cancellation')
      expect(reasons).toContain('Subscriber had log in or password issues')
    })

    it('clears reason when adjustment sign changes', () => {
      quotaManagement.updateAdjustmentValue(1)
      quotaManagement.updateReason('Customer compensation')
      
      // Change to negative - should clear reason
      quotaManagement.updateAdjustmentValue(-1)
      
      expect(quotaManagement.quotaAdjustment.value.reason).toBe('')
    })
  })

  describe('Modal Management', () => {
    it('opens modal with subscriber', () => {
      quotaManagement.openModal(mockSubscriber)
      
      expect(quotaManagement.isModalOpen.value).toBe(true)
      expect(quotaManagement.currentSubscriber.value).toEqual(mockSubscriber)
    })

    it('closes modal and resets form', () => {
      quotaManagement.setSubscriber(mockSubscriber)
      quotaManagement.updateAdjustmentValue(1)
      quotaManagement.updateReason('Test reason')
      quotaManagement.isModalOpen.value = true
      
      quotaManagement.closeModal()
      
      expect(quotaManagement.isModalOpen.value).toBe(false)
      expect(quotaManagement.quotaAdjustment.value.adjustmentValue).toBe(0)
      expect(quotaManagement.quotaAdjustment.value.reason).toBe('')
    })
  })
})