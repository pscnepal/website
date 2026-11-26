import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import {
  initGoogleAdSense,
  isAdEligibleRoute,
  pushAdSenseUnit,
  resolveAdSenseSlotConfig,
  type AdSenseSlotVariant,
} from '../../services/adsService';

export interface AdSenseSlotProps {
  /**
   * Slot preset to render. Defaults to `'auto'`, which dynamically picks
   * `horizontal` or `in-feed` based on configured environment variables.
   */
  variant?: AdSenseSlotVariant;
  /** Optional explicit AdSense slot ID overriding environment variable lookup */
  slot?: string;
  /** Optional AdSense layout key for custom In-Feed fluid templates (e.g. `-fb+5w+4e-db+86`) */
  layoutKey?: string;
  /** Optional wrapper classes */
  className?: string;
}

export function AdSenseSlot({
  variant = 'auto',
  slot,
  layoutKey,
  className = '',
}: AdSenseSlotProps) {
  const { pathname } = useLocation();
  const insRef = useRef<HTMLModElement | null>(null);
  const pushedKeyRef = useRef<string | null>(null);

  const resolvedConfig = resolveAdSenseSlotConfig({ variant, slot });
  const isEligible = Boolean(resolvedConfig && isAdEligibleRoute(pathname));

  useEffect(() => {
    if (!isEligible || !resolvedConfig) return;

    initGoogleAdSense();
    const renderKey = `${resolvedConfig.variant}:${pathname}:${resolvedConfig.slotId}`;
    if (pushedKeyRef.current === renderKey) return;

    const el = insRef.current;
    if (el && el.dataset.adsbygoogleStatus !== 'done') {
      pushedKeyRef.current = renderKey;
      pushAdSenseUnit();
    }
  }, [isEligible, resolvedConfig, pathname]);

  if (!isEligible || !resolvedConfig) {
    return null;
  }

  const { clientId, slotId, variant: activeVariant } = resolvedConfig;
  const isFluid = activeVariant === 'in-feed' || activeVariant === 'in-article';
  const trimmedLayoutKey = layoutKey?.trim() || undefined;

  return (
    <aside
      aria-label="Advertisement"
      className={`w-full overflow-hidden ${className}`}
    >
      <div
        className={`rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/70 dark:bg-zinc-900/40 px-3 py-2.5 text-center ${
          activeVariant === 'in-feed' ? 'my-2' : ''
        }`}
      >
        <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-1.5 select-none">
          Advertisement
        </p>
        <ins
          ref={insRef}
          key={`${activeVariant}-${pathname}-${slotId}`}
          className={`adsbygoogle block w-full ${
            activeVariant === 'in-article' ? 'text-center' : ''
          }`}
          data-ad-client={clientId}
          data-ad-slot={slotId}
          data-ad-layout={activeVariant === 'in-article' ? 'in-article' : undefined}
          data-ad-layout-key={
            activeVariant === 'in-feed' ? trimmedLayoutKey : undefined
          }
          data-ad-format={isFluid ? 'fluid' : 'horizontal'}
          data-full-width-responsive={isFluid ? undefined : 'true'}
        />
      </div>
    </aside>
  );
}
