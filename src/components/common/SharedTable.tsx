import React from 'react';

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
}: SharedTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className={`py-12 px-4 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl space-y-2 bg-white dark:bg-zinc-900 ${className}`}>
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

  return (
    <div
      className={`rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-xs ${className}`}
    >
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-left border-collapse text-xs">
          {caption && <caption className="sr-only">{caption}</caption>}

          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-500 dark:text-zinc-400 font-mono">
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

                return (
                  <th
                    key={col.id}
                    scope="col"
                    className={`py-3 px-3.5 sm:px-4 font-semibold text-zinc-600 dark:text-zinc-400 ${alignClass} ${col.width || ''} ${responsiveClass} ${
                      col.headerClassName || ''
                    }`}
                  >
                    {col.header}
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
            {data.map((item, index) => {
              const rowKey = keyExtractor(item, index);
              const isEven = index % 2 === 0;

              return (
                <tr
                  key={rowKey}
                  onClick={() => onRowClick?.(item)}
                  className={`transition-colors ${
                    striped && !isEven
                      ? 'bg-zinc-50/50 dark:bg-zinc-950/40'
                      : ''
                  } ${
                    hoverable
                      ? 'hover:bg-zinc-50/80 dark:hover:bg-zinc-800/60'
                      : ''
                  } ${onRowClick ? 'cursor-pointer' : ''}`}
                >
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
    </div>
  );
}
