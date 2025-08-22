// Validation utilities for quota management

import { VALIDATION_MESSAGES, REASON_OPTIONS } from '@/constants/validationMessages'
import { MIN_QUOTA, MAX_QUOTA } from '@/constants/quota'

export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

/**
 * Validate quota adjustment value
 */
export function validateQuotaAdjustment(
  currentQuota: number,
  adjustmentValue: number
): ValidationResult {
  const errors: string[] = []
  const newQuota = currentQuota + adjustmentValue
  
  // Check if adjustment is zero
  if (adjustmentValue === 0) {
    errors.push(VALIDATION_MESSAGES.QUOTA.ZERO_ADJUSTMENT)
  }
  
  // Check quota limits
  if (newQuota < MIN_QUOTA) {
    errors.push(VALIDATION_MESSAGES.QUOTA.NEGATIVE_QUOTA(MIN_QUOTA))
  }
  
  if (newQuota > MAX_QUOTA) {
    errors.push(VALIDATION_MESSAGES.QUOTA.EXCEEDS_MAX(MAX_QUOTA))
  }
  
  // Check adjustment range
  const maxAdjustment = MAX_QUOTA - currentQuota
  const minAdjustment = MIN_QUOTA - currentQuota
  
  if (adjustmentValue > maxAdjustment) {
    errors.push(VALIDATION_MESSAGES.QUOTA.MAX_ADJUSTMENT(maxAdjustment))
  }
  
  if (adjustmentValue < minAdjustment) {
    errors.push(VALIDATION_MESSAGES.QUOTA.MAX_REDUCTION(minAdjustment))
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Validate reason selection
 */
export function validateReason(reason: string): ValidationResult {
  const errors: string[] = []
  
  if (!reason || reason.trim() === '') {
    errors.push(VALIDATION_MESSAGES.REASON.REQUIRED)
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Get context-sensitive reason options
 */
export function getReasonOptions(adjustmentValue: number): readonly string[] {
  const isPositive = adjustmentValue > 0
  
  return isPositive ? REASON_OPTIONS.POSITIVE : REASON_OPTIONS.NEGATIVE
}

/**
 * Calculate new quota with business rule enforcement
 */
export function calculateNewQuota(currentQuota: number, adjustmentValue: number): number {
  const calculated = currentQuota + adjustmentValue
  return Math.max(MIN_QUOTA, Math.min(MAX_QUOTA, calculated))
}

/**
 * Comprehensive validation for quota adjustment form
 */
export function validateQuotaForm(
  currentQuota: number,
  adjustmentValue: number,
  reason: string
): ValidationResult {
  const adjustmentValidation = validateQuotaAdjustment(currentQuota, adjustmentValue)
  const reasonValidation = validateReason(reason)
  
  const allErrors = [
    ...adjustmentValidation.errors,
    ...reasonValidation.errors
  ]
  
  return {
    isValid: allErrors.length === 0,
    errors: allErrors
  }
}