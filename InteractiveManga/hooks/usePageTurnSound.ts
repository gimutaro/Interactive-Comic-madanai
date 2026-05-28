'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const STORAGE_KEY = 'pageSoundOn';
const SOUND_PATH = '/sounds/ThumbThrough.mp3';
const VOLUME = 0.25;

export interface PageTurnSound {
  isOn: boolean;
  toggle: () => void;
  play: () => void;
}

export const usePageTurnSound = (): PageTurnSound => {
  const [isOn, setIsOn] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const el = new Audio(SOUND_PATH);
    try {
      el.preload = 'auto';
      el.volume = VOLUME;
    } catch (_) {}
    audioRef.current = el;
    return () => {
      try {
        el.pause();
        el.src = '';
      } catch (_) {}
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved != null) setIsOn(saved === '1');
    } catch (_) {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, isOn ? '1' : '0');
    } catch (_) {}
  }, [isOn]);

  const play = useCallback(() => {
    if (!isOn) return;
    const el = audioRef.current;
    if (!el) return;
    try {
      el.currentTime = 0;
    } catch (_) {}
    el.play().catch(() => {});
  }, [isOn]);

  const toggle = useCallback(() => {
    setIsOn((prev) => !prev);
  }, []);

  return { isOn, toggle, play };
};
