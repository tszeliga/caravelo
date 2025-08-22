<template>
  <Modal 
    v-model="isOpen"
    title="Empty Modal"
    @save="handleSave"
    @close="handleClose"
  >
    <p class="mb-6">
      {{ subscribersStore.selectedSubscriber?.name }}
    </p>
    <QuotManageForm v-if="subscribersStore.selectedSubscriber" :adjustment-value="subscribersStore.selectedSubscriber.currentQuota" @form-update="handleFormUpdate" @form-touched="handleFormTouched" />
    
    <template #actions="{ loading, close, save }">
      <v-spacer />
      <v-btn
        variant="outlined"
        data-testid="cancel-btn"
        :disabled="loading || isSubmitting"
        @click="close"
      >
        Cancel
      </v-btn>
      <v-btn
        color="primary"
        data-testid="save-btn"
        :loading="loading || isSubmitting"
        :disabled="loading || isSubmitting || !isFormValid"
        @click="save"
      >
        Save
      </v-btn>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import Modal from '@/components/common/Modal.vue'
import QuotManageForm from '@/components/quot/QuotManageForm.vue'
import { useSubscribersStore } from '@/stores/subscribers'
import { useQuotaSubmission } from '@/composables/useQuotaSubmission'
interface Props {
  modelValue: boolean
}

interface Emits {
  'update:modelValue': [value: boolean]
  'save': []
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const subscribersStore = useSubscribersStore()

// Composables
const { isSubmitting, submissionError, submitQuotaAdjustment, clearError } = useQuotaSubmission()

// Form state
const isFormValid = ref(false)
const formData = ref<{ reason: string | null; adjustmentValue: number; isFormValid: boolean; adjustedQuota: number } | null>(null)

// Modal state
const isOpen = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value)
})

// Methods
const handleSave = async () => {
  if (!subscribersStore.selectedSubscriber || !formData.value || !formData.value.reason) {
    console.error('Missing required data for quota adjustment')
    return
  }

  clearError()

  const result = await submitQuotaAdjustment(
    subscribersStore.selectedSubscriber,
    {
      reason: formData.value.reason,
      adjustmentValue: formData.value.adjustmentValue,
      adjustedQuota: formData.value.adjustedQuota
    },
    // Store update callback
    (subscriberId: string, newQuota: number) => {
      subscribersStore.updateSubscriberQuota(subscriberId, newQuota)
    }
  )

  if (result.success) {
    subscribersStore.selectSubscriber(null)
    emit('save')
  }
  // Error handling is managed by the composable
}

const handleClose = () => {
  subscribersStore.selectSubscriber(null)
  emit('update:modelValue', false)
}

const handleFormUpdate = (data: { reason: string | null; adjustmentValue: number; isFormValid: boolean; adjustedQuota: number }) => {
  console.log('Form model updated:', data)
  formData.value = data
  isFormValid.value = data.isFormValid
}

const handleFormTouched = () => {
  console.log('Form was touched/interacted with')
}
</script>