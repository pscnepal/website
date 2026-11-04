import { useCallback, useEffect, useState, type RefObject } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { setFullscreenState } from '../features/reader/readerSlice';

export function useFullscreen(targetRef: RefObject<HTMLElement | null>) {
  const dispatch = useAppDispatch();
  const isFullscreen = useAppSelector((state) => state.reader.isFullscreen);
  const [isSupported, setIsSupported] = useState<boolean>(true);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const supported = Boolean(
      document.fullscreenEnabled ||
        (document as unknown as { webkitFullscreenEnabled?: boolean })
          .webkitFullscreenEnabled
    );
    setIsSupported(supported);

    const handleFullscreenChange = () => {
      const activeElement =
        document.fullscreenElement ||
        (document as unknown as { webkitFullscreenElement?: Element | null })
          .webkitFullscreenElement;
      dispatch(setFullscreenState(Boolean(activeElement)));
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener(
        'webkitfullscreenchange',
        handleFullscreenChange
      );
    };
  }, [dispatch]);

  const toggleFullscreen = useCallback(async () => {
    if (typeof document === 'undefined' || !isSupported) return;
    const el = targetRef.current ?? document.documentElement;
    try {
      if (!document.fullscreenElement) {
        await el.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      // Fullscreen may be blocked by iframe sandbox permissions; degrade gracefully
      setIsSupported(false);
      dispatch(setFullscreenState(false));
    }
  }, [dispatch, isSupported, targetRef]);

  return {
    isFullscreen,
    isSupported,
    toggleFullscreen,
  };
}
