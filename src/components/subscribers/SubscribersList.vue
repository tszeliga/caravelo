<template>
  <div class="mb-6">
    <h3 class="text-h6 mb-4">Active Subscribers:</h3>
    <v-row v-if="subscribers.length > 0">
      <v-col
        v-for="subscriber in subscribers"
        :key="subscriber.id"
        cols="12"
        sm="6"
        md="4"
      >
        <SubscriberCard 
          :subscriber="subscriber"
          @manage="handleManageSubscriber"
        />
      </v-col>
    </v-row>
    <p v-if="subscribers.length === 0">
      There are no active subscribers currently.
    </p>
  </div>
</template>

<script setup lang="ts">
import SubscriberCard from './SubscriberCard.vue'
import type { Subscriber } from '@/types'

interface Props {
  subscribers: Subscriber[]
}

interface Emits {
  'manage-subscriber': [subscriber: Subscriber]
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const handleManageSubscriber = (subscriber: Subscriber): void => {
  emit('manage-subscriber', subscriber)
}
</script>