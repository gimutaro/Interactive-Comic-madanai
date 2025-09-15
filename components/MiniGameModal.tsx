'use client';

import React, { useEffect, useRef, useState } from 'react';

interface MiniGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameUrl: string;
  title?: string;
  fullScreen?: boolean;
}

const MiniGameModal: React.FC<MiniGameModalProps> = ({ isOpen, onClose, gameUrl, title = 'Mini Game', fullScreen = false }) => {
  // Keep the modal mounted during exit to avoid flicker.
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isClosing, setIsClosing] = useState(false);
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setIsClosing(false);
    } else if (shouldRender) {
      // Start local fade-out when parent requests close
      setIsClosing(true);
    }
  }, [isOpen, shouldRender]);

  // When the backdrop transition finishes while closing, unmount locally.
  const handleTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (!isClosing) return;
    if (e.target === backdropRef.current && e.propertyName === 'opacity') {
      setShouldRender(false);
      setIsClosing(false);
    }
  };

  if (!shouldRender) return null;

  const requestClose = () => {
    // Trigger local fade-out first; parent has already set isOpen=false
    // in some cases (postMessage). If not, call onClose to initiate it.
    if (!isClosing) setIsClosing(true);
    if (isOpen) onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      requestClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      requestClose();
    }
  };

  return (
    <div
      ref={backdropRef}
      className={`mini-game-backdrop${isClosing ? ' closing' : ''}`}
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
      onTransitionEnd={handleTransitionEnd}
    >
      <div className={`mini-game-modal${fullScreen ? ' fullscreen' : ''}${isClosing ? ' closing' : ''}`}>
        <div className="mini-game-header">
          <h2 className="mini-game-title">{title}</h2>
          <button
            onClick={requestClose}
            className="mini-game-close"
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <div className="mini-game-content">
          {gameUrl && gameUrl.trim() !== '' ? (
            <iframe
              src={gameUrl}
              className={`mini-game-iframe${isClosing ? ' hide' : ''}`}
              title={title}
              sandbox="allow-scripts allow-same-origin allow-forms"
              allow="fullscreen; pointer-lock; gamepad; accelerometer; gyroscope"
              allowFullScreen
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default MiniGameModal;
