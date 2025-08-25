<template>
  <v-dialog
    v-model="isOpen"
    class="modal"
    max-width="600px"
    persistent
    scrollable
    role="dialog"
    aria-labelledby="modal-title"
    data-testid="modal-container"
  >
    <v-card class="card">
      <v-card-title
        id="modal-title"
        class="modal-header d-flex align-center pb-0"
        data-testid="modal-header-title"
      >
        <slot name="header" :loading="isLoading" :close="handleModalClose">
          <v-icon class="mr-3" color="primary" icon="mdi-account-cog" />
          <span class="modal-title">{{ title }}</span>
          <v-spacer />
          <v-btn
            icon="mdi-close"
            size="small"
            variant="text"
            data-testid="modal-header-close-button"
            @click="handleModalClose"
          />
        </slot>
      </v-card-title>

      <v-card-text class="modal-content" data-testid="modal-body-content">
        <slot
          :loading="isLoading"
          :close="handleModalClose"
          :save="handleModalSave"
        />
      </v-card-text>

      <v-card-actions class="modal-actions pa-6">
        <slot
          name="actions"
          :loading="isLoading"
          :close="handleModalClose"
          :save="handleModalSave"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useModal } from '@shared/composables/useModal'
import { computed } from 'vue'

defineOptions({
  name: 'CommonModal'
})

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    title?: string
  }>(),
  {
    title: 'New Modal'
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  save: []
  close: []
}>()

// Use the composable
const {
  handleClose: composableHandleClose,
  handleSave: composableHandleSave,
  isLoading
} = useModal()

// Modal state management - sync with parent
const isOpen = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value)
})

// Handle modal close - emit to parent and use composable
const handleModalClose = (): void => {
  composableHandleClose()
  emit('close')
  emit('update:modelValue', false)
}

// Handle modal save - use composable and emit result
const handleModalSave = (): void => {
  try {
    composableHandleSave()
    emit('save')
    emit('update:modelValue', false)
  } catch (error) {
    console.error('Modal save failed:', error)
  }
}
</script>

<style scoped lang="scss">
.modal {
  .card {
    .modal-header {
      background: rgb(var(--v-theme-surface));
      border-bottom: 1px solid rgb(var(--v-theme-outline));
      padding: 1.5rem;

      .modal-title {
        font-size: 1.25rem;
        font-weight: 500;
        color: rgb(var(--v-theme-on-surface));
      }
    }

    .modal-content {
      padding: 1.5rem;
    }

    .modal-actions {
      border-top: 1px solid rgb(var(--v-theme-outline));
    }
  }
}

@media (max-width: 768px) {
  .modal {
    margin: 1rem;

    .card {
      .modal-header,
      .modal-content,
      .modal-actions {
        padding: 1rem;
      }
    }
  }
}
</style>
