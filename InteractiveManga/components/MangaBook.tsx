'use client';

import React, { useState, useEffect, useRef } from 'react';
import AIBot from './AIBot';
import MiniGameModal from './MiniGameModal';

const MangaBook: React.FC = () => {
  const [currentSpread, setCurrentSpread] = useState(1);
  const [isAIBotOpen, setIsAIBotOpen] = useState(false);
  const [isMiniGameOpen, setIsMiniGameOpen] = useState(false);
  const [currentGameUrl, setCurrentGameUrl] = useState('');
  const [currentGameTitle, setCurrentGameTitle] = useState('');
  const [isMiniGameFullScreen, setIsMiniGameFullScreen] = useState(false);
  const [isPageSoundOn, setIsPageSoundOn] = useState(true);
  const cleanupTimerRef = useRef<number | null>(null);
  const prizeRevealTimerRef = useRef<number | null>(null);
  const prizeFreshResetTimerRef = useRef<number | null>(null);
  const totalSpreads = 7;

  // UFOキャッチャーの景品獲得状態
  const [hasUfoPrize, setHasUfoPrize] = useState(false);
  const [pendingUfoPrize, setPendingUfoPrize] = useState(false);
  const [isFreshUfoPrize, setIsFreshUfoPrize] = useState(false);

  // テトリスのスコア達成状態
  const [hasTetrisScore, setHasTetrisScore] = useState(false);

  // Zoom animation state
  const cameraRef = useRef<HTMLDivElement>(null);
  const [isZoomingIn, setIsZoomingIn] = useState(false);
  const [isZoomingOut, setIsZoomingOut] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isZoomOverlayActive, setIsZoomOverlayActive] = useState(false);

  // Page-turn SE
  const pageTurnAudioRef = useRef<HTMLAudioElement | null>(null);
  const playPageTurnSE = () => {
    if (!isPageSoundOn) return;
    const el = pageTurnAudioRef.current;
    if (!el) return;
    try { el.currentTime = 0; } catch (_) {}
    el.play().catch(() => {});
  };

  const showSpread = (n: number) => {
    if (isAIBotOpen || isMiniGameOpen || isZoomingIn || isZoomingOut) return;
    if (n === currentSpread) return;
    setCurrentSpread(n);
    playPageTurnSE();
  };

  const nextSpread = () => {
    if (isAIBotOpen || isMiniGameOpen || isZoomingIn || isZoomingOut) return;
    // 見開き5（ページ7）から次に進む場合、テトリススコア300以上が必要
    if (currentSpread === 5 && !hasTetrisScore) {
      // スコア未達成の場合は進めない
      return;
    }
    if (currentSpread < totalSpreads) showSpread(currentSpread + 1);
  };

  const prevSpread = () => {
    if (isAIBotOpen || isMiniGameOpen || isZoomingIn || isZoomingOut) return;
    if (currentSpread > 1) showSpread(currentSpread - 1);
  };

  // ズームアウトを実行
  const performZoomOut = () => {
    if (cameraRef.current) {
      cameraRef.current.classList.remove('zooming-in');
      cameraRef.current.classList.add('zooming-out');
    }
    setIsZoomingIn(false);
    setIsZoomingOut(true);
    setIsZoomOverlayActive(false);
    // アニメーション終了でリセット
    cleanupTimerRef.current && window.clearTimeout(cleanupTimerRef.current);
    cleanupTimerRef.current = window.setTimeout(() => {
      if (cameraRef.current) {
        cameraRef.current.classList.remove('zooming-out');
      }
      setIsZoomed(false);
      setIsZoomingOut(false);
      // スクロール復帰
      try { document.body.style.overflow = ''; } catch (_) {}
    }, 720);
  };

  // 閉じ処理（ズーム演出あり）
  const closeActiveUI = () => {
    // UIを閉じる（モーダルは内部でフェードアウト）
    setIsMiniGameOpen(false);
    setIsAIBotOpen(false);
    setCurrentGameUrl('');
    setCurrentGameTitle('');
    setIsMiniGameFullScreen(false);
    // 表示中ならズームアウト
    if (isZoomed || isZoomingIn) {
      performZoomOut();
    }
  };

  useEffect(() => {
    //  iFrame内ミニゲームからの終了要求（×ボタンなど）を受け取る
    const handleMessage = (e: MessageEvent) => {
      try {
        if (e.origin !== window.location.origin) return;
      } catch (_) {}
      if (e && (e as any).data && (e as any).data.type === 'CLOSE_MINI_GAME') {
        closeActiveUI();
      }
      // UFOキャッチャーからの景品獲得通知
      if (e && (e as any).data && (e as any).data.type === 'UFO_PRIZE_COLLECTED') {
        const count = (e as any).data.count || 0;
        if (count >= 1) {
          // 現在の状態を確認してから処理
          setPendingUfoPrize(prevPending => {
            if (!prevPending) {
              // ズームアウト完了後に表示するためのフラグを立てる
              return true;
            }
            return prevPending;
          });
        }
      }
      // テトリスからのスコア達成通知
      if (e && (e as any).data && (e as any).data.type === 'TETRIS_SCORE_ACHIEVED') {
        setHasTetrisScore(prevScore => {
          if (!prevScore) {
            try {
              localStorage.setItem('hasTetrisScore', 'true');
            } catch (_) {}
            return true;
          }
          return prevScore;
        });
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
      // Clean up any pending timers on unmount
      if (cleanupTimerRef.current) {
        window.clearTimeout(cleanupTimerRef.current);
      }
      if (prizeRevealTimerRef.current) {
        window.clearTimeout(prizeRevealTimerRef.current);
        prizeRevealTimerRef.current = null;
      }
      if (prizeFreshResetTimerRef.current) {
        window.clearTimeout(prizeFreshResetTimerRef.current);
        prizeFreshResetTimerRef.current = null;
      }
    };
  }, []);

  // Prepare page-turn audio element
  useEffect(() => {
    // Use public/ served path
    const el = new Audio('/sounds/ThumbThrough.mp3');
    try { el.preload = 'auto'; } catch (_) {}
    // Volume: make page-turn sound a bit quieter
    try { el.volume = 0.25; } catch (_) {}
    pageTurnAudioRef.current = el;
    return () => {
      try { el.pause(); } catch (_) {}
      // Detach source to hint GC
      try { el.src = ''; } catch (_) {}
      pageTurnAudioRef.current = null;
    };
  }, []);

  // Optionally restore saved preference
  useEffect(() => {
    try {
      const saved = localStorage.getItem('pageSoundOn');
      if (saved != null) setIsPageSoundOn(saved === '1');
    } catch (_) {}
  }, []);

  // UFOキャッチャーの景品獲得状態を復元
  useEffect(() => {
    try {
      const saved = localStorage.getItem('hasUfoPrize');
      if (saved === 'true') setHasUfoPrize(true);
    } catch (_) {}
  }, []);

  // テトリスのスコア達成状態を復元
  useEffect(() => {
    try {
      const saved = localStorage.getItem('hasTetrisScore');
      if (saved === 'true') setHasTetrisScore(true);
    } catch (_) {}
  }, []);

  // Persist preference on change
  useEffect(() => {
    try { localStorage.setItem('pageSoundOn', isPageSoundOn ? '1' : '0'); } catch (_) {}
  }, [isPageSoundOn]);

  // ズームアウト完了後に景品獲得状態を反映（一拍置いてから表示）
  useEffect(() => {
    if (!isZoomingOut && !isZoomed && pendingUfoPrize && !hasUfoPrize) {
      if (prizeRevealTimerRef.current) {
        window.clearTimeout(prizeRevealTimerRef.current);
      }
      prizeRevealTimerRef.current = window.setTimeout(() => {
        prizeRevealTimerRef.current = null;
        setIsFreshUfoPrize(true);
        setHasUfoPrize(true);
        setPendingUfoPrize(false);
        try {
          localStorage.setItem('hasUfoPrize', 'true');
        } catch (_) {}

        if (prizeFreshResetTimerRef.current) {
          window.clearTimeout(prizeFreshResetTimerRef.current);
        }
        prizeFreshResetTimerRef.current = window.setTimeout(() => {
          setIsFreshUfoPrize(false);
          prizeFreshResetTimerRef.current = null;
        }, 1800);
      }, 600);
    }
    
    // Single cleanup function that handles both timers
    return () => {
      if (prizeRevealTimerRef.current) {
        window.clearTimeout(prizeRevealTimerRef.current);
        prizeRevealTimerRef.current = null;
      }
      if (prizeFreshResetTimerRef.current) {
        window.clearTimeout(prizeFreshResetTimerRef.current);
        prizeFreshResetTimerRef.current = null;
      }
    };
  }, [isZoomingOut, isZoomed, pendingUfoPrize, hasUfoPrize]);

  // ページを離れたタイミングで浮かび上がりアニメーションを確実に解除
  useEffect(() => {
    if (currentSpread !== 4 && isFreshUfoPrize) {
      if (prizeFreshResetTimerRef.current) {
        window.clearTimeout(prizeFreshResetTimerRef.current);
        prizeFreshResetTimerRef.current = null;
      }
      setIsFreshUfoPrize(false);
    }
  }, [currentSpread, isFreshUfoPrize]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // UI表示中はEscで閉じる、ナビは抑止
      if (isAIBotOpen || isMiniGameOpen) {
        if (e.key === 'Escape') closeActiveUI();
        return;
      }
      // Reading flow: Right arrow => next, Left arrow => previous
      if (e.key === 'ArrowRight') nextSpread();
      else if (e.key === 'ArrowLeft') prevSpread();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isAIBotOpen, isMiniGameOpen, currentSpread]);

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
  }, [currentSpread, isAIBotOpen, isMiniGameOpen]);

  // クリックしたコマの中心へズーム → アプリ起動
  const launchWithZoom = (el: HTMLDivElement, launchFn: () => void) => {
    if (!el || isZoomingIn || isZoomingOut || isAIBotOpen || isMiniGameOpen) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    if (cameraRef.current) {
      cameraRef.current.style.setProperty('--zoom-origin-x', `${cx}px`);
      cameraRef.current.style.setProperty('--zoom-origin-y', `${cy}px`);
      // ズーム開始
      cameraRef.current.classList.add('zooming-in');
    }
    setIsZoomOverlayActive(true);
    setIsZoomingIn(true);
    try { document.body.style.overflow = 'hidden'; } catch (_) {}

    // 起動パネルの軽いエフェクト
    el.classList.add('launching');
    window.setTimeout(() => el.classList.remove('launching'), 550);

    // ズーム完了直前にアプリ起動
    cleanupTimerRef.current && window.clearTimeout(cleanupTimerRef.current);
    cleanupTimerRef.current = window.setTimeout(() => {
      setIsZoomed(true);
      setIsZoomingIn(false);
      launchFn();
    }, 620);
  };


  const KomaPanel = ({ pageNum, komaNum, assetName, className = "" }: {
    pageNum: number;
    komaNum: number;
    assetName: string;
    className?: string;
  }) => {
    // ページ4のコマ3とコマ4に景品獲得状態に応じてクラスを追加
    const isPrizeUnlocked = pageNum === 4 && (komaNum === 3 || komaNum === 4) && hasUfoPrize;
    const finalClassName = `koma ${className}${isPrizeUnlocked ? ' prize-unlocked' : ''}${isPrizeUnlocked && isFreshUfoPrize ? ' prize-fresh' : ''}`;

    return (
    <div
      className={finalClassName}
      data-koma={komaNum}
      data-asset={assetName}
      onClick={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        // 起動対象かどうか判定（ズーム→起動）
        if (pageNum === 3 && komaNum === 1) {
          launchWithZoom(el, () => {
            setIsAIBotOpen(true);
            setCurrentGameUrl('');
            setCurrentGameTitle('');
            setIsMiniGameFullScreen(false);
          });
        } else if (pageNum === 7 && komaNum === 5) {
          launchWithZoom(el, () => {
            setIsAIBotOpen(false);
            setCurrentGameUrl('/mini-games/p7_koma5_tetris.html');
            setCurrentGameTitle('Tetris');
            setIsMiniGameFullScreen(true);
            setIsMiniGameOpen(true);
          });
        } else if (pageNum === 6 && komaNum === 4) {
          launchWithZoom(el, () => {
            setIsAIBotOpen(false);
            setCurrentGameUrl('/mini-games/p6_koma4_bubble.html');
            setCurrentGameTitle('Interactive Bubbles');
            setIsMiniGameFullScreen(true);
            setIsMiniGameOpen(true);
          });
        } else if (pageNum === 4 && komaNum === 5) {
          launchWithZoom(el, () => {
            setIsAIBotOpen(false);
            setCurrentGameUrl('/mini-games/p4_koma5_ufo.html');
            setCurrentGameTitle('UFO Catcher');
            setIsMiniGameFullScreen(true);
            setIsMiniGameOpen(true);
          });
        } else if (pageNum === 9 && komaNum === 4) {
          launchWithZoom(el, () => {
            setIsAIBotOpen(false);
            setCurrentGameUrl('/mini-games/p9_koma4_shooting.html');
            setCurrentGameTitle('Shooting');
            setIsMiniGameFullScreen(true);
            setIsMiniGameOpen(true);
          });
        } else if (pageNum === 2 && komaNum === 1) {
          launchWithZoom(el, () => {
            setIsAIBotOpen(false);
            setCurrentGameUrl('/mini-games/p2_koma1_email.html');
            setCurrentGameTitle('Email');
            setIsMiniGameFullScreen(true);
            setIsMiniGameOpen(true);
          });
        }
      }}
    >
      <img
        className="koma-img-el"
        alt={assetName}
        data-name={assetName}
        src={`/images/${assetName}.png`}
        loading="eager"
        decoding="async"
      />
    </div>
    );
  };

  return (
    <>
      {/* カメラズーム用コンテナで本体をラップ */}
      <div className={`camera-zoom-container${isZoomingIn ? ' zooming-in' : ''}${isZoomingOut ? ' zooming-out' : ''}`} id="cameraZoomContainer" ref={cameraRef}>
      <div className="book-container" id="bookRoot">
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
            <div className="nav-area next" onClick={nextSpread} />
          </div>
          <div className="page right">
            <div className="manga-page layout-p2v2" data-page="2">
              <div className="row top">
                <KomaPanel pageNum={2} komaNum={1} assetName="p2_koma1" className="full launcher" />
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
              <KomaPanel pageNum={4} komaNum={5} assetName="p4_koma5" className="k5 launcher" />
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
                <KomaPanel pageNum={7} komaNum={5} assetName="p7_koma5" className="k5 launcher" />
              </div>
            </div>
            <div
              className={`nav-area next${currentSpread === 5 && !hasTetrisScore ? ' tetris-locked' : ''}`}
              onClick={nextSpread}
            >
              {currentSpread === 5 && !hasTetrisScore && (
                <div className="tetris-requirement-tooltip">
                  Tetris Over 300 point
                </div>
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
                <KomaPanel pageNum={9} komaNum={4} assetName="p9_koma4" className="launcher" />
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
            </div>
            <div className="nav-area prev" onClick={prevSpread} />
          </div>
        </div>
      </div>
      </div>
      {/* ズーム用オーバーレイ（モーダルの下に敷く） */}
      <div className={`zoom-overlay${isZoomOverlayActive ? ' active' : ''}`} />
      {/* ズーム機能 */}
      <AIBot isActive={isAIBotOpen} onClose={closeActiveUI} />
      <MiniGameModal
        isOpen={isMiniGameOpen}
        onClose={closeActiveUI}
        gameUrl={currentGameUrl}
        title={currentGameTitle}
        fullScreen={isMiniGameFullScreen}
      />
      {/* Email client now runs as an iframe mini-game, similar to other games */}

      {/* ページめくり音 ON/OFF トグル */}
      <button
        type="button"
        className={`sound-toggle${isPageSoundOn ? ' on' : ' off'}`}
        aria-pressed={isPageSoundOn}
        aria-label={`ページめくり音 ${isPageSoundOn ? 'オン' : 'オフ'}`}
        onClick={() => setIsPageSoundOn(!isPageSoundOn)}
      >
        {isPageSoundOn ? '🔊' : '🔇'}
      </button>
    </>
  );
};

export default MangaBook;
