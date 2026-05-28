'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { buildDialogue, ChoiceId } from '@/lib/aiBotDialogue';

interface AIBotProps {
  isActive: boolean;
  onClose: () => void;
  onComplete?: () => void;
}

const AIBot: React.FC<AIBotProps> = ({ isActive, onClose, onComplete }) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [choice, setChoice] = useState<ChoiceId | null>(null);

  useEffect(() => {
    if (isActive) {
      setStepIndex(0);
      setChoice(null);
    }
  }, [isActive]);

  const steps = useMemo(() => buildDialogue(choice), [choice]);
  const currentStep = steps[stepIndex];
  const isFinished = !currentStep;

  useEffect(() => {
    if (isActive && isFinished) {
      onComplete?.();
      onClose();
    }
  }, [isActive, isFinished, onComplete, onClose]);

  const advance = useCallback(() => {
    if (isFinished) return;
    if (currentStep.kind === 'message') {
      setStepIndex((prev) => prev + 1);
    }
  }, [currentStep, isFinished]);

  const selectChoice = useCallback((id: ChoiceId) => {
    setChoice(id);
    setStepIndex((prev) => prev + 1);
  }, []);

  const handleBoxClick = useCallback(() => {
    if (currentStep?.kind === 'message' || isFinished) advance();
  }, [currentStep, isFinished, advance]);

  return (
    <>
      <div className={`ai-bot-wrapper ${isActive ? 'active' : ''}`}>
        <div className="ai-bot-container">
          <div className="image-background" />

          <div
            className="ai-dialogue-box"
            onClick={handleBoxClick}
            role="dialog"
            aria-label="営業部長との会話"
          >
            <div className="ai-dialogue-speaker">営業部長</div>

            {currentStep?.kind === 'message' && (
              <>
                <div className="ai-dialogue-text">{currentStep.text}</div>
                <div className="ai-dialogue-next" aria-hidden="true">
                  ▼ タップで次へ
                </div>
              </>
            )}

            {currentStep?.kind === 'choice' && (
              <div
                className="ai-choice-list"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="ai-choice-prompt">どう答える？</div>
                {currentStep.options.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    className="ai-choice-btn"
                    onClick={() => selectChoice(opt.id)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}

          </div>
        </div>
      </div>
      <span
        className={`back-btn ${isActive ? 'visible' : ''}`}
        onClick={onClose}
        role="button"
        aria-label="閉じる"
      >
        &times;
      </span>
    </>
  );
};

export default AIBot;
