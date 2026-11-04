import { Maximize, Minimize } from 'lucide-react';
import { Button } from '../ui/Button';
import { Tooltip } from '../ui/Tooltip';

interface FullscreenButtonProps {
  isFullscreen: boolean;
  isSupported: boolean;
  onToggle: () => void;
}

export function FullscreenButton({
  isFullscreen,
  isSupported,
  onToggle,
}: FullscreenButtonProps) {
  const label = !isSupported
    ? 'Fullscreen unavailable in this browser frame'
    : isFullscreen
    ? 'Exit fullscreen'
    : 'Enter fullscreen';

  return (
    <Tooltip content={label} shortcut={isSupported ? 'F' : undefined}>
      <Button
        variant="icon"
        size="sm"
        active={isFullscreen}
        disabled={!isSupported}
        onClick={onToggle}
        aria-label={label}
        aria-pressed={isFullscreen}
      >
        {isFullscreen ? (
          <Minimize className="w-4 h-4" />
        ) : (
          <Maximize className="w-4 h-4" />
        )}
      </Button>
    </Tooltip>
  );
}
