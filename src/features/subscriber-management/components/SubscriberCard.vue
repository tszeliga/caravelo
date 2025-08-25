<template>
  <v-card
    class="subscriber-card rounded-sm"
    data-testid="subscriber-card-container"
  >
    <v-card-text class="pa-4">
      <div class="d-flex align-center mb-2">
        <v-icon color="primary" class="me-2" icon="mdi-account" />
        <span
          class="text-subtitle-1 font-weight-medium subscriber-name"
          data-testid="subscriber-card-name"
        >
          {{ subscriber.name }}
        </span>
      </div>

      <div class="text-body-2 mb-3">
        {{ subscriber.email }}
      </div>

      <div class="d-flex align-center justify-space-between">
        <v-chip color="primary" size="small" variant="flat">
          {{ subscriber.currentQuota }} quota{{
            subscriber.currentQuota !== 1 ? 's' : ''
          }}
        </v-chip>

        <v-btn
          color="primary"
          size="small"
          variant="outlined"
          prepend-icon="mdi-airplane"
          @click="handleQuotaManageClick"
          data-testid="subscriber-card-manage-button"
          v-if="showEditButton"
        >
          Edit flights
        </v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type { Subscriber } from '@/features/subscriber-management/types/subscriber'

interface Props {
  subscriber: Subscriber
  showEditButton?: boolean
}

interface Emits {
  manage: [subscriber: Subscriber]
}

const props = withDefaults(defineProps<Props>(), {
  showEditButton: true
})
const emit = defineEmits<Emits>()

const handleQuotaManageClick = (): void => {
  emit('manage', props.subscriber)
}
</script>

<style scoped lang="scss">
.subscriber-card {
  transition: all 0.2s ease-in-out;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
}
</style>
