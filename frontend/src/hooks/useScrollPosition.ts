import { useState, useEffect, useCallback } from 'react';

interface ScrollPosition {
  x: number;
  y: number;
  direction: 'up' | 'down' | null;
  isScrolling: boolean;
}

export const useScrollPosition = (throttleMs = 100) => {
  const [scrollPosition, setScrollPosition] = useState<ScrollPosition>(() => ({
    x: window.pageXOffset,
    y: window.pageYOffset,
    direction: null,
    isScrolling: false,
  }));

  const handleScroll = useCallback(() => {
    const x = window.pageXOffset;
    const y = window.pageYOffset;
    const direction = y > scrollPosition.y ? 'down' : 'up';

    setScrollPosition((prev) => ({
      x,
      y,
      direction,
      isScrolling: true,
    }));

    // Reset isScrolling after scrolling stops
    const scrollTimeout = setTimeout(() => {
      setScrollPosition((prev) => ({
        ...prev,
        isScrolling: false,
      }));
    }, throttleMs);

    return () => clearTimeout(scrollTimeout);
  }, [scrollPosition.y, throttleMs]);

  useEffect(() => {
    let lastScrollTime = Date.now();
    let cleanup: (() => void) | undefined;

    const throttledHandleScroll = () => {
      const now = Date.now();
      if (now - lastScrollTime >= throttleMs) {
        cleanup?.();
        cleanup = handleScroll();
        lastScrollTime = now;
      }
    };

    window.addEventListener('scroll', throttledHandleScroll);
    window.addEventListener('resize', throttledHandleScroll);

    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
      window.removeEventListener('resize', throttledHandleScroll);
      cleanup?.();
    };
  }, [handleScroll, throttleMs]);

  return scrollPosition;
}; 