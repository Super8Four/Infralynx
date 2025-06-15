import { useState, useEffect, useCallback } from 'react';

interface UseMediaQueryOptions {
  query: string;
  defaultMatches?: boolean;
}

export const useMediaQuery = ({
  query,
  defaultMatches = false,
}: UseMediaQueryOptions) => {
  const [matches, setMatches] = useState(defaultMatches);

  const handleChange = useCallback((event: MediaQueryListEvent) => {
    setMatches(event.matches);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [query, handleChange]);

  return matches;
};

// Predefined media query hooks
export const useIsMobile = () =>
  useMediaQuery({
    query: '(max-width: 767px)',
  });

export const useIsTablet = () =>
  useMediaQuery({
    query: '(min-width: 768px) and (max-width: 991px)',
  });

export const useIsDesktop = () =>
  useMediaQuery({
    query: '(min-width: 992px)',
  });

export const useIsLargeDesktop = () =>
  useMediaQuery({
    query: '(min-width: 1200px)',
  });

export const useIsExtraLargeDesktop = () =>
  useMediaQuery({
    query: '(min-width: 1400px)',
  });

export const useIsDarkMode = () =>
  useMediaQuery({
    query: '(prefers-color-scheme: dark)',
  });

export const useIsReducedMotion = () =>
  useMediaQuery({
    query: '(prefers-reduced-motion: reduce)',
  });

export const useIsHighContrast = () =>
  useMediaQuery({
    query: '(prefers-contrast: high)',
  });

export const useIsPrint = () =>
  useMediaQuery({
    query: 'print',
  });

export const useIsHover = () =>
  useMediaQuery({
    query: '(hover: hover)',
  });

export const useIsTouch = () =>
  useMediaQuery({
    query: '(hover: none)',
  }); 