'use client';

import React, { useState, useEffect } from 'react';

interface AIBotProps {
  isActive: boolean;
  onClose: () => void;
}

const AIBot: React.FC<AIBotProps> = ({ isActive, onClose }) => {
  const [userInput, setUserInput] = useState('');
  const [responseText, setResponseText] = useState('お待たせ！');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showResponse, setShowResponse] = useState(false);

  useEffect(() => {
    if (isActive) {
      setShowResponse(true);
      setResponseText('お待たせ！');
    } else {
      setShowResponse(false);
      setUserInput('');
      setResponseText('');
    }
  }, [isActive]);

  const generateImageBackground = () => {
    const cells = [];
    for (let i = 0; i < 100; i++) {
      cells.push(<div key={i} className="bg-image-cell" />);
    }
    return cells;
  };

  const sendMessage = async () => {
    const message = userInput.trim();
    if (!message) return;

    setIsProcessing(true);
    setShowResponse(false);

    setTimeout(() => {
      setResponseText('考え中…');
      setShowResponse(true);
    }, 80);

    // Simulate API response
    setTimeout(() => {
      setResponseText(`「${message}」についての回答です。これはデモ版のため、実際のAI応答は実装されていません。`);
      setIsProcessing(false);
      setUserInput('');
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      <div className={`zoom-overlay ${isActive ? 'active' : ''}`} id="zoomOverlay" />
      <div className={`ai-bot-wrapper ${isActive ? 'active' : ''}`} id="aiBotWrapper">
        <div className="ai-bot-container">
          <div className="image-background" id="imageBackground">
            {generateImageBackground()}
          </div>
          <div className={`ai-response-area ${showResponse ? 'show' : ''}`} id="aiResponseArea">
            <div className="ai-response-text" id="aiResponseText">
              {responseText}
            </div>
          </div>
          <div className="input-area">
            <div className="input-container">
              <input
                type="text"
                className="text-input"
                id="userInput"
                placeholder="質問を入力してください…"
                autoComplete="off"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isProcessing}
              />
              <button
                className="submit-btn"
                id="submitBtn"
                type="button"
                onClick={sendMessage}
                disabled={isProcessing}
              >
                {isProcessing ? '処理中' : '回答'}
              </button>
            </div>
          </div>
        </div>
      </div>
      <span
        className={`back-btn ${isActive ? 'visible' : ''}`}
        id="backBtn"
        onClick={onClose}
      >
        &times;
      </span>
    </>
  );
};

export default AIBot;