import { computed, type Ref } from 'vue'
import { MIN_QUOTA, MAX_QUOTA } from '@/constants/quota'


export function useQuotaCalculations(adjustedQuota: Ref<number>) {

  const isAdjustedQuotaCorrect = computed(() => {
    return adjustedQuota.value >= MIN_QUOTA && adjustedQuota.value <= MAX_QUOTA
  })

  return {
     isAdjustedQuotaCorrect
  }
}