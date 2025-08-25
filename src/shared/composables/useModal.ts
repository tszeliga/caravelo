import { computed, ref } from 'vue'

export interface ModalState<T = Record<string, unknown>> {
  isOpen: boolean
  data: T | null
  isLoading: boolean
}

export function useModal<T = Record<string, unknown>>() {
  // Modal state
  const isModalOpen = ref<boolean>(false)
  const modalData = ref<T | null>(null)
  const isLoading = ref<boolean>(false)

  // Computed properties
  const modalState = computed<ModalState<T>>(() => ({
    isOpen: isModalOpen.value,
    data: modalData.value,
    isLoading: isLoading.value
  }))

  // Modal actions
  const openModal = (data?: T): void => {
    modalData.value = data || null
    isModalOpen.value = true
  }

  const closeModal = (): void => {
    isModalOpen.value = false
    modalData.value = null
    isLoading.value = false
  }

  const handleClose = (): void => {
    closeModal()
  }

  const handleSave = async (): Promise<void> => {
    try {
      isLoading.value = true

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Close modal on successful save
      closeModal()
    } catch (error) {
      console.error('Error saving modal data:', error)
    } finally {
      isLoading.value = false
    }
  }

  const setModalData = (data: T): void => {
    modalData.value = data
  }

  const updateModalData = (updates: Partial<T>): void => {
    if (modalData.value) {
      modalData.value = { ...modalData.value, ...updates }
    }
  }

  return {
    // State
    isModalOpen,
    modalData,
    isLoading,
    modalState,

    // Actions
    openModal,
    closeModal,
    handleClose,
    handleSave,
    setModalData,
    updateModalData
  }
}
