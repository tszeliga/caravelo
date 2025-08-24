export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
} as const

export type NotificationType =
  (typeof NOTIFICATION_TYPES)[keyof typeof NOTIFICATION_TYPES]

export interface Notification {
  id: string
  type: NotificationType
  message: string
  timestamp: Date
  timeout?: number
  persistent?: boolean
}
