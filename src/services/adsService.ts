import { initGoogleAnalytics } from './analyticsService';

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>>;
  }
}

const ADSENSE_SCRIPT_ID = 'psc-nepal-adsense-script';
const ADSENSE_CLIENT_REGEX = /^ca-pub-\d{10,20}$/i;
const GOOGLE_ADS_ID_REGEX = /^AW-\d+$/i;
const GOOGLE_ADS_CONVERSION_REGEX = /^AW-\d+\/[A-Za-z0-9_-]+$/i;

const RESTRICTED_AD_ROUTE_PREFIXES = [
  '/dashboard',
  '/read',
  '/simulate',
  '/quiz',
  '/progress',
  '/library',
] as const;

let adsenseRetryRegistered = false;
let configuredGoogleAdsId: string | null = null;

export type AdSenseSlotVariant = 'horizontal' | 'in-feed' | 'in-article' | 'auto';

export interface ResolvedAdSenseSlotConfig {
  clientId: string;
  slotId: string;
  variant: Exclude<AdSenseSlotVariant, 'auto'>;
}

export function getAdSenseClientId(): string | null {
  const raw =
    typeof import.meta !== 'undefined'
      ? import.meta.env?.VITE_GOOGLE_ADSENSE_CLIENT?.trim()
      : undefined;
  if (!raw || !ADSENSE_CLIENT_REGEX.test(raw)) {
    return null;
  }
  return raw;
}

export function getHorizontalAdSenseSlot(): string | null {
  if (typeof import.meta === 'undefined') return null;
  const horizontal = import.meta.env?.VITE_GOOGLE_ADSENSE_SLOT_HORIZONTAL?.trim();
  return horizontal || null;
}

export function getInFeedAdSenseSlot(): string | null {
  if (typeof import.meta === 'undefined') return null;
  const inFeed = import.meta.env?.VITE_GOOGLE_ADSENSE_SLOT_INFEED?.trim();
  return inFeed || null;
}

export function getDefaultAdSenseSlot(
  variant: AdSenseSlotVariant = 'auto'
): string | null {
  const horizontal = getHorizontalAdSenseSlot();
  const inFeed = getInFeedAdSenseSlot();

  if (variant === 'horizontal') {
    return horizontal;
  }
  if (variant === 'in-feed') {
    return inFeed;
  }
  if (variant === 'in-article') {
    return inFeed || horizontal;
  }
  return horizontal || inFeed;
}

export function resolveAdSenseSlotConfig(options?: {
  variant?: AdSenseSlotVariant;
  slot?: string;
}): ResolvedAdSenseSlotConfig | null {
  const clientId = getAdSenseClientId();
  if (!clientId) return null;

  const requestedVariant = options?.variant ?? 'auto';
  const explicitSlot = options?.slot?.trim();
  const horizontalSlot = getHorizontalAdSenseSlot();
  const inFeedSlot = getInFeedAdSenseSlot();

  if (explicitSlot) {
    const resolvedVariant: Exclude<AdSenseSlotVariant, 'auto'> =
      requestedVariant === 'auto' ? 'horizontal' : requestedVariant;
    return {
      clientId,
      slotId: explicitSlot,
      variant: resolvedVariant,
    };
  }

  if (requestedVariant === 'horizontal') {
    return horizontalSlot
      ? { clientId, slotId: horizontalSlot, variant: 'horizontal' }
      : null;
  }

  if (requestedVariant === 'in-feed') {
    return inFeedSlot
      ? { clientId, slotId: inFeedSlot, variant: 'in-feed' }
      : null;
  }

  if (requestedVariant === 'in-article') {
    const slotId = inFeedSlot || horizontalSlot;
    return slotId ? { clientId, slotId, variant: 'in-article' } : null;
  }

  // Dynamic 'auto' resolution: select horizontal or in-feed based on configured env vars
  if (horizontalSlot) {
    return { clientId, slotId: horizontalSlot, variant: 'horizontal' };
  }
  if (inFeedSlot) {
    return { clientId, slotId: inFeedSlot, variant: 'in-feed' };
  }
  return null;
}

export function isAdEligibleRoute(pathname: string): boolean {
  const normalized = pathname.toLowerCase();
  return !RESTRICTED_AD_ROUTE_PREFIXES.some(
    (prefix) => normalized === prefix || normalized.startsWith(`${prefix}/`)
  );
}

function upsertAdSenseMeta(clientId: string): void {
  if (typeof document === 'undefined') return;
  let meta = document.head.querySelector<HTMLMetaElement>(
    'meta[name="google-adsense-account"]'
  );
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = 'google-adsense-account';
    document.head.appendChild(meta);
  }
  meta.content = clientId;
}

function injectAdSenseScript(clientId: string): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  if (
    document.getElementById(ADSENSE_SCRIPT_ID) ||
    document.querySelector('script[src*="pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]')
  ) {
    return;
  }

  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    if (!adsenseRetryRegistered) {
      adsenseRetryRegistered = true;
      window.addEventListener(
        'online',
        () => {
          adsenseRetryRegistered = false;
          injectAdSenseScript(clientId);
        },
        { once: true }
      );
    }
    return;
  }

  const script = document.createElement('script');
  script.id = ADSENSE_SCRIPT_ID;
  script.async = true;
  script.crossOrigin = 'anonymous';
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(
    clientId
  )}`;
  document.head.appendChild(script);
}

export function initGoogleAdSense(): boolean {
  const clientId = getAdSenseClientId();
  if (!clientId || typeof window === 'undefined') {
    return false;
  }

  upsertAdSenseMeta(clientId);
  injectAdSenseScript(clientId);
  return true;
}

export function pushAdSenseUnit(): void {
  if (typeof window === 'undefined') return;
  try {
    window.adsbygoogle = window.adsbygoogle || [];
    window.adsbygoogle.push({});
  } catch {
    // Ignore duplicate or blocked AdSense slot pushes
  }
}

const GOOGLE_ADS_LABEL_REGEX = /^[A-Za-z0-9_-]+$/;

function resolveConversionSendTo(rawValue?: string): string | undefined {
  const raw = rawValue?.trim();
  if (!raw) return undefined;

  if (GOOGLE_ADS_CONVERSION_REGEX.test(raw)) {
    return raw;
  }

  const adsId = getGoogleAdsId();
  if (adsId && GOOGLE_ADS_LABEL_REGEX.test(raw)) {
    return `${adsId}/${raw}`;
  }

  return undefined;
}

export function getGoogleAdsId(): string | null {
  const raw =
    typeof import.meta !== 'undefined'
      ? import.meta.env?.VITE_GOOGLE_ADS_ID?.trim()
      : undefined;
  if (!raw || !GOOGLE_ADS_ID_REGEX.test(raw)) {
    return null;
  }
  return raw;
}

export function getSignupConversionId(): string | undefined {
  const raw =
    typeof import.meta !== 'undefined'
      ? import.meta.env?.VITE_GOOGLE_ADS_CONVERSION_SIGNUP
      : undefined;
  return resolveConversionSendTo(raw);
}

export function getInquiryConversionId(): string | undefined {
  const raw =
    typeof import.meta !== 'undefined'
      ? import.meta.env?.VITE_GOOGLE_ADS_CONVERSION_INQUIRY
      : undefined;
  return resolveConversionSendTo(raw);
}

export function initGoogleAdsTag(): boolean {
  const adsId = getGoogleAdsId();
  if (!adsId || typeof window === 'undefined') {
    return false;
  }

  initGoogleAnalytics();
  if (typeof window.gtag !== 'function') {
    return false;
  }

  if (configuredGoogleAdsId !== adsId) {
    window.gtag('config', adsId);
    configuredGoogleAdsId = adsId;
  }
  return true;
}

export function trackGoogleAdsConversion(
  sendTo?: string,
  params?: { value?: number; currency?: string; transaction_id?: string }
): boolean {
  const resolvedSendTo = resolveConversionSendTo(sendTo);
  if (!resolvedSendTo || typeof window === 'undefined') return false;

  initGoogleAdsTag();
  if (typeof window.gtag !== 'function') return false;

  window.gtag('event', 'conversion', {
    send_to: resolvedSendTo,
    ...(params?.value !== undefined ? { value: params.value } : {}),
    ...(params?.currency ? { currency: params.currency } : {}),
    ...(params?.transaction_id
      ? { transaction_id: params.transaction_id }
      : {}),
  });
  return true;
}
