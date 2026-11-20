import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  initGoogleAnalytics,
  setAnalyticsUser,
  trackPageView,
} from '../../services/analyticsService';

export function GoogleAnalyticsTracker() {
  const { pathname, search } = useLocation();
  const { user, isAuthReady } = useAuth();

  useEffect(() => {
    initGoogleAnalytics();
  }, []);

  useEffect(() => {
    const fullPath = `${pathname}${search}`;
    trackPageView(fullPath, document.title);
  }, [pathname, search]);

  useEffect(() => {
    if (!isAuthReady) return;
    setAnalyticsUser(user?.uid ?? null);
  }, [isAuthReady, user?.uid]);

  return null;
}
