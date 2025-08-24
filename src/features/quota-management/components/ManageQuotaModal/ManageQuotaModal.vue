<template>
  <Modal v-model="isOpen" title="Edit quota" @close="handleQuotaModalClose">
    <p class="mb-6">Current subscriber informations:</p>
    <v-row class="fill-height">
      <v-col cols="12" md="12" lg="6">
        <SubscriberCard
          v-if="subscriber"
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
    <QuotaManageForm
      v-if="subscriber"
      :adjustment-value="adjustmentValue"
      @form-update="handleFormUpdate"
    />

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
import QuotaManageForm from '@/features/quota-management/components/QuotaManageForm'
import { useQuotaForm } from '@/features/quota-management/composables/useQuotaForm'
import { useQuotaModal } from '@/features/quota-management/composables/useQuotaModal'
import SubscriberCard from '@/features/subscriber-management/components/SubscriberCard.vue'
import type { Subscriber } from '@/features/subscriber-management/types/subscriber'
import Modal from '@/shared/components/Modal.vue'
import { toRefs } from 'vue'
interface Props {
  modelValue: boolean
  subscriber: Subscriber | null
}

interface Emits {
  'update:modelValue': [value: boolean]
  save: []
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const { subscriber } = toRefs(props)

// Composables
const { isOpen, handleClose: closeModal } = useQuotaModal(props, emit)
const {
  isSubmitting,
  isFormValid,
  adjustmentValue,
  handleFormUpdate,
  handleSave: saveForm,
  clearForm
} = useQuotaForm(subscriber)

// Methods
const handleQuotaSave = async () => {
  const result = await saveForm()
  if (result.success) {
    emit('save')
    closeModal()
  }
}

const handleQuotaModalClose = () => {
  clearForm()
  closeModal()
}
</script>
