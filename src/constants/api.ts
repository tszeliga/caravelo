// API endpoint constants

export const API_ENDPOINTS = {
  QUOTA: {
    BASE: '/api/v1/quota',
    ADJUST: '/api/v1/quota/adjust',
    VALIDATE: '/api/v1/quota/validate',
    SUBSCRIBER: (id: string) => `/api/v1/quota/subscriber/${id}`
  }
} as const

export const HTTP_TIMEOUTS = {
  DEFAULT: 10000, // 10 seconds
  LONG_RUNNING: 30000 // 30 seconds
} as const

export const HTTP_HEADERS = {
  CONTENT_TYPE: 'application/json',
  ACCEPT: 'application/json'
} as const