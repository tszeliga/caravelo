<template>
  <v-select
    v-model="internalValue"
    :items="options"
    label="Reason for Adjustment"
    placeholder="Select a reason"
    variant="outlined"
    density="comfortable"
    :disabled="disabled"
    :rules="rules"
    :error-messages="errorMessages"
    aria-label="reason for quota adjustment"
    aria-required="true"
    data-testid="reason-select"
    class="reason-selector"
  >
    <template #prepend-inner>
      <v-icon color="primary" icon="mdi-comment-text" />
    </template>
    
    <template #no-data>
      <div class="pa-4 text-center text-medium-emphasis">
        {{ disabled ? 'Enter an adjustment value first' : 'No reason options available' }}
      </div>
    </template>
    
  </v-select>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue: string
  options: string[]
  disabled?: boolean
  rules?: Array<(v: string) => boolean | string>
  errorMessages?: string[]
}

interface Emits {
  'update:modelValue': [value: string]
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  rules: () => [],
  errorMessages: () => []
})

const emit = defineEmits<Emits>()

const { modelValue } = props

const internalValue = computed({
  get: () => modelValue,
  set: (value: string) => emit('update:modelValue', value)
})

</script>

<style scoped lang="scss">
.reason-selector {
  .v-field__prepend-inner {
    padding-inline-end: 8px;
  }
}
</style>