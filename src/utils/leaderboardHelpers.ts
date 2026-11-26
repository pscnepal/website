import type {
  BookReadingStats,
  LeaderboardCategory,
  LeaderboardEntry,
  PscCadreId,
  QuizAttemptRecord,
  ReadingProgressEntry,
  RecentBookEntry,
  SimulationRunRecord,
  WrittenEvaluationRecord,
  WrittenQuestionProgress,
} from '../types';

export interface LeaderboardSourceSnapshot {
  userId: string;
  displayName: string;
  photoURL?: string;
  targetCadre: PscCadreId;
  isPublic?: boolean;
  recentBooks: RecentBookEntry[];
  readingProgress: Record<string, ReadingProgressEntry>;
  readingStats: Record<string, BookReadingStats>;
  writtenRecords: Record<string, WrittenQuestionProgress>;
  writtenEvaluations: WrittenEvaluationRecord[];
  quizAttempts: QuizAttemptRecord[];
  simulationHistory: SimulationRunRecord[];
}

export function countWrittenWords(text: string): number {
  const cleaned = text.trim();
  if (!cleaned) return 0;
  return cleaned.split(/\s+/).filter(Boolean).length;
}

export function computeLeaderboardCompositeScore(metrics: {
  booksReadCount: number;
  totalPagesRead: number;
  readingMinutes: number;
  writtenPracticedCount: number;
  writtenMasteredCount: number;
  writtenEvaluationsCount: number;
  writtenWordsCount: number;
  quizAttemptsCount: number;
  omrSimulationsCount: number;
  quizQuestionsSolved: number;
  quizTotalNetScore: number;
}): number {
  const readingScore =
    metrics.readingMinutes * 2 +
    metrics.totalPagesRead * 1 +
    metrics.booksReadCount * 10;

  const writtenScore =
    metrics.writtenPracticedCount * 20 +
    metrics.writtenMasteredCount * 30 +
    metrics.writtenEvaluationsCount * 25 +
    Math.floor(metrics.writtenWordsCount / 50);

  const quizScore =
    metrics.quizAttemptsCount * 15 +
    metrics.omrSimulationsCount * 30 +
    metrics.quizQuestionsSolved * 1 +
    Math.max(0, Math.round(metrics.quizTotalNetScore * 2));

  const rawTotal = readingScore + writtenScore + quizScore;
  return Math.min(10_000_000, Math.max(0, Math.round(rawTotal)));
}

export function buildLeaderboardStatsPayload(
  source: LeaderboardSourceSnapshot
): Omit<LeaderboardEntry, 'createdAt' | 'updatedAt'> {
  // 1. Reading Stats (PDF library progress & reading timer)
  const bookIds = new Set<string>([
    ...source.recentBooks.map((b) => b.id).filter(Boolean),
    ...Object.keys(source.readingProgress),
    ...Object.keys(source.readingStats),
  ]);

  let totalReadingSeconds = 0;
  let totalPagesRead = 0;
  const accountedBookIds = new Set<string>();

  for (const [bookId, st] of Object.entries(source.readingStats)) {
    accountedBookIds.add(bookId);
    totalReadingSeconds += Math.max(0, Number(st.totalReadingSeconds) || 0);
    const pagesTurned = Math.max(0, Math.round(Number(st.pagesReadCount) || 0));
    const uniquePages = Array.isArray(st.uniquePagesVisited)
      ? st.uniquePagesVisited.length
      : 0;
    totalPagesRead += Math.max(pagesTurned, uniquePages);
  }

  for (const [bookId, prog] of Object.entries(source.readingProgress)) {
    if (accountedBookIds.has(bookId)) continue;
    const lastPage = Math.max(0, Math.round(Number(prog.lastPage) || 0));
    if (lastPage > 0) {
      totalPagesRead += lastPage;
    }
  }

  const booksReadCount = Math.min(1000, Math.max(0, bookIds.size));
  const clampedPagesRead = Math.min(500_000, Math.max(0, Math.round(totalPagesRead)));
  const readingMinutes = Math.min(
    500_000,
    Math.max(0, Math.round(totalReadingSeconds / 60))
  );

  // 2. Written Study Stats (drafts practiced, mastered & evaluator scorecards)
  let writtenPracticedCount = 0;
  let writtenMasteredCount = 0;
  let writtenDraftWords = 0;

  for (const rec of Object.values(source.writtenRecords)) {
    if (!rec) continue;
    const draftWords = countWrittenWords(rec.draftAnswer || '');
    const isTouched =
      rec.status !== 'unseen' ||
      draftWords > 0 ||
      (Array.isArray(rec.checkedRubricIndices) &&
        rec.checkedRubricIndices.length > 0) ||
      (Number(rec.timeSpentSeconds) || 0) > 0;

    if (isTouched) {
      writtenPracticedCount += 1;
    }
    if (rec.status === 'mastered') {
      writtenMasteredCount += 1;
    }
    writtenDraftWords += draftWords;
  }

  let evaluationWords = 0;
  for (const ev of source.writtenEvaluations) {
    const wc = Math.max(
      0,
      Math.round(Number(ev.wordCount) || countWrittenWords(ev.userDraft || ''))
    );
    evaluationWords += wc;
  }

  const clampedWrittenPracticed = Math.min(1000, writtenPracticedCount);
  const clampedWrittenMastered = Math.min(1000, writtenMasteredCount);
  const writtenEvaluationsCount = Math.min(500, source.writtenEvaluations.length);
  const writtenWordsCount = Math.min(
    5_000_000,
    Math.max(0, writtenDraftWords + evaluationWords)
  );

  // 3. Quiz & Exam Hall Simulation Stats
  const quizAttemptsCount = Math.min(1000, source.quizAttempts.length);
  const omrSimulationsCount = Math.min(1000, source.simulationHistory.length);

  let questionsSolved = 0;
  let totalNetScore = 0;
  let accuracySum = 0;
  let accuracySamples = 0;

  for (const att of source.quizAttempts) {
    questionsSolved += Math.max(
      0,
      (Number(att.correctCount) || 0) + (Number(att.wrongCount) || 0)
    );
    totalNetScore += Number(att.pscNetScore) || 0;
    accuracySum += Math.min(100, Math.max(0, Number(att.accuracyPercent) || 0));
    accuracySamples += 1;
  }

  for (const sim of source.simulationHistory) {
    questionsSolved += Math.max(0, Number(sim.attemptedItems) || 0);
    totalNetScore += Number(sim.netMarks) || 0;
    accuracySum += Math.min(100, Math.max(0, Number(sim.percentage) || 0));
    accuracySamples += 1;
  }

  const clampedQuestionsSolved = Math.min(
    100_000,
    Math.max(0, Math.round(questionsSolved))
  );
  const quizAvgAccuracy =
    accuracySamples > 0
      ? Math.min(
          100,
          Math.max(0, Math.round((accuracySum / accuracySamples) * 10) / 10)
        )
      : 0;
  const quizTotalNetScore = Math.min(
    50_000,
    Math.max(-5000, Math.round(totalNetScore * 100) / 100)
  );

  const safeName = (source.displayName || 'PSC Aspirant').trim().slice(0, 120) || 'PSC Aspirant';
  const safePhoto = source.photoURL?.trim().slice(0, 512);
  const safeCadre: PscCadreId =
    source.targetCadre === 'nayab-subba' ||
    source.targetCadre === 'kharidar' ||
    source.targetCadre === 'ntc-computer-engineer-7'
      ? source.targetCadre
      : 'section-officer';

  const totalScore = computeLeaderboardCompositeScore({
    booksReadCount,
    totalPagesRead: clampedPagesRead,
    readingMinutes,
    writtenPracticedCount: clampedWrittenPracticed,
    writtenMasteredCount: clampedWrittenMastered,
    writtenEvaluationsCount,
    writtenWordsCount,
    quizAttemptsCount,
    omrSimulationsCount,
    quizQuestionsSolved: clampedQuestionsSolved,
    quizTotalNetScore,
  });

  return {
    userId: source.userId,
    displayName: safeName,
    ...(safePhoto ? { photoURL: safePhoto } : {}),
    targetCadre: safeCadre,
    isPublic: source.isPublic !== false,
    booksReadCount,
    totalPagesRead: clampedPagesRead,
    readingMinutes,
    writtenPracticedCount: clampedWrittenPracticed,
    writtenMasteredCount: clampedWrittenMastered,
    writtenEvaluationsCount,
    writtenWordsCount,
    quizAttemptsCount,
    omrSimulationsCount,
    quizQuestionsSolved: clampedQuestionsSolved,
    quizAvgAccuracy,
    quizTotalNetScore,
    totalScore,
  };
}

export function computeWrittenCategoryScore(entry: LeaderboardEntry): number {
  return (
    entry.writtenMasteredCount * 30 +
    entry.writtenPracticedCount * 20 +
    entry.writtenEvaluationsCount * 25 +
    Math.floor(entry.writtenWordsCount / 50)
  );
}

export function computeReadingCategoryScore(entry: LeaderboardEntry): number {
  return (
    entry.readingMinutes * 2 +
    entry.totalPagesRead +
    entry.booksReadCount * 10
  );
}

export function computeQuizCategoryScore(entry: LeaderboardEntry): number {
  return (
    entry.quizAttemptsCount * 15 +
    entry.omrSimulationsCount * 30 +
    entry.quizQuestionsSolved +
    Math.max(0, Math.round(entry.quizTotalNetScore * 2))
  );
}

export function sortLeaderboardEntries(
  entries: LeaderboardEntry[],
  category: LeaderboardCategory
): LeaderboardEntry[] {
  return [...entries].sort((a, b) => {
    if (category === 'reading') {
      const diff =
        computeReadingCategoryScore(b) - computeReadingCategoryScore(a);
      if (diff !== 0) return diff;
      if (b.totalPagesRead !== a.totalPagesRead) {
        return b.totalPagesRead - a.totalPagesRead;
      }
      if (b.readingMinutes !== a.readingMinutes) {
        return b.readingMinutes - a.readingMinutes;
      }
      return b.totalScore - a.totalScore;
    }

    if (category === 'written') {
      const diff =
        computeWrittenCategoryScore(b) - computeWrittenCategoryScore(a);
      if (diff !== 0) return diff;
      if (b.writtenWordsCount !== a.writtenWordsCount) {
        return b.writtenWordsCount - a.writtenWordsCount;
      }
      if (b.writtenMasteredCount !== a.writtenMasteredCount) {
        return b.writtenMasteredCount - a.writtenMasteredCount;
      }
      return b.totalScore - a.totalScore;
    }

    if (category === 'quiz') {
      const diff = computeQuizCategoryScore(b) - computeQuizCategoryScore(a);
      if (diff !== 0) return diff;
      if (b.quizQuestionsSolved !== a.quizQuestionsSolved) {
        return b.quizQuestionsSolved - a.quizQuestionsSolved;
      }
      if (b.quizAvgAccuracy !== a.quizAvgAccuracy) {
        return b.quizAvgAccuracy - a.quizAvgAccuracy;
      }
      return b.totalScore - a.totalScore;
    }

    if (b.totalScore !== a.totalScore) {
      return b.totalScore - a.totalScore;
    }
    if (b.quizQuestionsSolved !== a.quizQuestionsSolved) {
      return b.quizQuestionsSolved - a.quizQuestionsSolved;
    }
    if (b.totalPagesRead !== a.totalPagesRead) {
      return b.totalPagesRead - a.totalPagesRead;
    }
    return b.writtenWordsCount - a.writtenWordsCount;
  });
}

export function formatReadingDurationShort(minutes: number): string {
  const mins = Math.max(0, Math.round(minutes));
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  const rem = mins % 60;
  return rem > 0 ? `${hrs}h ${rem}m` : `${hrs}h`;
}
