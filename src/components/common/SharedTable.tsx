import React, { useMemo, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { ActionButton } from './ActionButton';
import { SharedSearchSelect } from './SharedSearchSelect';

export interface ColumnDef<T> {
  /** Unique key for the column */
  id: string;
  /** Header title or component */
  header: React.ReactNode;
  /** Property on item to display directly if no custom render is given */
  accessorKey?: keyof T;
  /** Custom render function */
  render?: (item: T, index: number) => React.ReactNode;
  /** Alignment of column text */
  align?: 'left' | 'center' | 'right';
  /** Width class or inline width */
  width?: string;
  /** Additional classes applied to td cells */
  className?: string;
  /** Additional classes applied to th header */
  headerClassName?: string;
  /** If true, column is hidden on mobile screens (< 768px) */
  hideOnMobile?: boolean;
  /** If true, column is hidden on tablets (< 1024px) */
  hideOnTablet?: boolean;
  /** Whether the column can be sorted */
  sortable?: boolean;
  /** Optional custom sorting accessor function */
  sortKey?: (item: T) => string | number | boolean;
}

export interface SharedTableProps<T> {
  /** Array of row items */
  data: T[];
  /** Column definitions */
  columns: ColumnDef<T>[];
  /** Unique key extractor for each row */
  keyExtractor: (item: T, index: number) => string | number;
  /** Message displayed when data is empty */
  emptyMessage?: string;
  /** Sub-description displayed when empty */
  emptyDescription?: string;
  /** Action button or element rendered in empty state */
  emptyAction?: React.ReactNode;
  /** Accessible table caption */
  caption?: string;
  /** Table wrapper class name */
  className?: string;
  /** Whether rows should alternate background colors */
  striped?: boolean;
  /** Optional row click handler */
  onRowClick?: (item: T) => void;
  /** Highlight on hover */
  hoverable?: boolean;
  /** Enable built-in pagination (defaults to true if data length > defaultPageSize) */
  pagination?: boolean;
  /** Initial rows per page (default: 15) */
  defaultPageSize?: number;
  /** Available page size choices */
  pageSizeOptions?: number[];
  /** Optional row selection support */
  selectable?: boolean;
  /** Set of selected keys */
  selectedKeys?: Set<string | number>;
  /** Callback when selected rows change */
  onSelectionChange?: (selected: Set<string | number>) => void;
}

export function SharedTable<T>({
  data,
  columns,
  keyExtractor,
  emptyMessage = 'No records found',
  emptyDescription = 'Try adjusting your filters or search keywords.',
  emptyAction,
  caption,
  className = '',
  striped = false,
  onRowClick,
  hoverable = true,
  pagination = false,
  defaultPageSize = 15,
  pageSizeOptions = [10, 15, 25, 50],
  selectable = false,
  selectedKeys,
  onSelectionChange,
}: SharedTableProps<T>) {
  // Sorting state
  const [sortColId, setSortColId] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc' | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  // Handle column header sort toggle
  const handleSort = (col: ColumnDef<T>) => {
    if (!col.sortable) return;
    if (sortColId !== col.id) {
      setSortColId(col.id);
      setSortDir('asc');
    } else if (sortDir === 'asc') {
      setSortDir('desc');
    } else {
      setSortColId(null);
      setSortDir(null);
    }
    setCurrentPage(0);
  };

  // Sort data if sort column is active
  const sortedData = useMemo(() => {
    if (!sortColId || !sortDir) return data;
    const targetCol = columns.find((c) => c.id === sortColId);
    if (!targetCol) return data;

    return [...data].sort((a, b) => {
      let valA: any;
      let valB: any;

      if (targetCol.sortKey) {
        valA = targetCol.sortKey(a);
        valB = targetCol.sortKey(b);
      } else if (targetCol.accessorKey) {
        valA = a[targetCol.accessorKey];
        valB = b[targetCol.accessorKey];
      } else {
        return 0;
      }

      if (valA == null) return sortDir === 'asc' ? -1 : 1;
      if (valB == null) return sortDir === 'asc' ? 1 : -1;

      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortDir === 'asc' ? valA - valB : valB - valA;
      }

      const strA = String(valA).toLowerCase();
      const strB = String(valB).toLowerCase();
      return sortDir === 'asc'
        ? strA.localeCompare(strB)
        : strB.localeCompare(strA);
    });
  }, [data, sortColId, sortDir, columns]);

  // Paginated data slice
  const totalPages = pagination ? Math.max(1, Math.ceil(sortedData.length / pageSize)) : 1;
  const safePage = Math.min(currentPage, totalPages - 1);

  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;
    const start = safePage * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, pagination, safePage, pageSize]);

  // Handle select all toggle
  const allCurrentKeys = useMemo(
    () => paginatedData.map((item, idx) => keyExtractor(item, idx)),
    [paginatedData, keyExtractor]
  );

  const isAllCurrentSelected =
    selectable &&
    selectedKeys &&
    allCurrentKeys.length > 0 &&
    allCurrentKeys.every((k) => selectedKeys.has(k));

  const handleToggleSelectAll = () => {
    if (!selectable || !onSelectionChange || !selectedKeys) return;
    const next = new Set(selectedKeys);
    if (isAllCurrentSelected) {
      allCurrentKeys.forEach((k) => next.delete(k));
    } else {
      allCurrentKeys.forEach((k) => next.add(k));
    }
    onSelectionChange(next);
  };

  const handleToggleRow = (key: string | number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectable || !onSelectionChange || !selectedKeys) return;
    const next = new Set(selectedKeys);
    if (next.has(key)) {
      next.delete(key);
    } else {
      next.add(key);
    }
    onSelectionChange(next);
  };

  if (data.length === 0) {
    return (
      <div
        className={`py-12 px-4 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl space-y-2 bg-white dark:bg-zinc-900 ${className}`}
      >
        <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
          {emptyMessage}
        </p>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          {emptyDescription}
        </p>
        {emptyAction && <div className="pt-2">{emptyAction}</div>}
      </div>
    );
  }

  const startIdx = safePage * pageSize;
  const endIdx = Math.min(startIdx + pageSize, sortedData.length);

  return (
    <div
      className={`rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-xs flex flex-col ${className}`}
    >
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-left border-collapse text-xs">
          {caption && <caption className="sr-only">{caption}</caption>}

          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-500 dark:text-zinc-400 font-mono">
              {selectable && (
                <th scope="col" className="w-10 py-3 px-3 text-center">
                  <input
                    type="checkbox"
                    checked={Boolean(isAllCurrentSelected)}
                    onChange={handleToggleSelectAll}
                    aria-label="Select all rows on current page"
                    className="w-3.5 h-3.5 rounded border-zinc-300 dark:border-zinc-700 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </th>
              )}

              {columns.map((col) => {
                const alignClass =
                  col.align === 'center'
                    ? 'text-center'
                    : col.align === 'right'
                      ? 'text-right'
                      : 'text-left';

                const responsiveClass = col.hideOnMobile
                  ? 'hidden md:table-cell'
                  : col.hideOnTablet
                    ? 'hidden lg:table-cell'
                    : '';

                const isCurrentSort = sortColId === col.id;

                return (
                  <th
                    key={col.id}
                    scope="col"
                    onClick={() => handleSort(col)}
                    className={`py-3 px-3.5 sm:px-4 font-semibold text-zinc-600 dark:text-zinc-400 ${alignClass} ${
                      col.width || ''
                    } ${responsiveClass} ${col.sortable ? 'cursor-pointer select-none hover:text-zinc-900 dark:hover:text-zinc-100' : ''} ${
                      col.headerClassName || ''
                    }`}
                  >
                    <div
                      className={`inline-flex items-center gap-1.5 ${
                        col.align === 'center'
                          ? 'justify-center'
                          : col.align === 'right'
                            ? 'justify-end'
                            : 'justify-start'
                      }`}
                    >
                      <span>{col.header}</span>
                      {col.sortable && (
                        <span className="shrink-0 text-zinc-400">
                          {isCurrentSort ? (
                            sortDir === 'asc' ? (
                              <ArrowUp className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                            ) : (
                              <ArrowDown className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                            )
                          ) : (
                            <ArrowUpDown className="w-2.5 h-2.5 opacity-50" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
            {paginatedData.map((item, index) => {
              const rowKey = keyExtractor(item, index);
              const isEven = index % 2 === 0;
              const isSelected = selectable && selectedKeys?.has(rowKey);

              return (
                <tr
                  key={rowKey}
                  onClick={() => onRowClick?.(item)}
                  className={`transition-colors ${
                    isSelected
                      ? 'bg-blue-50/60 dark:bg-blue-950/30'
                      : striped && !isEven
                        ? 'bg-zinc-50/50 dark:bg-zinc-950/40'
                        : ''
                  } ${
                    hoverable
                      ? 'hover:bg-zinc-50/80 dark:hover:bg-zinc-800/60'
                      : ''
                  } ${onRowClick ? 'cursor-pointer' : ''}`}
                >
                  {selectable && (
                    <td className="w-10 py-3.5 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={Boolean(isSelected)}
                        onClick={(e) => handleToggleRow(rowKey, e)}
                        onChange={() => {}}
                        aria-label={`Select row ${rowKey}`}
                        className="w-3.5 h-3.5 rounded border-zinc-300 dark:border-zinc-700 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                    </td>
                  )}

                  {columns.map((col) => {
                    const alignClass =
                      col.align === 'center'
                        ? 'text-center'
                        : col.align === 'right'
                          ? 'text-right'
                          : 'text-left';

                    const responsiveClass = col.hideOnMobile
                      ? 'hidden md:table-cell'
                      : col.hideOnTablet
                        ? 'hidden lg:table-cell'
                        : '';

                    let cellContent: React.ReactNode = null;
                    if (col.render) {
                      cellContent = col.render(item, index);
                    } else if (col.accessorKey) {
                      cellContent = String(item[col.accessorKey] ?? '');
                    }

                    return (
                      <td
                        key={col.id}
                        className={`py-3.5 px-3.5 sm:px-4 ${alignClass} ${responsiveClass} ${
                          col.className || ''
                        }`}
                      >
                        {cellContent}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer Controls */}
      {pagination && sortedData.length > 0 && (
        <div className="border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-950/80 px-4 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-zinc-600 dark:text-zinc-400 font-mono">
          <div className="flex items-center gap-3">
            <span>
              Showing <strong className="font-semibold text-zinc-900 dark:text-zinc-100">{startIdx + 1}</strong> to{' '}
              <strong className="font-semibold text-zinc-900 dark:text-zinc-100">{endIdx}</strong> of{' '}
              <strong className="font-semibold text-zinc-900 dark:text-zinc-100">{sortedData.length}</strong> records
            </span>

            {pageSizeOptions.length > 1 && (
              <div className="flex items-center gap-1.5 font-sans">
                <span className="text-[11px] text-zinc-400">Rows:</span>
                <SharedSearchSelect
                  value={String(pageSize)}
                  onChange={(val) => {
                    setPageSize(Number(val));
                    setCurrentPage(0);
                  }}
                  options={pageSizeOptions.map((opt) => ({
                    label: `${opt} / page`,
                    value: String(opt),
                  }))}
                  enableSearch={false}
                  size="xs"
                  popoverWidth="w-28"
                  align="right"
                  ariaLabel="Select number of rows per page"
                />
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5 self-end sm:self-auto">
            <span className="text-xs mr-1 text-zinc-500">
              Page {safePage + 1} of {totalPages}
            </span>

            <ActionButton
              title="Previous page"
              icon={ChevronLeft}
              color="zinc"
              variant="outline"
              size="xs"
              disabled={safePage <= 0}
              onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
            />

            <ActionButton
              title="Next page"
              icon={ChevronRight}
              color="zinc"
              variant="outline"
              size="xs"
              disabled={safePage >= totalPages - 1}
              onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
            />
          </div>
        </div>
      )}
    </div>
  );
}
