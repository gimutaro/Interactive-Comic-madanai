'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import AIBot from './AIBot';
import MiniGameModal from './MiniGameModal';

const MangaBook: React.FC = () => {
  const [currentSpread, setCurrentSpread] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isAIBotOpen, setIsAIBotOpen] = useState(false);
  const [isMiniGameOpen, setIsMiniGameOpen] = useState(false);
  const [currentGameUrl, setCurrentGameUrl] = useState('');
  const [currentGameTitle, setCurrentGameTitle] = useState('');
  const [isMiniGameFullScreen, setIsMiniGameFullScreen] = useState(false);
  const bookRef = useRef<HTMLDivElement>(null);
  const totalSpreads = 7;

  const showSpread = (n: number) => {
    if (isZoomed) return;
    setCurrentSpread(n);
  };

  const nextSpread = () => {
    if (isZoomed) return;
    if (currentSpread < totalSpreads) showSpread(currentSpread + 1);
  };

  const prevSpread = () => {
    if (isZoomed) return;
    if (currentSpread > 1) showSpread(currentSpread - 1);
  };

  const zoomIntoKoma = (komaEl: HTMLElement) => {
    if (isZoomed || !bookRef.current) return;

    const rect = komaEl.getBoundingClientRect();
    const bookRect = bookRef.current.getBoundingClientRect();
    const tweakX = -24;
    const cx = rect.left - bookRect.left + rect.width / 2 + tweakX;
    const cy = rect.top - bookRect.top + rect.height / 2;

    bookRef.current.style.setProperty('--zoom-origin-x', `${cx}px`);
    bookRef.current.style.setProperty('--zoom-origin-y', `${cy}px`);
    document.body.style.overflow = 'hidden';
    bookRef.current.classList.add('zooming-in');

    setTimeout(() => {
      // ズーム状態へ移行（以降の演出は useEffect で制御）
      setIsZoomed(true);
    }, 400);
  };

  const zoomOut = () => {
    if (!isZoomed || !bookRef.current) return;

    setIsZoomed(false);
    setIsMiniGameOpen(false);
    setIsAIBotOpen(false);
    setCurrentGameUrl('');
    setCurrentGameTitle('');
    setIsMiniGameFullScreen(false);
    bookRef.current.classList.remove('zooming-in');
    bookRef.current.classList.add('zooming-out');

    setTimeout(() => {
      if (bookRef.current) {
        bookRef.current.classList.remove('zooming-out');
      }
      document.body.style.overflow = 'auto';
    }, 720);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isZoomed) {
        if (e.key === 'Escape') zoomOut();
        return;
      }
      if (e.key === 'ArrowLeft') nextSpread();
      else if (e.key === 'ArrowRight') prevSpread();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isZoomed, currentSpread]);

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
  }, [currentSpread, isZoomed]);

  // ズーム完了後にミニゲームURLが設定されていればモーダルを開く
  useEffect(() => {
    if (isZoomed && currentGameUrl) {
      setIsMiniGameOpen(true);
    }
  }, [isZoomed, currentGameUrl]);

  const KomaPanel = ({ pageNum, komaNum, assetName, className = "" }: {
    pageNum: number;
    komaNum: number;
    assetName: string;
    className?: string;
  }) => (
    <div
      className={`koma ${className}`}
      data-koma={komaNum}
      data-asset={assetName}
      onClick={(e) => {
        if (pageNum === 3 && komaNum === 1) {
          // p3_koma1: AIボットのみ（ゲーム状態をクリア）
          setCurrentGameUrl('');
          setCurrentGameTitle('');
          setIsMiniGameFullScreen(false);
          // 先にズーム演出を実行し、その後にAIボットを表示
          zoomIntoKoma(e.currentTarget);
          setTimeout(() => setIsAIBotOpen(true), 450);
        } else if (pageNum === 7 && komaNum === 5) {
          // p7_koma5: ズーム後にテトリスを起動
          setIsAIBotOpen(false);
          setCurrentGameUrl('/mini-games/p7_koma5_tetris.html');
          setCurrentGameTitle('Tetris');
          setIsMiniGameFullScreen(true);
          zoomIntoKoma(e.currentTarget);
        } else if (pageNum === 4 && komaNum === 5) {
          // p4_koma5: ズーム後にUFOキャッチャーをフルスクリーン起動
          setIsAIBotOpen(false);
          setCurrentGameUrl('/mini-games/p4_koma5_ufo.html');
          setCurrentGameTitle('UFO Catcher');
          setIsMiniGameFullScreen(true);
          zoomIntoKoma(e.currentTarget);
        }
      }}
    >
      <img
        className="koma-img-el"
        alt={assetName}
        data-name={assetName}
        src={`/images/${assetName}.png`}
      />
      <span className="asset-badge">{assetName}</span>
    </div>
  );

  return (
    <>
      <div className="book-container" id="bookRoot" ref={bookRef}>
        {/* 見開き1（表紙） */}
        <div className={`spread has-empty ${currentSpread === 1 ? 'active' : ''}`} data-spread="1">
          <div className="page left">
            <div className="cover-container has-image" id="front-cover" data-asset="cover_front">
              <img
                className="cover-image koma-img-el"
                alt="cover_front"
                data-name="cover_front"
                src="/images/cover_front.png"
                style={{ display: 'block' }}
              />
              <span className="asset-badge">cover_front</span>
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
                <KomaPanel pageNum={3} komaNum={1} assetName="p3_koma1" />
              </div>
              <div className="row bottom">
                <KomaPanel pageNum={3} komaNum={2} assetName="p3_koma2" />
              </div>
            </div>
            <div className="nav-area next" onClick={nextSpread} />
          </div>
          <div className="page right">
            <div className="manga-page layout-p2v2" data-page="2">
              <div className="row top">
                <KomaPanel pageNum={2} komaNum={1} assetName="p2_koma1" className="full" />
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
              <KomaPanel pageNum={4} komaNum={5} assetName="p4_koma5" className="k5" />
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
                <KomaPanel pageNum={7} komaNum={5} assetName="p7_koma5" className="k5" />
              </div>
            </div>
            <div className="nav-area next" onClick={nextSpread} />
          </div>
          <div className="page right">
            <div className="manga-page layout-p6" data-page="6">
              <div className="row top">
                <KomaPanel pageNum={6} komaNum={1} assetName="p6_koma1" />
                <KomaPanel pageNum={6} komaNum={2} assetName="p6_koma2" />
                <KomaPanel pageNum={6} komaNum={3} assetName="p6_koma3" />
              </div>
              <div className="row mid">
                <KomaPanel pageNum={6} komaNum={4} assetName="p6_koma4" />
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
                <KomaPanel pageNum={9} komaNum={4} assetName="p9_koma4" />
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
        <div className={`spread has-empty ${currentSpread === 7 ? 'active' : ''}`} data-spread="7">
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
              <span className="asset-badge">cover_back</span>
            </div>
            <div className="nav-area prev" onClick={prevSpread} />
          </div>
        </div>
      </div>

      <AIBot isActive={isAIBotOpen} onClose={zoomOut} />
      <MiniGameModal
        isOpen={isMiniGameOpen && isZoomed}
        onClose={zoomOut}
        gameUrl={currentGameUrl}
        title={currentGameTitle}
        fullScreen={isMiniGameFullScreen}
      />
    </>
  );
};

export default MangaBook;
