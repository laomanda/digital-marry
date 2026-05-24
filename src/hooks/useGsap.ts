import { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useGsap(callback: () => void, dependencies: any[] = []) {
  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      callback();
    });
    return () => ctx.revert();
  }, dependencies);
}
