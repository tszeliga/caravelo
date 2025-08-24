<template>
  <div class="notification-container">
    <transition-group name="notification" tag="div">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        class="custom-notification"
        :class="[
          `notification-${notification.type}`,
          { 'notification-visible': notification.visible }
        ]"
        :data-testid="`notification-${notification.type}`"
      >
        <div class="notification-content">
          <v-icon
            class="notification-icon"
            :icon="getNotificationIcon(notification.type)"
            size="small"
          />
          <span class="notification-message">{{ notification.message }}</span>
          <v-btn
            variant="text"
            size="x-small"
            icon="mdi-close"
            class="notification-close"
            @click="removeNotification(notification.id)"
          />
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import { useNotificationStore } from '@/shared/stores/notifications'
import type { NotificationType } from '@/shared/types/notifications'
import { computed, ref, watch } from 'vue'

const notificationStore = useNotificationStore()
const visibleStates = ref<Record<string, boolean>>({})

const notifications = computed(() => {
  return notificationStore.notifications.map(notification => ({
    ...notification,
    visible: visibleStates.value[notification.id] ?? true
  }))
})

// Watch for new notifications and make them visible
watch(
  () => notificationStore.notifications,
  newNotifications => {
    newNotifications.forEach(notification => {
      if (!(notification.id in visibleStates.value)) {
        visibleStates.value[notification.id] = true
      }
    })
  },
  { immediate: true, deep: true }
)

// Remove notification
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

const getNotificationIcon = (type: NotificationType): string => {
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
  max-width: 400px;
}

.custom-notification {
  pointer-events: auto;
  margin-bottom: 12px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  opacity: 0;
  transform: translateX(100%);
  transition: all 0.3s ease-in-out;

  &.notification-visible {
    opacity: 1;
    transform: translateX(0);
  }

  // Notification type styles
  &.notification-success {
    background: rgb(var(--v-theme-success));
    color: rgb(var(--v-theme-on-success));
  }

  &.notification-error {
    background: rgb(var(--v-theme-error));
    color: rgb(var(--v-theme-on-error));
  }

  &.notification-warning {
    background: rgb(var(--v-theme-warning));
    color: rgb(var(--v-theme-on-warning));
  }

  &.notification-info {
    background: rgb(var(--v-theme-info));
    color: rgb(var(--v-theme-on-info));
  }
}

.notification-content {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  gap: 8px;
}

.notification-icon {
  flex-shrink: 0;
}

.notification-message {
  flex: 1;
  font-weight: 500;
  line-height: 1.4;
  font-size: 0.875rem;
}

.notification-close {
  flex-shrink: 0;
  margin-left: auto;
}

/* Transition animations */
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease-in-out;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

/* Mobile responsive */
@media (max-width: 600px) {
  .notification-container {
    top: 10px;
    right: 10px;
    left: 10px;
    max-width: none;
  }

  .notification-content {
    padding: 10px 12px;
  }

  .notification-message {
    font-size: 0.8rem;
  }
}
</style>
