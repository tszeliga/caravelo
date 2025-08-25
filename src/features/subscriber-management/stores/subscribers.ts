import type { Subscriber } from '@/features/subscriber-management/types/subscriber'
import { defineStore } from 'pinia'
import { ref } from 'vue'

/**
 * Subscribers Store
 *
 * Manages the global state for subscriber data and operations.
 * Uses Pinia composition API for reactive state management.
 */
export const useSubscribersStore = defineStore('subscribers', () => {
  /**
   * Reactive subscribers collection
   *
   * @description Main data source for all subscriber information.
   */
  const subscribers = ref<Subscriber[]>([
    {
      id: 'sub-001',
      name: 'John Doe',
      email: 'john.doe@example.com',
      currentQuota: 2
    },
    {
      id: 'sub-002',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      currentQuota: 1
    },
    {
      id: 'sub-003',
      name: 'Bob Johnson',
      email: 'bob.johnson@example.com',
      currentQuota: 3
    }
  ])

  /**
   * Update subscriber's quota value
   *
   * @description Finds a subscriber by ID and updates their current quota.
   * Used by the quota management system after successful API calls.
   */
  const updateSubscriberQuotaValue = (
    subscriberId: string,
    newQuotaValue: number
  ): void => {
    const subscriber = subscribers.value.find(sub => sub.id === subscriberId)
    if (subscriber) {
      subscriber.currentQuota = newQuotaValue
    }
  }

  // Expose reactive state and actions
  return {
    subscribers, // Readonly access to subscriber data
    updateSubscriberQuotaValue // Quota update mutation
  }
})
