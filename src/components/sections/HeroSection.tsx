import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../../lib/gsap'
import { weddingData } from '../../data/wedding.data'
import { useReducedMotionSafe } from '../../hooks/useReducedMotionSafe'

type HeroSectionProps = {
  isInvitationOpen: boolean
}

export default function HeroSection({ isInvitationOpen }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const { shouldReduceMotion } = useReducedMotionSafe()
  const hasPlayedIntroRef = useRef(false)

  useEffect(() => {
    if (!isInvitationOpen) return
    if (hasPlayedIntroRef.current) return
    hasPlayedIntroRef.current = true

    if (!sectionRef.current) return

    const root = sectionRef.current

    if (shouldReduceMotion) {
      // Reduced motion: make everything visible immediately
      gsap.set(root.querySelectorAll('[data-hero-image]'), { scale: 1, opacity: 1 })
      gsap.set(root.querySelectorAll('[data-hero-overlay]'), { opacity: 0.45 })
      gsap.set(root.querySelectorAll('[data-hero-label], [data-hero-title], [data-hero-date], [data-hero-line], [data-hero-meta], [data-hero-subtitle]'), {
        opacity: 1,
        y: 0,
        x: 0,
        scaleY: 1,
        scaleX: 1,
      })
      return
    }

    const ctx = gsap.context(() => {
      // --- INTRO TIMELINE ---
      const tl = gsap.timeline({ delay: 0.2 })

      // Image scale reveal
      tl.fromTo(
        '[data-hero-image]',
        { scale: 1.12, opacity: 0 },
        { scale: 1, opacity: 1, duration: 2.2, ease: 'power3.out' },
        0
      )

      // Overlay recedes
      tl.fromTo(
        '[data-hero-overlay]',
        { opacity: 0.9 },
        { opacity: 0.45, duration: 1.8, ease: 'power2.out' },
        0.1
      )

      // Top decorative line draws
      const topLine = root.querySelector('[data-hero-line="top"]')
      if (topLine) {
        tl.fromTo(
          topLine,
          { scaleX: 0, opacity: 0 },
          { scaleX: 1, opacity: 1, duration: 0.8, ease: 'power2.out', transformOrigin: 'left center' },
          0.5
        )
      }

      // Editorial number
      const metaNumber = root.querySelector('[data-hero-meta="number"]')
      if (metaNumber) {
        tl.fromTo(
          metaNumber,
          { opacity: 0, x: -12 },
          { opacity: 1, x: 0, duration: 0.7, ease: 'power3.out' },
          0.7
        )
      }

      // Label fades up
      tl.fromTo(
        '[data-hero-label]',
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
        0.8
      )

      // Bride name — breath reveal
      tl.fromTo(
        '[data-hero-title="bride"]',
        { opacity: 0, y: 40, letterSpacing: '0.06em' },
        { opacity: 1, y: 0, letterSpacing: '-0.02em', duration: 1.2, ease: 'power3.out' },
        1.0
      )

      // Ampersand
      tl.fromTo(
        '[data-hero-title="amp"]',
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.6, ease: 'power3.out' },
        1.3
      )

      // Groom name — breath reveal with offset
      tl.fromTo(
        '[data-hero-title="groom"]',
        { opacity: 0, y: 40, letterSpacing: '0.06em' },
        { opacity: 1, y: 0, letterSpacing: '-0.02em', duration: 1.2, ease: 'power3.out' },
        1.4
      )

      // Bottom decorative line
      tl.fromTo(
        '[data-hero-line="bottom"]',
        { scaleX: 0, opacity: 0 },
        { scaleX: 1, opacity: 1, duration: 0.7, ease: 'power2.out', transformOrigin: 'right center' },
        1.7
      )

      // Date
      tl.fromTo(
        '[data-hero-date]',
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
        1.8
      )

      // Subtitle
      tl.fromTo(
        '[data-hero-subtitle]',
        { opacity: 0 },
        { opacity: 1, duration: 0.6, ease: 'power2.out' },
        2.0
      )

      // Side meta
      tl.fromTo(
        '[data-hero-meta="side"]',
        { opacity: 0 },
        { opacity: 1, duration: 0.6, ease: 'power2.out' },
        2.0
      )

      // --- SCROLL ANIMATION ---
      ScrollTrigger.create({
        trigger: root,
        start: 'top top',
        end: 'bottom top',
        scrub: 0.8,
        onUpdate: (self) => {
          const p = self.progress
          // Image slow zoom on scroll
          const imageEl = root.querySelector('[data-hero-image]') as HTMLElement
          if (imageEl) {
            gsap.set(imageEl, { scale: 1 + p * 0.08, y: p * 80 })
          }
          // Content fades and shifts up
          const contentEl = root.querySelector('[data-hero-content]') as HTMLElement
          if (contentEl) {
            gsap.set(contentEl, { opacity: 1 - p * 1.5, y: p * -50 })
          }
          // Overlay darkens
          const overlayEl = root.querySelector('[data-hero-overlay]') as HTMLElement
          if (overlayEl) {
            gsap.set(overlayEl, { opacity: 0.45 + p * 0.4 })
          }
        },
      })
    }, sectionRef)

    // Ensure ScrollTrigger parses coordinates correctly now that cover is hidden
    ScrollTrigger.refresh()

    return () => ctx.revert()
  }, [isInvitationOpen, shouldReduceMotion])

  return (
    <>
    <section
      ref={sectionRef}
      id="hero"
      data-section
      data-theme="dark"
      data-wow="true"
      className="relative min-h-screen w-full overflow-hidden bg-[#050505]"
    >
      {/* Background image — uses gallery[1] to differentiate from cover */}
      <div
        data-hero-image
        className="absolute inset-0 will-change-transform"
        style={{ opacity: 0 }}
      >
        <img
          src={weddingData.gallery?.[1]?.src || weddingData.gallery?.[0]?.src || "https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&q=85&fit=crop"}
          alt="Potret editorial pasangan pengantin"
          className="w-full h-full object-cover grayscale contrast-[1.05]"
          loading="eager"
        />
      </div>

      {/* Dark overlay */}
      <div
        data-hero-overlay
        className="absolute inset-0 bg-[#050505]"
        style={{ opacity: 0.9 }}
      />

      {/* Left reading gradient for text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/80 via-[#050505]/30 to-transparent pointer-events-none" />

      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, transparent 20%, rgba(5,5,5,0.6) 100%)' }} />

      {/* Bottom fade gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-56 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent pointer-events-none" />

      {/* --- CONTENT: Editorial Asymmetric Layout --- */}
      <div
        data-hero-content
        className="relative z-10 min-h-screen flex flex-col justify-end pb-20 md:pb-24 lg:pb-32 px-6 md:px-10 lg:px-16"
      >

        {/* Main title block — bottom-left aligned, editorial offset */}
        <div className="max-w-4xl">
          {/* Label */}
          <p
            data-hero-label
            className="label-caps text-[rgba(245,242,236,0.4)] tracking-[0.4em] mb-5 md:mb-6"
            style={{ opacity: 0 }}
          >
            The Wedding of
          </p>

          {/* Couple names — stacked, large serif, editorial */}
          <div className="mb-6 md:mb-8">
            <h1
              className="leading-[0.9] md:leading-[0.88]"
              aria-label={`${weddingData.bride.firstName} & ${weddingData.groom.firstName}`}
            >
              <span
                data-hero-title="bride"
                className="block text-[#F5F2EC]"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontWeight: 300,
                  fontSize: 'clamp(48px, 11vw, 140px)',
                  letterSpacing: '-0.02em',
                  opacity: 0,
                }}
              >
                {weddingData.bride.firstName}
              </span>

              <span className="flex items-baseline gap-3 md:gap-5 lg:gap-6">
                <span
                  data-hero-title="amp"
                  className="text-[rgba(245,242,236,0.2)]"
                  aria-hidden="true"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontWeight: 300,
                    fontStyle: 'italic',
                    fontSize: 'clamp(32px, 6vw, 72px)',
                    opacity: 0,
                  }}
                >
                  &amp;
                </span>
                <span
                  data-hero-title="groom"
                  className="text-[#F5F2EC]"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontWeight: 300,
                    fontSize: 'clamp(48px, 11vw, 140px)',
                    letterSpacing: '-0.02em',
                    opacity: 0,
                  }}
                >
                  {weddingData.groom.firstName}
                </span>
              </span>
            </h1>
          </div>

          {/* Bottom line */}
          <div
            data-hero-line="bottom"
            className="w-24 md:w-32 h-px bg-[rgba(245,242,236,0.15)] mb-5 md:mb-6"
            style={{ opacity: 0, transformOrigin: 'right center' }}
          />

          {/* Date — mono, tracked */}
          <p
            data-hero-date
            className="font-mono text-[11px] md:text-[12px] text-[rgba(245,242,236,0.35)] tracking-[0.5em] mb-4"
            style={{ opacity: 0 }}
          >
            {weddingData.wedding.dateFormatted}
          </p>

          {/* Editorial subtitle */}
          <p
            data-hero-subtitle
            className="max-w-md"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 300,
              fontStyle: 'italic',
              fontSize: 'clamp(14px, 1.8vw, 18px)',
              lineHeight: 1.7,
              color: 'rgba(245,242,236,0.35)',
              opacity: 0,
            }}
          >
            Sebuah undangan untuk merayakan cinta yang telah kami rawat bersama
          </p>
        </div>

        {/* Side metadata — right, vertical on desktop */}
        <div
          data-hero-meta="side"
          className="hidden lg:flex flex-col items-center gap-3 absolute right-16 bottom-24"
          style={{ opacity: 0 }}
        >
          <div className="w-px h-20 bg-[rgba(245,242,236,0.12)]" />
          <span
            className="label-caps text-[rgba(245,242,236,0.2)] [writing-mode:vertical-lr] tracking-[0.3em]"
          >
            Scroll
          </span>
          <div className="w-px h-20 bg-[rgba(245,242,236,0.12)]" />
        </div>
      </div>
    </section>

    {/* Editorial Wave Transition Bridge — sits between Hero and Quote */}
    <div
      aria-hidden="true"
      className="relative w-full h-[80px] sm:h-[120px] md:h-[160px] pointer-events-none -mt-px"
      style={{ backgroundColor: '#F5F5F0' }}
    >
      <svg
        viewBox="0 0 1440 160"
        preserveAspectRatio="none"
        className="absolute top-0 left-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0,0 L0,100 C240,160 480,40 720,80 C960,120 1200,20 1440,60 L1440,0 Z"
          fill="#050505"
        />
      </svg>
    </div>
    </>
  )
}
