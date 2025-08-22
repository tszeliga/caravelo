import { defineStore } from 'pinia'
import { ref } from 'vue'
import { NOTIFICATION_PREFIX } from '@/constants/ui'

export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  timestamp: Date
  timeout?: number
  persistent?: boolean
}

export const useNotificationStore = defineStore('notifications', () => {
  // State
  const notifications = ref<Notification[]>([])
  const nextId = ref(1)

  // Actions
  const addNotification = (
    type: Notification['type'],
    message: string,
    options: { timeout?: number; persistent?: boolean } = {}
  ): string => {
    const id = `${NOTIFICATION_PREFIX}${nextId.value++}`
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
    if (!notification.persistent && notification.timeout && notification.timeout > 0) {
      setTimeout(() => {
        removeNotification(id)
      }, notification.timeout)
    }

    return id
  }

  const addSuccess = (message: string, options?: { timeout?: number; persistent?: boolean }): string => {
    return addNotification('success', message, options)
  }

  const addError = (message: string, options?: { timeout?: number; persistent?: boolean }): string => {
    return addNotification('error', message, options)
  }

  const addWarning = (message: string, options?: { timeout?: number; persistent?: boolean }): string => {
    return addNotification('warning', message, options)
  }

  const addInfo = (message: string, options?: { timeout?: number; persistent?: boolean }): string => {
    return addNotification('info', message, options)
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

  const clearType = (type: Notification['type']): void => {
    notifications.value = notifications.value.filter(n => n.type !== type)
  }

  return {
    // State
    notifications,
    
    // Actions
    addNotification,
    addSuccess,
    addError,
    addWarning,
    addInfo,
    removeNotification,
    clearAll,
    clearType
  }
})