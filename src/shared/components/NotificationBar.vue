<template>
  <div class="notification-container">
    <div
      v-for="notification in notifications"
      :key="notification.id"
      class="custom-notification"
      :class="[
        `notification-${notification.type}`,
        {
          'notification-exit': animatingOut.has(notification.id),
          'notification-enter': animatingIn.has(notification.id)
        }
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
  </div>
</template>

<script setup lang="ts">
import { useNotificationStore } from '@/shared/stores/notifications'
import type { NotificationType } from '@/shared/types/notifications'
import { computed, nextTick, ref, watch } from 'vue'

const notificationStore = useNotificationStore()
const animatingOut = ref<Set<string>>(new Set())
const animatingIn = ref<Set<string>>(new Set())

const notifications = computed(() => notificationStore.notifications)

// Watch for new notifications and trigger enter animation
watch(
  notifications,
  async (newNotifications, oldNotifications = []) => {
    const newIds = newNotifications
      .filter(n => !oldNotifications.some(o => o.id === n.id))
      .map(n => n.id)

    for (const id of newIds) {
      animatingIn.value.add(id)
      await nextTick()
      // Remove from animatingIn after a brief moment to trigger the animation
      setTimeout(() => {
        animatingIn.value.delete(id)
      }, 10)
    }
  },
  { immediate: false }
)

// Remove notification with animation
const removeNotification = (id: string): void => {
  animatingOut.value.add(id)

  // Wait for animation to complete before removing
  setTimeout(() => {
    notificationStore.removeNotification(id)
    animatingOut.value.delete(id)
  }, 300)
}

const notificationConfig = {
  success: { color: 'success', icon: 'mdi-check-circle' },
  error: { color: 'error', icon: 'mdi-alert-circle' }
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
  opacity: 1;
  transform: translateX(0);
  transition: all 0.3s ease-out;

  &.notification-enter {
    opacity: 0;
    transform: translateX(100%);
  }

  &.notification-exit {
    opacity: 0;
    transform: translateX(100%);
  }

  &.notification-success {
    background: rgb(var(--v-theme-success));
    color: rgb(var(--v-theme-on-success));
  }

  &.notification-error {
    background: rgb(var(--v-theme-error));
    color: rgb(var(--v-theme-on-error));
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

/* Smooth transitions - no keyframes needed */

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
