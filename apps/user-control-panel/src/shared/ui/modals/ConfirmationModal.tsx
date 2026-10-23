import { X, Loader2, Trash2 } from "lucide-react";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { SMALL_BUTTON_SECONDARY } from "../styles";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "Do you really want to delete these records? This process cannot be undone.",
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  isLoading = false,
}: ConfirmationModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (isOpen && e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        ref={modalRef}
        className="relative w-full max-w-sm font-inter-tight bg-white border border-neutral-200 dark:bg-neutral-900 dark:border-neutral-800 rounded-2xl shadow-xl p-6 flex flex-col items-center text-center animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        {/* Close X button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-full p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon */}
        <div className="w-14 h-14 rounded-full bg-error/10 flex items-center justify-center mb-4 text-error">
          <Trash2 className="w-6 h-6" aria-hidden="true" />
        </div>

        {/* Title */}
        <h3
          id="modal-title"
          className="text-xl font-semibold tracking-tight text-neutral-950 dark:text-white mb-2"
        >
          {title}
        </h3>

        {/* Message */}
        <p
          id="modal-description"
          className="text-neutral-600 dark:text-neutral-400 mb-6 text-sm"
        >
          {message}
        </p>

        {/* Buttons */}
        <div className="flex gap-3 w-full justify-center">
          <button
            onClick={onClose}
            disabled={isLoading}
            className={`${SMALL_BUTTON_SECONDARY} h-10 flex-1`}
          >
            {cancelLabel}
          </button>
          <button
            onClick={() => {
              onConfirm();
            }}
            disabled={isLoading}
            className="flex-1 h-10 px-4 inline-flex items-center justify-center rounded-full bg-error text-white text-sm font-semibold hover:bg-error/90 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-error"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
