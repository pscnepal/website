import { useCallback, useEffect, useMemo } from 'react';
import {
  getGoogleAdsId,
  getInquiryConversionId,
  getSignupConversionId,
  initGoogleAdsTag,
  trackGoogleAdsConversion,
} from '../services/adsService';

export type GoogleAdsConversionType = 'signup' | 'inquiry';

export interface GoogleAdsConversionParams {
  value?: number;
  currency?: string;
  transactionId?: string;
  sendToOverride?: string;
}

export function useGoogleAdsConversion() {
  const adsId = useMemo(() => getGoogleAdsId(), []);
  const signupConversionId = useMemo(() => getSignupConversionId(), []);
  const inquiryConversionId = useMemo(() => getInquiryConversionId(), []);

  useEffect(() => {
    initGoogleAdsTag();
  }, []);

  const trackConversion = useCallback(
    (
      type: GoogleAdsConversionType,
      params?: GoogleAdsConversionParams
    ): boolean => {
      const targetSendTo =
        params?.sendToOverride?.trim() ||
        (type === 'signup' ? signupConversionId : inquiryConversionId);

      return trackGoogleAdsConversion(targetSendTo, {
        value: params?.value,
        currency: params?.currency,
        transaction_id: params?.transactionId,
      });
    },
    [signupConversionId, inquiryConversionId]
  );

  const trackSignupConversion = useCallback(
    (params?: GoogleAdsConversionParams): boolean =>
      trackConversion('signup', params),
    [trackConversion]
  );

  const trackInquiryConversion = useCallback(
    (params?: GoogleAdsConversionParams): boolean =>
      trackConversion('inquiry', params),
    [trackConversion]
  );

  return {
    adsId,
    isConfigured: Boolean(adsId),
    signupConversionId,
    inquiryConversionId,
    trackConversion,
    trackSignupConversion,
    trackInquiryConversion,
  };
}
