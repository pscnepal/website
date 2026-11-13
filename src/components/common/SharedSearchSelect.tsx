import React, {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { Check, ChevronDown, Search, X } from 'lucide-react';

export interface SearchSelectOption {
  value: string;
  label: string;
  description?: string;
  badge?: string | number;
  disabled?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
}

export type SearchSelectSize = 'xs' | 'sm' | 'md';

export interface SharedSearchSelectProps {
  /** Selected value */
  value: string;
  /** Value change callback */
  onChange: (value: string) => void;
  /** Available options */
  options: (SearchSelectOption | { label: string; value: string })[];
  /** Placeholder when no option is selected */
  placeholder?: string;
  /** Placeholder for the search input */
  searchPlaceholder?: string;
  /** Optional field label above trigger */
  label?: string;
  /** Optional accessible aria label */
  ariaLabel?: string;
  /** Whether the select is disabled */
  disabled?: boolean;
  /** Enable search filter input (defaults to true if options count > 3) */
  enableSearch?: boolean;
  /** Whether a clear 'X' button is shown when a value is selected */
  clearable?: boolean;
  /** Value to set when cleared (defaults to 'all' or empty string) */
  clearValue?: string;
  /** Control dimensions */
  size?: SearchSelectSize;
  /** Popover horizontal alignment */
  align?: 'left' | 'right';
  /** Popover min-width (e.g. 'w-48', 'w-64', 'min-w-[200px]') */
  popoverWidth?: string;
  /** Custom wrapper class */
  className?: string;
  /** Custom trigger button class */
  triggerClassName?: string;
  /** Custom popover class */
  popoverClassName?: string;
  /** Optional HTML id */
  id?: string;
  /** Optional HTML name */
  name?: string;
}

const SIZE_STYLES: Record<
  SearchSelectSize,
  {
    trigger: string;
    text: string;
    icon: string;
    item: string;
  }
> = {
  xs: {
    trigger: 'h-6 sm:h-7 px-2 text-[11px] gap-1 rounded-md',
    text: 'text-[11px]',
    icon: 'w-3 h-3',
    item: 'px-2 py-1 text-[11px]',
  },
  sm: {
    trigger: 'h-8 sm:h-9 px-2.5 text-xs gap-1.5 rounded-lg',
    text: 'text-xs',
    icon: 'w-3.5 h-3.5',
    item: 'px-2.5 py-1.5 text-xs',
  },
  md: {
    trigger: 'h-10 px-3 text-sm gap-2 rounded-xl',
    text: 'text-sm',
    icon: 'w-4 h-4',
    item: 'px-3 py-2 text-sm',
  },
};

export function SharedSearchSelect({
  value,
  onChange,
  options,
  placeholder = 'Select option...',
  searchPlaceholder = 'Search...',
  label,
  ariaLabel,
  disabled = false,
  enableSearch,
  clearable = false,
  clearValue = '',
  size = 'sm',
  align = 'left',
  popoverWidth,
  className = '',
  triggerClassName = '',
  popoverClassName = '',
  id: propId,
  name,
}: SharedSearchSelectProps) {
  const generatedId = useId();
  const selectId = propId || generatedId;
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const [popoverPos, setPopoverPos] = useState<{
    top: number;
    left: number;
    minWidth?: number;
    ready: boolean;
  }>({ top: 0, left: 0, ready: false });

  const containerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const sizeStyle = SIZE_STYLES[size];

  // Auto determine if search box is needed
  const shouldShowSearch =
    enableSearch !== undefined ? enableSearch : options.length > 4;

  // Selected option finding
  const selectedOption = useMemo(() => {
    return options.find((opt) => opt.value === value);
  }, [options, value]);

  // Filtered options based on search query
  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) return options;
    const query = searchQuery.toLowerCase().trim();
    return options.filter((opt) => {
      const matchLabel = opt.label.toLowerCase().includes(query);
      const matchValue = opt.value.toLowerCase().includes(query);
      const matchDesc =
        'description' in opt && opt.description
          ? opt.description.toLowerCase().includes(query)
          : false;
      return matchLabel || matchValue || matchDesc;
    });
  }, [options, searchQuery]);

  const updatePopoverPosition = useCallback(() => {
    const triggerEl = containerRef.current;
    const popoverEl = popoverRef.current;
    if (!triggerEl || !popoverEl) return;

    const triggerRect = triggerEl.getBoundingClientRect();
    const popRect = popoverEl.getBoundingClientRect();
    const viewportW = window.innerWidth;
    const viewportH = window.innerHeight;
    const margin = 12;
    const gap = 4;

    const spaceBelow = viewportH - triggerRect.bottom - margin;
    const spaceAbove = triggerRect.top - margin;
    const flipTop = spaceBelow < popRect.height + gap && spaceAbove > spaceBelow;

    const top = flipTop
      ? Math.max(margin, triggerRect.top - gap - popRect.height)
      : Math.min(
          Math.max(margin, triggerRect.bottom + gap),
          Math.max(margin, viewportH - popRect.height - margin)
        );

    const effectiveWidth = Math.max(popRect.width, !popoverWidth ? triggerRect.width : 0);
    let left =
      align === 'right'
        ? triggerRect.right - effectiveWidth
        : triggerRect.left;

    left = Math.max(
      margin,
      Math.min(left, Math.max(margin, viewportW - effectiveWidth - margin))
    );

    setPopoverPos({
      top: Math.round(top),
      left: Math.round(left),
      minWidth: !popoverWidth ? Math.round(triggerRect.width) : undefined,
      ready: true,
    });
  }, [align, popoverWidth]);

  useLayoutEffect(() => {
    if (!isOpen) {
      setPopoverPos((prev) => (prev.ready ? { ...prev, ready: false } : prev));
      return;
    }
    updatePopoverPosition();
  }, [isOpen, filteredOptions.length, updatePopoverPosition]);

  // Focus search input when popover opens
  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setHighlightedIndex(-1);
      if (shouldShowSearch) {
        const timer = setTimeout(() => {
          searchInputRef.current?.focus();
        }, 30);
        return () => clearTimeout(timer);
      }
    }
  }, [isOpen, shouldShowSearch]);

  // Close on outside click or Escape & reposition on scroll/resize
  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (
        !containerRef.current?.contains(target) &&
        !popoverRef.current?.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', updatePopoverPosition);
    window.addEventListener('scroll', updatePopoverPosition, true);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', updatePopoverPosition);
      window.removeEventListener('scroll', updatePopoverPosition, true);
    };
  }, [isOpen, updatePopoverPosition]);

  // Keyboard navigation inside dropdown
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => {
        const next = prev < filteredOptions.length - 1 ? prev + 1 : 0;
        return next;
      });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => {
        const next = prev > 0 ? prev - 1 : filteredOptions.length - 1;
        return next;
      });
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (
        highlightedIndex >= 0 &&
        highlightedIndex < filteredOptions.length
      ) {
        const opt = filteredOptions[highlightedIndex];
        if (!('disabled' in opt && opt.disabled)) {
          onChange(opt.value);
          setIsOpen(false);
        }
      }
    } else if (e.key === 'Tab') {
      setIsOpen(false);
    }
  };

  const handleSelect = (optValue: string, isOptDisabled?: boolean) => {
    if (isOptDisabled) return;
    onChange(optValue);
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(clearValue);
    setIsOpen(false);
  };

  return (
    <div
      ref={containerRef}
      className={`relative inline-block text-left ${className}`}
      onKeyDown={handleKeyDown}
    >
      {/* Optional Top Label */}
      {label && (
        <label
          htmlFor={selectId}
          className="block text-[11px] font-medium text-zinc-600 dark:text-zinc-400 mb-1"
        >
          {label}
        </label>
      )}

      {/* Trigger Button */}
      <button
        id={selectId}
        name={name}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ariaLabel || label || placeholder}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        className={`w-full flex items-center justify-between border transition-all text-left select-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed bg-zinc-50 dark:bg-zinc-950 hover:bg-zinc-100 dark:hover:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-600/50 dark:focus:ring-blue-500/50 ${
          isOpen
            ? 'ring-2 ring-blue-600/40 border-blue-500 dark:border-blue-500'
            : ''
        } ${sizeStyle.trigger} ${triggerClassName}`}
      >
        <span className="flex items-center gap-1.5 truncate flex-1 min-w-0">
          {selectedOption ? (
            <>
              {'icon' in selectedOption && selectedOption.icon && (
                <selectedOption.icon className={`${sizeStyle.icon} shrink-0 text-zinc-500`} />
              )}
              <span className={`truncate font-medium text-zinc-900 dark:text-zinc-100 ${sizeStyle.text}`}>
                {selectedOption.label}
              </span>
            </>
          ) : (
            <span className={`truncate text-zinc-400 dark:text-zinc-500 ${sizeStyle.text}`}>
              {placeholder}
            </span>
          )}
        </span>

        <span className="flex items-center gap-1 shrink-0 ml-1 text-zinc-400 dark:text-zinc-500">
          {clearable && value && value !== clearValue && !disabled && (
            <span
              role="button"
              tabIndex={0}
              aria-label="Clear selection"
              onClick={handleClear}
              className="p-0.5 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
            >
              <X className="w-3 h-3" />
            </span>
          )}
          <ChevronDown
            className={`${sizeStyle.icon} transition-transform duration-150 ${
              isOpen ? 'rotate-180 text-blue-600 dark:text-blue-400' : ''
            }`}
          />
        </span>
      </button>

      {/* Portal Popover Dropdown */}
      {isOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            ref={popoverRef}
            role="listbox"
            tabIndex={-1}
            style={{
              position: 'fixed',
              top: popoverPos.top,
              left: popoverPos.left,
              minWidth: popoverPos.minWidth,
              visibility: popoverPos.ready ? 'visible' : 'hidden',
            }}
            className={`z-[9999] min-w-[200px] ${
              popoverWidth || ''
            } rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl py-1 focus:outline-none ${popoverClassName}`}
            onClick={(e) => e.stopPropagation()}
          >
          {/* Search Filter Header */}
          {shouldShowSearch && (
            <div className="p-1.5 border-b border-zinc-100 dark:border-zinc-800">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setHighlightedIndex(0);
                  }}
                  placeholder={searchPlaceholder}
                  className="w-full h-7 pl-7 pr-7 rounded-md bg-zinc-100/80 dark:bg-zinc-800/80 border border-transparent focus:border-zinc-300 dark:focus:border-zinc-700 text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:bg-white dark:focus:bg-zinc-950 transition-colors"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear filter query"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Options List */}
          <div
            ref={listRef}
            className="max-h-56 overflow-y-auto scrollbar-thin py-0.5 space-y-0.5"
          >
            {filteredOptions.length === 0 ? (
              <div className="py-4 text-center text-xs text-zinc-400 dark:text-zinc-500">
                No matching options
              </div>
            ) : (
              filteredOptions.map((opt, idx) => {
                const isSelected = opt.value === value;
                const isHighlighted = idx === highlightedIndex;
                const isOptDisabled = 'disabled' in opt && opt.disabled;
                const OptionIcon = 'icon' in opt ? opt.icon : undefined;

                return (
                  <div
                    key={opt.value}
                    role="option"
                    aria-selected={isSelected}
                    aria-disabled={isOptDisabled}
                    onClick={() => handleSelect(opt.value, isOptDisabled)}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                    className={`flex items-center justify-between gap-2 mx-1 rounded-lg cursor-pointer transition-colors select-none ${
                      sizeStyle.item
                    } ${
                      isOptDisabled
                        ? 'opacity-40 cursor-not-allowed pointer-events-none'
                        : isSelected
                        ? 'bg-blue-50 dark:bg-blue-950/70 text-blue-900 dark:text-blue-100 font-semibold'
                        : isHighlighted
                        ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-950 dark:text-zinc-50'
                        : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate flex-1 min-w-0">
                      {OptionIcon && (
                        <OptionIcon
                          className={`${sizeStyle.icon} shrink-0 ${
                            isSelected
                              ? 'text-blue-600 dark:text-blue-400'
                              : 'text-zinc-400'
                          }`}
                        />
                      )}
                      <div className="truncate">
                        <span className="block truncate">{opt.label}</span>
                        {'description' in opt && opt.description && (
                          <span className="block text-[10px] text-zinc-400 font-normal truncate mt-0.5">
                            {opt.description}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 ml-1">
                      {'badge' in opt && opt.badge && (
                        <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                          {opt.badge}
                        </span>
                      )}
                      {isSelected && (
                        <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
