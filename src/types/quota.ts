export interface QuotaAdjustment {
  subscriberId: string
  newQuota: number
  reason: string
}

export interface QuotaAdjustmentResponse {
  success: boolean
  data?: QuotaAdjustment
  message?: string
  error?: string
  validationErrors?: string[]
}