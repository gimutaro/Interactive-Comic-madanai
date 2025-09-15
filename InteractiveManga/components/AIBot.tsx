'use client';

import React, { useState, useEffect } from 'react';

interface AIBotProps {
  isActive: boolean;
  onClose: () => void;
}

const AIBot: React.FC<AIBotProps> = ({ isActive, onClose }) => {
  const [userInput, setUserInput] = useState('');
  const [responseText, setResponseText] = useState('お前、この仕事やってて楽しいか？');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showResponse, setShowResponse] = useState(false);
  const [messageCount, setMessageCount] = useState(0);

  useEffect(() => {
    if (isActive) {
      setShowResponse(true);
      setResponseText('お前、この仕事やってて楽しいか？');
    } else {
      setShowResponse(false);
      setUserInput('');
      setResponseText('');
      setMessageCount(0); // Reset message count when closing
    }
  }, [isActive]);


  const sendMessage = async () => {
    const message = userInput.trim();
    if (!message) return;

    // Check message limit
    if (messageCount >= 3) {
      setResponseText('回答の制限回数に達しました。これ以上質問はできません。');
      setShowResponse(true);
      return;
    }

    setIsProcessing(true);
    setShowResponse(false);

    setTimeout(() => {
      setResponseText('考え中…');
      setShowResponse(true);
    }, 80);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      setResponseText(data.response);
      setMessageCount(prevCount => prevCount + 1); // Increment message count
    } catch (error) {
      console.error('Error:', error);
      setResponseText('エラーが発生しました。もう一度お試しください。');
    } finally {
      setIsProcessing(false);
      setUserInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      <div className={`ai-bot-wrapper ${isActive ? 'active' : ''}`} id="aiBotWrapper">
        <div className="ai-bot-container">
          <div className="image-background" id="imageBackground" />
          <div className="message-counter">
            残り回答回数: {3 - messageCount}回
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
                placeholder={messageCount >= 3 ? "回答制限に達しました" : "上司に回答する…"}
                autoComplete="off"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isProcessing || messageCount >= 3}
              />
              <button
                className="submit-btn"
                id="submitBtn"
                type="button"
                onClick={sendMessage}
                disabled={isProcessing || messageCount >= 3}
              >
                {messageCount >= 3 ? '制限到達' : isProcessing ? '処理中' : '回答'}
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
