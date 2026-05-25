import { useState, useRef, useEffect, useCallback } from 'react'
import { gsap } from '../../lib/gsap'
import { animate } from 'animejs'
import { weddingData } from '../../data/wedding.data'
import { useScrollLock } from '../../hooks/useScrollLock'
import { useReducedMotionSafe } from '../../hooks/useReducedMotionSafe'

interface CoverSectionProps {
  onOpen?: () => void
  onOpened?: () => void
  isPreloaderDone?: boolean
}

/**
 * Splits a string into individual <span> elements for letter stagger animation.
 * Spaces are preserved as non-breaking spaces with explicit width.
 */
function LetterSplit({ text, className }: { text: string; className?: string }) {
  return (
    <span className={className} aria-label={text}>
      {text.split('').map((char, i) => (
        <span
          key={i}
          className="cover-char"
          aria-hidden="true"
          style={{ opacity: 0, ...(char === ' ' ? { width: '0.3em' } : undefined) }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  )
}

export function CoverSection({ onOpen, onOpened, isPreloaderDone = true }: CoverSectionProps) {
  const [isOpened, setIsOpened] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const introTlRef = useRef<gsap.core.Timeline | null>(null)
  const exitTlRef = useRef<gsap.core.Timeline | null>(null)
  const { shouldReduceMotion } = useReducedMotionSafe()

  // Lock scroll while cover is active
  useScrollLock(!isOpened)

  // --- INTRO ANIMATION ---
  useEffect(() => {
    if (!sectionRef.current || isOpened || !isPreloaderDone) return

    const ctx = gsap.context(() => {
      const root = sectionRef.current!

      if (shouldReduceMotion) {
        // Reduced motion: make everything visible instantly
        gsap.set(root.querySelectorAll('[data-cover-line], [data-cover-label], [data-cover-date], [data-cover-guest], [data-cover-button]'), {
          opacity: 1,
          y: 0,
        })
        gsap.set(root.querySelectorAll('.cover-char'), { opacity: 1 })
        gsap.set(root.querySelector('[data-cover-bg]'), { scale: 1, opacity: 1 })
        return
      }

      const tl = gsap.timeline({ delay: 0.3 })
      introTlRef.current = tl

      // Background subtle zoom
      tl.fromTo(
        '[data-cover-bg]',
        { scale: 1.12, opacity: 0 },
        { scale: 1, opacity: 1, duration: 2.4, ease: 'power2.out' },
        0
      )

      // Decorative line draws in
      tl.fromTo(
        '[data-cover-line]',
        { scaleY: 0, opacity: 0 },
        { scaleY: 1, opacity: 1, duration: 0.8, ease: 'power2.out', transformOrigin: 'top center' },
        0.4
      )

      // Label fade up
      tl.fromTo(
        '[data-cover-label]',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
        0.7
      )

      // Letter stagger for couple name (anime.js)
      tl.call(() => {
        const chars = root.querySelectorAll('.cover-char')
        if (chars.length > 0) {
          animate(chars, {
            opacity: [0, 1],
            translateY: [24, 0],
            duration: 800,
            delay: (_el: Element, i: number) => i * 35,
            ease: 'outExpo',
          })
        }
      }, [], 1.0)

      // Date fade in
      tl.fromTo(
        '[data-cover-date]',
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
        1.6
      )

      // Guest greeting fade in
      tl.fromTo(
        '[data-cover-guest]',
        { opacity: 0 },
        { opacity: 1, duration: 0.6, ease: 'power2.out' },
        2.0
      )

      // Button fade up (last)
      tl.fromTo(
        '[data-cover-button]',
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
        2.3
      )
    }, sectionRef)

    return () => {
      introTlRef.current = null
      ctx.revert()
    }
  }, [shouldReduceMotion, isOpened, isPreloaderDone])

  // --- HANDLE OPEN ---
  const handleOpen = useCallback(() => {
    if (isAnimating || isOpened) return
    setIsAnimating(true)

    // Preemptively try to reset scroll to top
    window.scrollTo(0, 0)

    // Kill intro if still running
    if (introTlRef.current) {
      introTlRef.current.progress(1)
    }

    // Notify parent (triggers MusicToggle visibility, etc.)
    onOpen?.()

    const scrollToHero = () => {
      const heroEl = document.getElementById('hero')
      if (heroEl) {
        heroEl.scrollIntoView({ behavior: 'auto' })
      } else {
        window.scrollTo(0, 0)
      }
    }

    if (shouldReduceMotion) {
      // Reduced motion: instant hide
      setIsOpened(true)
      setIsAnimating(false)
      scrollToHero()
      onOpened?.()
      return
    }

    // Safety fallback: if animation somehow never completes, force unlock
    const fallbackTimer = window.setTimeout(() => {
      setIsOpened(true)
      setIsAnimating(false)
      scrollToHero()
      onOpened?.()
    }, 5000)

    const ctx = gsap.context(() => {
      const exitTl = gsap.timeline({
        onComplete: () => {
          window.clearTimeout(fallbackTimer)
          setIsOpened(true)
          setIsAnimating(false)
          scrollToHero()
          onOpened?.()
        },
      })
      exitTlRef.current = exitTl

      // Content fades out
      exitTl.to(
        '[data-cover-content]',
        { opacity: 0, y: -30, duration: 0.6, ease: 'power2.in' },
        0
      )

      // Background zooms in subtly and fades
      exitTl.to(
        '[data-cover-bg]',
        { scale: 1.06, opacity: 0, duration: 1.0, ease: 'power2.in' },
        0.1
      )

      // Section itself fades out
      exitTl.to(
        sectionRef.current,
        {
          opacity: 0,
          duration: 0.4,
          ease: 'power2.in',
          onComplete: () => {
            if (sectionRef.current) {
              sectionRef.current.style.visibility = 'hidden'
              sectionRef.current.style.pointerEvents = 'none'
            }
          },
        },
        0.8
      )
    }, sectionRef)

    return () => {
      window.clearTimeout(fallbackTimer)
      exitTlRef.current = null
      ctx.revert()
    }
  }, [isAnimating, isOpened, shouldReduceMotion, onOpen])

  // Cleanup exit timeline on unmount
  useEffect(() => {
    return () => {
      exitTlRef.current?.kill()
    }
  }, [])

  // If already opened via reduced motion, hide immediately
  if (isOpened && shouldReduceMotion) {
    return null
  }

  const coupleText = `${weddingData.bride.firstName} & ${weddingData.groom.firstName}`

  return (
    <section
      ref={sectionRef}
      id="cover"
      data-section
      data-theme="dark"
      data-wow="true"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050505] overflow-hidden"
      style={isOpened ? { visibility: 'hidden', pointerEvents: 'none' } : undefined}
    >
      {/* Background layer */}
      <div data-cover-bg className="absolute inset-0" style={{ opacity: 0 }}>
        <img
          src={weddingData.gallery[0]?.src}
          alt=""
          className="w-full h-full object-cover grayscale opacity-30"
          loading="eager"
        />
        {/* Vignette + gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-[#050505]/30" />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 30%, #050505 100%)' }} />
      </div>

      {/* Content */}
      <div data-cover-content className="relative z-10 flex flex-col items-center text-center px-6 max-w-2xl">

        {/* Decorative line */}
        <div
          data-cover-line
          className="w-px h-16 md:h-20 bg-[rgba(245,242,236,0.15)] mb-8"
          style={{ opacity: 0, transformOrigin: 'top center' }}
        />

        {/* Label */}
        <span
          data-cover-label
          className="label-caps text-[rgba(164,164,164,0.7)] tracking-[0.4em] mb-6 block"
          style={{ opacity: 0 }}
        >
          The Wedding of
        </span>

        {/* Couple name with letter stagger */}
        <h1
          data-cover-title
          className="mb-4"
          style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: 'clamp(40px, 8vw, 80px)', lineHeight: 1.1 }}
        >
          <LetterSplit text={coupleText} className="text-[#F5F2EC]" />
        </h1>

        {/* Date */}
        <p
          data-cover-date
          className="font-sans text-[13px] md:text-[14px] text-[rgba(164,164,164,0.6)] tracking-[0.3em] mb-10 md:mb-14"
          style={{ opacity: 0 }}
        >
          {weddingData.wedding.dateFormatted}
        </p>

        {/* Guest greeting */}
        <div
          data-cover-guest
          className="flex flex-col items-center gap-2 mb-10 md:mb-12"
          style={{ opacity: 0 }}
        >
          <p className="font-sans text-[12px] text-[rgba(164,164,164,0.5)] tracking-[0.2em] uppercase">
            Dear, Bapak/Ibu/Saudara/i
          </p>
          <p
            className="text-[rgba(245,242,236,0.7)] max-w-sm"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: 'clamp(14px, 2vw, 17px)', lineHeight: 1.7, fontStyle: 'italic' }}
          >
            {weddingData.wedding.openingQuote}
          </p>
        </div>

        {/* Open button */}
        <div data-cover-button style={{ opacity: 0 }}>
          <button
            onClick={handleOpen}
            disabled={isAnimating}
            aria-label="Buka undangan pernikahan"
            className="relative inline-flex items-center justify-center px-10 py-4 font-mono text-[11px] tracking-[0.3em] uppercase text-[rgba(245,242,236,0.8)] border border-[rgba(245,242,236,0.25)] bg-transparent hover:bg-[rgba(245,242,236,0.06)] hover:border-[rgba(245,242,236,0.4)] hover:text-[#F5F2EC] transition-all duration-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(245,242,236,0.5)] disabled:opacity-50 disabled:cursor-wait"
          >
            Open Invitation
          </button>
        </div>
      </div>
    </section>
  )
}
