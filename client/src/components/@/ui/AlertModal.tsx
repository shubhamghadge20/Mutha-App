import React from "react";
import { createPortal } from "react-dom";

interface AlertModalProps {
  open: boolean;
  message: string;
  onClose: () => void;
  onConfirm: () => void;
}

const AlertModal: React.FC<AlertModalProps> = ({
  open,
  message,
  onClose,
  onConfirm,
}) => {
  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Confirm Action
        </h2>
        <p className="text-gray-700 dark:text-gray-300">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default AlertModal;
