
import { create } from 'zustand'

interface GlobalModalState {
  visible: boolean
  message: string
  confirmText: string
  cancelText?: string
  onConfirm: () => void
  onCancel?: () => void
  open: (params: {
    message: string
    confirmText: string
    cancelText?: string
    onConfirm: () => void
    onCancel?: () => void
  }) => void
  close: () => void
}

const useGlobalModalStore = create<GlobalModalState>((set) => ({
  visible: false,
  message: '',
  confirmText: '',
  cancelText: undefined,
  onConfirm: () => {},
  onCancel: () => {},
  open: ({ message, confirmText, cancelText, onConfirm, onCancel }) =>
    set({
      visible: true,
      message,
      confirmText,
      cancelText,
      onConfirm,
      onCancel
    }),
  close: () =>
    set({
      visible: false,
      message: '',
      confirmText: '',
      cancelText: undefined,
      onConfirm: () => {},
      onCancel: undefined
    }),
}))

export default useGlobalModalStore
