interface ResultModalProps {
  message: string;
  confirmText: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void; 
}

const ResultModal = ({ message, confirmText, cancelText, onConfirm, onCancel }:ResultModalProps) => {
  return (
    <div id="ResultModal" className="fixed bg-modal-back inset-0 z-50">
      <div className="result-modal absolute left-[50%] top-[15%] transform -translate-x-[50%] bg-white p-8 rounded-xl shadow-xl w-80 text-center space-y-4">
        <h5 className="text-white text-base leading-relaxed">{message}</h5>

        <div className="flex justify-center gap-4 pt-3">
          {cancelText && (
            <button
              className="px-4 py-1.5 bg-white-1 text-black rounded hover:bg-gray-50"
              onClick={onCancel}
            >
              {cancelText}
            </button>
          )}
          <button
            className="px-4 py-1.5 bg-white-1 text-black rounded hover:bg-gray-200"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultModal;