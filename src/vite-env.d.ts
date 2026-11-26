/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
  readonly VITE_GA_MEASUREMENT_ID?: string;
  readonly VITE_GOOGLE_ADSENSE_CLIENT?: string;
  readonly VITE_GOOGLE_ADSENSE_SLOT_HORIZONTAL?: string;
  readonly VITE_GOOGLE_ADSENSE_SLOT_INFEED?: string;
  readonly VITE_GOOGLE_ADS_ID?: string;
  readonly VITE_GOOGLE_ADS_CONVERSION_SIGNUP?: string;
  readonly VITE_GOOGLE_ADS_CONVERSION_INQUIRY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module '*.mjs?url' {
  const src: string;
  export default src;
}
