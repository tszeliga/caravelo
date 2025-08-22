<template>
  <v-card
    class="subscriber-card rounded-sm"
    data-testid="subscriber-card"
  >
    <v-card-text class="pa-4">
      <div class="d-flex align-center mb-2">
        <v-icon
          color="primary"
          class="me-2"
          icon="mdi-account"
        />
        <span 
          class="text-subtitle-1 font-weight-medium subscriber-name"
          data-testid="subscriber-name"
        >
          {{ subscriber.name }}
        </span>
      </div>
      
      <div class="text-body-2 mb-3">
        {{ subscriber.email }}
      </div>
      
      <div class="d-flex align-center justify-space-between">
        <v-chip
          color="primary"
          size="small"
          variant="flat"
        >
          {{ subscriber.currentQuota }} quota{{ subscriber.currentQuota !== 1 ? 's' : '' }}
        </v-chip>
        
        <v-btn
          color="primary"
          size="small"
          variant="outlined"
          prepend-icon="mdi-airplane"
          @click="handleManageClick"
          data-testid="manage-quota-btn"
        >
          Edit flights
        </v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type { Subscriber } from '@/types'
import { useSubscribersStore } from '@/stores/subscribers'

interface Props {
  subscriber: Subscriber
}

interface Emits {
  'manage': [subscriber: Subscriber]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const subscribersStore = useSubscribersStore()

const handleManageClick = (): void => {
  subscribersStore.selectSubscriber(props.subscriber)
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