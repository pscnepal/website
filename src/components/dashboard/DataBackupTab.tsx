import { useState } from 'react';
import {
  AlertTriangle,
  Check,
  Download,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { clearWrittenProgress } from '../../features/written/writtenSlice';
import { clearAllReactions } from '../../features/reactions/reactionsSlice';
import { ActionButton } from '../common/ActionButton';

export function DataBackupTab() {
  const dispatch = useAppDispatch();
  const quizAttempts = useAppSelector((state) => state.quiz.attempts);
  const writtenRecords = useAppSelector((state) => state.written.records);
  const simulationRuns = useAppSelector((state) => state.psc.simulationHistory);
  const userReactions = useAppSelector((state) => state.reactions.userReactions);
  const itemViews = useAppSelector((state) => state.reactions.itemViews);
  const recentBooks = useAppSelector((state) => state.library.recentBooks);

  const [confirmReset, setConfirmReset] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleExportData = () => {
    const backupData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      platform: 'PSC Nepal Preparation Workspace',
      quizAttempts,
      writtenRecords,
      simulationRuns,
      userReactions,
      itemViews,
      recentBooks,
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `psc_nepal_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const handleClearData = () => {
    dispatch(clearWrittenProgress());
    dispatch(clearAllReactions());
    setConfirmReset(false);
  };

  return (
    <div className="space-y-6">
      {/* Storage Health Overview */}
      <div className="rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 sm:p-6 space-y-4">
        <div>
          <h3 className="font-serif text-lg font-bold text-zinc-950 dark:text-zinc-50">
            Local Browser Storage &amp; Data Sovereignty
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            All your timed written answer scripts, test attempts, rubric scores, and question ratings are stored locally on your device with zero cloud tracking.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono tabular-nums">
          <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800">
            <span className="text-zinc-500 font-sans block">Saved Answer Drafts</span>
            <span className="text-xl font-bold text-zinc-950 dark:text-zinc-50">
              {Object.keys(writtenRecords).length}
            </span>
          </div>

          <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800">
            <span className="text-zinc-500 font-sans block">Quiz Attempts</span>
            <span className="text-xl font-bold text-zinc-950 dark:text-zinc-50">
              {quizAttempts.length}
            </span>
          </div>

          <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800">
            <span className="text-zinc-500 font-sans block">Exam Hall Runs</span>
            <span className="text-xl font-bold text-blue-700 dark:text-blue-400">
              {simulationRuns.length}
            </span>
          </div>

          <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800">
            <span className="text-zinc-500 font-sans block">Views &amp; Reactions</span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-emerald-700 dark:text-emerald-400">
                {Object.keys(userReactions).length}
              </span>
              <span className="text-[11px] text-zinc-400 font-mono">
                rated · {Object.keys(itemViews).length} viewed
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Export / Backup Section */}
      <div className="rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="font-serif font-bold text-zinc-950 dark:text-zinc-50 text-base">
              Export Candidate Snapshot (.JSON)
            </h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Download your complete preparation portfolio including all drafts, scores, and mastery flags for backup or moving across devices.
            </p>
          </div>

          <ActionButton
            onClick={handleExportData}
            label={downloadSuccess ? 'Backup Exported!' : 'Export JSON Backup'}
            title="Download full candidate profile snapshot as JSON"
            color={downloadSuccess ? 'emerald' : 'blue'}
            variant="solid"
            size="md"
            icon={downloadSuccess ? Check : Download}
            className="self-start sm:self-auto"
          />
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded-xl bg-white dark:bg-zinc-900 border border-red-200 dark:border-red-900/60 p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="font-serif font-bold text-red-950 dark:text-red-200 text-base flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
              <span>Reset Local Study Workspace</span>
            </h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Permanently clear saved written drafts, rubric criteria checkmarks, and reaction logs from this browser.
            </p>
          </div>

          {confirmReset ? (
            <div className="flex items-center gap-2">
              <ActionButton
                onClick={() => setConfirmReset(false)}
                label="Cancel"
                title="Cancel workspace reset"
                color="zinc"
                variant="outline"
                size="sm"
              />
              <ActionButton
                onClick={handleClearData}
                label="Confirm Delete"
                title="Permanently erase written drafts and reactions"
                color="red"
                variant="solid"
                size="sm"
              />
            </div>
          ) : (
            <ActionButton
              onClick={() => setConfirmReset(true)}
              label="Clear Workspace Data"
              title="Reset and clear local study data"
              color="red"
              variant="outline"
              size="sm"
            />
          )}
        </div>
      </div>
    </div>
  );
}
