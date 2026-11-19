import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  Loader2,
  Upload,
  X,
} from 'lucide-react';
import type {
  CsvImportParseResult,
  QuestionCsvImportModalProps,
  QuizQuestion,
  WrittenQuestion,
} from '../../types';
import { ActionButton } from '../common/ActionButton';
import { toast } from '../../services/toastService';
import { formatUserFriendlyError } from '../../utils/errorHelpers';
import { downloadCsvErrorsReport } from '../../utils/questionCsvHelpers';

export function QuestionCsvImportModal<T extends { id: string }>({
  isOpen,
  kind,
  existingIds,
  onClose,
  onDownloadTemplate,
  onParseCsv,
  onConfirmImport,
}: QuestionCsvImportModalProps<T>) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [inputMode, setInputMode] = useState<'file' | 'paste'>('file');
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSizeBytes, setFileSizeBytes] = useState<number>(0);
  const [rawCsvText, setRawCsvText] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setInputMode('file');
      setFileName(null);
      setFileSizeBytes(0);
      setRawCsvText('');
      setIsDragging(false);
      setIsImporting(false);
    }
  }, [isOpen]);

  const parseResult = useMemo<CsvImportParseResult<T> | null>(() => {
    if (!rawCsvText.trim()) return null;
    return onParseCsv(rawCsvText, existingIds);
  }, [rawCsvText, existingIds, onParseCsv]);

  if (!isOpen) return null;

  const isQuiz = kind === 'quiz';
  const title = isQuiz
    ? 'Import Objective MCQ Questions (CSV)'
    : 'Import Written Questions & Rubrics (CSV)';

  const handleFileLoad = async (file: File) => {
    const lowerName = file.name.toLowerCase();
    const isAllowed =
      lowerName.endsWith('.csv') ||
      lowerName.endsWith('.txt') ||
      file.type === 'text/csv' ||
      file.type === 'application/vnd.ms-excel' ||
      file.type === 'text/plain';

    if (!isAllowed) {
      toast.error(
        `Unsupported file "${file.name}". Please save or export your spreadsheet as CSV (UTF-8 .csv) first.`
      );
      return;
    }

    try {
      const text = await file.text();
      setFileName(file.name);
      setFileSizeBytes(file.size);
      setRawCsvText(text);
    } catch (err) {
      toast.error(formatUserFriendlyError(err, 'Could not read CSV file.'));
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      void handleFileLoad(file);
    }
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      void handleFileLoad(file);
    }
  };

  const handleConfirm = async () => {
    if (!parseResult || parseResult.validItems.length === 0 || isImporting) {
      return;
    }

    setIsImporting(true);
    try {
      const summary = await onConfirmImport(parseResult.validItems);
      const localMsg = `Imported ${summary.created} new and updated ${summary.updated} existing ${isQuiz ? 'MCQ' : 'written'} questions.`;
      if (summary.cloudSkipped) {
        toast.info(
          `${localMsg} Saved locally (sign in as verified admin to sync to Firestore).`
        );
      } else if (summary.cloudFailed > 0) {
        toast.warning(
          `${localMsg} (${summary.cloudSynced} synced to cloud, ${summary.cloudFailed} cloud sync failed — check admin sign-in.)`
        );
      } else if (summary.cloudSynced > 0) {
        toast.success(`${localMsg} Synced ${summary.cloudSynced} to Firestore.`);
      } else {
        toast.success(localMsg);
      }
      onClose();
    } catch (err) {
      toast.error(formatUserFriendlyError(err, 'Failed to import CSV questions.'));
    } finally {
      setIsImporting(false);
    }
  };

  const renderPreviewLine = (item: T) => {
    if (isQuiz) {
      const q = item as unknown as QuizQuestion;
      return {
        primary: q.question,
        meta: `${q.subject} · ${q.difficulty} · Key: ${q.correct_options.join(',')}`,
      };
    }
    const w = item as unknown as WrittenQuestion;
    return {
      primary: w.en.title,
      meta: `${w.paper} · ${w.marks} Marks (${w.rubric.length} rubric pts)`,
    };
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="csv-import-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
    >
      <div className="w-full max-w-2xl rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-3 bg-zinc-50/70 dark:bg-zinc-900/70">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/70 flex items-center justify-center shrink-0">
              <FileSpreadsheet className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="min-w-0">
              <h3
                id="csv-import-modal-title"
                className="font-serif text-base font-bold text-zinc-950 dark:text-zinc-50 truncate"
              >
                {title}
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                UTF-8 CSV with Devanagari (नेपाली) support · Upserts by question ID
              </p>
            </div>
          </div>

          <ActionButton
            title="Close CSV import dialog"
            icon={X}
            color="zinc"
            variant="ghost"
            size="xs"
            disabled={isImporting}
            onClick={onClose}
          />
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Template & Schema Helper */}
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-950/60 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-xs text-zinc-600 dark:text-zinc-400 space-y-0.5">
              <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                Need the exact column headers?
              </p>
              <p>
                {isQuiz
                  ? 'Required: question, optionA, optionB, correct_options (e.g. A or A|C). Existing IDs update in place.'
                  : 'Required: enTitle, enQuestion, marks (5 or 10), paper. Sections & rubric support JSON or "::" shorthand.'}
              </p>
            </div>
            <ActionButton
              label="Download Template"
              title="Download a sample CSV file with exact column headers"
              icon={Download}
              color="zinc"
              variant="outline"
              size="xs"
              className="shrink-0"
              onClick={onDownloadTemplate}
            />
          </div>

          {/* Input Mode Switcher */}
          <div className="flex items-center justify-between gap-2">
            <div className="inline-flex p-0.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 gap-1">
              <ActionButton
                label="Upload .CSV File"
                title="Upload a CSV spreadsheet file"
                color="zinc"
                variant={inputMode === 'file' ? 'solid' : 'ghost'}
                size="xs"
                onClick={() => setInputMode('file')}
              />
              <ActionButton
                label="Paste CSV Text"
                title="Paste raw CSV rows directly"
                color="zinc"
                variant={inputMode === 'paste' ? 'solid' : 'ghost'}
                size="xs"
                onClick={() => setInputMode('paste')}
              />
            </div>

            {rawCsvText && (
              <button
                type="button"
                onClick={() => {
                  setRawCsvText('');
                  setFileName(null);
                  setFileSizeBytes(0);
                }}
                className="text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 cursor-pointer"
              >
                Clear data
              </button>
            )}
          </div>

          {/* File Dropzone or Paste Textarea */}
          {inputMode === 'file' ? (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition-colors ${
                isDragging
                  ? 'border-blue-500 bg-blue-50/60 dark:bg-blue-950/30'
                  : 'border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-600 bg-zinc-50/40 dark:bg-zinc-950/40'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,text/csv"
                onChange={handleFileInputChange}
                className="hidden"
              />
              <Upload className="w-6 h-6 mx-auto text-zinc-400 mb-2" />
              {fileName ? (
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 font-mono">
                    {fileName}
                  </p>
                  <p className="text-[11px] text-zinc-500 font-mono tabular-nums">
                    {(fileSizeBytes / 1024).toFixed(1)} KB · Click or drop another CSV to replace
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                    Click to select a CSV file or drag &amp; drop here
                  </p>
                  <p className="text-[11px] text-zinc-500">
                    Supports exported question bank CSVs from Excel, Google Sheets, or LibreOffice Calc
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-1.5">
              <label
                htmlFor="csv-raw-textarea"
                className="block text-xs font-medium text-zinc-700 dark:text-zinc-300"
              >
                Paste CSV content (including header row)
              </label>
              <textarea
                id="csv-raw-textarea"
                rows={6}
                value={rawCsvText}
                onChange={(e) => {
                  setFileName('Pasted CSV text');
                  setRawCsvText(e.target.value);
                }}
                placeholder={
                  isQuiz
                    ? 'id,subject,topic,difficulty,marks,correct_options,question,optionA,optionB,optionC,optionD,explanation'
                    : 'id,paper,subject,marks,enTitle,enQuestion,neTitle,neQuestion'
                }
                className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 p-3 text-xs font-mono text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              />
            </div>
          )}

          {/* Validation Summary */}
          {parseResult && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-2.5 bg-white dark:bg-zinc-950/60">
                  <span className="block text-[11px] text-zinc-500">Data Rows</span>
                  <span className="font-mono tabular-nums text-base font-bold text-zinc-950 dark:text-zinc-50">
                    {parseResult.totalRows}
                  </span>
                </div>
                <div className="rounded-lg border border-emerald-200 dark:border-emerald-900/60 p-2.5 bg-emerald-50/50 dark:bg-emerald-950/20">
                  <span className="block text-[11px] text-emerald-700 dark:text-emerald-400">
                    New Questions
                  </span>
                  <span className="font-mono tabular-nums text-base font-bold text-emerald-700 dark:text-emerald-300">
                    +{parseResult.newCount}
                  </span>
                </div>
                <div className="rounded-lg border border-blue-200 dark:border-blue-900/60 p-2.5 bg-blue-50/50 dark:bg-blue-950/20">
                  <span className="block text-[11px] text-blue-700 dark:text-blue-400">
                    Updates Existing
                  </span>
                  <span className="font-mono tabular-nums text-base font-bold text-blue-700 dark:text-blue-300">
                    {parseResult.updateCount}
                  </span>
                </div>
                <div
                  className={`rounded-lg border p-2.5 ${
                    parseResult.errors.length > 0
                      ? 'border-red-200 dark:border-red-900/60 bg-red-50/50 dark:bg-red-950/20'
                      : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/60'
                  }`}
                >
                  <span
                    className={`block text-[11px] ${
                      parseResult.errors.length > 0
                        ? 'text-red-700 dark:text-red-400'
                        : 'text-zinc-500'
                    }`}
                  >
                    Row Errors
                  </span>
                  <span
                    className={`font-mono tabular-nums text-base font-bold ${
                      parseResult.errors.length > 0
                        ? 'text-red-700 dark:text-red-300'
                        : 'text-zinc-950 dark:text-zinc-50'
                    }`}
                  >
                    {parseResult.errors.length}
                  </span>
                </div>
              </div>

              {/* Row Errors Box */}
              {parseResult.errors.length > 0 && (
                <div className="rounded-xl border border-red-200 dark:border-red-900/70 bg-red-50/60 dark:bg-red-950/30 p-3.5 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-red-800 dark:text-red-300">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>
                        {parseResult.errors.length} row
                        {parseResult.errors.length === 1 ? '' : 's'} failed validation
                        {parseResult.validItems.length > 0
                          ? ' (invalid rows will be skipped if you proceed)'
                          : ''}
                      </span>
                    </div>
                    <ActionButton
                      label="Download Errors"
                      title="Download validation error list as CSV to fix rows in Excel or Sheets"
                      icon={Download}
                      color="crimson"
                      variant="outline"
                      size="xs"
                      onClick={() => {
                        downloadCsvErrorsReport(
                          parseResult.errors,
                          `psc-${isQuiz ? 'mcq' : 'written'}-import-errors.csv`
                        );
                        toast.info('Downloaded CSV validation error report.');
                      }}
                    />
                  </div>
                  <div className="max-h-36 overflow-y-auto divide-y divide-red-200/70 dark:divide-red-900/50 text-xs">
                    {parseResult.errors.slice(0, 50).map((err, idx) => (
                      <div key={idx} className="py-1.5 text-red-800 dark:text-red-200">
                        <span className="font-mono font-semibold">
                          Row {err.rowNumber}
                          {err.questionId ? ` (${err.questionId})` : ''}:
                        </span>{' '}
                        {err.message}
                      </div>
                    ))}
                    {parseResult.errors.length > 50 && (
                      <div className="py-1.5 font-mono text-[11px] text-red-700 dark:text-red-300">
                        ...and {parseResult.errors.length - 50} more errors. Download the error report CSV to see all rows.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Valid Preview Box */}
              {parseResult.validItems.length > 0 && (
                <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-950/50 p-3.5 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>
                      Ready to import {parseResult.validItems.length} validated{' '}
                      {isQuiz ? 'MCQ' : 'written'} question
                      {parseResult.validItems.length === 1 ? '' : 's'} (Previewing first{' '}
                      {Math.min(3, parseResult.validItems.length)})
                    </span>
                  </div>
                  <div className="divide-y divide-zinc-200/80 dark:divide-zinc-800">
                    {parseResult.validItems.slice(0, 3).map((item) => {
                      const info = renderPreviewLine(item);
                      const isUpdate = existingIds.has(item.id);
                      return (
                        <div key={item.id} className="py-2 text-xs space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-semibold text-zinc-800 dark:text-zinc-200">
                              {item.id}
                            </span>
                            <span
                              className={`font-mono text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                                isUpdate
                                  ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                                  : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                              }`}
                            >
                              {isUpdate ? 'UPDATE' : 'NEW'}
                            </span>
                            <span className="text-[11px] text-zinc-500 truncate">
                              {info.meta}
                            </span>
                          </div>
                          <p className="text-zinc-700 dark:text-zinc-300 line-clamp-1">
                            {info.primary}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/70 flex items-center justify-between gap-3">
          <div className="text-[11px] text-zinc-500 font-mono">
            {isImporting && (
              <span className="inline-flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Saving locally &amp; syncing to Firestore...
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <ActionButton
              label="Cancel"
              title="Close import modal"
              color="zinc"
              variant="outline"
              size="sm"
              disabled={isImporting}
              onClick={onClose}
            />
            <ActionButton
              label={
                isImporting
                  ? 'Importing...'
                  : parseResult && parseResult.validItems.length > 0
                    ? `Import ${parseResult.validItems.length} Question${parseResult.validItems.length === 1 ? '' : 's'}`
                    : 'Import CSV'
              }
              title="Commit validated CSV rows to the question bank"
              icon={isImporting ? Loader2 : Upload}
              color="blue"
              variant="solid"
              size="sm"
              disabled={
                isImporting ||
                !parseResult ||
                parseResult.validItems.length === 0
              }
              onClick={() => void handleConfirm()}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
