import { computed, ref } from 'vue'
import { REASON_OPTIONS } from '@/constants/validationMessages'
import { MIN_QUOTA, MAX_QUOTA } from '@/constants/quota'
import { useQuotaCalculations } from '@/composables/useQuotaCalculations'

type ReasonType = typeof REASON_OPTIONS.POSITIVE[number] | typeof REASON_OPTIONS.NEGATIVE[number] | null

export function useQuotManagement(quota: number) {
  const reason = ref<ReasonType>(null)
  const adjustedQuota = ref<number>(quota)
  const touched = ref(false)
  
  const reasonOptions = computed(() => {
    const isAddingQuota = adjustedQuota.value > quota
    const { POSITIVE, NEGATIVE } = REASON_OPTIONS
    return [...(isAddingQuota ? POSITIVE : NEGATIVE)]
  })
  const {
    isAdjustedQuotaCorrect
  } = useQuotaCalculations(adjustedQuota)

  const markTouched = () => {
    touched.value = true
  }

  const updateReason = (value: ReasonType) => {
    touched.value = true
    reason.value = value
  }

  const updateAdjustedQuota = (value: number) => {
    touched.value = true
    reason.value = null
    adjustedQuota.value = value
  }

  const errors = computed(() => {
    if (!touched.value) {
      return { reason: null, quota: null }
    }
    
    return {
      reason: reason.value === null ? 'Please select a reason for the adjustment' : null,
      quota: !isAdjustedQuotaCorrect.value ? `Quota must be between ${MIN_QUOTA} and ${MAX_QUOTA}` : null
    }
  })

  const isFormValid = computed(() => {
    return reason.value !== null && isAdjustedQuotaCorrect.value
  })

  return {
    reasonOptions,
    reason,
    adjustedQuota,
    updateReason,
    updateAdjustedQuota,
    isFormValid,
    errors,
    markTouched
  }
}