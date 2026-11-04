import { useEffect } from 'react';

interface UseKeyboardShortcutsOptions {
  enabled: boolean;
  onPrevPage: () => void;
  onNextPage: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitToPage: () => void;
  onToggleFullscreen: () => void;
  onToggleMode: () => void;
  onToggleSound: () => void;
  onToggleStats: () => void;
  onEscapeOverlay: () => void;
}

function isEditableElement(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName.toLowerCase();
  if (tag === 'input' || tag === 'textarea' || tag === 'select') {
    return true;
  }
  return target.isContentEditable;
}

export function useKeyboardShortcuts({
  enabled,
  onPrevPage,
  onNextPage,
  onZoomIn,
  onZoomOut,
  onFitToPage,
  onToggleFullscreen,
  onToggleMode,
  onToggleSound,
  onToggleStats,
  onEscapeOverlay,
}: UseKeyboardShortcutsOptions): void {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      if (event.key === 'Escape') {
        onEscapeOverlay();
        return;
      }

      if (isEditableElement(event.target)) {
        return;
      }

      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          onPrevPage();
          break;
        case 'ArrowRight':
          event.preventDefault();
          onNextPage();
          break;
        case '+':
        case '=':
          event.preventDefault();
          onZoomIn();
          break;
        case '-':
        case '_':
          event.preventDefault();
          onZoomOut();
          break;
        case '0':
          event.preventDefault();
          onFitToPage();
          break;
        case 'f':
        case 'F':
          event.preventDefault();
          onToggleFullscreen();
          break;
        case 'm':
        case 'M':
          event.preventDefault();
          onToggleMode();
          break;
        case 's':
        case 'S':
          event.preventDefault();
          onToggleSound();
          break;
        case 'i':
        case 'I':
          event.preventDefault();
          onToggleStats();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    enabled,
    onPrevPage,
    onNextPage,
    onZoomIn,
    onZoomOut,
    onFitToPage,
    onToggleFullscreen,
    onToggleMode,
    onToggleSound,
    onToggleStats,
    onEscapeOverlay,
  ]);
}
