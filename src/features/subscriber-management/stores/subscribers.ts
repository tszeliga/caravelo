import type { Subscriber } from '@/features/subscriber-management/types/subscriber'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSubscribersStore = defineStore('subscribers', () => {
  // Mocked data
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

  const updateSubscriberQuotaValue = (
    subscriberId: string,
    newQuotaValue: number
  ): void => {
    const subscriber = subscribers.value.find(sub => sub.id === subscriberId)
    if (subscriber) {
      subscriber.currentQuota = newQuotaValue
    }
  }

  return {
    subscribers,
    updateSubscriberQuotaValue
  }
})
