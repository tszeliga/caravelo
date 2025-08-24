<template>
  <v-form class="quota-form" data-testid="quota-form-container">
    <v-row>
      <v-col cols="12" sm="6">
        <v-label class="text-subtitle-2 text-medium-emphasis mb-3">
          <v-icon icon="mdi-plus-minus" size="16" class="me-1" />
          New Quota Value
        </v-label>
        <NumberStepper
          :model-value="adjustedQuota"
          :min="MIN_QUOTA"
          :max="MAX_QUOTA"
          :step="1"
          placeholder="0"
          aria-label="quota adjustment value"
          aria-describedby="adjustment-help"
          data-test-id="quota-form-adjustment-input"
          @update:model-value="handleQuotaValueChange"
          @focus="handleQuotaFormTouch"
        />
        <div
          id="adjustment-help"
          class="text-caption text-medium-emphasis mt-2 d-flex align-center"
        >
          <v-icon icon="mdi-information-outline" size="14" class="me-1" />
          Range: {{ MIN_QUOTA }} - {{ MAX_QUOTA }} flights
        </div>
      </v-col>
      <v-col cols="12" sm="6">
        <v-label class="text-subtitle-2 text-medium-emphasis mb-3">
          <v-icon icon="mdi-comment-text-outline" size="16" class="me-1" />
          Adjustment Reason
        </v-label>
        <v-select
          :model-value="reason"
          :items="reasonOptions"
          :disabled="isReasonDisabled"
          label="Select reason for adjustment"
          variant="outlined"
          data-testid="quota-form-reason-select"
          @update:model-value="handleQuotaReasonChange"
          @focus="handleQuotaFormTouch"
        />
      </v-col>
    </v-row>
  </v-form>

  <!-- Error Messages -->
  <div v-if="errors.quota || errors.reason" class="mt-4">
    <v-alert
      v-if="errors.quota"
      type="error"
      variant="tonal"
      class="mb-2"
      data-testid="quota-form-quota-error"
    >
      {{ errors.quota }}
    </v-alert>
    <v-alert
      v-if="errors.reason"
      type="error"
      variant="tonal"
      data-testid="quota-form-reason-error"
    >
      {{ errors.reason }}
    </v-alert>
  </div>
</template>

<script setup lang="ts">
import { useQuotaManagement } from '@/features/quota-management/components/QuotaManageForm/composables/useQuotaManagement'
import {
  MAX_QUOTA,
  MIN_QUOTA
} from '@/features/quota-management/constants/quota'
import NumberStepper from '@/shared/components/NumberStepper/NumberStepper.vue'

interface Props {
  adjustmentValue: number
}

interface FormUpdateData {
  reason: string | null
  adjustmentValue: number
  isFormValid: boolean
  adjustedQuota: number
}

interface Emits {
  'form-update': [formData: FormUpdateData]
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
  markTouched,
  isReasonDisabled
} = useQuotaManagement(props.adjustmentValue)

const handleQuotaFormTouch = () => {
  markTouched()
  emit('form-touched')
}

const handleQuotaValueChange = (value: number) => {
  updateAdjustedQuota(value)
  emit('form-update', {
    reason: reason.value,
    adjustmentValue: props.adjustmentValue,
    isFormValid: isFormValid.value,
    adjustedQuota: value
  })
}

const handleQuotaReasonChange = (value: typeof reason.value) => {
  updateReason(value)
  emit('form-update', {
    reason: value,
    adjustmentValue: props.adjustmentValue,
    isFormValid: isFormValid.value,
    adjustedQuota: adjustedQuota.value
  })
}
</script>

<style scoped lang="scss">
// Enhanced form labels with icons
.v-label {
  display: flex;
  align-items: center;
  font-weight: 500;
  margin-bottom: 8px;

  .v-icon {
    color: rgba(var(--v-theme-primary), 0.8);
  }
}

// Helper text styling
.text-caption {
  &.text-medium-emphasis {
    color: rgba(var(--v-theme-on-surface), 0.7);

    .v-icon {
      color: rgba(var(--v-theme-on-surface), 0.6);
    }
  }
}
</style>
