import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { updateReadingProgress } from '../features/library/librarySlice';

export function useReadingProgress(bookId: string | null): void {
  const dispatch = useAppDispatch();
  const currentPage = useAppSelector((state) => state.reader.currentPage);
  const totalPages = useAppSelector((state) => state.reader.totalPages);

  useEffect(() => {
    if (!bookId || totalPages <= 0) return;
    dispatch(
      updateReadingProgress({
        bookId,
        page: currentPage,
        totalPages,
      })
    );
  }, [bookId, currentPage, totalPages, dispatch]);
}
