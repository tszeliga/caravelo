import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Subscriber } from '@/types'

export const useSubscribersStore = defineStore('subscribers', () => {

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

  const selectedSubscriber = ref<Subscriber | null>(null)

  const updateSubscriberQuota = (subscriberId: string, newQuota: number): void => {
    const subscriber = subscribers.value.find(sub => sub.id === subscriberId)
    if (subscriber) {
      subscriber.currentQuota = newQuota
    }
  }

  const getSubscriberById = (subscriberId: string): Subscriber | undefined => {
    return subscribers.value.find(sub => sub.id === subscriberId)
  }

  const selectSubscriber = (subscriber: Subscriber | null): void => {
    selectedSubscriber.value = subscriber
  }

  return {
    subscribers,
    selectedSubscriber,
    updateSubscriberQuota,
    getSubscriberById,
    selectSubscriber
  }
})