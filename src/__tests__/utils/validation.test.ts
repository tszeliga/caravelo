import { describe, it, expect } from 'vitest'
import { 
  validateQuotaAdjustment, 
  validateReason, 
  calculateNewQuota,
  validateQuotaForm,
  getReasonOptions 
} from '@/utils/validation'

describe('Validation Utils', () => {
  describe('validateQuotaAdjustment', () => {
    it('should validate positive adjustments within limits', () => {
      const result = validateQuotaAdjustment(1, 2)
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should validate negative adjustments within limits', () => {
      const result = validateQuotaAdjustment(2, -1)
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should reject zero adjustments', () => {
      const result = validateQuotaAdjustment(2, 0)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Adjustment value cannot be zero')
    })

    it('should reject adjustments that exceed maximum quota', () => {
      const result = validateQuotaAdjustment(2, 2) // Would result in 4, max is 3
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Quota cannot exceed 3 flights')
    })

    it('should reject adjustments that result in negative quota', () => {
      const result = validateQuotaAdjustment(1, -2) // Would result in -1
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Quota cannot be negative (minimum: 0)')
    })
  })

  describe('validateReason', () => {
    it('should accept valid reasons', () => {
      const result = validateReason('Subscriber canceled flight')
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should reject empty reasons', () => {
      const result = validateReason('')
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Please select a reason for the adjustment')
    })

    it('should reject whitespace-only reasons', () => {
      const result = validateReason('   ')
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Please select a reason for the adjustment')
    })
  })

  describe('calculateNewQuota', () => {
    it('should calculate new quota correctly within limits', () => {
      expect(calculateNewQuota(1, 1)).toBe(2)
      expect(calculateNewQuota(2, -1)).toBe(1)
    })

    it('should enforce minimum quota limit', () => {
      expect(calculateNewQuota(1, -5)).toBe(0)
    })

    it('should enforce maximum quota limit', () => {
      expect(calculateNewQuota(1, 5)).toBe(3)
    })
  })

  describe('validateQuotaForm', () => {
    it('should validate complete valid form', () => {
      const result = validateQuotaForm(1, 1, 'Subscriber canceled flight')
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should collect all validation errors', () => {
      const result = validateQuotaForm(1, 0, '') // Zero adjustment and no reason
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Adjustment value cannot be zero')
      expect(result.errors).toContain('Please select a reason for the adjustment')
    })
  })

  describe('getReasonOptions', () => {
    it('should return positive reasons for positive adjustments', () => {
      const options = getReasonOptions(1)
      expect(options).toContain('Subscriber canceled flight')
      expect(options).toContain('Customer compensation')
    })

    it('should return negative reasons for negative adjustments', () => {
      const options = getReasonOptions(-1)
      expect(options).toContain('Flight not redeposited after a flight cancellation')
      expect(options).toContain('Subscriber had log in or password issues')
    })

    it('should return negative reasons for zero (default case)', () => {
      const options = getReasonOptions(0)
      expect(options).toContain('Flight not redeposited after a flight cancellation')
    })
  })
})