import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { weddingData } from '../../data/wedding.data';
import { useReducedMotionSafe } from '../../hooks/useReducedMotionSafe'
import logo from '../../assets/logo-400.webp';

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [rawProgress, setRawProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const { isMobile, shouldReduceMotion, shouldReduceHeavyMotion } = useReducedMotionSafe();

  const rootClasses = 'bg-[#050505] text-[#F5F5F0]';
  const mutedTextClass = 'text-[#A4A4A4]';
  const progressTextClass = 'text-[#F5F5F0]';
  const vignetteClass = 'bg-[radial-gradient(circle_at_center,transparent_0%,rgba(5,5,5,0.95)_100%)]';
  const prefersReducedMotionRuntime =
    shouldReduceMotion ||
    (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const isMobileViewport =
    isMobile || (typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches);
  const isLightweightMotion = shouldReduceHeavyMotion || isMobileViewport || prefersReducedMotionRuntime;
  const preloaderDuration = prefersReducedMotionRuntime ? 900 : isMobileViewport ? 1400 : 2500;
  const completedHoldDuration = prefersReducedMotionRuntime ? 80 : isMobileViewport ? 140 : 600;
  const exitDuration = prefersReducedMotionRuntime ? 0.3 : isMobileViewport ? 0.45 : 0.8;
  const exitDurationMs = exitDuration * 1000;

  useEffect(() => {
    // Prevent scrolling while preloader is active
    const previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    let startTime: number | null = null;
    let animationFrameId: number;
    let timeout1: any;
    let timeout2: any;

    const animateLoader = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const t = Math.min(elapsed / preloaderDuration, 1);

      // Mobile uses a softer curve so the counter remains readable.
      const easeOutQuad = 1 - Math.pow(1 - t, 2);
      const easeOutQuart = 1 - Math.pow(1 - t, 4);
      const easedProgress = prefersReducedMotionRuntime ? t : isMobileViewport ? easeOutQuad : easeOutQuart;
      const currentProgress = easedProgress * 100;

      setProgress(Math.floor(currentProgress));
      setRawProgress(currentProgress);

      if (t < 1) {
        animationFrameId = requestAnimationFrame(animateLoader);
      } else {
        // Wait a brief moment at 100% to let user savor the completed logo
        timeout1 = setTimeout(() => {
          setIsVisible(false);

          // Wait for exit animation to finish before notifying parent to unmount
          timeout2 = setTimeout(() => {
            document.body.style.overflow = previousBodyOverflow;
            onComplete();
          }, exitDurationMs);
        }, completedHoldDuration);
      }
    };

    animationFrameId = requestAnimationFrame(animateLoader);

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      document.body.style.overflow = previousBodyOverflow;
    };
  }, [
    completedHoldDuration,
    exitDurationMs,
    isMobileViewport,
    onComplete,
    prefersReducedMotionRuntime,
    preloaderDuration,
  ]);

  // Determine current label based on progress for a dynamic storytelling feel
  let loadingLabel = 'Initializing';
  if (progress > 15) loadingLabel = 'Menyiapkan Undangan';
  if (progress > 45) loadingLabel = 'Curating Memories';
  if (progress > 75) loadingLabel = 'Opening Invitation';
  if (progress === 100) loadingLabel = 'Ready';

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden transition-colors duration-500 ${rootClasses}`}
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: prefersReducedMotionRuntime ? 1 : isMobileViewport ? 0.985 : 1,
            transition: { duration: exitDuration, ease: [0.22, 1, 0.36, 1] },
          }}
          role="status"
          aria-label="Loading wedding invitation"
        >
          {/* Subtle Film Grain / Vignette */}
          <div className={`absolute inset-0 pointer-events-none opacity-90 z-0 transition-colors duration-500 ${vignetteClass}`} aria-hidden="true" />
          
          {/* Top Left Editorial Mark */}
          <div className="absolute top-8 left-8 md:top-12 md:left-12 overflow-hidden z-10">
            <motion.div 
              initial={{ y: '100%', opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }} 
              transition={{ delay: 0.2, duration: 1, ease: 'easeOut' }}
              className="font-mono text-[9px] md:text-[10px] tracking-[0.4em] text-[#A4A4A4] uppercase"
            >
            </motion.div>
          </div>

          {/* Top Right Date */}
          <div className="absolute top-8 right-8 md:top-12 md:right-12 overflow-hidden z-10">
            <motion.div 
              initial={{ y: '100%', opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }} 
              transition={{ delay: 0.3, duration: 1, ease: 'easeOut' }}
              className={`font-mono text-[9px] md:text-[10px] tracking-[0.4em] uppercase transition-colors duration-500 ${mutedTextClass}`}
            >
              {weddingData.wedding.dateFormatted}
            </motion.div>
          </div>

          <div className="relative z-10 flex flex-col items-center justify-center w-full px-6 flex-1 mt-8">
            
            {/* The Logo Silhouette Fill */}
            <motion.div 
              className="relative flex justify-center items-center w-[min(80vw,320px)] md:w-[min(65vw,480px)] h-auto max-h-[50vh]"
              initial={{ 
                scale: isLightweightMotion ? 1 : 0.92,
                opacity: isLightweightMotion ? 1 : 0,
                filter: isLightweightMotion ? 'none' : 'blur(8px)'
              }}
              animate={{ 
                scale: 1, 
                opacity: 1,
                filter: isLightweightMotion ? 'none' : 'blur(0px)'
              }}
              transition={{ duration: isLightweightMotion ? 0.45 : 4, ease: 'easeOut' }}
            >
              {/* Dim/Background Logo */}
              <img 
                src={logo} 
                alt="" 
                width="400"
                height="400"
                fetchPriority="high"
                className={`absolute w-full h-full object-contain pointer-events-none select-none opacity-15 filter grayscale ${isLightweightMotion ? '' : 'blur-[2px]'}`}
                aria-hidden="true"
              />
              
              {/* Bright/Filled Logo with Mask */}
              <img 
                src={logo} 
                alt="Wedding logo" 
                width="400"
                height="400"
                fetchPriority="high"
                className="relative w-full h-full object-contain pointer-events-none select-none opacity-100 will-change-[clip-path]"
                style={{ 
                  clipPath: isLightweightMotion ? 'none' : `inset(${100 - rawProgress}% 0 0 0)`,
                  opacity: isLightweightMotion ? (rawProgress / 100) : 1
                }}
              />
            </motion.div>
          </div>

          {/* Bottom Cinematic Counter & Narrative */}
          <div className="absolute bottom-12 md:bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-6 z-10 w-full">
            <motion.div 
              className="flex flex-col items-center gap-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1, ease: 'easeOut' }}
            >
              <div className="flex items-baseline gap-2">
                <span className={`font-serif text-4xl md:text-5xl lg:text-6xl font-light italic tabular-nums lining-nums tracking-widest transition-colors duration-500 ${progressTextClass}`}>
                  {String(progress).padStart(3, '0')}
                </span>
                <span className={`font-serif text-lg md:text-xl italic transition-colors duration-500 ${mutedTextClass}`}>%</span>
              </div>
            </motion.div>

            <motion.div 
              className="overflow-hidden h-[16px] flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
            >
              <AnimatePresence mode="wait">
                <motion.span 
                  key={loadingLabel}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                  className={`block font-mono text-[8px] md:text-[9px] tracking-[0.5em] uppercase whitespace-nowrap transition-colors duration-500 ${mutedTextClass}`}
                >
                  {loadingLabel}
                </motion.span>
              </AnimatePresence>
            </motion.div>
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}
