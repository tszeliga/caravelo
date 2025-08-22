export const VALIDATION_MESSAGES = {
  QUOTA: {
    ZERO_ADJUSTMENT: 'Adjustment value cannot be zero',
    NEGATIVE_QUOTA: (minLimit: number) => `Quota cannot be negative (minimum: ${minLimit})`,
    EXCEEDS_MAX: (maxLimit: number) => `Quota cannot exceed ${maxLimit} flights`,
    MAX_ADJUSTMENT: (max: number) => `Maximum adjustment is +${max}`,
    MAX_REDUCTION: (min: number) => `Maximum reduction is ${min}`,
  },
  REASON: {
    REQUIRED: 'Please select a reason for the adjustment'
  },
  FORM: {
    COMPLETE_REQUIRED: 'Please complete all required fields'
  }
} as const

export const REASON_OPTIONS = {
  POSITIVE: [
    'Subscriber canceled flight',
    'Airline canceled flight', 
    'Customer compensation',
    'Other'
  ],
  NEGATIVE: [
    'Flight not redeposited after a flight cancellation',
    'Subscriber had log in or password issues',
    'Subscriber had issues when booking', 
    'Subscription has not renewed correctly',
    'Other'
  ]
} as const