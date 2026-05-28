'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const UFO_KEY = 'hasUfoPrize';
const TETRIS_KEY = 'hasTetrisScore';
const AIBOT_KEY = 'hasCompletedAIBot';
const FRESH_DURATION_MS = 1800;
const REVEAL_DELAY_MS = 600;

export interface GameProgress {
  hasUfoPrize: boolean;
  hasTetrisScore: boolean;
  hasCompletedAIBot: boolean;
  pendingUfoPrize: boolean;
  isFreshUfoPrize: boolean;
  markPendingUfoPrize: () => void;
  markTetrisScore: () => void;
  markAIBotCompleted: () => void;
  finalizePendingUfoPrize: (canReveal: boolean) => void;
  clearFreshUfoPrize: () => void;
}

export const useGameProgress = (): GameProgress => {
  const [hasUfoPrize, setHasUfoPrize] = useState(false);
  const [hasTetrisScore, setHasTetrisScore] = useState(false);
  const [hasCompletedAIBot, setHasCompletedAIBot] = useState(false);
  const [pendingUfoPrize, setPendingUfoPrize] = useState(false);
  const [isFreshUfoPrize, setIsFreshUfoPrize] = useState(false);
  const revealTimerRef = useRef<number | null>(null);
  const freshResetTimerRef = useRef<number | null>(null);

  useEffect(() => {
    try {
      if (localStorage.getItem(UFO_KEY) === 'true') setHasUfoPrize(true);
      if (localStorage.getItem(TETRIS_KEY) === 'true') setHasTetrisScore(true);
      if (localStorage.getItem(AIBOT_KEY) === 'true') setHasCompletedAIBot(true);
    } catch (_) {}
  }, []);

  useEffect(() => {
    return () => {
      if (revealTimerRef.current) {
        window.clearTimeout(revealTimerRef.current);
        revealTimerRef.current = null;
      }
      if (freshResetTimerRef.current) {
        window.clearTimeout(freshResetTimerRef.current);
        freshResetTimerRef.current = null;
      }
    };
  }, []);

  const markPendingUfoPrize = useCallback(() => {
    setPendingUfoPrize((prev) => prev || true);
  }, []);

  const markTetrisScore = useCallback(() => {
    setHasTetrisScore((prev) => {
      if (prev) return prev;
      try {
        localStorage.setItem(TETRIS_KEY, 'true');
      } catch (_) {}
      return true;
    });
  }, []);

  const markAIBotCompleted = useCallback(() => {
    setHasCompletedAIBot((prev) => {
      if (prev) return prev;
      try {
        localStorage.setItem(AIBOT_KEY, 'true');
      } catch (_) {}
      return true;
    });
  }, []);

  const finalizePendingUfoPrize = useCallback(
    (canReveal: boolean) => {
      if (!canReveal || !pendingUfoPrize || hasUfoPrize) return;
      if (revealTimerRef.current) window.clearTimeout(revealTimerRef.current);
      revealTimerRef.current = window.setTimeout(() => {
        revealTimerRef.current = null;
        setIsFreshUfoPrize(true);
        setHasUfoPrize(true);
        setPendingUfoPrize(false);
        try {
          localStorage.setItem(UFO_KEY, 'true');
        } catch (_) {}

        if (freshResetTimerRef.current) window.clearTimeout(freshResetTimerRef.current);
        freshResetTimerRef.current = window.setTimeout(() => {
          setIsFreshUfoPrize(false);
          freshResetTimerRef.current = null;
        }, FRESH_DURATION_MS);
      }, REVEAL_DELAY_MS);
    },
    [pendingUfoPrize, hasUfoPrize],
  );

  const clearFreshUfoPrize = useCallback(() => {
    if (freshResetTimerRef.current) {
      window.clearTimeout(freshResetTimerRef.current);
      freshResetTimerRef.current = null;
    }
    setIsFreshUfoPrize(false);
  }, []);

  return {
    hasUfoPrize,
    hasTetrisScore,
    hasCompletedAIBot,
    pendingUfoPrize,
    isFreshUfoPrize,
    markPendingUfoPrize,
    markTetrisScore,
    markAIBotCompleted,
    finalizePendingUfoPrize,
    clearFreshUfoPrize,
  };
};
