import React, { useEffect, useRef } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { ActionButton, type ActionButtonColor } from './ActionButton';

export interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmColor?: ActionButtonColor;
  onConfirm: () => void;
  onClose: () => void;
  isLoading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  title,
  description,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  confirmColor = 'crimson',
  onConfirm,
  onClose,
  isLoading = false,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={dialogRef}
        className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-6 z-10 space-y-4 animate-in fade-in zoom-in-95 duration-150"
      >
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-full bg-crimson-100 dark:bg-crimson-950/60 text-crimson-600 dark:text-crimson-400 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h3
              id="confirm-dialog-title"
              className="text-base font-semibold text-zinc-950 dark:text-zinc-50"
            >
              {title}
            </h3>
            <div className="mt-1 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {description}
            </div>
          </div>
          <ActionButton
            icon={X}
            title="Close dialog"
            color="zinc"
            variant="ghost"
            size="xs"
            onClick={onClose}
          />
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-zinc-100 dark:border-zinc-800">
          <ActionButton
            label={cancelLabel}
            title={cancelLabel}
            color="zinc"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isLoading}
          />
          <ActionButton
            label={confirmLabel}
            title={confirmLabel}
            color={confirmColor}
            variant="solid"
            size="sm"
            onClick={onConfirm}
            disabled={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
