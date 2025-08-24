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
    <p v-else>There are no active subscribers currently.</p>

    <ManageQuotaModal
      v-model="isQuotaModalOpen"
      :subscriber="selectedSubscriber"
      @update:model-value="onModalClose"
    />
  </div>
</template>

<script setup lang="ts">
import ManageQuotaModal from '@/features/quota-management/components/ManageQuotaModal'
import SubscriberCard from '@/features/subscriber-management/components/SubscriberCard.vue'
import { useSubscribersStore } from '@/features/subscriber-management/stores/subscribers'
import type { Subscriber } from '@/features/subscriber-management/types/subscriber'
import { ref } from 'vue'

const { subscribers } = useSubscribersStore()

const isQuotaModalOpen = ref(false)
const selectedSubscriber = ref<Subscriber | null>(null)

const handleManageSubscriber = (subscriber: Subscriber) => {
  selectedSubscriber.value = subscriber
  isQuotaModalOpen.value = true
}

const onModalClose = () => {
  selectedSubscriber.value = null
}
</script>
