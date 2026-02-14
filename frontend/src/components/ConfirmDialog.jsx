import React from 'react';
import { FaExclamationTriangle, FaInfoCircle, FaTimes } from 'react-icons/fa';

const ConfirmDialog = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    isDestructive = false
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all scale-100 animate-scale-up border border-gray-100">

                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDestructive ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'}`}>
                            {isDestructive ? <FaExclamationTriangle size={18} /> : <FaInfoCircle size={18} />}
                        </div>
                        <h3 className="text-lg font-bold text-gray-800">{title}</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-50 transition-colors"
                    >
                        <FaTimes size={14} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <p className="text-gray-600 leading-relaxed">{message}</p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-5 border-t border-gray-50 bg-gray-50/50 rounded-b-2xl">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-xl text-gray-600 font-semibold hover:bg-white hover:shadow-sm hover:text-gray-800 border border-transparent hover:border-gray-200 transition-all text-sm"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className={`
              px-6 py-2.5 rounded-xl text-white font-bold shadow-lg transition-all transform active:scale-95 text-sm flex items-center gap-2
              ${isDestructive
                                ? 'bg-red-500 hover:bg-red-600 shadow-red-200'
                                : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'
                            }
            `}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;
