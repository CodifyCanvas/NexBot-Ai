'use client';

import { useState, useEffect } from 'react';

export type Breakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

const breakpointOrder: Breakpoint[] = ['sm', 'md', 'lg', 'xl', '2xl'];

/**
 * Returns the current screen size breakpoint ('sm', 'md', etc.)
 */
export function useResponsiveBreakpoint(): Breakpoint {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>('2xl');

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;

      if (width < 640) setBreakpoint('sm');
      else if (width < 768) setBreakpoint('md');
      else if (width < 1024) setBreakpoint('lg');
      else if (width < 1280) setBreakpoint('xl');
      else setBreakpoint('2xl');
    };

    updateBreakpoint(); // run on mount
    window.addEventListener('resize', updateBreakpoint);

    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  return breakpoint;
}

/**
 * Compares two breakpoints to determine if current is less than or equal to target
 */
export function isBreakpointLessThanOrEqual(current: Breakpoint, target: Breakpoint): boolean {
  return breakpointOrder.indexOf(current) <= breakpointOrder.indexOf(target);
}
