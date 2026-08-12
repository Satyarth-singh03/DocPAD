import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Modal } from './Modal';

export const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', isDanger = true }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title || 'Confirmation Required'} maxWidth="max-w-md">
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-full ${isDanger ? 'bg-red-100 text-red-600' : 'bg-sky-100 text-sky-700'}`}>
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <p className="text-sm text-gray-700 font-medium leading-relaxed mb-6">
            {message}
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`px-4 py-2 text-sm font-medium text-white rounded-md transition-colors ${
                isDanger ? 'bg-red-600 hover:bg-red-700' : 'bg-black hover:bg-gray-800'
              }`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
