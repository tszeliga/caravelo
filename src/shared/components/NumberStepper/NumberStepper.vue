<template>
  <div class="number-stepper" :class="{ disabled }">
    <label v-if="label" :for="inputId" class="stepper-label">
      {{ label }}
    </label>
    <div class="stepper-container" :data-testid="dataTestId">
      <button
        type="button"
        class="stepper-btn stepper-btn--minus"
        :disabled="disabled || isMinReached"
        :aria-label="`Decrease ${label || 'value'}`"
        @click="decrement"
        data-testid="number-stepper-decrement-button"
      >
        <v-icon icon="mdi-minus" size="small" />
      </button>

      <div class="stepper-display">
        <input
          :id="inputId"
          :value="displayValue"
          :aria-label="ariaLabel"
          :aria-describedby="ariaDescribedby"
          type="text"
          readonly
          class="stepper-input"
          data-testid="number-stepper-input"
        />
      </div>

      <button
        type="button"
        class="stepper-btn stepper-btn--plus"
        :disabled="disabled || isMaxReached"
        :aria-label="`Increase ${label || 'value'}`"
        @click="increment"
        data-testid="number-stepper-increment-button"
      >
        <v-icon icon="mdi-plus" size="small" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useNumberStepper } from '@/shared/components/NumberStepper/useNumberStepper'

interface Props {
  modelValue: number
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  label?: string
  placeholder?: string
  ariaLabel?: string
  ariaDescribedby?: string
  dataTestId?: string
}

const props = withDefaults(defineProps<Props>(), {
  min: undefined,
  max: undefined,
  step: 1,
  disabled: false,
  label: '',
  placeholder: '',
  ariaLabel: '',
  ariaDescribedby: '',
  dataTestId: 'number-stepper'
})

const emit = defineEmits<{
  'update:modelValue': [value: number]
  focus: []
}>()

const {
  inputId,
  displayValue,
  isMinReached,
  isMaxReached,
  increment,
  decrement
} = useNumberStepper(props, emit)
</script>

<style scoped>
.number-stepper {
  width: 100%;
}

.stepper-label {
  display: block;
  margin-bottom: 4px;
  font-size: 0.875rem;
  color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
}

.stepper-container {
  display: flex;
  align-items: stretch;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 4px;
  overflow: hidden;
  background: rgb(var(--v-theme-surface));
  min-height: 48px;
}

.stepper-container:focus-within {
  border-color: rgb(var(--v-theme-primary));
  border-width: 2px;
}

.stepper-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  border: none;
  background: rgba(var(--v-theme-surface-variant), 0.08);
  color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
  cursor: pointer;
  transition: all 0.2s ease;
}

.stepper-btn:hover:not(:disabled) {
  background: rgba(var(--v-theme-surface-variant), 0.16);
  color: rgb(var(--v-theme-on-surface));
}

.stepper-btn:active:not(:disabled) {
  background: rgba(var(--v-theme-surface-variant), 0.24);
}

.stepper-btn:disabled {
  opacity: 0.38;
  cursor: not-allowed;
}

.stepper-display {
  flex: 1;
  display: flex;
  align-items: center;
}

.stepper-input {
  width: 100%;
  height: 100%;
  border: none;
  background: transparent;
  text-align: center;
  font-size: 1rem;
  color: rgb(var(--v-theme-on-surface));
  outline: none;
  padding: 0 8px;
}

.stepper-input::placeholder {
  color: rgba(var(--v-theme-on-surface), var(--v-disabled-opacity));
}

.disabled {
  opacity: 0.6;
  pointer-events: none;
}

.disabled .stepper-container {
  background: rgba(var(--v-theme-surface-variant), 0.04);
}
</style>
