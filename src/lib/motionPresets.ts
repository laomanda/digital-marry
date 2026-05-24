/**
 * Global Motion Presets for GSAP and Anime.js animations.
 * Provides consistent typography, fades, and reveal parameters.
 */

export const motionPresets = {
  fadeUp: {
    from: { opacity: 0, y: 40 },
    to: { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }
  },
  fadeIn: {
    from: { opacity: 0 },
    to: { opacity: 1, duration: 0.8, ease: 'power2.out' }
  },
  titleBreath: {
    from: { opacity: 0, y: 32, letterSpacing: '0.04em' },
    to: { opacity: 1, y: 0, letterSpacing: '0em', duration: 1.1, ease: 'power3.out' }
  },
  imageReveal: {
    from: { opacity: 0, scale: 1.08 },
    to: { opacity: 1, scale: 1, duration: 1.2, ease: 'power3.out' }
  },
  lineDraw: {
    from: { scaleX: 0, opacity: 0 },
    to: { scaleX: 1, opacity: 1, duration: 0.8, ease: 'power2.out', transformOrigin: 'left center' }
  },
  cardStagger: {
    from: { opacity: 0, y: 32 },
    to: { opacity: 1, y: 0, stagger: 0.12, duration: 0.8, ease: 'power3.out' }
  },
  numberReveal: {
    from: { opacity: 0, y: 24, scale: 0.96 },
    to: { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power3.out' }
  }
};

export type MotionPresets = typeof motionPresets;
