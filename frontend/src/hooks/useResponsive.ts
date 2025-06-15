import { useState, useEffect, useCallback } from 'react';

type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

interface BreakpointConfig {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
}

const defaultBreakpoints: BreakpointConfig = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1400,
};

export const useResponsive = (breakpoints: BreakpointConfig = defaultBreakpoints) => {
  const [currentBreakpoint, setCurrentBreakpoint] = useState<Breakpoint>('xs');

  const getBreakpoint = useCallback(
    (width: number): Breakpoint => {
      if (width >= breakpoints.xxl) return 'xxl';
      if (width >= breakpoints.xl) return 'xl';
      if (width >= breakpoints.lg) return 'lg';
      if (width >= breakpoints.md) return 'md';
      if (width >= breakpoints.sm) return 'sm';
      return 'xs';
    },
    [breakpoints]
  );

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setCurrentBreakpoint(getBreakpoint(width));
    };

    // Initial check
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [getBreakpoint]);

  const isBreakpoint = useCallback(
    (breakpoint: Breakpoint) => currentBreakpoint === breakpoint,
    [currentBreakpoint]
  );

  const isBreakpointOrLarger = useCallback(
    (breakpoint: Breakpoint) => {
      const breakpointValues = Object.entries(breakpoints) as [Breakpoint, number][];
      const currentValue = breakpoints[currentBreakpoint];
      const targetValue = breakpoints[breakpoint];
      return currentValue >= targetValue;
    },
    [currentBreakpoint, breakpoints]
  );

  const isBreakpointOrSmaller = useCallback(
    (breakpoint: Breakpoint) => {
      const breakpointValues = Object.entries(breakpoints) as [Breakpoint, number][];
      const currentValue = breakpoints[currentBreakpoint];
      const targetValue = breakpoints[breakpoint];
      return currentValue <= targetValue;
    },
    [currentBreakpoint, breakpoints]
  );

  return {
    currentBreakpoint,
    isBreakpoint,
    isBreakpointOrLarger,
    isBreakpointOrSmaller,
  };
}; 