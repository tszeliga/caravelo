import type {
  Notification,
  NotificationType
} from '@/shared/types/notifications'
import { NOTIFICATION_TYPES } from '@/shared/types/notifications'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useNotificationStore = defineStore('notifications', () => {
  const notifications = ref<Notification[]>([])
  const nextId = ref(1)

  const addNotification = (
    type: NotificationType,
    message: string,
    options: { timeout?: number; persistent?: boolean } = {}
  ): string => {
    const id = `notification-${nextId.value++}`
    const notification: Notification = {
      id,
      type,
      message,
      timestamp: new Date(),
      timeout: options.timeout ?? (type === 'error' ? 5000 : 3000),
      persistent: options.persistent ?? false
    }

    notifications.value.push(notification)

    // Auto-remove notification after timeout (unless persistent)
    if (
      !notification.persistent &&
      notification.timeout &&
      notification.timeout > 0
    ) {
      setTimeout(() => {
        removeNotification(id)
      }, notification.timeout)
    }

    return id
  }

  const addSuccess = (
    message: string,
    options?: { timeout?: number; persistent?: boolean }
  ): string => {
    return addNotification(NOTIFICATION_TYPES.SUCCESS, message, options)
  }

  const addError = (
    message: string,
    options?: { timeout?: number; persistent?: boolean }
  ): string => {
    return addNotification(NOTIFICATION_TYPES.ERROR, message, options)
  }

  const removeNotification = (id: string): void => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }

  const clearAll = (): void => {
    notifications.value = []
  }

  const clearType = (type: NotificationType): void => {
    notifications.value = notifications.value.filter(n => n.type !== type)
  }

  return {
    notifications,
    addSuccess,
    addError,
    removeNotification,
    clearAll,
    clearType
  }
})
