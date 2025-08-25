import type { Subscriber } from '@/features/subscriber-management/types/subscriber'
import { computed } from 'vue'

export function useQuotaModal(
  props: { modelValue: boolean; subscriber: Subscriber },
  emit: (event: 'update:modelValue', value: boolean) => void
) {
  // Modal state
  const isOpen = computed({
    get: () => props.modelValue,
    set: (value: boolean) => emit('update:modelValue', value)
  })

  const handleClose = () => {
    emit('update:modelValue', false)
  }

  return {
    isOpen,
    handleClose
  }
}
