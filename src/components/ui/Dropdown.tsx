import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';

interface DropdownProps {
  trigger: (props: {
    open: boolean;
    toggle: () => void;
  }) => ReactNode;
  children: (props: { close: () => void }) => ReactNode;
}

export function Dropdown({ trigger, children }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const [menuPos, setMenuPos] = useState<{
    top: number;
    left: number;
    ready: boolean;
  }>({ top: 0, left: 0, ready: false });

  const containerRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const updatePosition = useCallback(() => {
    const triggerEl = containerRef.current;
    const menuEl = menuRef.current;
    if (!triggerEl || !menuEl) return;

    const triggerRect = triggerEl.getBoundingClientRect();
    const menuRect = menuEl.getBoundingClientRect();
    const viewportW = window.innerWidth;
    const viewportH = window.innerHeight;
    const margin = 12;
    const gap = 8;

    const spaceBelow = viewportH - triggerRect.bottom - margin;
    const spaceAbove = triggerRect.top - margin;
    const flipTop = spaceBelow < menuRect.height + gap && spaceAbove > spaceBelow;

    const top = flipTop
      ? Math.max(margin, triggerRect.top - gap - menuRect.height)
      : Math.min(
          Math.max(margin, triggerRect.bottom + gap),
          Math.max(margin, viewportH - menuRect.height - margin)
        );

    const left = Math.max(
      margin,
      Math.min(
        triggerRect.right - menuRect.width,
        Math.max(margin, viewportW - menuRect.width - margin)
      )
    );

    setMenuPos({
      top: Math.round(top),
      left: Math.round(left),
      ready: true,
    });
  }, []);

  useLayoutEffect(() => {
    if (!open) {
      setMenuPos((prev) => (prev.ready ? { ...prev, ready: false } : prev));
      return;
    }
    updatePosition();
  }, [open, updatePosition]);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        !containerRef.current?.contains(target) &&
        !menuRef.current?.contains(target)
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
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [open, updatePosition]);

  return (
    <div ref={containerRef} className="relative inline-flex">
      {trigger({
        open,
        toggle: () => setOpen((prev) => !prev),
      })}

      {open &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            ref={menuRef}
            role="menu"
            style={{
              position: 'fixed',
              top: menuPos.top,
              left: menuPos.left,
              visibility: menuPos.ready ? 'visible' : 'hidden',
            }}
            className="z-[9999] min-w-56 max-h-[calc(100vh-24px)] overflow-y-auto rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-lg p-1.5"
            onClick={(e) => e.stopPropagation()}
          >
            {children({ close: () => setOpen(false) })}
          </div>,
          document.body
        )}
    </div>
  );
}
