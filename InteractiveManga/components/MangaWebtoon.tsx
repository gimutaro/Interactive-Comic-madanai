'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import AIBot from './AIBot';
import MiniGameModal from './MiniGameModal';
import SharedKomaPanel, { KomaPanelProps } from './KomaPanel';
import { useGameLauncher } from '@/hooks/useGameLauncher';
import { useGameProgress } from '@/hooks/useGameProgress';

type KomaProps = Omit<KomaPanelProps, 'hasUfoPrize' | 'isFreshUfoPrize' | 'onLaunch'>;

const LOCK_TOAST_DURATION_MS = 2400;
const FRESH_PRIZE_DURATION_MS = 2400;

const MangaWebtoon: React.FC = () => {
  const cameraRef = useRef<HTMLDivElement>(null);

  const progress = useGameProgress();
  const launcher = useGameLauncher({
    cameraRef,
    onUfoPrizeCollected: progress.markPendingUfoPrize,
    onTetrisScoreAchieved: progress.markTetrisScore,
  });

  const [lockToastMessage, setLockToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const canReveal = !launcher.zoom.isZoomingOut && !launcher.zoom.isZoomed;
    progress.finalizePendingUfoPrize(canReveal);
  }, [launcher.zoom.isZoomingOut, launcher.zoom.isZoomed, progress.finalizePendingUfoPrize]);

  useEffect(() => {
    if (!progress.isFreshUfoPrize) return;
    const id = window.setTimeout(() => progress.clearFreshUfoPrize(), FRESH_PRIZE_DURATION_MS);
    return () => window.clearTimeout(id);
  }, [progress.isFreshUfoPrize, progress.clearFreshUfoPrize]);

  const showLockToast = useCallback((message: string) => {
    setLockToastMessage(message);
    window.setTimeout(() => setLockToastMessage(null), LOCK_TOAST_DURATION_MS);
  }, []);

  const KomaPanel = (props: KomaProps) => (
    <SharedKomaPanel
      {...props}
      hasUfoPrize={progress.hasUfoPrize}
      isFreshUfoPrize={progress.isFreshUfoPrize}
      onLaunch={launcher.launchAt}
      loadingStrategy="lazy"
    />
  );

  const aibotLocked = !progress.hasCompletedAIBot;
  const tetrisLocked = !progress.hasTetrisScore;

  return (
    <>
      <div
        className={`camera-zoom-container webtoon-camera${
          launcher.zoom.isZoomingIn ? ' zooming-in' : ''
        }${launcher.zoom.isZoomingOut ? ' zooming-out' : ''}`}
        ref={cameraRef}
      >
        <div className="webtoon-container">
          <div className="webtoon-cover">
            <img
              className="webtoon-cover-image"
              src="/images/cover_front.png"
              alt="cover_front"
              loading="eager"
              decoding="async"
            />
          </div>

          <div className="webtoon-page">
            <div className="manga-page layout-p1v2" data-page="1">
              <div className="row top">
                <KomaPanel pageNum={1} komaNum={1} assetName="p1_koma1" />
                <KomaPanel pageNum={1} komaNum={2} assetName="p1_koma2" />
              </div>
              <div className="row bottom">
                <KomaPanel pageNum={1} komaNum={3} assetName="p1_koma3" />
              </div>
            </div>
          </div>

          <div className="webtoon-page">
            <div className="manga-page layout-p2v2" data-page="2">
              <div className="row top">
                <KomaPanel
                  pageNum={2}
                  komaNum={1}
                  assetName="p2_koma1"
                  className="full launcher"
                />
              </div>
              <div className="row mid">
                <KomaPanel pageNum={2} komaNum={2} assetName="p2_koma2" className="left" />
                <KomaPanel pageNum={2} komaNum={3} assetName="p2_koma3" className="thin" />
                <KomaPanel pageNum={2} komaNum={4} assetName="p2_koma4" className="right" />
              </div>
              <div className="row bottom">
                <KomaPanel pageNum={2} komaNum={5} assetName="p2_koma5" />
                <KomaPanel pageNum={2} komaNum={6} assetName="p2_koma6" />
              </div>
            </div>
          </div>

          <div className="webtoon-page">
            <div className="manga-page layout-p3v2" data-page="3">
              <div className="row top">
                <KomaPanel pageNum={3} komaNum={1} assetName="p3_koma1" className="launcher" />
              </div>
              <div className="row bottom">
                <KomaPanel pageNum={3} komaNum={2} assetName="p3_koma2" />
              </div>
            </div>
          </div>

          <div
            className={`webtoon-locked-section${aibotLocked ? ' is-locked' : ''}`}
            onClickCapture={(e) => {
              if (!aibotLocked) return;
              e.preventDefault();
              e.stopPropagation();
              showLockToast('Talk to your boss first');
            }}
          >
            {aibotLocked && (
              <div className="webtoon-lock-gate">
                <div className="webtoon-lock-card">
                  <div className="webtoon-lock-title">上司との会話を体験しよう</div>
                  <div className="webtoon-lock-desc">
                    上の上司のコマをタップして会話を最後まで体験すると、続きが解禁されます。
                  </div>
                </div>
              </div>
            )}

          <div className="webtoon-page">
            <div className="manga-page layout-p4v2" data-page="4">
              <KomaPanel pageNum={4} komaNum={1} assetName="p4_koma1" className="k1" />
              <KomaPanel pageNum={4} komaNum={2} assetName="p4_koma2" className="k2" />
              <KomaPanel pageNum={4} komaNum={3} assetName="p4_koma3" className="k3" />
              <KomaPanel pageNum={4} komaNum={4} assetName="p4_koma4" className="k4" />
              <KomaPanel pageNum={4} komaNum={5} assetName="p4_koma5" className="k5 launcher" />
            </div>
          </div>

          <div className="webtoon-page">
            <div className="manga-page layout-p5" data-page="5">
              <div className="row top">
                <KomaPanel pageNum={5} komaNum={1} assetName="p5_koma1" />
                <KomaPanel pageNum={5} komaNum={2} assetName="p5_koma2" />
              </div>
              <div className="row mid">
                <KomaPanel pageNum={5} komaNum={3} assetName="p5_koma3" />
                <KomaPanel pageNum={5} komaNum={4} assetName="p5_koma4" />
              </div>
              <div className="row bottom">
                <KomaPanel pageNum={5} komaNum={5} assetName="p5_koma5" />
              </div>
            </div>
          </div>

          <div className="webtoon-page">
            <div className="manga-page layout-p6" data-page="6">
              <div className="row top">
                <KomaPanel pageNum={6} komaNum={1} assetName="p6_koma1" />
                <KomaPanel pageNum={6} komaNum={2} assetName="p6_koma2" />
                <KomaPanel pageNum={6} komaNum={3} assetName="p6_koma3" />
              </div>
              <div className="row mid">
                <KomaPanel pageNum={6} komaNum={4} assetName="p6_koma4" className="launcher" />
              </div>
              <div className="row bottom">
                <KomaPanel pageNum={6} komaNum={5} assetName="p6_koma5" />
                <KomaPanel pageNum={6} komaNum={6} assetName="p6_koma6" />
              </div>
            </div>
          </div>

          <div className="webtoon-page">
            <div className="manga-page layout-p7b" data-page="7">
              <div className="row top">
                <KomaPanel pageNum={7} komaNum={1} assetName="p7_koma1" className="k1" />
                <KomaPanel pageNum={7} komaNum={2} assetName="p7_koma2" className="k2" />
              </div>
              <div className="row mid">
                <KomaPanel pageNum={7} komaNum={3} assetName="p7_koma3" className="k3" />
                <KomaPanel pageNum={7} komaNum={4} assetName="p7_koma4" className="k4" />
              </div>
              <div className="row bottom">
                <KomaPanel pageNum={7} komaNum={5} assetName="p7_koma5" className="k5 launcher" />
              </div>
            </div>
          </div>

          <div
            className={`webtoon-locked-section${
              !aibotLocked && tetrisLocked ? ' is-locked' : ''
            }`}
            onClickCapture={(e) => {
              if (aibotLocked || !tetrisLocked) return;
              e.preventDefault();
              e.stopPropagation();
              showLockToast('Tetris Over 300 point');
            }}
          >
            {!aibotLocked && tetrisLocked && (
              <div className="webtoon-lock-gate">
                <div className="webtoon-lock-card">
                  <div className="webtoon-lock-title">テトリスをクリアして続きを読もう</div>
                  <div className="webtoon-lock-desc">
                    上のテトリスのコマをタップして、スコア300点以上を達成すると、続きが解禁されます。
                  </div>
                </div>
              </div>
            )}

            <div className="webtoon-page">
              <div className="manga-page layout-p7" data-page="8">
                <div className="row top">
                  <KomaPanel pageNum={8} komaNum={1} assetName="p8_koma1" className="left" />
                  <KomaPanel pageNum={8} komaNum={2} assetName="p8_koma2" className="right" />
                </div>
                <div className="row mid">
                  <KomaPanel pageNum={8} komaNum={3} assetName="p8_koma3" />
                </div>
                <div className="row bottom">
                  <KomaPanel pageNum={8} komaNum={4} assetName="p8_koma4" />
                  <KomaPanel pageNum={8} komaNum={5} assetName="p8_koma5" />
                </div>
              </div>
            </div>

            <div className="webtoon-page">
              <div className="manga-page layout-p9" data-page="9">
                <div className="row top">
                  <KomaPanel pageNum={9} komaNum={1} assetName="p9_koma1" />
                  <KomaPanel pageNum={9} komaNum={2} assetName="p9_koma2" />
                </div>
                <div className="row mid">
                  <KomaPanel pageNum={9} komaNum={3} assetName="p9_koma3" />
                  <KomaPanel
                    pageNum={9}
                    komaNum={4}
                    assetName="p9_koma4"
                    className="launcher"
                  />
                </div>
                <div className="row bottom">
                  <KomaPanel pageNum={9} komaNum={5} assetName="p9_koma5" />
                  <KomaPanel pageNum={9} komaNum={6} assetName="p9_koma6" />
                </div>
              </div>
            </div>

            <div className="webtoon-cover">
              <img
                className="webtoon-cover-image"
                src="/images/cover_back.png"
                alt="cover_back"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
          </div>
        </div>
      </div>

      <div className={`zoom-overlay${launcher.zoom.isOverlayActive ? ' active' : ''}`} />

      {lockToastMessage && (
        <div className="webtoon-lock-toast" role="status">
          {lockToastMessage}
        </div>
      )}

      <AIBot
        isActive={launcher.active.isAIBotOpen}
        onClose={launcher.closeActive}
        onComplete={progress.markAIBotCompleted}
      />
      <MiniGameModal
        isOpen={launcher.active.isMiniGameOpen}
        onClose={launcher.closeActive}
        gameUrl={launcher.active.gameUrl}
        title={launcher.active.gameTitle}
        fullScreen={launcher.active.isFullScreen}
      />
    </>
  );
};

export default MangaWebtoon;
