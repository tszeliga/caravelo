<template>
  <v-container 
    fluid
    class="back-office-container"
    data-testid="back-office-view"
  >
    <v-row justify="center">
      <v-col cols="12" md="8" lg="6">
        <v-card
          class="elevation-2"
          data-testid="back-office-card"
        >
          <BackOfficeHeader />
          
          <v-card-text class="pa-6">
            <SubscribersList 
              :subscribers="subscribersStore.subscribers"
              @manage-subscriber="openQuotaModal"
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  
    <SimpleQuotaModal
      v-model="isModalOpen"
      @save="handleQuotaSave"
    />
  </v-container>
</template>

<script setup lang="ts">

import { defineAsyncComponent, ref } from 'vue'
import { useSubscribersStore } from '@/stores'

import BackOfficeHeader from '@components/back-office/BackOfficeHeader.vue'
import SubscribersList from '@components/subscribers/SubscribersList.vue'

const SimpleQuotaModal = defineAsyncComponent(() => import('@/components/quota/SimpleQuotaModal.vue'))
const isModalOpen = ref(false)

const subscribersStore = useSubscribersStore()

const openQuotaModal = (): void => {
  isModalOpen.value = true
}

const handleQuotaSave = () => {
  isModalOpen.value = false
}

</script>