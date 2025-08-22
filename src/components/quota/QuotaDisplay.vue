<template>
  <v-card
    variant="outlined"
    class="quota-calculation-card mb-4"
    data-testid="quota-calculation"
  >
    <v-card-text class="quota-calculation">
      <div class="d-flex align-center justify-space-between">
        <div class="quota-item">
          <span class="text-caption text-medium-emphasis">Current Quota</span>
          <div class="quota-value" data-testid="current-quota">
            {{ currentQuota }}
          </div>
        </div>
        
        <div v-if="adjustmentValue !== 0" class="calculation-flow">
          <v-icon 
            :color="adjustmentValue > 0 ? 'success' : 'error'"
            class="mx-2"
            :icon="adjustmentValue > 0 ? 'mdi-plus' : 'mdi-minus'"
          />
          
          <div class="quota-item">
            <span class="text-caption text-medium-emphasis">Adjustment</span>
            <div 
              class="quota-value"
              :class="adjustmentValue > 0 ? 'text-success' : 'text-error'"
              data-testid="adjustment-value"
            >
              {{ adjustmentValue }}
            </div>
          </div>
          
          <v-icon class="mx-2" color="primary" icon="mdi-equal" />
          
          <div class="quota-item">
            <span class="text-caption text-medium-emphasis">New Quota</span>
            <div 
              class="quota-value font-weight-bold"
              :class="isWithinLimits ? 'text-primary' : 'text-error'"
              data-testid="new-quota"
            >
              {{ newQuota }}
            </div>
          </div>
        </div>
        
        <div v-else class="text-caption text-medium-emphasis">
          Enter an adjustment to see the calculation
        </div>
      </div>
      
      <div class="quota-limits mt-3">
        <v-chip
          v-for="{ value, label} in quotaLimits"
          :key="value"
          :color="getChipColor(value)"
          :variant="newQuota === value ? 'flat' : 'outlined'"
          size="small"
          class="mr-2"
          :data-testid="`quota-limit-${value}`"
        >
          {{ label }}
        </v-chip>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { QUOTA_LIMITS, MIN_QUOTA, MAX_QUOTA } from '@/constants/quota'

interface Props {
  currentQuota: number
  adjustmentValue: number
  newQuota: number
  isWithinLimits?: boolean
}

const props = defineProps<Props>()
const quotaLimits = QUOTA_LIMITS

const getChipColor = (limitValue: number): string => {
  if (props.newQuota === limitValue) {
    return 'primary'
  }
  if (limitValue === MIN_QUOTA) {
    return 'error'
  }
  if (limitValue === MAX_QUOTA) {
    return 'warning'
  }
  return 'default'
}
</script>

<style scoped lang="scss">
.quota-calculation-card {
  background: var(--quota-calculation-highlight);
  
  .quota-calculation {
    .quota-item {
      text-align: center;
      min-width: 80px;
      
      .quota-value {
        font-size: 1.5rem;
        font-weight: 600;
        line-height: 1.2;
      }
    }
    
    .calculation-flow {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
  }
  
  .quota-limits {
    border-top: 1px solid rgba(0, 0, 0, 0.12);
    padding-top: 0.75rem;
  }
}

@media (max-width: 600px) {
  .quota-calculation {
    .calculation-flow {
      flex-direction: column;
      gap: 0.25rem;
      
      .quota-item {
        min-width: 60px;
      }
    }
  }
}
</style>