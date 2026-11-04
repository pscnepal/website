import { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  recordPageTurnStats,
  recordReadingTick,
} from '../features/library/librarySlice';

const IDLE_THRESHOLD_MS = 180_000; // Pause timer if no interaction for 3 minutes

interface UseReadingStatsParams {
  bookId: string | null;
  isActiveDocument: boolean;
  currentPage: number;
}

export function useReadingStats({
  bookId,
  isActiveDocument,
  currentPage,
}: UseReadingStatsParams) {
  const dispatch = useAppDispatch();
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const lastActivityRef = useRef<number>(Date.now());
  const prevPageRef = useRef<{ bookId: string | null; page: number }>({
    bookId: null,
    page: currentPage,
  });

  const bookStats = useAppSelector((state) =>
    bookId ? state.library.readingStats[bookId] : undefined
  );

  // Reset local session timer when switching books
  useEffect(() => {
    setSessionSeconds(0);
    lastActivityRef.current = Date.now();
    prevPageRef.current = { bookId, page: currentPage };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookId]);

  // Track user activity to avoid counting abandoned background tabs
  useEffect(() => {
    if (!isActiveDocument || !bookId) return;

    const markActive = () => {
      lastActivityRef.current = Date.now();
    };

    window.addEventListener('pointerdown', markActive, { passive: true });
    window.addEventListener('pointermove', markActive, { passive: true });
    window.addEventListener('keydown', markActive, { passive: true });
    window.addEventListener('wheel', markActive, { passive: true });
    window.addEventListener('touchstart', markActive, { passive: true });

    return () => {
      window.removeEventListener('pointerdown', markActive);
      window.removeEventListener('pointermove', markActive);
      window.removeEventListener('keydown', markActive);
      window.removeEventListener('wheel', markActive);
      window.removeEventListener('touchstart', markActive);
    };
  }, [isActiveDocument, bookId]);

  // 1-second active reading clock
  useEffect(() => {
    if (!isActiveDocument || !bookId) return;

    const intervalId = window.setInterval(() => {
      if (document.visibilityState !== 'visible') return;
      if (Date.now() - lastActivityRef.current > IDLE_THRESHOLD_MS) return;

      setSessionSeconds((s) => s + 1);
      dispatch(recordReadingTick({ bookId, elapsedSeconds: 1 }));
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isActiveDocument, bookId, dispatch]);

  // Track page transitions for pages-per-minute calculation
  useEffect(() => {
    if (!isActiveDocument || !bookId) return;

    const prev = prevPageRef.current;
    if (prev.bookId === bookId && prev.page !== currentPage) {
      lastActivityRef.current = Date.now();
      dispatch(
        recordPageTurnStats({
          bookId,
          fromPage: prev.page,
          toPage: currentPage,
        })
      );
    }
    prevPageRef.current = { bookId, page: currentPage };
  }, [isActiveDocument, bookId, currentPage, dispatch]);

  return {
    bookStats,
    sessionSeconds,
    resetSessionTimer: () => setSessionSeconds(0),
  };
}
