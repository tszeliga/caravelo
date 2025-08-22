import { ref, computed } from 'vue'
import type { QuotaAdjustment, Subscriber } from '@/types'
import { useNotificationStore } from '@/stores/notifications'
import { useSubscribersStore } from '@/stores/subscribers'
import { quotaService } from '@/services/api/quota/managementApi'
import { REASON_OPTIONS, VALIDATION_MESSAGES } from '@/constants/validationMessages'
import { MIN_QUOTA, MAX_QUOTA } from '@/constants/quota'

export function useQuotaManagement() {
  // State
  const currentSubscriber = ref<Subscriber | null>(null)
  const quotaAdjustment = ref<Partial<QuotaAdjustment>>({
    subscriberId: '',
    currentQuota: 0,
    adjustmentValue: undefined,
    newQuota: 0,
    reason: '',
  })
  const isLoading = ref(false)
  const isModalOpen = ref(false)

  // Computed properties
  const newQuota = computed(() => {
    const current = currentSubscriber.value?.currentQuota || 0
    const adjustment = quotaAdjustment.value.adjustmentValue ?? 0
    return current + adjustment
  })

  const isQuotaWithinLimits = computed(() => {
    return newQuota.value >= MIN_QUOTA && newQuota.value <= MAX_QUOTA
  })

  const isValidAdjustment = computed(() => {
    const adjustment = quotaAdjustment.value.adjustmentValue
    return adjustment !== undefined && 
           adjustment !== 0 && 
           quotaAdjustment.value.reason !== '' &&
           isQuotaWithinLimits.value
  })

  const reasonOptions = computed(() => {
    const adjustment = quotaAdjustment.value.adjustmentValue
    const isPositive = adjustment !== undefined && adjustment > 0
    const { POSITIVE, NEGATIVE } = REASON_OPTIONS
    return [...(isPositive ? POSITIVE : NEGATIVE)]
  })

  const validationMessages = computed(() => {
    const messages: string[] = []
    const adjustment = quotaAdjustment.value.adjustmentValue
    const { QUOTA, REASON } = VALIDATION_MESSAGES
    
    if (adjustment === 0) messages.push(QUOTA.ZERO_ADJUSTMENT)
    if (adjustment !== undefined && newQuota.value < MIN_QUOTA) messages.push(QUOTA.NEGATIVE_QUOTA(MIN_QUOTA))
    if (adjustment !== undefined && newQuota.value > MAX_QUOTA) messages.push(QUOTA.EXCEEDS_MAX(MAX_QUOTA))
    if (adjustment !== undefined && adjustment !== 0 && !quotaAdjustment.value.reason) messages.push(REASON.REQUIRED)
    
    return messages
  })

  const setSubscriber = (subscriber: Subscriber): void => {
    const { id, currentQuota } = subscriber
    currentSubscriber.value = subscriber
    quotaAdjustment.value = {
      ...quotaAdjustment.value,
      subscriberId: id,
      currentQuota,
    }
  }

  const updateAdjustmentValue = (value: number): void => {
    const oldValue = quotaAdjustment.value.adjustmentValue ?? 0
    const oldSign = Math.sign(oldValue)
    const newSign = Math.sign(value)
    
    quotaAdjustment.value.adjustmentValue = value
    quotaAdjustment.value.newQuota = newQuota.value
    
    // Clear reason if sign changed (different reason categories)
    if (oldSign !== newSign && quotaAdjustment.value.reason) {
      quotaAdjustment.value.reason = ''
    }
  }

  const updateReason = (reason: string): void => {
    quotaAdjustment.value.reason = reason
  }

  const openModal = (subscriber?: Subscriber): void => {
    if (subscriber) {
      setSubscriber(subscriber)
    }
    isModalOpen.value = true
  }

  const closeModal = (): void => {
    isModalOpen.value = false
    resetAdjustment()
  }

  // Modal event handlers
  const handleClose = (): void => {
    closeModal()
  }

  const handleSave = async (): Promise<void> => {
    if (!isValidAdjustment.value || !currentSubscriber.value) return
    
    const success = await saveQuotaAdjustment()
    
    if (success) {
      closeModal()
    }
  }

  // v-model bridges for form components
  const adjustmentValue = computed({
    get: () => quotaAdjustment.value.adjustmentValue ?? 0,
    set: (value: number) => updateAdjustmentValue(value)
  })

  const selectedReason = computed({
    get: () => quotaAdjustment.value.reason || '',
    set: (value: string) => updateReason(value)
  })

  const resetAdjustment = (): void => {
    quotaAdjustment.value = {
      subscriberId: currentSubscriber.value?.id || '',
      currentQuota: currentSubscriber.value?.currentQuota || 0,
      adjustmentValue: undefined,
      newQuota: currentSubscriber.value?.currentQuota || 0,
      reason: '',
    }
  }

  const saveQuotaAdjustment = async (): Promise<boolean> => {
    if (!isValidAdjustment.value) {
      const notifications = useNotificationStore()
      const { FORM } = VALIDATION_MESSAGES
      notifications.addError(FORM.COMPLETE_REQUIRED)
      return false
    }

    try {
      isLoading.value = true
      
      const adjustmentData: QuotaAdjustment = {
        ...quotaAdjustment.value as QuotaAdjustment,
        newQuota: newQuota.value
      }

      const result = await quotaService.adjustQuota(adjustmentData)
      
      if (result.success) {
        // Update subscribers store with new quota
        const subscribersStore = useSubscribersStore()
        subscribersStore.updateSubscriberQuota(
          currentSubscriber.value!.id, 
          newQuota.value
        )
        
        // Update local subscriber reference
        if (currentSubscriber.value) {
          currentSubscriber.value.currentQuota = newQuota.value
        }
        
        const notifications = useNotificationStore()
        notifications.addSuccess(`Quota adjusted successfully. New quota: ${newQuota.value}`)
        
        closeModal()
        return true
      } else {
        throw new Error('Failed to save quota adjustment')
      }
    } catch (error) {
      const notifications = useNotificationStore()
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      notifications.addError(`Failed to save quota adjustment: ${errorMessage}`)
      return false
    } finally {
      isLoading.value = false
    }
  }

  return {
    // State
    currentSubscriber,
    quotaAdjustment,
    isLoading,
    isModalOpen,
    
    // Computed
    newQuota,
    isQuotaWithinLimits,
    isValidAdjustment,
    reasonOptions,
    validationMessages,
    
    // v-model bridges
    adjustmentValue,
    selectedReason,
    
    // Actions
    setSubscriber,
    updateAdjustmentValue,
    updateReason,
    openModal,
    closeModal,
    resetAdjustment,
    saveQuotaAdjustment,
    
    // Modal handlers
    handleClose,
    handleSave
  }
}