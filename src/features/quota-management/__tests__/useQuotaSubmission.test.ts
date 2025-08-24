import { useQuotaSubmission } from '@/features/quota-management/composables/useQuotaSubmission'
import type { Subscriber } from '@subscribers/types/subscriber'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// Mock the quota service at the module level
vi.mock('@/features/quota-management/services/managementApi')

describe('useQuotaSubmission', () => {
  const mockSubscriber: Subscriber = {
    id: 'test-subscriber-1',
    name: 'Test Subscriber',
    email: 'test@example.com',
    currentQuota: 2
  }

  const mockFormData = {
    reason: 'Peak season demand',
    adjustmentValue: 1,
    adjustedQuota: 3
  }

  let mockQuotaService: {
    adjustQuota: ReturnType<typeof vi.fn>
  }

  beforeEach(async () => {
    vi.resetAllMocks()
    const module = await import(
      '@/features/quota-management/services/managementApi'
    )
    mockQuotaService = module.quotaService as typeof module.quotaService & {
      adjustQuota: ReturnType<typeof vi.fn>
    }
    mockQuotaService.adjustQuota = vi.fn()
  })

  describe('initial state', () => {
    it('should initialize with correct default values', () => {
      const { isSubmitting, submissionError } = useQuotaSubmission()

      expect(isSubmitting.value).toBe(false)
      expect(submissionError.value).toBeNull()
    })
  })

  describe('submitQuotaAdjustment', () => {
    describe('successful submission', () => {
      it('should handle successful API response', async () => {
        const mockResponse = {
          success: true,
          data: {
            subscriberId: 'test-subscriber-1',
            newQuota: 3,
            reason: 'Peak season demand'
          },
          message: 'Quota updated successfully'
        }
        mockQuotaService.adjustQuota.mockResolvedValue(mockResponse)

        const { submitQuotaAdjustment, isSubmitting, submissionError } =
          useQuotaSubmission()

        const result = await submitQuotaAdjustment(mockSubscriber, mockFormData)

        expect(isSubmitting.value).toBe(false)
        expect(submissionError.value).toBeNull()
        expect(result).toEqual({
          success: true,
          data: mockResponse.data,
          message: mockResponse.message
        })

        expect(mockQuotaService.adjustQuota).toHaveBeenCalledWith({
          subscriberId: mockSubscriber.id,
          newQuota: mockFormData.adjustedQuota,
          reason: mockFormData.reason
        })
      })
    })

    describe('API failure response', () => {
      it('should handle API failure response', async () => {
        const mockResponse = {
          success: false,
          error: 'Quota adjustment failed due to business rules'
        }
        mockQuotaService.adjustQuota.mockResolvedValue(mockResponse)

        const { submitQuotaAdjustment, isSubmitting, submissionError } =
          useQuotaSubmission()

        const result = await submitQuotaAdjustment(mockSubscriber, mockFormData)

        expect(isSubmitting.value).toBe(false)
        expect(submissionError.value).toBe(
          'Quota adjustment failed due to business rules'
        )
        expect(result).toEqual({
          success: false,
          error: 'Quota adjustment failed due to business rules'
        })
      })
    })

    describe('network/exception errors', () => {
      it('should handle network errors', async () => {
        const networkError = new Error('Network connection failed')
        mockQuotaService.adjustQuota.mockRejectedValue(networkError)

        const { submitQuotaAdjustment, isSubmitting, submissionError } =
          useQuotaSubmission()

        const result = await submitQuotaAdjustment(mockSubscriber, mockFormData)

        expect(isSubmitting.value).toBe(false)
        expect(submissionError.value).toBe(
          'Quota adjustment failed: Network connection failed'
        )
        expect(result).toEqual({
          success: false,
          error: 'Quota adjustment failed: Network connection failed'
        })
      })
    })
  })

  describe('clearError', () => {
    it('should clear submission error', async () => {
      // Create an error first
      mockQuotaService.adjustQuota.mockResolvedValue({
        success: false,
        error: 'Test error'
      })

      const { submitQuotaAdjustment, submissionError, clearError } =
        useQuotaSubmission()

      await submitQuotaAdjustment(mockSubscriber, mockFormData)
      expect(submissionError.value).toBe('Test error')

      clearError()
      expect(submissionError.value).toBeNull()
    })
  })
})
