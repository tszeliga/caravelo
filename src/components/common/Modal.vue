<template>
  <v-dialog
    v-model="isOpen"
    class="modal"
    max-width="600px"
    persistent
    scrollable
    role="dialog"
    aria-labelledby="modal-title"
    data-testid="modal"
  >
    <v-card class="card">
      <v-card-title 
        id="modal-title"
        class="modal-header d-flex align-center pb-0"
        data-testid="modal-title"
      >
        <slot name="header" :loading="isLoading" :close="handleClose">
          <v-icon class="mr-3" color="primary" icon="mdi-account-cog" />
          <span class="modal-title">{{ title }}</span>
          <v-spacer />
          <v-btn 
            icon="mdi-close"
            size="small" 
            variant="text"
            data-testid="modal-close"
            @click="handleClose"
          />
        </slot>
      </v-card-title>
      
      <v-card-text 
        class="modal-content"
        data-testid="modal-content"
      >
        <slot :loading="isLoading" :close="handleClose" :save="handleSave"> </slot>
      </v-card-text>
      
      <v-card-actions class="modal-actions pa-6">
        <slot name="actions" :loading="isLoading" :close="handleClose" :save="handleSave">
          <v-spacer />
          <v-btn
            variant="outlined"
            data-testid="cancel-btn"
            :disabled="isLoading"
            @click="handleClose"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            data-testid="save-btn"
            :loading="isLoading"
            :disabled="isLoading"
            @click="handleSave"
          >
            Save
          </v-btn>
        </slot>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useModal } from '@/composables/useModal'

defineOptions({
  name: 'CommonModal'
})

const props = withDefaults(defineProps<{
  modelValue: boolean
  title?: string
}>(), {
  title: 'New Modal'
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'save': []
  'close': []
}>()

// Use the composable
const {
  isLoading,
  handleClose: composableHandleClose,
  handleSave: composableHandleSave
} = useModal()

// Modal state management - sync with parent
const isOpen = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value)
})

// Handle close - emit to parent and use composable
const handleClose = (): void => {
  composableHandleClose()
  emit('close')
  emit('update:modelValue', false)
}

// Handle save - use composable and emit result
const handleSave = async (): Promise<void> => {
  try {
    await composableHandleSave()
    emit('save')
    emit('update:modelValue', false)
  } catch (error) {
    // Error handling - modal stays open
    console.error('Save failed:', error)
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