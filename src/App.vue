<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
    <NotificationBar />
  </v-app>
</template>

<script setup lang="ts">
import NotificationBar from '@/components/common/NotificationBar.vue'
</script>

<style lang="scss">
// @import '@styles/globals.scss';
</style>