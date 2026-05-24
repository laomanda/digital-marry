import { useLayoutEffect } from 'react';
import { gsap } from '../lib/gsap';

export function useGsap(callback: () => void, dependencies: any[] = []) {
  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      callback();
    });
    return () => ctx.revert();
  }, dependencies);
}
