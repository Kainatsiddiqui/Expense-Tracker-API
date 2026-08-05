import { useEffect } from "react";

type ConfirmationModalProps = {
isOpen: boolean;
title: string;
message: string;
confirmText?: string;
cancelText?: string;
loading?: boolean;
loadingText?: string;
onConfirm: () => Promise<void> | void;
onClose: () => void;
};

function ConfirmationModal({
        isOpen,
        title,
        message,
        confirmText = "Confirm",
        cancelText = "Cancel",
        loadingText = "Processing...",
        loading = false,
        onConfirm,
        onClose,
    }: ConfirmationModalProps) {
        useEffect(() => {
            if (!isOpen || loading) return;

            function handleEscape(
                event: KeyboardEvent
                ) {
                if (event.key === "Escape") {
                    onClose();
                }
            }

            document.addEventListener(
                "keydown",
                handleEscape
            );

            return () => {
                document.removeEventListener(
                    "keydown",
                    handleEscape
                );
            };

        }, [isOpen, onClose, loading]);

        if (!isOpen) return null;

        return (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
                onClick={() => {
                    if (!loading) onClose();
                }}
            >
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6"
                    onClick={(e) =>
                        e.stopPropagation()
                    }
                > 
                    <div className="mb-6"> 
                        <h2 className="text-xl font-semibold text-gray-900">
                            {title} 
                        </h2>

                        <p className="text-gray-600 mt-2">
                            {message}
                        </p>
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            disabled={loading}
                            className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
                        >
                            {cancelText}
                        </button>

                        <button
                            onClick={onConfirm}
                            disabled={loading}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading
                                ? loadingText
                                : confirmText}
                        </button>
                    </div>
                </div>
            </div>

        );
    }

export default ConfirmationModal;
