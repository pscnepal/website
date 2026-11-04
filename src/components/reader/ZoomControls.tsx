import { Minus, MoveHorizontal, Plus, Scan } from 'lucide-react';
import type { FitMode } from '../../types/reader';
import { MAX_ZOOM, MIN_ZOOM } from '../../utils/pdfHelpers';
import { Button } from '../ui/Button';
import { Tooltip } from '../ui/Tooltip';

interface ZoomControlsProps {
  displayZoom: number;
  fitMode: FitMode;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitWidth: () => void;
  onFitPage: () => void;
  showFitButtons?: boolean;
}

export function ZoomControls({
  displayZoom,
  fitMode,
  onZoomIn,
  onZoomOut,
  onFitWidth,
  onFitPage,
  showFitButtons = true,
}: ZoomControlsProps) {
  return (
    <div className="flex items-center gap-0.5">
      <Tooltip content="Zoom out" shortcut="-">
        <Button
          variant="icon"
          size="sm"
          onClick={onZoomOut}
          disabled={fitMode === 'custom' && displayZoom <= MIN_ZOOM}
          aria-label="Zoom out"
        >
          <Minus className="w-4 h-4" />
        </Button>
      </Tooltip>

      <Tooltip content="Reset to fit page" shortcut="0">
        <button
          type="button"
          onClick={onFitPage}
          aria-label={`Current zoom ${displayZoom} percent. Click to fit page.`}
          className="h-8 min-w-[52px] px-1.5 rounded-md font-mono tabular-nums text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer whitespace-nowrap shrink-0"
        >
          {displayZoom}%
        </button>
      </Tooltip>

      <Tooltip content="Zoom in" shortcut="+">
        <Button
          variant="icon"
          size="sm"
          onClick={onZoomIn}
          disabled={fitMode === 'custom' && displayZoom >= MAX_ZOOM}
          aria-label="Zoom in"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </Tooltip>

      {showFitButtons && (
        <>
          <div className="w-px h-4 bg-zinc-200 dark:bg-zinc-800 mx-1" />
          <Tooltip content="Fit to width">
            <Button
              variant="icon"
              size="sm"
              active={fitMode === 'width'}
              onClick={onFitWidth}
              aria-label="Fit to width"
              aria-pressed={fitMode === 'width'}
            >
              <MoveHorizontal className="w-4 h-4" />
            </Button>
          </Tooltip>

          <Tooltip content="Fit to page" shortcut="0">
            <Button
              variant="icon"
              size="sm"
              active={fitMode === 'page'}
              onClick={onFitPage}
              aria-label="Fit to page"
              aria-pressed={fitMode === 'page'}
            >
              <Scan className="w-4 h-4" />
            </Button>
          </Tooltip>
        </>
      )}
    </div>
  );
}
