import { useEffect, useRef, useState, type ReactNode } from 'react';

interface DropdownProps {
  trigger: (props: {
    open: boolean;
    toggle: () => void;
  }) => ReactNode;
  children: (props: { close: () => void }) => ReactNode;
}

export function Dropdown({ trigger, children }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative inline-flex">
      {trigger({
        open,
        toggle: () => setOpen((prev) => !prev),
      })}

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-2 z-50 min-w-56 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-lg p-1.5"
        >
          {children({ close: () => setOpen(false) })}
        </div>
      )}
    </div>
  );
}
