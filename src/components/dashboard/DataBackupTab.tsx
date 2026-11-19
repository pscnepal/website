import { useEffect, useState } from 'react';
import {
  AlertTriangle,
  Check,
  Database,
  Download,
  Trash2,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { clearWrittenProgress } from '../../features/written/writtenSlice';
import { clearAllReactions } from '../../features/reactions/reactionsSlice';
import { clearWrittenEvaluations } from '../../features/workspace/workspaceSlice';
import {
  OFFLINE_CACHE_EVENTS,
  offlineDbService,
  type OfflineCacheSummary,
} from '../../services/offlineDbService';
import { storageService } from '../../services/storageService';
import { toast } from '../../services/toastService';
import { formatUserFriendlyError } from '../../utils/errorHelpers';
import { formatBytes } from '../../utils/pdfHelpers';
import { ActionButton } from '../common/ActionButton';

export function DataBackupTab() {
  const dispatch = useAppDispatch();
  const quizAttempts = useAppSelector((state) => state.quiz.attempts);
  const writtenRecords = useAppSelector((state) => state.written.records);
  const pscState = useAppSelector((state) => state.psc);
  const workspaceState = useAppSelector((state) => state.workspace);
  const userReactions = useAppSelector((state) => state.reactions.userReactions);
  const itemViews = useAppSelector((state) => state.reactions.itemViews);
  const recentBooks = useAppSelector((state) => state.library.recentBooks);

  const [confirmReset, setConfirmReset] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [offlineSummary, setOfflineSummary] = useState<OfflineCacheSummary | null>(
    null
  );

  useEffect(() => {
    let active = true;
    const loadSummary = () => {
      void offlineDbService.getCacheSummary().then((summary) => {
        if (active) {
          setOfflineSummary(summary);
        }
      });
    };
    loadSummary();
    window.addEventListener(OFFLINE_CACHE_EVENTS.CHANGED, loadSummary);
    return () => {
      active = false;
      window.removeEventListener(OFFLINE_CACHE_EVENTS.CHANGED, loadSummary);
    };
  }, []);

  const handleExportData = () => {
    try {
      const backupData = {
        version: '2.0',
        exportedAt: new Date().toISOString(),
        platform: 'PSC Nepal Preparation Workspace',
        targetCadreId: pscState.targetCadreId,
        completedUnitIds: pscState.completedUnitIds,
        completedTopicIds: pscState.completedTopicIds,
        bookmarkedUnitIds: pscState.bookmarkedUnitIds,
        quizAttempts,
        writtenRecords,
        writtenEvaluations: workspaceState.writtenEvaluations,
        simulationRuns: pscState.simulationHistory,
        flashcardProgress: workspaceState.flashcardProgress,
        pyqBookmarks: workspaceState.pyqBookmarks,
        affairBookmarks: workspaceState.affairBookmarks,
        examChecklist: workspaceState.examChecklist,
        userReactions,
        itemViews,
        flaggedQuestions: storageService.loadFlaggedQuestions(),
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
      toast.success('Candidate backup exported as JSON.');
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      toast.error(
        formatUserFriendlyError(err, 'Failed to generate backup JSON file.')
      );
    }
  };

  const handleClearData = () => {
    dispatch(clearWrittenProgress());
    dispatch(clearWrittenEvaluations());
    dispatch(clearAllReactions());
    setConfirmReset(false);
    toast.info('Written drafts, evaluations, and reactions cleared.');
  };

  return (
    <div className="space-y-6">
      {/* Storage Health Overview */}
      <div className="rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 sm:p-6 space-y-4">
        <div>
          <h3 className="font-serif text-lg font-bold text-zinc-950 dark:text-zinc-50">
            Workspace Data &amp; Backup Overview
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Review your saved answer scripts, quiz attempts, exam hall runs, and ratings, or export a portable JSON backup.
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
              {pscState.simulationHistory.length}
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

      {/* IndexedDB Offline Storage Summary */}
      {offlineSummary?.supported && (
        <div className="rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="font-serif font-bold text-zinc-950 dark:text-zinc-50 text-base flex items-center gap-2">
                <Database className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                <span>Offline IndexedDB Cache (PWA Storage)</span>
              </h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                Study materials, quiz banks, current affairs, PDF binaries, and progress snapshots cached locally for offline use.
              </p>
            </div>

            {offlineSummary.pdfCount > 0 && (
              <ActionButton
                onClick={() => {
                  void offlineDbService.clearAllPdfs().then(() => {
                    toast.info('Cleared offline PDF binary cache.');
                  });
                }}
                label="Clear Cached PDFs"
                title="Remove cached PDF files from IndexedDB (keeps reading & quiz progress)"
                color="zinc"
                variant="outline"
                size="sm"
                icon={Trash2}
              />
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono tabular-nums">
            <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800">
              <span className="text-zinc-500 font-sans block">Cached Study PDFs</span>
              <span className="text-base font-bold text-zinc-950 dark:text-zinc-50">
                {offlineSummary.pdfCount} ({formatBytes(offlineSummary.pdfBytes)})
              </span>
            </div>
            <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800">
              <span className="text-zinc-500 font-sans block">Offline Study Banks</span>
              <span className="text-base font-bold text-zinc-950 dark:text-zinc-50">
                {offlineSummary.studyBankCount} stores cached
              </span>
            </div>
            <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800">
              <span className="text-zinc-500 font-sans block">Progress Mirrors</span>
              <span className="text-base font-bold text-emerald-700 dark:text-emerald-400">
                {offlineSummary.progressKeyCount} keys synced
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Danger Zone */}
      <div className="rounded-xl bg-white dark:bg-zinc-900 border border-red-200 dark:border-red-900/60 p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="font-serif font-bold text-red-950 dark:text-red-200 text-base flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
              <span>Reset Study Drafts &amp; Reactions</span>
            </h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Permanently clear your saved written drafts, rubric criteria checkmarks, and personal reaction logs from your workspace.
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
              title="Reset and clear workspace study data"
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
