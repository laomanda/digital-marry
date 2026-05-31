import { useState, useEffect } from 'react';

interface ReducedMotionSafeState {
  prefersReducedMotion: boolean;
  isMobile: boolean;
  shouldReduceMotion: boolean;
  shouldReduceHeavyMotion: boolean;
}

export function useReducedMotionSafe(): ReducedMotionSafeState {
  const [state, setState] = useState<ReducedMotionSafeState>({
    prefersReducedMotion: false,
    isMobile: false,
    shouldReduceMotion: false,
    shouldReduceHeavyMotion: false,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mobileQuery = window.matchMedia('(max-width: 767px)');

    const updateState = () => {
      const prefersReduced = reducedMotionQuery.matches;
      const mobile = mobileQuery.matches;
      
      setState({
        prefersReducedMotion: prefersReduced,
        isMobile: mobile,
        // OS preference only
        shouldReduceMotion: prefersReduced,
        // Mobile OR OS preference
        shouldReduceHeavyMotion: prefersReduced || mobile,
      });
    };

    updateState();

    // Listeners for dynamic changes (e.g., resizing or system settings update)
    if (reducedMotionQuery.addEventListener) {
      reducedMotionQuery.addEventListener('change', updateState);
      mobileQuery.addEventListener('change', updateState);
    } else {
      // Fallback for older browsers
      reducedMotionQuery.addListener(updateState);
      mobileQuery.addListener(updateState);
    }

    return () => {
      if (reducedMotionQuery.removeEventListener) {
        reducedMotionQuery.removeEventListener('change', updateState);
        mobileQuery.removeEventListener('change', updateState);
      } else {
        reducedMotionQuery.removeListener(updateState);
        mobileQuery.removeListener(updateState);
      }
    };
  }, []);

  return state;
}
