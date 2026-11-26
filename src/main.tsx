import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App.tsx';
import { store } from './app/store.ts';
import { ErrorBoundary } from './components/common/ErrorBoundary.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import { toast } from './services/toastService.ts';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </Provider>
    </ErrorBoundary>
  </StrictMode>
);

const runDeferredStartup = () => {
  // Hydrate missing localStorage progress & seed study banks in IndexedDB without blocking first paint
  void import('./services/offlineHydrationService.ts').then(
    ({ initializeOfflineStorageHydration }) =>
      initializeOfflineStorageHydration(store)
  );

  // Register PWA Service Worker with automatic updates & offline-ready toast
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    void import('virtual:pwa-register').then(({ registerSW }) => {
      const updateSW = registerSW({
        immediate: true,
        onNeedRefresh() {
          toast.info('A newer version of PSC Nepal is ready.', {
            id: 'pwa-update-available',
            title: 'App Update Ready',
            duration: 12000,
            action: {
              label: 'Reload Now',
              onClick: () => {
                void updateSW(true);
              },
            },
          });
        },
        onOfflineReady() {
          toast.success(
            'PSC Nepal app shell is ready for offline study and quizzes.',
            {
              id: 'pwa-offline-ready',
              title: 'Ready Offline',
            }
          );
        },
      });
    });
  }
};

if (typeof window !== 'undefined') {
  if (typeof window.requestIdleCallback === 'function') {
    window.requestIdleCallback(runDeferredStartup, { timeout: 1200 });
  } else {
    globalThis.setTimeout(runDeferredStartup, 50);
  }
}
