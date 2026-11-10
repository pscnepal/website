import React, { useMemo, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Download,
  RotateCcw,
  Search,
  X,
} from 'lucide-react';
import { ActionButton } from './ActionButton';

export interface ColumnDef<T> {
  id: string;
  header: React.ReactNode;
  accessorKey?: keyof T;
  render?: (item: T, index: number) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
  width?: string;
  className?: string;
  headerClassName?: string;
  hideOnMobile?: boolean;
  hideOnTablet?: boolean;
  sortable?: boolean;
  sortKey?: (item: T) => string | number | boolean | null | undefined;
}

export interface TableFilterOption {
  label: string;
  value: string;
}

export interface TableFilterDef {
  id: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: TableFilterOption[];
  ariaLabel?: string;
  width?: string;
}

export interface SharedDataTableProps<T> {
  /** Array of data records */
  data: T[];
  /** Column definitions */
  columns: ColumnDef<T>[];
  /** Unique key extractor */
  keyExtractor: (item: T, index: number) => string | number;
  /** Optional table title */
  title?: string;
  /** Optional description */
  subtitle?: string;
  /** Total count before filters (for displaying "Showing X of Y") */
  totalCount?: number;
  /** Search state & handler */
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  searchPlaceholder?: string;
  /** Filter definitions rendered in toolbar */
  filters?: TableFilterDef[];
  /** Custom extra filter buttons/controls */
  customFilters?: React.ReactNode;
  /** Function to reset all filters */
  onResetFilters?: () => void;
  /** Whether filters are currently non-default */
  isFiltered?: boolean;
  /** Header action buttons (e.g. Export, Add New, etc.) */
  actions?: React.ReactNode;
  /** Enable built-in CSV export button */
  enableCsvExport?: boolean;
  csvFilename?: string;
  /** Empty state message and description */
  emptyMessage?: string;
  emptyDescription?: string;
  emptyAction?: React.ReactNode;
  /** Row click handler */
  onRowClick?: (item: T) => void;
  /** Whether rows are hoverable */
  hoverable?: boolean;
  /** Alternating row striping */
  striped?: boolean;
  /** Enable pagination */
  pagination?: boolean;
  defaultPageSize?: number;
  pageSizeOptions?: number[];
  /** Row selection */
  selectable?: boolean;
  selectedKeys?: Set<string | number>;
  onSelectionChange?: (selected: Set<string | number>) => void;
  /** View mode for rendering: 'table' or 'cards' */
  viewMode?: 'table' | 'cards';
  /** Custom card renderer when viewMode is 'cards' */
  renderCard?: (item: T, index: number) => React.ReactNode;
  /** Custom grid classes for card layout */
  gridClassName?: string;
  /** Wrapper className */
  className?: string;
}

export function SharedDataTable<T>({
  data,
  columns,
  keyExtractor,
  title,
  subtitle,
  totalCount,
  searchQuery,
  onSearchChange,
  searchPlaceholder = 'Search records...',
  filters = [],
  customFilters,
  onResetFilters,
  isFiltered = false,
  actions,
  enableCsvExport = false,
  csvFilename = 'psc-records-export.csv',
  emptyMessage = 'No records found',
  emptyDescription = 'Try adjusting your search keywords or clear current filters.',
  emptyAction,
  onRowClick,
  hoverable = true,
  striped = false,
  pagination = true,
  defaultPageSize = 15,
  pageSizeOptions = [10, 15, 25, 50],
  selectable = false,
  selectedKeys,
  onSelectionChange,
  viewMode = 'table',
  renderCard,
  gridClassName = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 p-4 sm:p-5',
  className = '',
}: SharedDataTableProps<T>) {
  // Internal search state fallback if not controlled externally
  const [internalSearch, setInternalSearch] = useState('');
  const activeSearch = searchQuery !== undefined ? searchQuery : internalSearch;
  const handleSearchChange = onSearchChange || setInternalSearch;

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
  const totalPages = pagination
    ? Math.max(1, Math.ceil(sortedData.length / pageSize))
    : 1;
  const safePage = Math.min(currentPage, totalPages - 1);

  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;
    const start = Math.max(0, safePage * pageSize);
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, pagination, safePage, pageSize]);

  // Row selection handlers
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

  // CSV Export utility
  const handleExportCsv = () => {
    if (sortedData.length === 0) return;
    const exportableCols = columns.filter((c) => c.accessorKey || c.id !== 'actions');
    const headers = exportableCols.map((c) =>
      typeof c.header === 'string' ? `"${c.header.replace(/"/g, '""')}"` : `"${c.id}"`
    );

    const rows = sortedData.map((item) =>
      exportableCols
        .map((c) => {
          let val = '';
          if (c.accessorKey) {
            val = String(item[c.accessorKey] ?? '');
          } else if (c.sortKey) {
            val = String(c.sortKey(item) ?? '');
          }
          return `"${val.replace(/"/g, '""')}"`;
        })
        .join(',')
    );

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = csvFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const hasActiveFiltersOrSearch = isFiltered || Boolean(activeSearch.trim());
  const startIdx = safePage * pageSize;
  const endIdx = Math.min(startIdx + pageSize, sortedData.length);

  return (
    <div
      className={`rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs flex flex-col overflow-hidden ${className}`}
    >
      {/* 1. Header Toolbar (Title, Subtitle, Global Table Actions) */}
      {(title || subtitle || actions || enableCsvExport) && (
        <div className="p-4 sm:p-5 border-b border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-50/50 dark:bg-zinc-900/50">
          <div>
            {title && (
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-base sm:text-lg font-bold text-zinc-950 dark:text-zinc-50">
                  {title}
                </h3>
                {totalCount !== undefined && (
                  <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                    {totalCount} total
                  </span>
                )}
              </div>
            )}
            {subtitle && (
              <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                {subtitle}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            {enableCsvExport && (
              <ActionButton
                onClick={handleExportCsv}
                label="Export CSV"
                title="Download current filtered data as a CSV spreadsheet"
                color="zinc"
                variant="outline"
                size="xs"
                icon={Download}
              />
            )}
            {actions}
          </div>
        </div>
      )}

      {/* 2. Search & Filters Bar */}
      <div className="p-3 sm:p-4 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative flex-1 min-w-[220px] max-w-lg">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 pointer-events-none" />
          <input
            type="text"
            value={activeSearch}
            onChange={(e) => {
              handleSearchChange(e.target.value);
              setCurrentPage(0);
            }}
            placeholder={searchPlaceholder}
            className="w-full h-9 pl-9 pr-8 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-zinc-400 dark:focus:border-zinc-600 text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none transition-colors"
          />
          {activeSearch && (
            <button
              type="button"
              onClick={() => {
                handleSearchChange('');
                setCurrentPage(0);
              }}
              aria-label="Clear search query"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Dynamic Filters & Reset Button */}
        <div className="flex flex-wrap items-center gap-2">
          {filters.map((filter) => (
            <div key={filter.id} className="flex items-center gap-1.5 text-xs">
              {filter.label && (
                <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 hidden sm:inline">
                  {filter.label}:
                </span>
              )}
              <select
                value={filter.value}
                onChange={(e) => {
                  filter.onChange(e.target.value);
                  setCurrentPage(0);
                }}
                aria-label={filter.ariaLabel || filter.label || filter.id}
                className={`h-9 px-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-800 dark:text-zinc-200 cursor-pointer focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 ${
                  filter.width || 'max-w-[180px]'
                }`}
              >
                {filter.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          ))}

          {customFilters}

          {/* Reset Filters Button */}
          {hasActiveFiltersOrSearch && onResetFilters && (
            <button
              type="button"
              onClick={() => {
                onResetFilters();
                handleSearchChange('');
                setCurrentPage(0);
              }}
              title="Reset all search queries and filters to defaults"
              className="inline-flex items-center gap-1.5 h-9 px-2.5 rounded-lg text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-750 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* 3. Table Content or Empty State */}
      {sortedData.length === 0 ? (
        <div className="py-16 px-4 text-center space-y-2 bg-white dark:bg-zinc-900">
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            {emptyMessage}
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
            {emptyDescription}
          </p>
          {emptyAction ? (
            <div className="pt-2">{emptyAction}</div>
          ) : (
            hasActiveFiltersOrSearch &&
            onResetFilters && (
              <div className="pt-3">
                <button
                  type="button"
                  onClick={() => {
                    onResetFilters();
                    handleSearchChange('');
                    setCurrentPage(0);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset All Filters</span>
                </button>
              </div>
            )
          )}
        </div>
      ) : viewMode === 'cards' && renderCard ? (
        <div className={gridClassName}>
          {paginatedData.map((item, index) => {
            const rowKey = keyExtractor(item, safePage * pageSize + index);
            return (
              <React.Fragment key={rowKey}>
                {renderCard(item, safePage * pageSize + index)}
              </React.Fragment>
            );
          })}
        </div>
      ) : (
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-left border-collapse text-xs">
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
                      } ${responsiveClass} ${
                        col.sortable
                          ? 'cursor-pointer select-none hover:text-zinc-900 dark:hover:text-zinc-100'
                          : ''
                      } ${col.headerClassName || ''}`}
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
      )}

      {/* 4. Pagination Footer */}
      {pagination && sortedData.length > 0 && (
        <div className="border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-950/80 px-4 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-zinc-600 dark:text-zinc-400 font-mono">
          <div className="flex items-center gap-3">
            <span>
              Showing{' '}
              <strong className="font-semibold text-zinc-900 dark:text-zinc-100">
                {startIdx + 1}
              </strong>{' '}
              to{' '}
              <strong className="font-semibold text-zinc-900 dark:text-zinc-100">
                {endIdx}
              </strong>{' '}
              of{' '}
              <strong className="font-semibold text-zinc-900 dark:text-zinc-100">
                {sortedData.length}
              </strong>{' '}
              records
              {totalCount !== undefined && totalCount > sortedData.length && (
                <span className="text-zinc-400 ml-1">
                  (filtered from {totalCount})
                </span>
              )}
            </span>

            {pageSizeOptions.length > 1 && (
              <div className="flex items-center gap-1.5 font-sans">
                <span className="text-[11px] text-zinc-400">Rows:</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(0);
                  }}
                  className="h-6 px-1.5 rounded border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs text-zinc-800 dark:text-zinc-200 cursor-pointer focus:outline-none"
                  aria-label="Select number of rows per page"
                >
                  {pageSizeOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
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

export default SharedDataTable;
