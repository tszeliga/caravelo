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
