import { useEffect, useRef, useState, type FormEvent } from 'react';
import { AlertCircle, Flag, X } from 'lucide-react';
import { QUICK_FLAG_REASONS } from '../../data/siteConfig';
import type {
  FlagReasonModalProps,
  FlagReasonTargetQuestion,
} from '../../types/common';
import { ActionButton } from './ActionButton';

export { QUICK_FLAG_REASONS, type FlagReasonTargetQuestion };

export function FlagReasonModal({
  open,
  question,
  initialReason = '',
  title = 'Flag Question for Review',
  submitLabel = 'Submit Flag',
  onConfirm,
  onCancel,
}: FlagReasonModalProps) {
  const [reason, setReason] = useState(initialReason);
  const [validationError, setValidationError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!open) return;
    setReason(initialReason);
    setValidationError(null);
    const frame = window.requestAnimationFrame(() => {
      textareaRef.current?.focus();
    });
    return () => window.cancelAnimationFrame(frame);
  }, [open, question?.id, initialReason]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [open, onCancel]);

  if (!open || !question) return null;

  const trimmed = reason.trim();

  const handleSelectPreset = (preset: string) => {
    setReason(preset);
    setValidationError(null);
    textareaRef.current?.focus();
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!trimmed) {
      setValidationError(
        'Please select or enter a reason before flagging this question.'
      );
      textareaRef.current?.focus();
      return;
    }
    if (trimmed.length < 3) {
      setValidationError(
        'Please enter a clearer reason (at least 3 characters).'
      );
      textareaRef.current?.focus();
      return;
    }
    onConfirm(trimmed.slice(0, 500));
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="flag-reason-dialog-title"
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-zinc-950/65 dark:bg-black/75 backdrop-blur-xs"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onCancel();
        }
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl p-5 sm:p-6 space-y-4"
      >
        <div className="flex items-start justify-between gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-3">
          <div className="flex items-start gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/70 flex items-center justify-center shrink-0 mt-0.5">
              <Flag className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="min-w-0">
              <h3
                id="flag-reason-dialog-title"
                className="font-serif font-bold text-base text-zinc-950 dark:text-zinc-50"
              >
                {title}
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono mt-0.5 truncate">
                {question.id}
                {question.subject ? ` · ${question.subject}` : ''}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onCancel}
            aria-label="Close flag reason dialog"
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors shrink-0 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Question Prompt Preview */}
        <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800 space-y-1 text-xs">
          <p
            lang={
              question.subject?.trim().toLowerCase() === 'nepali'
                ? 'ne'
                : undefined
            }
            className="font-serif font-medium text-zinc-900 dark:text-zinc-100 line-clamp-2"
          >
            {question.question}
          </p>
          {question.questionNe?.trim() && (
            <p
              lang="ne"
              className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-1"
            >
              {question.questionNe}
            </p>
          )}
        </div>

        {/* Quick Preset Selectors */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block">
            Select a quick reason or write your own:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {QUICK_FLAG_REASONS.map((preset) => {
              const selected = trimmed === preset;
              return (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors text-left cursor-pointer ${
                    selected
                      ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/50 text-amber-900 dark:text-amber-200'
                      : 'border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-800/70'
                  }`}
                >
                  {preset}
                </button>
              );
            })}
          </div>
        </div>

        {/* Reason Input */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <label
              htmlFor="flag-reason-textarea"
              className="text-xs font-semibold text-zinc-800 dark:text-zinc-200"
            >
              Reason for flagging <span className="text-crimson-600">*</span>
            </label>
            <span className="font-mono tabular-nums text-[11px] text-zinc-400">
              {reason.length}/500
            </span>
          </div>
          <textarea
            ref={textareaRef}
            id="flag-reason-textarea"
            rows={3}
            maxLength={500}
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              if (validationError) setValidationError(null);
            }}
            placeholder="Describe why you are flagging this question (e.g., Confusing statutory dates, answer key seems wrong, or want to revise before exam)..."
            className={`w-full p-2.5 rounded-lg border bg-white dark:bg-zinc-950 text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 resize-none ${
              validationError
                ? 'border-red-500 focus:ring-red-500'
                : 'border-zinc-200 dark:border-zinc-700 focus:ring-blue-600'
            }`}
          />
          {validationError && (
            <p className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{validationError}</span>
            </p>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
          <ActionButton
            label="Cancel"
            title="Cancel flagging this question"
            variant="outline"
            color="zinc"
            size="sm"
            onClick={onCancel}
          />
          <ActionButton
            type="submit"
            label={submitLabel}
            title="Save flag reason and mark question for review"
            icon={Flag}
            variant="solid"
            color="amber"
            size="sm"
          />
        </div>
      </form>
    </div>
  );
}
