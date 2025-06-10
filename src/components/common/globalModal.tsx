import useGlobalModalStore from "../../zstore/useGlobalModalStore"
import ResultModal from "./resultModal"

const GlobalModal = () => {
  const { visible, message, confirmText, cancelText, onConfirm, onCancel, close } = useGlobalModalStore()

  if (!visible) return null

  return (
    <ResultModal
      message={message}
      confirmText={confirmText}
      cancelText={cancelText}
      onConfirm={() => {
        onConfirm()
      }}
      onCancel={() => {
        onCancel?.()
      }}
    />
  )
}

export default GlobalModal