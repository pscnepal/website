import firebaseConfig from '../../firebase-applet-config.json';

type AnalyticsParamValue = string | number | boolean | undefined;
type AnalyticsParams = Record<string, AnalyticsParamValue>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const GTAG_SCRIPT_ID = 'psc-nepal-gtag-script';
const PLACEHOLDER_IDS = new Set(['G-XXXXXXXXXX', 'G-0000000000']);
const VALID_GA_ID_REGEX = /^(G|GT)-[A-Z0-9]+$/i;

let isConfigured = false;
let onlineRetryRegistered = false;
let lastTrackedPath: string | null = null;

function resolveMeasurementId(): string | null {
  const envId =
    typeof import.meta !== 'undefined'
      ? import.meta.env?.VITE_GA_MEASUREMENT_ID?.trim()
      : undefined;
  const configId =
    typeof firebaseConfig?.measurementId === 'string'
      ? firebaseConfig.measurementId.trim()
      : undefined;

  const candidate = envId || configId || '';
  if (
    !candidate ||
    PLACEHOLDER_IDS.has(candidate.toUpperCase()) ||
    !VALID_GA_ID_REGEX.test(candidate)
  ) {
    return null;
  }

  return candidate;
}

function ensureGtagBootstrap(measurementId: string): void {
  if (typeof window === 'undefined') return;

  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag !== 'function') {
    window.gtag = function gtag() {
      window.dataLayer?.push(arguments);
    };
  }

  if (!isConfigured) {
    window.gtag('js', new Date());
    window.gtag('config', measurementId, {
      send_page_view: false,
      anonymize_ip: true,
    });
    isConfigured = true;
  }
}

function injectGtagScript(measurementId: string): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  if (document.getElementById(GTAG_SCRIPT_ID)) return;

  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    if (!onlineRetryRegistered) {
      onlineRetryRegistered = true;
      window.addEventListener(
        'online',
        () => {
          onlineRetryRegistered = false;
          injectGtagScript(measurementId);
        },
        { once: true }
      );
    }
    return;
  }

  const script = document.createElement('script');
  script.id = GTAG_SCRIPT_ID;
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(
    measurementId
  )}`;
  document.head.appendChild(script);
}

export function initGoogleAnalytics(): boolean {
  const measurementId = resolveMeasurementId();
  if (!measurementId || typeof window === 'undefined') {
    return false;
  }

  ensureGtagBootstrap(measurementId);
  injectGtagScript(measurementId);
  return true;
}

export function trackPageView(path: string, title?: string): void {
  if (!initGoogleAnalytics() || typeof window === 'undefined') return;
  if (!window.gtag) return;

  const normalizedPath = path || '/';
  if (lastTrackedPath === normalizedPath) {
    return;
  }
  lastTrackedPath = normalizedPath;

  window.gtag('event', 'page_view', {
    page_path: normalizedPath,
    page_location: window.location.href,
    page_title:
      title || (typeof document !== 'undefined' ? document.title : undefined),
  });
}

export function trackAnalyticsEvent(
  eventName: string,
  params?: AnalyticsParams
): void {
  if (!initGoogleAnalytics() || typeof window === 'undefined') return;
  if (!window.gtag) return;

  const sanitized: Record<string, string | number | boolean> = {};
  if (params) {
    for (const [key, val] of Object.entries(params)) {
      if (val !== undefined) {
        sanitized[key] = val;
      }
    }
  }

  window.gtag('event', eventName, sanitized);
}

export function setAnalyticsUser(userId: string | null): void {
  const measurementId = resolveMeasurementId();
  if (!measurementId || !initGoogleAnalytics() || typeof window === 'undefined') {
    return;
  }
  if (!window.gtag) return;

  window.gtag('set', 'user_properties', {
    account_status: userId ? 'signed_in' : 'guest',
  });
  window.gtag('config', measurementId, {
    user_id: userId || undefined,
    send_page_view: false,
  });
}
