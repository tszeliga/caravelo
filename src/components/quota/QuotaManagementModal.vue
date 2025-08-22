<template>
  <v-dialog
    v-model="isOpen"
    class="quota-modal"
    max-width="var(--modal-width)"
    persistent
    scrollable
    role="dialog"
    aria-labelledby="quota-modal-title"
    aria-describedby="quota-modal-description"
    data-testid="quota-modal"
  >
    <v-card class="quota-card">
      <v-card-title 
        id="quota-modal-title"
        class="quota-header d-flex align-center pb-0"
        data-testid="quota-modal-title"
      >
        <v-icon class="mr-3" color="primary" icon="mdi-account-cog" />
        <span class="quota-title">Adjust Flight Quota</span>
        <v-spacer />
        <v-btn 
          icon="mdi-close"
          size="small" 
          variant="text"
          data-testid="quota-modal-close"
          @click="handleClose"
        />
      </v-card-title>
      
      <v-card-text 
        id="quota-modal-description"
        class="quota-content"
        data-testid="quota-modal-content"
      >
        <!-- Subscriber Information -->
        <div v-if="subscriber" class="subscriber-info mb-4">
          <h3 class="text-h6 mb-0" data-testid="subscriber-name">
            {{ subscriber.name }}
          </h3>
          <p class="text-body-2 text-medium-emphasis" data-testid="subscriber-email">
            {{ subscriber.email }}
          </p>
        </div>

        <!-- Current Quota Display -->
        <QuotaDisplay 
          :current-quota="subscriber?.currentQuota || 0"
          :adjustment-value="adjustmentValue"
          :new-quota="newQuota"
          :is-within-limits="isQuotaWithinLimits"
        />

        <!-- Quota Adjustment Form -->
        <QuotaAdjustmentForm
          v-model:adjustment-value="adjustmentValue"
          v-model:reason="selectedReason"
          :reason-options="reasonOptions"
          :validation-errors="validationMessages"
          :is-loading="isLoading"
        />
      </v-card-text>
      
      <v-card-actions class="quota-actions pa-6">
        <v-spacer />
        <v-btn
          variant="outlined"
          data-testid="quota-cancel-btn"
          :disabled="isLoading"
          @click="handleClose"
        >
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          :disabled="!isValidAdjustment || isLoading"
          :loading="isLoading"
          data-testid="quota-save-btn"
          @click="handleSaveWithClose"
        >
          Save Adjustment
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import { useQuotaManagement } from '@/composables/useQuotaManagement'
import QuotaDisplay from './QuotaDisplay.vue'
import QuotaAdjustmentForm from './QuotaAdjustmentForm.vue'
import type { Subscriber } from '@/types'

interface Props {
  modelValue: boolean
  subscriber: Subscriber | null
}

interface Emits {
  'update:modelValue': [value: boolean]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Unified quota management (includes modal state)
const {
  newQuota,
  reasonOptions,
  validationMessages,
  isValidAdjustment,
  isLoading,
  isQuotaWithinLimits,
  adjustmentValue,
  selectedReason,
  handleClose: composableHandleClose,
  handleSave,
  setSubscriber,
  isModalOpen
} = useQuotaManagement()

// Override handleClose to emit the close event to parent
const handleClose = (): void => {
  composableHandleClose()
  emit('update:modelValue', false)
}

// Override handleSave to emit close event after successful save
const handleSaveWithClose = async (): Promise<void> => {
  await handleSave()
  // Check if modal should be closed (the composable's handleSave calls closeModal internally)
  // but we also need to emit to parent
  if (!isModalOpen.value) {
    emit('update:modelValue', false)
  }
}

// Modal state management
const isOpen = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value)
})

// Initialize subscriber when modal opens
watchEffect(() => {
  if (props.subscriber && props.modelValue) {
    setSubscriber(props.subscriber)
  }
})

</script>

<style scoped lang="scss">
.quota-modal {
  .quota-card {
    .quota-header {
      background: rgb(var(--v-theme-surface));
      border-bottom: 1px solid rgb(var(--v-theme-outline));
      padding: var(--quota-form-padding);
      
      .quota-title {
        font-size: 1.25rem;
        font-weight: 500;
        color: rgb(var(--v-theme-on-surface));
      }
    }
    
    .quota-content {
      padding: var(--quota-form-padding);
      
      .subscriber-info {
        border-bottom: 1px solid rgb(var(--v-theme-outline));
        padding-bottom: 1rem;
      }
    }
    
    .quota-actions {
      border-top: 1px solid rgb(var(--v-theme-outline));
    }
  }
}

/* Responsive design for tablet usage */
@media (max-width: 768px) {
  .quota-modal {
    margin: var(--quota-modal-mobile-margin);
    
    .quota-card {
      .quota-header,
      .quota-content,
      .quota-actions {
        padding: calc(var(--platform-spacing-unit) * 2);
      }
    }
  }
}
</style>