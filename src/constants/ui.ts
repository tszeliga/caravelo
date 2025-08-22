// UI-related constants

export const TEST_IDS = {
  // Back Office
  BACK_OFFICE: {
    VIEW: 'back-office-view',
    CARD: 'back-office-card', 
    TITLE: 'back-office-title',
    SUBTITLE: 'back-office-subtitle',
    SUBSCRIBER_CARD: 'subscriber-card',
    MANAGE_QUOTA_BTN: 'manage-quota-btn'
  },
  
  // Quota Display
  QUOTA_DISPLAY: {
    CALCULATION: 'quota-calculation',
    CURRENT_QUOTA: 'current-quota',
    ADJUSTMENT_VALUE: 'adjustment-value',
    NEW_QUOTA: 'new-quota',
    QUOTA_LIMIT: (value: number) => `quota-limit-${value}`
  },
  
  // Quota Modal
  QUOTA_MODAL: {
    CONTAINER: 'quota-modal',
    TITLE: 'quota-modal-title',
    CLOSE: 'quota-modal-close',
    CONTENT: 'quota-modal-content',
    SUBSCRIBER_NAME: 'subscriber-name',
    SUBSCRIBER_EMAIL: 'subscriber-email',
    CANCEL_BTN: 'quota-cancel-btn',
    SAVE_BTN: 'quota-save-btn'
  },
  
  // Quota Form
  QUOTA_FORM: {
    CONTAINER: 'quota-adjustment-form',
    ADJUSTMENT_INPUT: 'adjustment-input',
    VALIDATION_ERRORS: 'validation-errors',
    VALIDATION_ERROR: 'validation-error'
  },
  
  // Reason Selector
  REASON_SELECTOR: {
    SELECT: 'reason-select',
    OPTION: (value: string) => `reason-option-${value}`
  },
  
  // Notifications
  NOTIFICATION: (type: string) => `notification-${type}`
} as const

export const CSS_VARIABLES = {
  MODAL_WIDTH: '--modal-width',
  QUOTA_CALCULATION_HIGHLIGHT: '--quota-calculation-highlight'
} as const

export const MODAL_SIZES = {
  QUOTA_MODAL: '600px'
} as const

export const NOTIFICATION_PREFIX = 'notification-' as const