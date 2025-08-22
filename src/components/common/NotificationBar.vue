<template>
  <div class="notification-container">
    <v-snackbar
      v-for="notification in notifications"
      :key="notification.id"
      v-model="notification.visible"
      :color="getNotificationColor(notification.type)"
      :timeout="notification.timeout"
      location="top right"
      class="notification-snackbar"
      :data-testid="`notification-${notification.type}`"
    >
      <div class="d-flex align-center">
        <v-icon class="mr-2" :icon="getNotificationIcon(notification.type)" />
        <span class="notification-message">{{ notification.message }}</span>
      </div>
      
      <template #actions>
        <v-btn
          variant="text"
          size="small"
          @click="removeNotification(notification.id)"
        >
          <v-icon icon="mdi-close" />
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useNotificationStore, type Notification } from '@/stores/notifications'

const notificationStore = useNotificationStore()
const visibleStates = ref<Record<string, boolean>>({})

const notifications = computed(() => {
  return notificationStore.notifications.map(notification => ({
    ...notification,
    visible: visibleStates.value[notification.id] ?? true
  }))
})

watch(
  () => notificationStore.notifications,
  (newNotifications) => {
    newNotifications.forEach(notification => {
      if (!(notification.id in visibleStates.value)) {
        visibleStates.value[notification.id] = true
      }
    })
  },
  { immediate: true, deep: true }
)

// Methods
const removeNotification = (id: string): void => {
  visibleStates.value[id] = false
  setTimeout(() => {
    notificationStore.removeNotification(id)
    delete visibleStates.value[id]
  }, 300)
}

const notificationConfig = {
  success: { color: 'success', icon: 'mdi-check-circle' },
  error: { color: 'error', icon: 'mdi-alert-circle' },
  warning: { color: 'warning', icon: 'mdi-alert' },
  info: { color: 'info', icon: 'mdi-information' }
} as const

const getNotificationColor = (type: Notification['type']): string => {
  return notificationConfig[type]?.color || 'info'
}

const getNotificationIcon = (type: Notification['type']): string => {
  return notificationConfig[type]?.icon || 'mdi-information'
}
</script>

<style scoped lang="scss">
.notification-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  pointer-events: none;
}

.notification-snackbar {
  pointer-events: auto;
  margin-bottom: 8px;
  
  .notification-message {
    font-weight: 500;
    line-height: 1.4;
  }
}

/* Mobile responsive */
@media (max-width: 600px) {
  .notification-container {
    top: 10px;
    right: 10px;
    left: 10px;
  }
  
  .notification-snackbar {
    .notification-message {
      font-size: 0.9rem;
    }
  }
}
</style>