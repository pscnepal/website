import type { AdSenseSlotVariant } from '../../services/adsService';
import { AdSenseSlot } from './AdSenseSlot';

export interface GoogleAdUnitProps {
  /** AdSense slot ID; falls back to VITE_GOOGLE_ADSENSE_SLOT_* env vars if omitted */
  slot?: string;
  /** Responsive layout preset */
  variant?: AdSenseSlotVariant;
  /** Optional AdSense layout key for In-Feed fluid templates */
  layoutKey?: string;
  /** Optional wrapper classes */
  className?: string;
}

export function GoogleAdUnit({
  slot,
  variant = 'horizontal',
  layoutKey,
  className = '',
}: GoogleAdUnitProps) {
  return (
    <AdSenseSlot
      slot={slot}
      variant={variant}
      layoutKey={layoutKey}
      className={className}
    />
  );
}
