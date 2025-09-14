'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { mangaPages, Panel, Page } from '@/lib/mangaData';

const MangaViewer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [currentPanelIndex, setCurrentPanelIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'page' | 'panel'>('page');
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const [loadedImages, setLoadedImages] = useState<Map<string, HTMLImageElement>>(new Map());
  const [isAnimating, setIsAnimating] = useState(false);
  const animationRef = useRef<number>();

  const currentPage = mangaPages[currentPageIndex];
  const currentPanel = currentPage.panels[currentPanelIndex];

  useEffect(() => {
    const loadImages = async () => {
      const imageMap = new Map<string, HTMLImageElement>();

      for (const page of mangaPages) {
        for (const panel of page.panels) {
          const img = new Image();
          img.src = panel.image;
          await new Promise((resolve) => {
            img.onload = resolve;
          });
          imageMap.set(panel.id, img);
        }
      }

      setLoadedImages(imageMap);
    };

    loadImages();
  }, []);

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (viewMode === 'page') {
      const pageScale = Math.min(
        canvas.width / 800,
        canvas.height / 1200
      ) * scale;

      const pageWidth = 800 * pageScale;
      const pageHeight = 1200 * pageScale;
      const pageX = (canvas.width - pageWidth) / 2 + offset.x;
      const pageY = (canvas.height - pageHeight) / 2 + offset.y;

      ctx.fillStyle = 'white';
      ctx.fillRect(pageX, pageY, pageWidth, pageHeight);

      for (const panel of currentPage.panels) {
        const img = loadedImages.get(panel.id);
        if (img) {
          ctx.drawImage(
            img,
            pageX + panel.x * pageScale,
            pageY + panel.y * pageScale,
            panel.width * pageScale,
            panel.height * pageScale
          );
        }

        ctx.strokeStyle = '#ddd';
        ctx.lineWidth = 1;
        ctx.strokeRect(
          pageX + panel.x * pageScale,
          pageY + panel.y * pageScale,
          panel.width * pageScale,
          panel.height * pageScale
        );
      }
    } else {
      const panelScale = Math.min(
        canvas.width / currentPanel.width,
        canvas.height / currentPanel.height
      ) * 0.9 * scale;

      const panelWidth = currentPanel.width * panelScale;
      const panelHeight = currentPanel.height * panelScale;
      const panelX = (canvas.width - panelWidth) / 2 + offset.x;
      const panelY = (canvas.height - panelHeight) / 2 + offset.y;

      const img = loadedImages.get(currentPanel.id);
      if (img) {
        ctx.drawImage(img, panelX, panelY, panelWidth, panelHeight);
      }
    }

    const navHeight = 60;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, canvas.height - navHeight, canvas.width, navHeight);

    ctx.fillStyle = 'white';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';

    const pageText = `Page ${currentPageIndex + 1} / ${mangaPages.length}`;
    const panelText = viewMode === 'panel' ? ` - Panel ${currentPanelIndex + 1} / ${currentPage.panels.length}` : '';
    const modeText = `[${viewMode === 'page' ? 'Page View' : 'Panel View'}]`;

    ctx.fillText(
      `${pageText}${panelText} ${modeText}`,
      canvas.width / 2,
      canvas.height - 25
    );
  }, [currentPageIndex, currentPanelIndex, viewMode, scale, offset, loadedImages]);

  useEffect(() => {
    drawCanvas();
    window.addEventListener('resize', drawCanvas);
    return () => window.removeEventListener('resize', drawCanvas);
  }, [drawCanvas]);

  const animateTransition = useCallback((
    startOffset: { x: number; y: number },
    endOffset: { x: number; y: number },
    startScale: number,
    endScale: number,
    duration: number
  ) => {
    setIsAnimating(true);
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);

      setOffset({
        x: startOffset.x + (endOffset.x - startOffset.x) * easeProgress,
        y: startOffset.y + (endOffset.y - startOffset.y) * easeProgress,
      });
      setScale(startScale + (endScale - startScale) * easeProgress);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  }, []);

  const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging || isAnimating) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (y > canvas.height - 60) return;

    if (viewMode === 'page') {
      const pageScale = Math.min(canvas.width / 800, canvas.height / 1200) * scale;
      const pageWidth = 800 * pageScale;
      const pageHeight = 1200 * pageScale;
      const pageX = (canvas.width - pageWidth) / 2 + offset.x;
      const pageY = (canvas.height - pageHeight) / 2 + offset.y;

      for (let i = 0; i < currentPage.panels.length; i++) {
        const panel = currentPage.panels[i];
        const panelX = pageX + panel.x * pageScale;
        const panelY = pageY + panel.y * pageScale;
        const panelWidth = panel.width * pageScale;
        const panelHeight = panel.height * pageScale;

        if (x >= panelX && x <= panelX + panelWidth &&
            y >= panelY && y <= panelY + panelHeight) {
          setCurrentPanelIndex(i);
          setViewMode('panel');
          animateTransition(offset, { x: 0, y: 0 }, scale, 1, 300);
          return;
        }
      }
    } else {
      if (currentPanelIndex < currentPage.panels.length - 1) {
        setCurrentPanelIndex(currentPanelIndex + 1);
      } else if (currentPageIndex < mangaPages.length - 1) {
        setCurrentPageIndex(currentPageIndex + 1);
        setCurrentPanelIndex(0);
        setViewMode('page');
        animateTransition({ x: 0, y: 0 }, { x: 0, y: 0 }, 1, 1, 300);
      }
    }
  }, [isDragging, isAnimating, viewMode, scale, offset, currentPageIndex, currentPanelIndex, animateTransition]);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setLastMousePos({ x: e.clientX, y: e.clientY });
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;

    const deltaX = e.clientX - lastMousePos.x;
    const deltaY = e.clientY - lastMousePos.y;

    setOffset(prev => ({
      x: prev.x + deltaX,
      y: prev.y + deltaY
    }));

    setLastMousePos({ x: e.clientX, y: e.clientY });
  }, [isDragging, lastMousePos]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const scaleFactor = e.deltaY > 0 ? 0.9 : 1.1;
    setScale(prev => Math.max(0.5, Math.min(3, prev * scaleFactor)));
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowRight':
        if (viewMode === 'panel') {
          if (currentPanelIndex < currentPage.panels.length - 1) {
            setCurrentPanelIndex(currentPanelIndex + 1);
          } else if (currentPageIndex < mangaPages.length - 1) {
            setCurrentPageIndex(currentPageIndex + 1);
            setCurrentPanelIndex(0);
            setViewMode('page');
          }
        } else if (currentPageIndex < mangaPages.length - 1) {
          setCurrentPageIndex(currentPageIndex + 1);
        }
        break;
      case 'ArrowLeft':
        if (viewMode === 'panel') {
          if (currentPanelIndex > 0) {
            setCurrentPanelIndex(currentPanelIndex - 1);
          } else if (currentPageIndex > 0) {
            setCurrentPageIndex(currentPageIndex - 1);
            setCurrentPanelIndex(mangaPages[currentPageIndex - 1].panels.length - 1);
          }
        } else if (currentPageIndex > 0) {
          setCurrentPageIndex(currentPageIndex - 1);
        }
        break;
      case ' ':
        setViewMode(viewMode === 'page' ? 'panel' : 'page');
        if (viewMode === 'panel') {
          setCurrentPanelIndex(0);
        }
        break;
      case 'Escape':
        if (viewMode === 'panel') {
          setViewMode('page');
        }
        break;
    }
  }, [viewMode, currentPageIndex, currentPanelIndex]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <canvas
      ref={canvasRef}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      style={{
        cursor: isDragging ? 'grabbing' : 'grab',
        touchAction: 'none'
      }}
    />
  );
};

export default MangaViewer;