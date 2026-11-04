import { useEffect, useState, type FormEvent } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { Tooltip } from '../ui/Tooltip';

interface PageNavigationProps {
  currentPage: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
  onJumpToPage: (page: number) => void;
}

export function PageNavigation({
  currentPage,
  totalPages,
  onPrev,
  onNext,
  onJumpToPage,
}: PageNavigationProps) {
  const [inputValue, setInputValue] = useState(String(currentPage));
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!isEditing) {
      setInputValue(String(currentPage));
    }
  }, [currentPage, isEditing]);

  const commitPageInput = () => {
    setIsEditing(false);
    const parsed = Number.parseInt(inputValue, 10);
    if (Number.isNaN(parsed) || totalPages <= 0) {
      setInputValue(String(currentPage));
      return;
    }
    const clamped = Math.max(1, Math.min(totalPages, parsed));
    setInputValue(String(clamped));
    if (clamped !== currentPage) {
      onJumpToPage(clamped);
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    commitPageInput();
  };

  return (
    <div className="flex items-center gap-1">
      <Tooltip content="Previous page" shortcut="←">
        <Button
          variant="icon"
          size="sm"
          onClick={onPrev}
          disabled={currentPage <= 1 || totalPages <= 0}
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
      </Tooltip>

      <form onSubmit={handleSubmit} className="flex items-center gap-1.5 px-1">
        <label htmlFor="reader-page-input" className="sr-only">
          Current page number
        </label>
        <input
          id="reader-page-input"
          type="text"
          inputMode="numeric"
          value={inputValue}
          onFocus={(e) => {
            setIsEditing(true);
            e.target.select();
          }}
          onBlur={commitPageInput}
          onChange={(e) => setInputValue(e.target.value.replace(/[^\d]/g, ''))}
          disabled={totalPages <= 0}
          className="w-11 h-8 text-center rounded-md bg-zinc-100 dark:bg-zinc-800/90 border border-transparent focus:border-zinc-400 dark:focus:border-zinc-600 focus:bg-white dark:focus:bg-zinc-900 font-mono tabular-nums text-xs font-medium text-zinc-900 dark:text-zinc-100 focus:outline-none transition-colors"
        />
        <span className="text-xs font-mono tabular-nums text-zinc-500 dark:text-zinc-400 whitespace-nowrap select-none">
          / {totalPages || '—'}
        </span>
      </form>

      <Tooltip content="Next page" shortcut="→">
        <Button
          variant="icon"
          size="sm"
          onClick={onNext}
          disabled={currentPage >= totalPages || totalPages <= 0}
          aria-label="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </Tooltip>
    </div>
  );
}
