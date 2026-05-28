'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { useIsMobile } from '@/hooks/useIsMobile';

const MangaBook = dynamic(() => import('./MangaBook'), { ssr: false });
const MangaWebtoon = dynamic(() => import('./MangaWebtoon'), { ssr: false });

const MangaApp: React.FC = () => {
  const isMobile = useIsMobile();

  if (isMobile === null) {
    return null;
  }

  return isMobile ? <MangaWebtoon /> : <MangaBook />;
};

export default MangaApp;
