import { useState, useEffect, useCallback } from 'react';

interface WindowSize {
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLargeDesktop: boolean;
  isExtraLargeDesktop: boolean;
}

const MOBILE_BREAKPOINT = 767;
const TABLET_BREAKPOINT = 991;
const DESKTOP_BREAKPOINT = 992;
const LARGE_DESKTOP_BREAKPOINT = 1200;
const EXTRA_LARGE_DESKTOP_BREAKPOINT = 1400;

export const useWindowSize = (debounceMs = 100) => {
  const [windowSize, setWindowSize] = useState<WindowSize>(() => ({
    width: window.innerWidth,
    height: window.innerHeight,
    isMobile: window.innerWidth <= MOBILE_BREAKPOINT,
    isTablet:
      window.innerWidth > MOBILE_BREAKPOINT &&
      window.innerWidth <= TABLET_BREAKPOINT,
    isDesktop: window.innerWidth >= DESKTOP_BREAKPOINT,
    isLargeDesktop: window.innerWidth >= LARGE_DESKTOP_BREAKPOINT,
    isExtraLargeDesktop: window.innerWidth >= EXTRA_LARGE_DESKTOP_BREAKPOINT,
  }));

  const handleResize = useCallback(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    setWindowSize({
      width,
      height,
      isMobile: width <= MOBILE_BREAKPOINT,
      isTablet: width > MOBILE_BREAKPOINT && width <= TABLET_BREAKPOINT,
      isDesktop: width >= DESKTOP_BREAKPOINT,
      isLargeDesktop: width >= LARGE_DESKTOP_BREAKPOINT,
      isExtraLargeDesktop: width >= EXTRA_LARGE_DESKTOP_BREAKPOINT,
    });
  }, []);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const debouncedHandleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleResize, debounceMs);
    };

    window.addEventListener('resize', debouncedHandleResize);
    window.addEventListener('orientationchange', debouncedHandleResize);

    return () => {
      window.removeEventListener('resize', debouncedHandleResize);
      window.removeEventListener('orientationchange', debouncedHandleResize);
      clearTimeout(timeoutId);
    };
  }, [handleResize, debounceMs]);

  return windowSize;
}; 