import { useNumberStepper } from '@/shared/components/NumberStepper/useNumberStepper'
import { describe, expect, it, vi } from 'vitest'

describe('useNumberStepper', () => {
  const createMockEmit = () => {
    const updateModelValue = vi.fn()
    const focus = vi.fn()

    return {
      emit: ((evt: string, ...args: unknown[]) => {
        if (evt === 'update:modelValue') {
          updateModelValue(args[0])
        } else if (evt === 'focus') {
          focus()
        }
      }) as {
        (evt: 'update:modelValue', value: number): void
        (evt: 'focus'): void
      },
      updateModelValue,
      focus
    }
  }

  const defaultProps = {
    modelValue: 2,
    min: 0,
    max: 5,
    step: 1,
    disabled: false,
    placeholder: ''
  }

  describe('computed properties', () => {
    describe('inputId', () => {
      it('should generate a unique ID', () => {
        const { emit } = createMockEmit()
        const { inputId } = useNumberStepper(defaultProps, emit)

        expect(inputId.value).toMatch(/^stepper-[a-z0-9]{9}$/)
      })

      it('should generate different IDs for different instances', () => {
        const { emit: emit1 } = createMockEmit()
        const { emit: emit2 } = createMockEmit()

        const { inputId: id1 } = useNumberStepper(defaultProps, emit1)
        const { inputId: id2 } = useNumberStepper(defaultProps, emit2)

        expect(id1.value).not.toBe(id2.value)
      })
    })

    describe('displayValue', () => {
      it('should return modelValue as string when no placeholder', () => {
        const { emit } = createMockEmit()
        const props = { ...defaultProps, modelValue: 42 }
        const { displayValue } = useNumberStepper(props, emit)

        expect(displayValue.value).toBe('42')
      })

      it('should return placeholder when modelValue is 0 and placeholder exists', () => {
        const { emit } = createMockEmit()
        const props = {
          ...defaultProps,
          modelValue: 0,
          placeholder: 'Enter value'
        }
        const { displayValue } = useNumberStepper(props, emit)

        expect(displayValue.value).toBe('Enter value')
      })

      it('should return modelValue when non-zero even with placeholder', () => {
        const { emit } = createMockEmit()
        const props = {
          ...defaultProps,
          modelValue: 3,
          placeholder: 'Enter value'
        }
        const { displayValue } = useNumberStepper(props, emit)

        expect(displayValue.value).toBe('3')
      })

      it('should handle negative values', () => {
        const { emit } = createMockEmit()
        const props = { ...defaultProps, modelValue: -5 }
        const { displayValue } = useNumberStepper(props, emit)

        expect(displayValue.value).toBe('-5')
      })
    })

    describe('isMinReached', () => {
      it('should return true when modelValue equals min', () => {
        const { emit } = createMockEmit()
        const props = { ...defaultProps, modelValue: 0, min: 0 }
        const { isMinReached } = useNumberStepper(props, emit)

        expect(isMinReached.value).toBe(true)
      })

      it('should return true when modelValue is less than min', () => {
        const { emit } = createMockEmit()
        const props = { ...defaultProps, modelValue: -1, min: 0 }
        const { isMinReached } = useNumberStepper(props, emit)

        expect(isMinReached.value).toBe(true)
      })

      it('should return false when modelValue is greater than min', () => {
        const { emit } = createMockEmit()
        const props = { ...defaultProps, modelValue: 3, min: 0 }
        const { isMinReached } = useNumberStepper(props, emit)

        expect(isMinReached.value).toBe(false)
      })

      it('should return false when min is undefined', () => {
        const { emit } = createMockEmit()
        const props = { ...defaultProps, modelValue: -100, min: undefined }
        const { isMinReached } = useNumberStepper(props, emit)

        expect(isMinReached.value).toBe(false)
      })
    })

    describe('isMaxReached', () => {
      it('should return true when modelValue equals max', () => {
        const { emit } = createMockEmit()
        const props = { ...defaultProps, modelValue: 5, max: 5 }
        const { isMaxReached } = useNumberStepper(props, emit)

        expect(isMaxReached.value).toBe(true)
      })

      it('should return true when modelValue is greater than max', () => {
        const { emit } = createMockEmit()
        const props = { ...defaultProps, modelValue: 10, max: 5 }
        const { isMaxReached } = useNumberStepper(props, emit)

        expect(isMaxReached.value).toBe(true)
      })

      it('should return false when modelValue is less than max', () => {
        const { emit } = createMockEmit()
        const props = { ...defaultProps, modelValue: 2, max: 5 }
        const { isMaxReached } = useNumberStepper(props, emit)

        expect(isMaxReached.value).toBe(false)
      })

      it('should return false when max is undefined', () => {
        const { emit } = createMockEmit()
        const props = { ...defaultProps, modelValue: 1000, max: undefined }
        const { isMaxReached } = useNumberStepper(props, emit)

        expect(isMaxReached.value).toBe(false)
      })
    })
  })

  describe('increment', () => {
    it('should increment value by step amount', () => {
      const { emit, updateModelValue, focus } = createMockEmit()
      const props = { ...defaultProps, modelValue: 2, step: 1 }
      const { increment } = useNumberStepper(props, emit)

      increment()

      expect(updateModelValue).toHaveBeenCalledWith(3)
      expect(focus).toHaveBeenCalled()
    })

    it('should increment by custom step amount', () => {
      const { emit, updateModelValue, focus } = createMockEmit()
      const props = { ...defaultProps, modelValue: 10, step: 5, max: 20 } // Added max to allow increment
      const { increment } = useNumberStepper(props, emit)

      increment()

      expect(updateModelValue).toHaveBeenCalledWith(15)
      expect(focus).toHaveBeenCalled()
    })

    it('should not exceed maximum value', () => {
      const { emit, updateModelValue, focus } = createMockEmit()
      const props = { ...defaultProps, modelValue: 4, max: 5, step: 2 }
      const { increment } = useNumberStepper(props, emit)

      increment()

      expect(updateModelValue).toHaveBeenCalledWith(5) // Clamped to max
      expect(focus).toHaveBeenCalled()
    })

    it('should not increment when disabled', () => {
      const { emit, updateModelValue, focus } = createMockEmit()
      const props = { ...defaultProps, modelValue: 2, disabled: true }
      const { increment } = useNumberStepper(props, emit)

      increment()

      expect(updateModelValue).not.toHaveBeenCalled()
      expect(focus).not.toHaveBeenCalled()
    })

    it('should not increment when at maximum', () => {
      const { emit, updateModelValue, focus } = createMockEmit()
      const props = { ...defaultProps, modelValue: 5, max: 5 }
      const { increment } = useNumberStepper(props, emit)

      increment()

      expect(updateModelValue).not.toHaveBeenCalled()
      expect(focus).not.toHaveBeenCalled()
    })

    it('should increment without max constraint when max is undefined', () => {
      const { emit, updateModelValue, focus } = createMockEmit()
      const props = {
        ...defaultProps,
        modelValue: 1000,
        max: undefined,
        step: 50
      }
      const { increment } = useNumberStepper(props, emit)

      increment()

      expect(updateModelValue).toHaveBeenCalledWith(1050)
      expect(focus).toHaveBeenCalled()
    })

    it('should handle decimal step values', () => {
      const { emit, updateModelValue, focus } = createMockEmit()
      const props = { ...defaultProps, modelValue: 2.5, step: 0.1 }
      const { increment } = useNumberStepper(props, emit)

      increment()

      expect(updateModelValue).toHaveBeenCalledWith(2.6)
      expect(focus).toHaveBeenCalled()
    })
  })

  describe('decrement', () => {
    it('should decrement value by step amount', () => {
      const { emit, updateModelValue, focus } = createMockEmit()
      const props = { ...defaultProps, modelValue: 3, step: 1 }
      const { decrement } = useNumberStepper(props, emit)

      decrement()

      expect(updateModelValue).toHaveBeenCalledWith(2)
      expect(focus).toHaveBeenCalled()
    })

    it('should decrement by custom step amount', () => {
      const { emit, updateModelValue, focus } = createMockEmit()
      const props = { ...defaultProps, modelValue: 20, step: 5 }
      const { decrement } = useNumberStepper(props, emit)

      decrement()

      expect(updateModelValue).toHaveBeenCalledWith(15)
      expect(focus).toHaveBeenCalled()
    })

    it('should not go below minimum value', () => {
      const { emit, updateModelValue, focus } = createMockEmit()
      const props = { ...defaultProps, modelValue: 1, min: 0, step: 2 }
      const { decrement } = useNumberStepper(props, emit)

      decrement()

      expect(updateModelValue).toHaveBeenCalledWith(0) // Clamped to min
      expect(focus).toHaveBeenCalled()
    })

    it('should not decrement when disabled', () => {
      const { emit, updateModelValue, focus } = createMockEmit()
      const props = { ...defaultProps, modelValue: 3, disabled: true }
      const { decrement } = useNumberStepper(props, emit)

      decrement()

      expect(updateModelValue).not.toHaveBeenCalled()
      expect(focus).not.toHaveBeenCalled()
    })

    it('should not decrement when at minimum', () => {
      const { emit, updateModelValue, focus } = createMockEmit()
      const props = { ...defaultProps, modelValue: 0, min: 0 }
      const { decrement } = useNumberStepper(props, emit)

      decrement()

      expect(updateModelValue).not.toHaveBeenCalled()
      expect(focus).not.toHaveBeenCalled()
    })

    it('should decrement without min constraint when min is undefined', () => {
      const { emit, updateModelValue, focus } = createMockEmit()
      const props = {
        ...defaultProps,
        modelValue: -500,
        min: undefined,
        step: 100
      }
      const { decrement } = useNumberStepper(props, emit)

      decrement()

      expect(updateModelValue).toHaveBeenCalledWith(-600)
      expect(focus).toHaveBeenCalled()
    })
  })

  describe('boundary conditions', () => {
    it('should handle zero values correctly', () => {
      const { emit, updateModelValue } = createMockEmit()
      const props = { ...defaultProps, modelValue: 0, min: -5, max: 5, step: 1 }
      const { increment, decrement, isMinReached, isMaxReached } =
        useNumberStepper(props, emit)

      expect(isMinReached.value).toBe(false)
      expect(isMaxReached.value).toBe(false)

      increment()
      expect(updateModelValue).toHaveBeenCalledWith(1)

      decrement()
      expect(updateModelValue).toHaveBeenCalledWith(-1)
    })
  })

  describe('integration scenarios', () => {
    it('should handle disabled state correctly', () => {
      const { emit, updateModelValue, focus } = createMockEmit()
      const props = { ...defaultProps, modelValue: 2, disabled: true }

      const { increment, decrement } = useNumberStepper(props, emit)

      // Neither operation should work when disabled
      increment()
      decrement()

      expect(updateModelValue).not.toHaveBeenCalled()
      expect(focus).not.toHaveBeenCalled()
    })

    it('should handle edge case values properly', () => {
      const { emit, updateModelValue } = createMockEmit()

      // Test with decimal boundaries
      const props = {
        modelValue: 2.95,
        min: 0,
        max: 3,
        step: 0.1,
        disabled: false
      }

      const { increment } = useNumberStepper(props, emit)

      increment() // Should clamp to 3.0, not 3.05
      expect(updateModelValue).toHaveBeenCalledWith(3)
    })
  })
})
