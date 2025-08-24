<template>
  <v-container
    fluid
    class="back-office-container"
    data-testid="back-office-view"
  >
    <v-row justify="center">
      <v-col cols="12" md="10" lg="8">
        <v-card class="elevation-2" data-testid="back-office-card">
          <BackOfficeHeader />
          <v-card-text class="pa-6">
            <SubscribersList />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import BackOfficeHeader from '@/features/back-office/components/BackOfficeHeader.vue'
import SubscribersList from '@/features/subscriber-management/components/SubscribersList.vue'
</script>
