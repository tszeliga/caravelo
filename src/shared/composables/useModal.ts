import { computed, ref } from 'vue'

export interface ModalState<T = Record<string, unknown>> {
  isOpen: boolean
  data: T | null
  isLoading: boolean
}

export function useModal<T = Record<string, unknown>>() {
  const isModalOpen = ref<boolean>(false)
  const modalData = ref<T | null>(null)
  const isLoading = ref<boolean>(false)

  const modalState = computed<ModalState<T>>(() => ({
    isOpen: isModalOpen.value,
    data: modalData.value,
    isLoading: isLoading.value
  }))

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

  const handleSave = (): void => {
    isLoading.value = false
    closeModal()
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
    isModalOpen,
    modalData,
    isLoading,
    modalState,

    openModal,
    closeModal,
    handleClose,
    handleSave,
    setModalData,
    updateModalData
  }
}
