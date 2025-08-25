<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
    <NotificationBar />
  </v-app>
</template>

<script setup lang="ts">
import NotificationBar from '@shared/components/NotificationBar.vue'
</script>
