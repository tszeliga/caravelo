<template>
  <v-form class="quota-form" data-testid="quota-adjustment-form">
    <v-text-field
      :model-value="adjustedQuota"
      label="Quota Adjustment"
      placeholder="Enter positive or negative number"
      type="number"
      variant="outlined"
      density="comfortable"
      aria-label="quota adjustment value"
      aria-describedby="adjustment-help"
      data-testid="adjustment-input"
      class="mb-3"
      @update:model-value="handleQuotaChange"
      @focus="handleFormTouch"
    >
    </v-text-field>
    <v-select
      :model-value="reason"
      :items="reasonOptions"
      label="Select reason"
      variant="outlined"
      data-testid="reason-select"
      @update:model-value="handleReasonChange"
      @focus="handleFormTouch"
    />
  </v-form>
  
  <!-- Error Messages -->
  <div v-if="errors.quota || errors.reason" class="mt-4">
    <v-alert
      v-if="errors.quota"
      type="error"
      variant="tonal"
      class="mb-2"
      data-testid="quota-error"
    >
      {{ errors.quota }}
    </v-alert>
    <v-alert
      v-if="errors.reason"
      type="error"
      variant="tonal"
      data-testid="reason-error"
    >
      {{ errors.reason }}
    </v-alert>
  </div>
</template>

<script setup lang="ts">

import { useQuotManagement } from '@/composables/useQuotManagement'

interface Props {
  adjustmentValue: number
}

interface Emits {
  'form-update': [formData: { reason: typeof reason.value; adjustmentValue: number, isFormValid: boolean, adjustedQuota: number }]
  'form-touched': []
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const {
    reasonOptions,
    reason,
    updateReason,
    updateAdjustedQuota,
    isFormValid,
    adjustedQuota,
    errors,
    markTouched
} = useQuotManagement(props.adjustmentValue)

const handleFormTouch = () => {
  markTouched()
  emit('form-touched')
}

const handleQuotaChange = (value: string) => {
  const numericValue = value === '' ? 0 : Number(value)
  updateAdjustedQuota(numericValue)
  emit('form-update', { reason: reason.value, adjustmentValue: props.adjustmentValue, isFormValid: isFormValid.value, adjustedQuota: numericValue })
}

const handleReasonChange = (value: typeof reason.value) => {
  updateReason(value)
  emit('form-update', { reason: value, adjustmentValue: props.adjustmentValue, isFormValid: isFormValid.value, adjustedQuota: adjustedQuota.value })
}

</script>