import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { registerSW } from 'virtual:pwa-register';
import App from './App.tsx';
import { store } from './app/store.ts';
import { ErrorBoundary } from './components/common/ErrorBoundary.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import { initializeOfflineStorageHydration } from './services/offlineHydrationService.ts';
import { toast } from './services/toastService.ts';
import './index.css';

// Hydrate missing localStorage progress & seed study banks in IndexedDB
void initializeOfflineStorageHydration(store);

// Register PWA Service Worker with automatic updates & offline-ready toast
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
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
}

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
