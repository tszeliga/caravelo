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
    if (props.modelValue === 0 && props.placeholder) {
      return props.placeholder
    }
    return props.modelValue.toString()
  })

  const isMinReached = computed(() => {
    return props.min !== undefined && props.modelValue <= props.min
  })

  const isMaxReached = computed(() => {
    return props.max !== undefined && props.modelValue >= props.max
  })

  const increment = () => {
    if (props.disabled || isMaxReached.value) {
      return
    }

    const newValue = props.modelValue + props.step
    const finalValue =
      props.max !== undefined ? Math.min(newValue, props.max) : newValue

    emit('update:modelValue', finalValue)
    emit('focus')
  }

  const decrement = () => {
    if (props.disabled || isMinReached.value) {
      return
    }

    const newValue = props.modelValue - props.step
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
