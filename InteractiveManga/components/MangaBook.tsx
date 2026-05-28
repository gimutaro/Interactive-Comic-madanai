'use client';

import React, { useEffect, useRef, useState } from 'react';
import AIBot from './AIBot';
import MiniGameModal from './MiniGameModal';
import SharedKomaPanel, { KomaPanelProps } from './KomaPanel';
import { useGameLauncher } from '@/hooks/useGameLauncher';
import { useGameProgress } from '@/hooks/useGameProgress';
import { usePageTurnSound } from '@/hooks/usePageTurnSound';

type KomaProps = Omit<KomaPanelProps, 'hasUfoPrize' | 'isFreshUfoPrize' | 'onLaunch'>;

const TOTAL_SPREADS = 7;

const MangaBook: React.FC = () => {
  const [currentSpread, setCurrentSpread] = useState(1);

  const cameraRef = useRef<HTMLDivElement>(null);
  const sound = usePageTurnSound();
  const progress = useGameProgress();
  const launcher = useGameLauncher({
    cameraRef,
    onUfoPrizeCollected: progress.markPendingUfoPrize,
    onTetrisScoreAchieved: progress.markTetrisScore,
  });

  const showSpread = (n: number) => {
    if (launcher.isBusy) return;
    if (n === currentSpread) return;
    setCurrentSpread(n);
    sound.play();
  };

  const nextSpread = () => {
    if (launcher.isBusy) return;
    if (currentSpread === 3 && !progress.hasCompletedAIBot) return;
    if (currentSpread === 5 && !progress.hasTetrisScore) return;
    if (currentSpread < TOTAL_SPREADS) showSpread(currentSpread + 1);
  };

  const prevSpread = () => {
    if (launcher.isBusy) return;
    if (currentSpread > 1) showSpread(currentSpread - 1);
  };

  useEffect(() => {
    const canReveal = !launcher.zoom.isZoomingOut && !launcher.zoom.isZoomed;
    progress.finalizePendingUfoPrize(canReveal);
  }, [launcher.zoom.isZoomingOut, launcher.zoom.isZoomed, progress.finalizePendingUfoPrize]);

  useEffect(() => {
    if (currentSpread !== 4 && progress.isFreshUfoPrize) {
      progress.clearFreshUfoPrize();
    }
  }, [currentSpread, progress.isFreshUfoPrize, progress.clearFreshUfoPrize]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (launcher.active.isAIBotOpen || launcher.active.isMiniGameOpen) {
        if (e.key === 'Escape') launcher.closeActive();
        return;
      }
      if (e.key === 'ArrowRight') nextSpread();
      else if (e.key === 'ArrowLeft') prevSpread();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [launcher.active.isAIBotOpen, launcher.active.isMiniGameOpen, currentSpread]);

  useEffect(() => {
    let startX = 0;
    let endX = 0;

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.changedTouches[0].screenX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      endX = e.changedTouches[0].screenX;
      const diff = startX - endX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) nextSpread();
        else prevSpread();
      }
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSpread, launcher.active.isAIBotOpen, launcher.active.isMiniGameOpen]);

  const KomaPanel = (props: KomaProps) => (
    <SharedKomaPanel
      {...props}
      hasUfoPrize={progress.hasUfoPrize}
      isFreshUfoPrize={progress.isFreshUfoPrize}
      onLaunch={launcher.launchAt}
    />
  );

  return (
    <>
      <div
        className={`camera-zoom-container${launcher.zoom.isZoomingIn ? ' zooming-in' : ''}${
          launcher.zoom.isZoomingOut ? ' zooming-out' : ''
        }`}
        id="cameraZoomContainer"
        ref={cameraRef}
      >
        <div className="book-container" id="bookRoot">
          {/* 見開き1（表紙） */}
          <div
            className={`spread has-empty ${currentSpread === 1 ? 'active' : ''}`}
            data-spread="1"
          >
            <div className="page left">
              <div className="cover-container has-image" id="front-cover" data-asset="cover_front">
                <img
                  className="cover-image koma-img-el"
                  alt="cover_front"
                  data-name="cover_front"
                  src="/images/cover_front.png"
                  style={{ display: 'block' }}
                />
              </div>
              <div className="nav-area next" onClick={nextSpread} />
            </div>
            <div className="page right empty" />
          </div>

          {/* 見開き2：ページ1 + 表紙裏 */}
          <div className={`spread ${currentSpread === 2 ? 'active' : ''}`} data-spread="2">
            <div className="page left">
              <div className="manga-page layout-p1v2" data-page="1">
                <div className="row top">
                  <KomaPanel pageNum={1} komaNum={1} assetName="p1_koma1" />
                  <KomaPanel pageNum={1} komaNum={2} assetName="p1_koma2" />
                </div>
                <div className="row bottom">
                  <KomaPanel pageNum={1} komaNum={3} assetName="p1_koma3" />
                </div>
              </div>
              <div className="nav-area next" onClick={nextSpread} />
            </div>
            <div className="page right">
              <div className="front-inside">
                <div className="qr-code-area" aria-label="QR" />
              </div>
              <div className="nav-area prev" onClick={prevSpread} />
            </div>
          </div>

          {/* 見開き3：ページ3（左）+ ページ2（右） */}
          <div className={`spread ${currentSpread === 3 ? 'active' : ''}`} data-spread="3">
            <div className="page left">
              <div className="manga-page layout-p3v2" data-page="3">
                <div className="row top">
                  <KomaPanel pageNum={3} komaNum={1} assetName="p3_koma1" className="launcher" />
                </div>
                <div className="row bottom">
                  <KomaPanel pageNum={3} komaNum={2} assetName="p3_koma2" />
                </div>
              </div>
              <div
                className={`nav-area next${
                  currentSpread === 3 && !progress.hasCompletedAIBot ? ' aibot-locked' : ''
                }`}
                onClick={nextSpread}
              >
                {currentSpread === 3 && !progress.hasCompletedAIBot && (
                  <div className="tetris-requirement-tooltip">Talk to your boss first</div>
                )}
              </div>
            </div>
            <div className="page right">
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
              <div className="nav-area prev" onClick={prevSpread} />
            </div>
          </div>

          {/* 見開き4：ページ5（左） + ページ4（右） */}
          <div className={`spread ${currentSpread === 4 ? 'active' : ''}`} data-spread="4">
            <div className="page left">
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
              <div className="nav-area next" onClick={nextSpread} />
            </div>
            <div className="page right">
              <div className="manga-page layout-p4v2" data-page="4">
                <KomaPanel pageNum={4} komaNum={1} assetName="p4_koma1" className="k1" />
                <KomaPanel pageNum={4} komaNum={2} assetName="p4_koma2" className="k2" />
                <KomaPanel pageNum={4} komaNum={3} assetName="p4_koma3" className="k3" />
                <KomaPanel pageNum={4} komaNum={4} assetName="p4_koma4" className="k4" />
                <KomaPanel
                  pageNum={4}
                  komaNum={5}
                  assetName="p4_koma5"
                  className="k5 launcher"
                />
              </div>
              <div className="nav-area prev" onClick={prevSpread} />
            </div>
          </div>

          {/* 見開き5：ページ7（左） + ページ6（右） */}
          <div className={`spread ${currentSpread === 5 ? 'active' : ''}`} data-spread="5">
            <div className="page left">
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
                  <KomaPanel
                    pageNum={7}
                    komaNum={5}
                    assetName="p7_koma5"
                    className="k5 launcher"
                  />
                </div>
              </div>
              <div
                className={`nav-area next${
                  currentSpread === 5 && !progress.hasTetrisScore ? ' tetris-locked' : ''
                }`}
                onClick={nextSpread}
              >
                {currentSpread === 5 && !progress.hasTetrisScore && (
                  <div className="tetris-requirement-tooltip">Tetris Over 300 point</div>
                )}
              </div>
            </div>
            <div className="page right">
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
              <div className="nav-area prev" onClick={prevSpread} />
            </div>
          </div>

          {/* 見開き6：ページ9（左） + ページ8（右） */}
          <div className={`spread ${currentSpread === 6 ? 'active' : ''}`} data-spread="6">
            <div className="page left">
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
              <div className="nav-area next" onClick={nextSpread} />
            </div>
            <div className="page right">
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
              <div className="nav-area prev" onClick={prevSpread} />
            </div>
          </div>

          {/* 見開き7：裏表紙 */}
          <div
            className={`spread has-empty ${currentSpread === 7 ? 'active' : ''}`}
            data-spread="7"
          >
            <div className="page left empty" />
            <div className="page right">
              <div className="cover-container has-image" id="back-cover" data-asset="cover_back">
                <img
                  className="cover-image koma-img-el"
                  alt="cover_back"
                  data-name="cover_back"
                  src="/images/cover_back.png"
                  style={{ display: 'block' }}
                />
              </div>
              <div className="nav-area prev" onClick={prevSpread} />
            </div>
          </div>
        </div>
      </div>
      <div className={`zoom-overlay${launcher.zoom.isOverlayActive ? ' active' : ''}`} />
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

      <button
        type="button"
        className={`sound-toggle${sound.isOn ? ' on' : ' off'}`}
        aria-pressed={sound.isOn}
        aria-label={`ページめくり音 ${sound.isOn ? 'オン' : 'オフ'}`}
        onClick={sound.toggle}
      >
        {sound.isOn ? '🔊' : '🔇'}
      </button>
    </>
  );
};

export default MangaBook;
