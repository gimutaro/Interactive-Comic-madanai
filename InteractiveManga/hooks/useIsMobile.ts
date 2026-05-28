'use client';

import { useEffect, useState } from 'react';

const DEFAULT_BREAKPOINT_PX = 768;

export const useIsMobile = (breakpointPx: number = DEFAULT_BREAKPOINT_PX): boolean | null => {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${breakpointPx}px)`);
    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile(e.matches);
    };
    handleChange(mediaQuery);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [breakpointPx]);

  return isMobile;
};
