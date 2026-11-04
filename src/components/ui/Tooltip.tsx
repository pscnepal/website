import { useId, useState, type ReactNode } from 'react';

interface TooltipProps {
  content: string;
  shortcut?: string;
  position?: 'bottom' | 'top';
  children: ReactNode;
}

export function Tooltip({
  content,
  shortcut,
  position = 'bottom',
  children,
}: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const tooltipId = useId();

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div
          id={tooltipId}
          role="tooltip"
          className={`pointer-events-none absolute left-1/2 -translate-x-1/2 z-50 flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 text-xs font-medium whitespace-nowrap shadow-md ${
            position === 'bottom' ? 'top-full mt-2' : 'bottom-full mb-2'
          }`}
        >
          <span>{content}</span>
          {shortcut && (
            <kbd className="font-mono text-[10px] opacity-75 px-1 py-0.5 rounded bg-zinc-800 text-zinc-200 dark:bg-zinc-200 dark:text-zinc-800">
              {shortcut}
            </kbd>
          )}
        </div>
      )}
    </div>
  );
}
