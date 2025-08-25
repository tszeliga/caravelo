import { computed } from 'vue'

interface UseNumberStepperProps {
  modelValue: number
  min?: number
  max?: number
  step: number
  disabled: boolean
  placeholder?: string
}

export function useNumberStepper(
  props: UseNumberStepperProps,
  emit: {
    (evt: 'update:modelValue', value: number): void
    (evt: 'focus'): void
  }
) {
  const inputId = computed(
    () => `stepper-${Math.random().toString(36).substring(2, 11)}`
  )

  const displayValue = computed(() => {
    // Ensure we have a valid number
    const value = Number.isNaN(props.modelValue) ? 0 : props.modelValue
    if (value === 0 && props.placeholder) {
      return props.placeholder
    }
    return value.toString()
  })

  const isMinReached = computed(() => {
    const value = Number.isNaN(props.modelValue) ? 0 : props.modelValue
    return props.min !== undefined && value <= props.min
  })

  const isMaxReached = computed(() => {
    const value = Number.isNaN(props.modelValue) ? 0 : props.modelValue
    return props.max !== undefined && value >= props.max
  })

  const increment = () => {
    if (props.disabled || isMaxReached.value) {
      return
    }

    const currentValue = Number.isNaN(props.modelValue) ? 0 : props.modelValue
    const newValue = currentValue + props.step
    const finalValue =
      props.max !== undefined ? Math.min(newValue, props.max) : newValue

    emit('update:modelValue', finalValue)
    emit('focus')
  }

  const decrement = () => {
    if (props.disabled || isMinReached.value) {
      return
    }

    const currentValue = Number.isNaN(props.modelValue) ? 0 : props.modelValue
    const newValue = currentValue - props.step
    const finalValue =
      props.min !== undefined ? Math.max(newValue, props.min) : newValue

    emit('update:modelValue', finalValue)
    emit('focus')
  }

  return {
    inputId,
    displayValue,
    isMinReached,
    isMaxReached,
    increment,
    decrement
  }
}
