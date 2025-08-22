// Quota management constants
// Business rules: Subscribers can have 0-3 flight quotas

export const QUOTA_LIMITS = [
  { value: 0, label: 'No Flights (0)' },
  { value: 1, label: '1 Flight' },
  { value: 2, label: '2 Flights' },
  { value: 3, label: '3 Flights (Max)' }
] as const

// Core business limits - used throughout the app instead of environment variables
export const MIN_QUOTA = 0
export const MAX_QUOTA = 3