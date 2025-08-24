import { useQuotaForm } from '@/features/quota-management/composables/useQuotaForm'
import type { Subscriber } from '@/features/subscriber-management/types/subscriber'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ref, type Ref } from 'vue'

// Simple mocks without complex vi.mocked usage
const mockSubmitQuotaAdjustment = vi.fn()
const mockClearError = vi.fn()
const mockUpdateSubscriberQuota = vi.fn()
const mockAddSuccess = vi.fn()
const mockAddError = vi.fn()

// Mock the composables and stores
vi.mock('@/features/quota-management/composables/useQuotaSubmission', () => ({
  useQuotaSubmission: () => ({
    isSubmitting: ref(false),
    submissionError: ref(null),
    submitQuotaAdjustment: mockSubmitQuotaAdjustment,
    clearError: mockClearError
  })
}))

vi.mock('@/features/subscriber-management/stores/subscribers', () => ({
  useSubscribersStore: () => ({
    updateSubscriberQuota: mockUpdateSubscriberQuota
  })
}))

vi.mock('@/shared/stores/notifications', () => ({
  useNotificationStore: () => ({
    addSuccess: mockAddSuccess,
    addError: mockAddError
  })
}))

describe('useQuotaForm', () => {
  let mockSubscriber: Subscriber
  let subscriberRef: Ref<Subscriber | null>

  beforeEach(() => {
    mockSubscriber = {
      id: 'subscriber-123',
      name: 'Test Subscriber',
      email: 'test@example.com',
      currentQuota: 2
    }

    subscriberRef = ref<Subscriber | null>(mockSubscriber)
    vi.clearAllMocks()
  })

  describe('initial state', () => {
    it('should initialize with correct default values', () => {
      const { isFormValid, adjustmentValue } = useQuotaForm(subscriberRef)

      expect(isFormValid.value).toBe(false)
      expect(adjustmentValue.value).toBe(2) // Current subscriber quota
    })

    it('should handle null subscriber', () => {
      const nullSubscriberRef = ref<Subscriber | null>(null)
      const { isFormValid, adjustmentValue } = useQuotaForm(nullSubscriberRef)

      expect(isFormValid.value).toBe(false)
      expect(adjustmentValue.value).toBe(0) // Default when no subscriber
    })

    it('should be reactive to subscriber changes', () => {
      const { adjustmentValue } = useQuotaForm(subscriberRef)

      expect(adjustmentValue.value).toBe(2)

      // Update subscriber quota
      subscriberRef.value = {
        ...mockSubscriber,
        currentQuota: 3
      }

      expect(adjustmentValue.value).toBe(3)
    })
  })

  describe('handleFormUpdate', () => {
    it('should update form data and validity', () => {
      const { handleFormUpdate, isFormValid } = useQuotaForm(subscriberRef)

      const mockFormData = {
        reason: 'Test reason',
        adjustmentValue: 1,
        isFormValid: true,
        adjustedQuota: 3
      }

      expect(isFormValid.value).toBe(false)

      handleFormUpdate(mockFormData)

      expect(isFormValid.value).toBe(true)
    })

    it('should handle invalid form data', () => {
      const { handleFormUpdate, isFormValid } = useQuotaForm(subscriberRef)

      const invalidFormData = {
        reason: null,
        adjustmentValue: 0,
        isFormValid: false,
        adjustedQuota: 2
      }

      handleFormUpdate(invalidFormData)

      expect(isFormValid.value).toBe(false)
    })
  })

  describe('handleSave', () => {
    it('should handle successful save operation', async () => {
      const { handleFormUpdate, handleSave } = useQuotaForm(subscriberRef)

      // Setup form data
      const formData = {
        reason: 'Increased demand',
        adjustmentValue: 1,
        isFormValid: true,
        adjustedQuota: 3
      }
      handleFormUpdate(formData)

      // Mock successful submission
      mockSubmitQuotaAdjustment.mockResolvedValue({
        success: true,
        message: 'Quota updated successfully'
      })

      const result = await handleSave()

      expect(mockClearError).toHaveBeenCalled()
      expect(mockSubmitQuotaAdjustment).toHaveBeenCalledWith(
        mockSubscriber,
        {
          reason: 'Increased demand',
          adjustmentValue: 1,
          adjustedQuota: 3
        },
        expect.any(Function) // Store update callback
      )
      expect(mockAddSuccess).toHaveBeenCalledWith('Quota updated successfully')
      expect(result.success).toBe(true)
    })

    it('should handle save failure from API', async () => {
      const { handleFormUpdate, handleSave } = useQuotaForm(subscriberRef)

      // Setup form data
      const formData = {
        reason: 'Test reason',
        adjustmentValue: 1,
        isFormValid: true,
        adjustedQuota: 3
      }
      handleFormUpdate(formData)

      // Mock failed submission
      mockSubmitQuotaAdjustment.mockResolvedValue({
        success: false,
        error: 'Quota limit exceeded'
      })

      const result = await handleSave()

      expect(mockAddError).toHaveBeenCalledWith('Quota limit exceeded')
      expect(result.success).toBe(false)
    })

    it('should return false when no subscriber', async () => {
      const nullSubscriberRef = ref<Subscriber | null>(null)
      const { handleSave } = useQuotaForm(nullSubscriberRef)

      const result = await handleSave()

      expect(result.success).toBe(false)
      expect(mockSubmitQuotaAdjustment).not.toHaveBeenCalled()
    })

    it('should return false when no form data', async () => {
      const { handleSave } = useQuotaForm(subscriberRef)

      const result = await handleSave()

      expect(result.success).toBe(false)
      expect(mockSubmitQuotaAdjustment).not.toHaveBeenCalled()
    })

    it('should return false when no reason provided', async () => {
      const { handleFormUpdate, handleSave } = useQuotaForm(subscriberRef)

      const formDataWithoutReason = {
        reason: null,
        adjustmentValue: 1,
        isFormValid: false,
        adjustedQuota: 3
      }
      handleFormUpdate(formDataWithoutReason)

      const result = await handleSave()

      expect(result.success).toBe(false)
      expect(mockSubmitQuotaAdjustment).not.toHaveBeenCalled()
    })
  })

  describe('clearForm', () => {
    it('should clear form data and errors', () => {
      const { handleFormUpdate, clearForm, isFormValid } =
        useQuotaForm(subscriberRef)

      // Setup form data first
      const formData = {
        reason: 'Test reason',
        adjustmentValue: 1,
        isFormValid: true,
        adjustedQuota: 3
      }
      handleFormUpdate(formData)

      expect(isFormValid.value).toBe(true)

      clearForm()

      expect(isFormValid.value).toBe(false)
    })
  })

  describe('integration scenarios', () => {
    it('should handle subscriber changes during form lifecycle', () => {
      const { adjustmentValue, handleFormUpdate, isFormValid } =
        useQuotaForm(subscriberRef)

      // Initial subscriber quota
      expect(adjustmentValue.value).toBe(2)

      // Fill form
      handleFormUpdate({
        reason: 'Test',
        adjustmentValue: 1,
        isFormValid: true,
        adjustedQuota: 3
      })
      expect(isFormValid.value).toBe(true)

      // Change subscriber
      subscriberRef.value = {
        ...mockSubscriber,
        id: 'new-subscriber',
        currentQuota: 1
      }

      expect(adjustmentValue.value).toBe(1) // Should reflect new subscriber's quota

      // Switch to null subscriber
      subscriberRef.value = null
      expect(adjustmentValue.value).toBe(0)
    })
  })
})
