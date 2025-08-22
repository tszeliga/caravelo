import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useNotificationStore } from '@/stores/notifications'

describe('Notifications Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.useFakeTimers()
  })

  describe('Adding Notifications', () => {
    it('should add success notification', () => {
      const store = useNotificationStore()
      const id = store.addSuccess('Operation successful')
      
      expect(store.notifications).toHaveLength(1)
      expect(store.notifications[0].type).toBe('success')
      expect(store.notifications[0].message).toBe('Operation successful')
      expect(store.notifications[0].id).toBe(id)
    })

    it('should add error notification', () => {
      const store = useNotificationStore()
      const id = store.addError('Operation failed')
      
      expect(store.notifications).toHaveLength(1)
      expect(store.notifications[0].type).toBe('error')
      expect(store.notifications[0].message).toBe('Operation failed')
    })

    it('should add warning notification', () => {
      const store = useNotificationStore()
      store.addWarning('Warning message')
      
      expect(store.notifications[0].type).toBe('warning')
    })

    it('should add info notification', () => {
      const store = useNotificationStore()
      store.addInfo('Info message')
      
      expect(store.notifications[0].type).toBe('info')
    })
  })

  describe('Notification Management', () => {
    it('should remove notification by id', () => {
      const store = useNotificationStore()
      const id = store.addSuccess('Test message')
      
      expect(store.notifications).toHaveLength(1)
      
      store.removeNotification(id)
      expect(store.notifications).toHaveLength(0)
    })

    it('should clear all notifications', () => {
      const store = useNotificationStore()
      store.addSuccess('Message 1')
      store.addError('Message 2')
      
      expect(store.notifications).toHaveLength(2)
      
      store.clearAll()
      expect(store.notifications).toHaveLength(0)
    })

    it('should clear notifications by type', () => {
      const store = useNotificationStore()
      store.addSuccess('Success message')
      store.addError('Error message')
      store.addWarning('Warning message')
      
      expect(store.notifications).toHaveLength(3)
      
      store.clearType('error')
      expect(store.notifications).toHaveLength(2)
      expect(store.notifications.find(n => n.type === 'error')).toBeUndefined()
    })
  })

  describe('Auto-removal', () => {
    it('should auto-remove success notifications after timeout', () => {
      const store = useNotificationStore()
      store.addSuccess('Test message') // Default 3000ms timeout
      
      expect(store.notifications).toHaveLength(1)
      
      vi.advanceTimersByTime(3000)
      expect(store.notifications).toHaveLength(0)
    })

    it('should auto-remove error notifications after timeout', () => {
      const store = useNotificationStore()
      store.addError('Test message') // Default 5000ms timeout
      
      expect(store.notifications).toHaveLength(1)
      
      vi.advanceTimersByTime(5000)
      expect(store.notifications).toHaveLength(0)
    })

    it('should not auto-remove persistent notifications', () => {
      const store = useNotificationStore()
      store.addSuccess('Persistent message', { persistent: true })
      
      expect(store.notifications).toHaveLength(1)
      
      vi.advanceTimersByTime(10000)
      expect(store.notifications).toHaveLength(1)
    })

    it('should respect custom timeout', () => {
      const store = useNotificationStore()
      store.addSuccess('Custom timeout', { timeout: 1000 })
      
      expect(store.notifications).toHaveLength(1)
      
      vi.advanceTimersByTime(1000)
      expect(store.notifications).toHaveLength(0)
    })
  })

  describe('Notification Properties', () => {
    it('should include timestamp', () => {
      const store = useNotificationStore()
      const now = new Date()
      vi.setSystemTime(now)
      
      store.addSuccess('Test message')
      
      expect(store.notifications[0].timestamp).toEqual(now)
    })

    it('should generate unique IDs', () => {
      const store = useNotificationStore()
      const id1 = store.addSuccess('Message 1')
      const id2 = store.addSuccess('Message 2')
      
      expect(id1).not.toBe(id2)
      expect(store.notifications[0].id).toBe(id1)
      expect(store.notifications[1].id).toBe(id2)
    })
  })
})