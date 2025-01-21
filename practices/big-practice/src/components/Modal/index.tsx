import React, { ReactNode } from 'react';

interface ModalProps {
  title: string;
  onClose: () => void;
  content: ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  title,
  onClose,
  content,
}) => {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
      data-testid="modal-overlay"
    >
      <div
        className="bg-white w-full max-w-lg rounded-lg shadow-lg relative"
        onClick={(e) => e.stopPropagation()}
        data-testid="modal-content"
      >
        {/* Modal Header */}
        <div className="bg-blue-600 text-white p-4 rounded-t-lg">
          <h2 className="text-lg font-semibold">{title}</h2>
        </div>

        {/* Modal Body */}
        <div className="p-4">{content}</div>
      </div>
    </div>
  );
};
