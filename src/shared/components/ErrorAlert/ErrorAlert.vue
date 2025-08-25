<template>
  <div v-if="hasErrors" :class="containerClass">
    <v-alert
      v-for="(error, key) in visibleErrors"
      :key="key"
      type="error"
      variant="tonal"
      :class="alertClass"
      :data-testid="getTestId(key)"
    >
      {{ error }}
    </v-alert>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  errors?: Record<string, string | null>
  containerClass?: string
  alertClass?: string
  testIdPrefix?: string
}

const props = withDefaults(defineProps<Props>(), {
  errors: () => ({}),
  containerClass: 'mt-4',
  alertClass: 'mb-2',
  testIdPrefix: 'error-alert'
})

/** Computed property that filters out null/empty errors */
const visibleErrors = computed(() => {
  return Object.fromEntries(
    Object.entries(props.errors).filter(
      ([, value]) => value !== null && value !== ''
    )
  )
})

/** Computed property to check if there are any visible errors */
const hasErrors = computed(() => {
  return Object.keys(visibleErrors.value).length > 0
})

/** Generates data-testid attribute for each error */
const getTestId = (key: string | number) => {
  return `${props.testIdPrefix}-${key}`
}
</script>
