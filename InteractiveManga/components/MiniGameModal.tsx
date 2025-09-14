'use client';

import React from 'react';

interface MiniGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameUrl: string;
  title?: string;
  fullScreen?: boolean;
}

const MiniGameModal: React.FC<MiniGameModalProps> = ({ isOpen, onClose, gameUrl, title = 'Mini Game', fullScreen = false }) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div
      className="mini-game-backdrop"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div className={`mini-game-modal${fullScreen ? ' fullscreen' : ''}`}>
        <div className="mini-game-header">
          <h2 className="mini-game-title">{title}</h2>
          <button
            onClick={onClose}
            className="mini-game-close"
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <div className="mini-game-content">
          <iframe
            src={gameUrl}
            className="mini-game-iframe"
            title={title}
            sandbox="allow-scripts allow-same-origin allow-forms"
          />
        </div>
      </div>
    </div>
  );
};

export default MiniGameModal;
