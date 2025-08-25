<template>
  <Modal v-model="isOpen" title="Edit quota" @close="handleQuotaModalClose">
    <p class="mb-6">Current subscriber informations:</p>
    <v-row class="fill-height">
      <v-col cols="12" md="12" lg="6">
        <SubscriberCard
          :subscriber="subscriber"
          class="fill-height"
          :show-edit-button="false"
        />
      </v-col>
      <v-col cols="12" md="12" lg="6" class="d-none d-lg-block">
        <v-img
          aspect-ratio="16/9"
          cover
          src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"
        />
      </v-col>
    </v-row>

    <p class="mb-6 mt-6">
      Adjust subscriber flight quota for exceptional circumstances
    </p>

    <!-- Quota Form -->
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
    <ErrorAlert :errors="errors" test-id-prefix="quota-form" />

    <template #actions="{ loading, close }">
      <v-spacer />
      <v-btn
        variant="plain"
        data-testid="quota-modal-cancel-button"
        :disabled="loading || isSubmitting"
        @click="close"
      >
        Cancel
      </v-btn>
      <v-btn
        color="primary"
        variant="elevated"
        data-testid="quota-modal-save-button"
        :loading="loading || isSubmitting"
        :disabled="loading || isSubmitting || !isFormValid"
        @click="handleQuotaSave"
      >
        Save
      </v-btn>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { useQuotaManagement } from '@/features/quota-management/composables/useQuotaManagement'
import { useQuotaModal } from '@/features/quota-management/composables/useQuotaModal'
import {
  MAX_QUOTA,
  MIN_QUOTA
} from '@/features/quota-management/constants/quota'
import type { ReasonType } from '@/features/quota-management/types/quota'
import ErrorAlert from '@/shared/components/ErrorAlert'
import Modal from '@/shared/components/Modal.vue'
import NumberStepper from '@/shared/components/NumberStepper/NumberStepper.vue'
import SubscriberCard from '@subscriber-management/components/SubscriberCard.vue'
import type { Subscriber } from '@subscriber-management/types/subscriber'
import { computed, toRefs } from 'vue'

interface Props {
  modelValue: boolean
  subscriber: Subscriber
}

interface Emits {
  'update:modelValue': [value: boolean]
  save: []
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const { subscriber } = toRefs(props)

// Get the current quota from subscriber
const currentQuota = computed(() => subscriber.value.currentQuota)

// Composables
const { isOpen, handleClose: closeModal } = useQuotaModal(props, emit)

// Consolidated quota management composable (includes form state, validation, and submission)
const {
  reasonOptions,
  reason,
  updateReason,
  updateAdjustedQuota,
  isFormValid,
  adjustedQuota,
  errors,
  markTouched,
  isReasonDisabled,
  isSubmitting,
  handleSave: saveForm,
  clearForm,
  reset: resetForm
} = useQuotaManagement(currentQuota.value, subscriber)

// Form event handlers
const handleQuotaFormTouch = () => {
  markTouched()
}

const handleQuotaValueChange = (value: number) => {
  updateAdjustedQuota(value)
}

const handleQuotaReasonChange = (value: ReasonType) => {
  updateReason(value)
}

// Methods
const handleQuotaSave = async () => {
  if (!saveForm) return

  const result = await saveForm()
  if (result.success) {
    emit('save')
    closeModal()
  }
}

const handleQuotaModalClose = () => {
  clearForm?.()
  resetForm()
  closeModal()
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
