import { REASON_OPTIONS } from '@/features/quota-management/constants/reasons'

// Use proper type union for better type safety
export type ReasonType =
  | (typeof REASON_OPTIONS.POSITIVE)[number]
  | (typeof REASON_OPTIONS.NEGATIVE)[number]
  | null

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
}
