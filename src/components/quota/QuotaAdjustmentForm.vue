<template>
  <v-form class="quota-form" data-testid="quota-adjustment-form">
    <!-- Adjustment Value Input -->
    <v-text-field
      v-model.number="internalAdjustmentValue"
      label="Quota Adjustment"
      placeholder="Enter positive or negative number"
      type="number"
      variant="outlined"
      density="comfortable"
      :error-messages="adjustmentErrorMessages"
      aria-label="quota adjustment value"
      aria-describedby="adjustment-help"
      data-testid="adjustment-input"
      class="mb-3"
    >
    </v-text-field>

    <!-- Reason Selection -->
    <ReasonSelector
      v-model="internalReason"
      :options="reasonOptions"
      :disabled="!internalAdjustmentValue"
      :rules="reasonRules"
      :error-messages="reasonErrorMessages"
    />

    <!-- Validation Errors -->
    <v-alert
      v-if="validationErrors.length > 0"
      type="error"
      variant="outlined"
      class="mt-4"
      data-testid="validation-errors"
    >
      <template #title>Please fix the following issues:</template>
      <ul class="mt-2">
        <li 
          v-for="error in validationErrors" 
          :key="error"
          data-testid="validation-error"
        >
          {{ error }}
        </li>
      </ul>
    </v-alert>
  </v-form>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ReasonSelector from './ReasonSelector.vue'

interface Props {
  adjustmentValue: number
  reason: string
  reasonOptions: string[]
  validationErrors: string[]
  isLoading: boolean
}

interface Emits {
  'update:adjustmentValue': [value: number]
  'update:reason': [value: string]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const { adjustmentValue, reason, reasonOptions, validationErrors } = props

// Computed properties for v-model
const internalAdjustmentValue = computed({
  get: () => adjustmentValue,
  set: (value: number) => emit('update:adjustmentValue', value)
})

const internalReason = computed({
  get: () => reason,
  set: (value: string) => emit('update:reason', value)
})

const reasonRules = computed(() => [
  (v: string) => !!v || 'Reason is required',
])

// Error messages for individual fields
const adjustmentErrorMessages = computed(() => {
  return validationErrors.filter(error => 
    error.includes('adjustment') || 
    error.includes('negative') || 
    error.includes('exceed')
  )
})

const reasonErrorMessages = computed(() => {
  return validationErrors.filter(error => 
    error.includes('reason') || 
    error.includes('select')
  )
})
</script>

<style scoped lang="scss">
.quota-form {
  .v-text-field {
    .v-field__prepend-inner {
      padding-inline-end: 8px;
    }
  }
}
</style>