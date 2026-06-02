import { useState, useRef, useEffect, useCallback } from 'react'
import { gsap } from '../../lib/gsap'
import { Mail } from 'lucide-react'
import { weddingData } from '../../data/wedding.data'
import { useScrollLock } from '../../hooks/useScrollLock'
import { useReducedMotionSafe } from '../../hooks/useReducedMotionSafe'
import coverImage from '../../assets/lainnya/foto/galeri-1.webp'
import coverLogo from '../../assets/logo-cover.webp'

interface CoverSectionProps {
  onOpen?: () => void
  onOpened?: () => void
  isPreloaderDone?: boolean
}

export function CoverSection({ onOpen, onOpened, isPreloaderDone = true }: CoverSectionProps) {
  const [isOpened, setIsOpened] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  const rootClass = 'bg-[#202020]';
  const lineClass = 'bg-[rgba(245,242,236,0.22)]';
  const gradientClass = 'from-[#202020]/82 via-[#202020]/44 to-[#202020]/24';
  const radialClass = 'radial-gradient(ellipse at center, rgba(32,32,32,0.02) 0%, rgba(32,32,32,0.74) 100%)';
  const buttonClass = 'bg-[#C49A6C] text-[#F5F2EC] hover:bg-[#D0A777] focus-visible:outline-[rgba(196,154,108,0.7)]';

  const introTlRef = useRef<gsap.core.Timeline | null>(null)
  const exitTlRef = useRef<gsap.core.Timeline | null>(null)
  const { shouldReduceMotion } = useReducedMotionSafe()

  const [guestName, setGuestName] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const toParam = params.get('to') || params.get('u') || params.get('guest')
      if (toParam) {
        setGuestName(decodeURIComponent(toParam))
      }
    }
  }, [])

  // Lock scroll while cover is active
  useScrollLock(!isOpened)

  // --- INTRO ANIMATION ---
  useEffect(() => {
    if (!sectionRef.current || isOpened || !isPreloaderDone) return

    const ctx = gsap.context(() => {
      const root = sectionRef.current!

      if (shouldReduceMotion) {
        // Reduced motion: make everything visible instantly
        const coverParts = Array.from(
          root.querySelectorAll<HTMLElement>('[data-cover-line], [data-cover-logo], [data-cover-guest], [data-cover-button]')
        )
        const coverBg = root.querySelector<HTMLElement>('[data-cover-bg]')

        if (coverParts.length) {
          gsap.set(coverParts, {
            opacity: 1,
            y: 0,
            scale: 1,
          })
        }
        if (coverBg) gsap.set(coverBg, { scale: 1, opacity: 1 })
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
        { scaleX: 0, opacity: 0 },
        { scaleX: 1, opacity: 1, duration: 0.8, ease: 'power2.out', transformOrigin: 'center center' },
        0.4
      )

      // Title logo fade up
      tl.fromTo(
        '[data-cover-logo]',
        { opacity: 0, y: 18, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.95, ease: 'power3.out' },
        0.7
      )

      // Guest greeting fade in
      tl.fromTo(
        '[data-cover-guest]',
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.65, ease: 'power2.out' },
        1.75
      )

      // Button fade up (last)
      tl.fromTo(
        '[data-cover-button]',
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
        2.05
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
      setTimeout(() => {
        scrollToHero()
        onOpened?.()
      }, 50)
    }, 5000)

    const ctx = gsap.context(() => {
      const exitTl = gsap.timeline({
        onComplete: () => {
          window.clearTimeout(fallbackTimer)
          setIsOpened(true)
          setIsAnimating(false)
          setTimeout(() => {
            scrollToHero()
            onOpened?.()
          }, 50)
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

  return (
    <section
      ref={sectionRef}
      id="cover"
      data-section
      data-theme="dark"
      data-wow="true"
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden transition-colors duration-500 ${rootClass}`}
      style={isOpened ? { visibility: 'hidden', pointerEvents: 'none' } : undefined}
    >
      {/* Background layer */}
      <div data-cover-bg className="absolute inset-0" style={{ opacity: 0 }}>
        <img
          src={coverImage}
          alt=""
          className="h-full w-full object-cover"
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
        {/* Vignette + gradient overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t transition-colors duration-500 ${gradientClass}`} />
        <div className="absolute inset-0 transition-colors duration-500" style={{ background: radialClass }} />
      </div>

      {/* Content */}
      <div
        data-cover-content
        className="relative z-10 flex h-full min-h-[100svh] w-full flex-col items-center justify-between px-6 pb-8 pt-8 text-center sm:pb-10 sm:pt-10 md:px-10 md:pb-12 md:pt-12"
      >
        <div className="flex w-full flex-col items-center">
          <h1 className="sr-only">
            The Wedding of {weddingData.groom.firstName} & {weddingData.bride.firstName}
          </h1>
          <img
            data-cover-logo
            src={coverLogo}
            alt=""
            className="mx-auto h-auto max-h-[170px] w-[min(52vw,190px)] select-none object-contain sm:max-h-[185px] sm:w-[min(34vw,210px)] md:max-h-[205px] md:w-[min(20vw,230px)] lg:w-[240px]"
            style={{ opacity: 0 }}
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
        </div>

        <div className="flex min-h-[28vh] w-full flex-1 items-end justify-center md:min-h-[34vh]">
          <div className="w-full max-w-[360px]">
            <div
              data-cover-guest
              className="mb-4 flex flex-col items-center"
              style={{ opacity: 0 }}
            >
              {guestName && (
                <div className="mb-4 flex flex-col items-center">
                  <p className="font-montserrat text-[10px] uppercase tracking-[0.24em] text-[#F5F2EC]/55 md:text-[11px]">
                    Kepada Yth. Bapak/Ibu/Saudara/i:
                  </p>
                  <p className="mt-2 font-athene text-[22px] font-medium tracking-wide text-[#F5F2EC] drop-shadow-[0_4px_10px_rgba(0,0,0,0.35)] md:text-[25px]">
                    {guestName}
                  </p>
                </div>
              )}
              <div
                data-cover-line
                className={`mt-4 h-px w-full origin-center transition-colors duration-500 ${lineClass}`}
                style={{ opacity: 0 }}
              />
              <p className="mt-3 font-montserrat text-[10px] font-semibold italic leading-relaxed text-[#F5F2EC]/82 md:text-[11px]">
                Kami mohon maaf jika ada kesalahan ejaan nama atau gelar.
              </p>
            </div>

            <div data-cover-button style={{ opacity: 0 }}>
              <button
                onClick={handleOpen}
                disabled={isAnimating}
                aria-label="Buka undangan pernikahan"
                className={`relative inline-flex min-h-[44px] items-center justify-center gap-2 rounded-[4px] px-6 py-3 font-montserrat text-[12px] font-semibold uppercase tracking-[0.03em] shadow-[0_12px_34px_rgba(0,0,0,0.24)] transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-wait disabled:opacity-50 md:px-7 md:text-[13px] ${buttonClass}`}
              >
                <Mail size={16} strokeWidth={2} aria-hidden="true" />
                <span>Open Invitation</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
