import { useQuotaModal } from '@/features/quota-management/composables/useQuotaModal'
import type { Subscriber } from '@/features/subscriber-management/types/subscriber'
import { describe, expect, it, vi } from 'vitest'

describe('useQuotaModal', () => {
  const mockSubscriber: Subscriber = {
    id: 'subscriber-123',
    name: 'John Doe',
    email: 'john@example.com',
    currentQuota: 2
  }

  const createMockEmit = () => {
    return vi.fn() as (event: 'update:modelValue', value: boolean) => void
  }

  describe('isOpen computed property', () => {
    it('should get value from props.modelValue', () => {
      const mockEmit = createMockEmit()
      const props = { modelValue: true, subscriber: mockSubscriber }

      const { isOpen } = useQuotaModal(props, mockEmit)

      expect(isOpen.value).toBe(true)
    })

    it('should emit update:modelValue when set', () => {
      const mockEmit = createMockEmit()
      const props = { modelValue: false, subscriber: mockSubscriber }

      const { isOpen } = useQuotaModal(props, mockEmit)

      // Set isOpen to true
      isOpen.value = true

      expect(mockEmit).toHaveBeenCalledWith('update:modelValue', true)
    })

    it('should emit update:modelValue when set to false', () => {
      const mockEmit = createMockEmit()
      const props = { modelValue: true, subscriber: mockSubscriber }

      const { isOpen } = useQuotaModal(props, mockEmit)

      // Set isOpen to false
      isOpen.value = false

      expect(mockEmit).toHaveBeenCalledWith('update:modelValue', false)
    })
  })

  describe('handleClose', () => {
    it('should emit update:modelValue with false', () => {
      const mockEmit = createMockEmit()
      const props = { modelValue: true, subscriber: mockSubscriber }

      const { handleClose } = useQuotaModal(props, mockEmit)

      handleClose()

      expect(mockEmit).toHaveBeenCalledWith('update:modelValue', false)
    })

    it('should emit update:modelValue even if already false', () => {
      const mockEmit = createMockEmit()
      const props = { modelValue: false, subscriber: mockSubscriber }

      const { handleClose } = useQuotaModal(props, mockEmit)

      handleClose()

      expect(mockEmit).toHaveBeenCalledWith('update:modelValue', false)
    })

    it('should emit only once when called multiple times', () => {
      const mockEmit = createMockEmit()
      const props = { modelValue: true, subscriber: mockSubscriber }

      const { handleClose } = useQuotaModal(props, mockEmit)

      handleClose()
      handleClose()
      handleClose()

      expect(mockEmit).toHaveBeenCalledTimes(3)
      expect(mockEmit).toHaveBeenNthCalledWith(1, 'update:modelValue', false)
      expect(mockEmit).toHaveBeenNthCalledWith(2, 'update:modelValue', false)
      expect(mockEmit).toHaveBeenNthCalledWith(3, 'update:modelValue', false)
    })
  })
})
