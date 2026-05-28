'use client';

import React from 'react';
import { getLauncherTarget, LauncherTarget } from '@/lib/gameLaunchers';

export interface KomaPanelProps {
  pageNum: number;
  komaNum: number;
  assetName: string;
  className?: string;
  hasUfoPrize: boolean;
  isFreshUfoPrize: boolean;
  onLaunch: (el: HTMLElement, target: LauncherTarget) => void;
  loadingStrategy?: 'eager' | 'lazy';
}

const KomaPanel: React.FC<KomaPanelProps> = ({
  pageNum,
  komaNum,
  assetName,
  className = '',
  hasUfoPrize,
  isFreshUfoPrize,
  onLaunch,
  loadingStrategy = 'eager',
}) => {
  const isPrizeUnlocked = pageNum === 4 && (komaNum === 3 || komaNum === 4) && hasUfoPrize;
  const finalClassName = `koma ${className}${isPrizeUnlocked ? ' prize-unlocked' : ''}${
    isPrizeUnlocked && isFreshUfoPrize ? ' prize-fresh' : ''
  }`;
  const target = getLauncherTarget(pageNum, komaNum);

  return (
    <div
      className={finalClassName}
      data-koma={komaNum}
      data-asset={assetName}
      onClick={(e) => {
        if (!target) return;
        onLaunch(e.currentTarget as HTMLDivElement, target);
      }}
    >
      <img
        className="koma-img-el"
        alt={assetName}
        data-name={assetName}
        src={`/images/${assetName}.png`}
        loading={loadingStrategy}
        decoding="async"
      />
    </div>
  );
};

export default KomaPanel;
