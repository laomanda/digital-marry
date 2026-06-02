import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { weddingData } from '../../data/wedding.data'
import { useReducedMotionSafe } from '../../hooks/useReducedMotionSafe'
import logo from '../../assets/logo-400.webp'

interface PreloaderProps {
  onComplete: () => void
}

const getLoadingLabel = (progress: number) => {
  if (progress >= 100) return 'Ready'
  if (progress > 75) return 'Opening Invitation'
  if (progress > 45) return 'Curating Memories'
  if (progress > 15) return 'Menyiapkan Undangan'
  return 'Initializing'
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [isVisible, setIsVisible] = useState(true)
  const logoFillRef = useRef<HTMLImageElement | null>(null)
  const progressBarRef = useRef<HTMLSpanElement | null>(null)
  const progressTextRef = useRef<HTMLSpanElement | null>(null)
  const labelRef = useRef<HTMLSpanElement | null>(null)
  const { isMobile, shouldReduceMotion, shouldReduceHeavyMotion } = useReducedMotionSafe()

  const rootClasses = 'bg-[#050505] text-[#F5F5F0]'
  const mutedTextClass = 'text-[#A4A4A4]'
  const progressTextClass = 'text-[#F5F5F0]'
  const vignetteClass = 'bg-[radial-gradient(circle_at_center,transparent_0%,rgba(5,5,5,0.95)_100%)]'

  const prefersReducedMotionRuntime =
    shouldReduceMotion ||
    (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const isMobileViewport =
    isMobile || (typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches)
  const isLightweightMotion = shouldReduceHeavyMotion || isMobileViewport || prefersReducedMotionRuntime
  const preloaderDuration = prefersReducedMotionRuntime ? 700 : isMobileViewport ? 1150 : 1900
  const completedHoldDuration = prefersReducedMotionRuntime ? 60 : isMobileViewport ? 100 : 260
  const exitDuration = prefersReducedMotionRuntime ? 0.2 : isMobileViewport ? 0.28 : 0.48
  const exitDurationMs = exitDuration * 1000

  useEffect(() => {
    const previousBodyOverflow = document.body.style.overflow
    const previousHtmlOverflow = document.documentElement.style.overflow
    const previousBodyTouchAction = document.body.style.touchAction

    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    document.body.style.touchAction = 'none'

    let startTime: number | null = null
    let animationFrameId = 0
    let holdTimeout: ReturnType<typeof setTimeout> | null = null
    let exitTimeout: ReturnType<typeof setTimeout> | null = null
    let lastIntegerProgress = -1
    let lastLabel = ''

    const setProgressDom = (value: number) => {
      const clamped = Math.min(100, Math.max(0, value))
      const ratio = clamped / 100
      const integerProgress = Math.floor(clamped)

      if (progressBarRef.current) {
        progressBarRef.current.style.transform = `scaleX(${ratio})`
      }

      if (logoFillRef.current) {
        if (isLightweightMotion) {
          logoFillRef.current.style.opacity = String(0.22 + ratio * 0.78)
          logoFillRef.current.style.transform = `scale(${0.985 + ratio * 0.015})`
        } else {
          logoFillRef.current.style.clipPath = `inset(${100 - clamped}% 0 0 0)`
        }
      }

      if (integerProgress !== lastIntegerProgress) {
        lastIntegerProgress = integerProgress
        if (progressTextRef.current) {
          progressTextRef.current.textContent = String(integerProgress).padStart(3, '0')
        }

        const nextLabel = getLoadingLabel(integerProgress)
        if (nextLabel !== lastLabel) {
          lastLabel = nextLabel
          if (labelRef.current) {
            labelRef.current.textContent = nextLabel
          }
        }
      }
    }

    const animateLoader = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime
      const t = Math.min(elapsed / preloaderDuration, 1)
      const easedProgress = prefersReducedMotionRuntime
        ? t
        : isMobileViewport
          ? 1 - Math.pow(1 - t, 2.2)
          : 1 - Math.pow(1 - t, 3.4)

      setProgressDom(easedProgress * 100)

      if (t < 1) {
        animationFrameId = requestAnimationFrame(animateLoader)
        return
      }

      holdTimeout = setTimeout(() => {
        setIsVisible(false)
        exitTimeout = setTimeout(() => {
          document.body.style.overflow = previousBodyOverflow
          document.documentElement.style.overflow = previousHtmlOverflow
          document.body.style.touchAction = previousBodyTouchAction
          onComplete()
        }, exitDurationMs)
      }, completedHoldDuration)
    }

    setProgressDom(0)
    animationFrameId = requestAnimationFrame(animateLoader)

    return () => {
      cancelAnimationFrame(animationFrameId)
      if (holdTimeout) clearTimeout(holdTimeout)
      if (exitTimeout) clearTimeout(exitTimeout)
      document.body.style.overflow = previousBodyOverflow
      document.documentElement.style.overflow = previousHtmlOverflow
      document.body.style.touchAction = previousBodyTouchAction
    }
  }, [
    completedHoldDuration,
    exitDurationMs,
    isLightweightMotion,
    isMobileViewport,
    onComplete,
    prefersReducedMotionRuntime,
    preloaderDuration,
  ])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden transition-colors duration-500 ${rootClasses}`}
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: exitDuration, ease: [0.22, 1, 0.36, 1] },
          }}
          role="status"
          aria-label="Loading wedding invitation"
        >
          <div className={`pointer-events-none absolute inset-0 z-0 opacity-80 transition-colors duration-500 ${vignetteClass}`} aria-hidden="true" />

          <div className="absolute right-6 top-7 z-10 overflow-hidden md:right-12 md:top-12">
            <motion.div
              initial={isLightweightMotion ? false : { y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.12, duration: 0.55, ease: 'easeOut' }}
              className={`font-mono text-[9px] uppercase tracking-[0.34em] transition-colors duration-500 md:text-[10px] ${mutedTextClass}`}
            >
              {weddingData.wedding.dateFormatted}
            </motion.div>
          </div>

          <div className="relative z-10 mt-8 flex w-full flex-1 flex-col items-center justify-center px-6">
            <motion.div
              className="relative flex h-auto max-h-[44vh] w-[min(72vw,260px)] items-center justify-center md:w-[min(65vw,420px)]"
              initial={isLightweightMotion ? false : { scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: isLightweightMotion ? 0 : 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              <img
                src={logo}
                alt=""
                width="400"
                height="400"
                fetchPriority="high"
                decoding="async"
                className="pointer-events-none absolute h-full w-full select-none object-contain opacity-14 grayscale"
                aria-hidden="true"
              />

              <img
                ref={logoFillRef}
                src={logo}
                alt="Wedding logo"
                width="400"
                height="400"
                fetchPriority="high"
                decoding="async"
                className="pointer-events-none relative h-full w-full select-none object-contain opacity-25"
                style={{
                  clipPath: isLightweightMotion ? 'none' : 'inset(100% 0 0 0)',
                  transform: 'scale(0.985)',
                  transformOrigin: 'center center',
                }}
              />
            </motion.div>

            <div className="mt-8 h-px w-[min(220px,56vw)] overflow-hidden bg-[#F5F5F0]/10 md:mt-10">
              <span
                ref={progressBarRef}
                className="block h-full origin-left scale-x-0 bg-[#F5F5F0]/80"
                aria-hidden="true"
              />
            </div>
          </div>

          <div className="absolute bottom-10 left-1/2 z-10 flex w-full -translate-x-1/2 flex-col items-center gap-5 md:bottom-16">
            <motion.div
              className="flex flex-col items-center gap-2"
              initial={isLightweightMotion ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18, duration: 0.55, ease: 'easeOut' }}
            >
              <div className="flex items-baseline gap-2">
                <span
                  ref={progressTextRef}
                  className={`font-serif text-4xl font-light italic tracking-widest tabular-nums lining-nums transition-colors duration-500 md:text-5xl lg:text-6xl ${progressTextClass}`}
                >
                  000
                </span>
                <span className={`font-serif text-lg italic transition-colors duration-500 md:text-xl ${mutedTextClass}`}>%</span>
              </div>
            </motion.div>

            <span
              ref={labelRef}
              className={`block min-h-[16px] whitespace-nowrap font-mono text-[8px] uppercase tracking-[0.42em] transition-colors duration-500 md:text-[9px] ${mutedTextClass}`}
            >
              Initializing
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
