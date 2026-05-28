'use client';

import { useCallback, useEffect, useRef, useState, RefObject } from 'react';
import { LauncherTarget } from '@/lib/gameLaunchers';

const ZOOM_DURATION_MS = 620;
const ZOOM_CLEANUP_MS = 720;
const LAUNCH_PULSE_MS = 550;

export interface ActiveGame {
  isAIBotOpen: boolean;
  isMiniGameOpen: boolean;
  gameUrl: string;
  gameTitle: string;
  isFullScreen: boolean;
}

export interface ZoomState {
  isZoomingIn: boolean;
  isZoomingOut: boolean;
  isZoomed: boolean;
  isOverlayActive: boolean;
}

interface UseGameLauncherArgs {
  cameraRef: RefObject<HTMLDivElement | null>;
  onUfoPrizeCollected: () => void;
  onTetrisScoreAchieved: () => void;
}

export interface GameLauncher {
  active: ActiveGame;
  zoom: ZoomState;
  launchAt: (el: HTMLElement, target: LauncherTarget) => void;
  closeActive: () => void;
  isBusy: boolean;
}

const initialActive: ActiveGame = {
  isAIBotOpen: false,
  isMiniGameOpen: false,
  gameUrl: '',
  gameTitle: '',
  isFullScreen: false,
};

const initialZoom: ZoomState = {
  isZoomingIn: false,
  isZoomingOut: false,
  isZoomed: false,
  isOverlayActive: false,
};

export const useGameLauncher = ({
  cameraRef,
  onUfoPrizeCollected,
  onTetrisScoreAchieved,
}: UseGameLauncherArgs): GameLauncher => {
  const [active, setActive] = useState<ActiveGame>(initialActive);
  const [zoom, setZoom] = useState<ZoomState>(initialZoom);
  const cleanupTimerRef = useRef<number | null>(null);

  const isBusy = zoom.isZoomingIn || zoom.isZoomingOut || active.isAIBotOpen || active.isMiniGameOpen;

  const performZoomOut = useCallback(() => {
    const camera = cameraRef.current;
    if (camera) {
      camera.classList.remove('zooming-in');
      camera.classList.add('zooming-out');
    }
    setZoom({
      isZoomingIn: false,
      isZoomingOut: true,
      isZoomed: true,
      isOverlayActive: false,
    });

    if (cleanupTimerRef.current) window.clearTimeout(cleanupTimerRef.current);
    cleanupTimerRef.current = window.setTimeout(() => {
      if (camera) camera.classList.remove('zooming-out');
      setZoom(initialZoom);
      try {
        document.body.style.overflow = '';
      } catch (_) {}
    }, ZOOM_CLEANUP_MS);
  }, [cameraRef]);

  const closeActive = useCallback(() => {
    setActive(initialActive);
    setZoom((prev) =>
      prev.isZoomed || prev.isZoomingIn ? prev : { ...prev, isOverlayActive: false },
    );

    if (zoom.isZoomed || zoom.isZoomingIn) {
      performZoomOut();
    }
  }, [zoom.isZoomed, zoom.isZoomingIn, performZoomOut]);

  const launchAt = useCallback(
    (el: HTMLElement, target: LauncherTarget) => {
      if (!el || isBusy) return;

      const elRect = el.getBoundingClientRect();
      const camera = cameraRef.current;
      if (camera) {
        const cameraRect = camera.getBoundingClientRect();
        const cx = elRect.left + elRect.width / 2 - cameraRect.left;
        const cy = elRect.top + elRect.height / 2 - cameraRect.top;
        camera.style.setProperty('--zoom-origin-x', `${cx}px`);
        camera.style.setProperty('--zoom-origin-y', `${cy}px`);
        camera.classList.add('zooming-in');
      }

      setZoom({
        isZoomingIn: true,
        isZoomingOut: false,
        isZoomed: false,
        isOverlayActive: true,
      });
      try {
        document.body.style.overflow = 'hidden';
      } catch (_) {}

      el.classList.add('launching');
      window.setTimeout(() => el.classList.remove('launching'), LAUNCH_PULSE_MS);

      if (cleanupTimerRef.current) window.clearTimeout(cleanupTimerRef.current);
      cleanupTimerRef.current = window.setTimeout(() => {
        setZoom((prev) => ({ ...prev, isZoomingIn: false, isZoomed: true }));
        if (target.type === 'aibot') {
          setActive({
            isAIBotOpen: true,
            isMiniGameOpen: false,
            gameUrl: '',
            gameTitle: '',
            isFullScreen: false,
          });
        } else {
          setActive({
            isAIBotOpen: false,
            isMiniGameOpen: true,
            gameUrl: target.url,
            gameTitle: target.title,
            isFullScreen: target.fullScreen,
          });
        }
      }, ZOOM_DURATION_MS);
    },
    [cameraRef, isBusy],
  );

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      try {
        if (e.origin !== window.location.origin) return;
      } catch (_) {}
      const data = e?.data;
      if (!data || typeof data !== 'object') return;

      if (data.type === 'CLOSE_MINI_GAME') {
        closeActive();
      } else if (data.type === 'UFO_PRIZE_COLLECTED') {
        const count = typeof data.count === 'number' ? data.count : 0;
        if (count >= 1) onUfoPrizeCollected();
      } else if (data.type === 'TETRIS_SCORE_ACHIEVED') {
        onTetrisScoreAchieved();
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [closeActive, onUfoPrizeCollected, onTetrisScoreAchieved]);

  useEffect(() => {
    return () => {
      if (cleanupTimerRef.current) {
        window.clearTimeout(cleanupTimerRef.current);
        cleanupTimerRef.current = null;
      }
    };
  }, []);

  return {
    active,
    zoom,
    launchAt,
    closeActive,
    isBusy,
  };
};
