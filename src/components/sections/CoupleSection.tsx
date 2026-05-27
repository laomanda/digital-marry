import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Instagram } from 'lucide-react'
import { animate } from 'animejs'
import { gsap } from '../../lib/gsap'
import { weddingData } from '../../data/wedding.data'
import { useReducedMotionSafe } from '../../hooks/useReducedMotionSafe'
import { Container } from '../ui/Container'

type Person = typeof weddingData.bride

/* ─── Editorial Heart SVG ─── */
const HEART_D =
  'M60 108 C60 108 8 78 8 38 C8 17.5 22 4 38 4 C49 4 56.5 11 60 18 C63.5 11 71 4 82 4 C98 4 112 17.5 112 38 C112 78 60 108 60 108Z'
const VB = 120

/* Floating sparkle positions — 8 particles distributed around the heart */
const SPARKLES = [
  { cx: 22, cy: 28, delay: 0 },
  { cx: 98, cy: 28, delay: 0.7 },
  { cx: 14, cy: 58, delay: 1.4 },
  { cx: 106, cy: 58, delay: 2.1 },
  { cx: 34, cy: 95, delay: 2.8 },
  { cx: 86, cy: 95, delay: 0.35 },
  { cx: 60, cy: 6, delay: 1.05 },
  { cx: 60, cy: 112, delay: 1.75 },
]

function EditorialHeart({
  isActive,
  shouldReduceMotion,
  className = '',
}: {
  isActive: boolean
  shouldReduceMotion: boolean
  className?: string
}) {
  const strokeRef = useRef<SVGPathElement>(null)
  const animeRef = useRef<ReturnType<typeof animate> | null>(null)

  useEffect(() => {
    const path = strokeRef.current
    if (!path) return

    const len = path.getTotalLength()
    path.style.strokeDasharray = `${len}`

    if (shouldReduceMotion) {
      path.style.strokeDashoffset = '0'
      return
    }

    path.style.strokeDashoffset = `${len}`

    // Precise drawing loop matching the CSS animation keyframe intervals exactly
    animeRef.current = animate(path, {
      keyframes: [
        { strokeDashoffset: len, duration: 0 },
        { strokeDashoffset: 0, duration: 5000, easing: 'easeInOutSine' }, // 5s draw-in
        { strokeDashoffset: 0, duration: 2000 },                          // 2s pause/hold at end
        { strokeDashoffset: len, duration: 5000, easing: 'easeInOutSine' }, // 5s draw-out
        { strokeDashoffset: len, duration: 1000 }                          // 1s pause at start
      ],
      loop: true,
      delay: 600,
    })

    return () => {
      animeRef.current?.pause()
      animeRef.current = null
    }
  }, [shouldReduceMotion])

  return (
    <div
      className={[
        'pointer-events-none relative select-none transition-transform duration-600',
        isActive ? 'scale-[1.12] text-[rgba(245,245,240,0.55)]' : 'scale-100 text-[rgba(245,245,240,0.28)]',
        className,
      ].join(' ')}
      aria-hidden="true"
    >
      {/* Pulsing rings */}
      {!shouldReduceMotion && (
        <>
          <span
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#F5F5F0]/[0.06]"
            style={{
              width: '140%',
              height: '140%',
              animation: 'couple-ring-pulse 4s ease-in-out infinite',
            }}
          />
          <span
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#F5F5F0]/[0.04]"
            style={{
              width: '180%',
              height: '180%',
              animation: 'couple-ring-pulse 4s ease-in-out 1s infinite',
            }}
          />
          <span
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#F5F5F0]/[0.025]"
            style={{
              width: '220%',
              height: '220%',
              animation: 'couple-ring-pulse 4s ease-in-out 2s infinite',
            }}
          />
        </>
      )}

      <svg
        viewBox={`0 0 ${VB} ${VB}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative block"
        style={{
          width: '100%',
          height: '100%',
        }}
      >
        <defs>
          {/* Radial gradient for subtle inner fill */}
          <radialGradient id="heart-fill-glow" cx="50%" cy="45%" r="50%">
            <stop offset="0%" stopColor="rgba(245,245,240,0.09)" />
            <stop offset="100%" stopColor="rgba(245,245,240,0)" />
          </radialGradient>
          {/* Glow filter */}
          <filter id="heart-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
          </filter>
        </defs>

        {/* Layer 1: Soft inner fill */}
        <path
          d={HEART_D}
          fill="url(#heart-fill-glow)"
          className={[
            'transition-opacity duration-600',
            isActive ? 'opacity-100' : 'opacity-60',
          ].join(' ')}
        />

        {/* Layer 2: Outer glow stroke (monochrome) */}
        <path
          d={HEART_D}
          stroke="rgba(245,245,240,0.08)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#heart-glow)"
          className={[
            'transition-opacity duration-600',
            isActive ? 'opacity-100' : 'opacity-50',
          ].join(' ')}
        />

        {/* Layer 3: Fine outer stroke (monochrome static) */}
        <path
          d={HEART_D}
          stroke="rgba(245,245,240,0.12)"
          strokeWidth="0.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={[
            'transition-opacity duration-600',
            isActive ? 'opacity-100' : 'opacity-70',
          ].join(' ')}
        />

        {/* Layer 4: Animated draw stroke (monochrome main) */}
        <path
          ref={strokeRef}
          d={HEART_D}
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          stroke="currentColor"
          className="transition-[stroke] duration-600"
        />

        {/* Floating sparkle particles */}
        {!shouldReduceMotion &&
          SPARKLES.map((s, i) => (
            <circle
              key={i}
              cx={s.cx}
              cy={s.cy}
              r="1"
              fill="rgba(245,245,240,0.25)"
              style={{
                animation: `couple-sparkle 3.5s ease-in-out ${s.delay}s infinite`,
              }}
            />
          ))}
      </svg>

      {/* CSS keyframes injected once */}
      <style>{`
        @keyframes couple-ring-pulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          50% { transform: translate(-50%, -50%) scale(1.12); opacity: 0.3; }
        }
        @keyframes couple-sparkle {
          0%, 100% { opacity: 0; transform: scale(0.5); }
          50% { opacity: 0.6; transform: scale(1.4); }
        }
      `}</style>
    </div>
  )
}

function SplitHeaderTitle({ text }: { text: string }) {
  return (
    <>
      {text.split('').map((ch, i) => (
        <span
          key={`${ch}-${i}`}
          data-couple-header-char
          aria-hidden="true"
          className="inline-block will-change-transform"
          style={{ opacity: 0 }}
        >
          {ch === ' ' ? '\u00A0' : ch}
        </span>
      ))}
    </>
  )
}

function SplitName({ name }: { name: string }) {
  return (
    <>
      {name.split('').map((ch, i) => (
        <span
          key={`${ch}-${i}`}
          data-couple-char
          aria-hidden="true"
          className="inline-block"
          style={{ opacity: 0 }}
        >
          {ch === ' ' ? '\u00A0' : ch}
        </span>
      ))}
    </>
  )
}

function PersonCard({
  person,
  side,
  active,
  inactive,
  onEnter,
  onLeave,
}: {
  person: Person
  side: 'bride' | 'groom'
  active: boolean
  inactive: boolean
  onEnter: () => void
  onLeave: () => void
}) {
  const handle = person.instagram?.replace('@', '')

  return (
    <article
      data-couple-card
      data-couple-side={side === 'bride' ? 'left' : 'right'}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className={[
        'group relative flex flex-col transition-opacity duration-500',
        inactive ? 'opacity-[0.72]' : 'opacity-100',
      ].join(' ')}
    >
      {/* Portrait */}
      <div
        className={[
          'relative aspect-[4/5] w-full overflow-hidden bg-[#1a1a1a]',
          'border transition-colors duration-500',
          active ? 'border-[#F5F5F0]/50' : 'border-[#F5F5F0]/15',
        ].join(' ')}
      >
        <img
          src={person.photo}
          alt={`Portrait of ${person.fullName}`}
          loading="eager"
          decoding="async"
          className={[
            'absolute inset-0 h-full w-full object-cover grayscale',
            'brightness-[0.88] contrast-[1.05]',
            'transition-transform duration-700 ease-out',
            active ? 'scale-[1.04]' : 'scale-100',
          ].join(' ')}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050505]/40 via-transparent to-transparent" />

        {/* Corner marks */}
        <span className="absolute left-3 top-3 h-6 w-6 border-l border-t border-[#F5F5F0]/30" aria-hidden="true" />
        <span className="absolute right-3 top-3 h-6 w-6 border-r border-t border-[#F5F5F0]/30" aria-hidden="true" />
        <span className="absolute bottom-3 left-3 h-6 w-6 border-b border-l border-[#F5F5F0]/30" aria-hidden="true" />
        <span className="absolute bottom-3 right-3 h-6 w-6 border-b border-r border-[#F5F5F0]/30" aria-hidden="true" />

        {/* Role badge */}
        <span className="absolute left-4 top-4 font-mono text-[9px] uppercase tracking-[0.3em] text-[#F5F5F0]/50">
          {side === 'bride' ? 'Bride' : 'Groom'}
        </span>
      </div>

      {/* Info */}
      <div className={`mt-6 ${side === 'groom' ? 'text-left md:text-right' : 'text-left'}`}>
        <h3
          className="font-serif text-[clamp(36px,5vw,64px)] font-light leading-[0.9] text-[#F5F5F0]"
          aria-label={person.fullName}
        >
          <SplitName name={person.firstName} />
        </h3>

        <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#F5F5F0]/45">
          {person.fullName}
        </p>

        <div className={`my-4 h-px w-10 bg-[#F5F5F0]/15 ${side === 'groom' ? 'md:ml-auto' : ''}`} />

        <p className="font-sans text-[11px] uppercase leading-relaxed tracking-[0.16em] text-[#F5F5F0]/55">
          {person.parents}
        </p>

        {handle && (
          <a
            href={`https://instagram.com/${handle}`}
            target="_blank"
            rel="noopener noreferrer"
            className={[
              'mt-4 inline-flex items-center gap-2 text-[#F5F5F0]/40',
              'transition duration-300 hover:text-[#F5F5F0]',
              'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#F5F5F0] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]',
            ].join(' ')}
            aria-label={`Instagram ${person.fullName}`}
          >
            <Instagram size={14} strokeWidth={1.5} />
            <span className="font-mono text-[10px] tracking-[0.15em]">{person.instagram}</span>
            <ArrowUpRight
              size={13}
              strokeWidth={1.5}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>
        )}
      </div>
    </article>
  )
}

export function CoupleSection() {
  const { shouldReduceMotion } = useReducedMotionSafe()
  const sectionRef = useRef<HTMLElement>(null)
  const [activeSide, setActiveSide] = useState<'bride' | 'groom' | null>(null)
  const heartIsActive = activeSide !== null

  useEffect(() => {
    const el = sectionRef.current
    if (!el || shouldReduceMotion) {
      // Make everything visible immediately
      el?.querySelectorAll<HTMLElement>('[data-couple-char], [data-couple-header-char]').forEach((c) => {
        c.style.opacity = '1'
      })
      el?.querySelectorAll<HTMLElement>('[data-couple-header-label], [data-couple-header-sub]').forEach((s) => {
        s.style.opacity = '1'
      })
      const headerLine = el?.querySelector<HTMLElement>('[data-couple-header-line]')
      if (headerLine) {
        headerLine.style.opacity = '1'
        headerLine.style.transform = 'scaleX(1)'
      }
      return
    }

    const ctx = gsap.context(() => {
      // 1. Main Header Staggered Entrance Timeline (All Devices)
      const headerTl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      })

      headerTl
        .fromTo('[data-couple-header-label]',
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }
        )
        .fromTo('[data-couple-header-char]',
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, stagger: 0.03, duration: 0.8, ease: 'power3.out' },
          '-=0.5'
        )
        .fromTo('[data-couple-header-line]',
          { scaleX: 0, opacity: 0 },
          { scaleX: 1, opacity: 1, duration: 0.6, ease: 'power2.out', transformOrigin: 'center center' },
          '-=0.4'
        )
        .fromTo('[data-couple-header-sub]',
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' },
          '-=0.4'
        )

      const mm = gsap.matchMedia()

      // ─── DESKTOP (lg >= 1024px) — Scroll-Driven Convergence ───
      mm.add("(min-width: 1024px)", () => {
        const leftCard = el.querySelector('[data-couple-side="left"]')
        const rightCard = el.querySelector('[data-couple-side="right"]')
        const centerHeart = el.querySelector('[data-couple-heart]')

        // Set initial convergence states: portraits far apart, low opacity, slightly scaled down
        gsap.set(leftCard, { xPercent: -26, opacity: 0.75, scale: 0.96 })
        gsap.set(rightCard, { xPercent: 26, opacity: 0.75, scale: 0.96 })
        gsap.set(centerHeart, { opacity: 0.15, scale: 0.86 })

        // Flag to execute the "sealed moment" exactly once per sweep
        let hasSealed = false

        // Scroll convergence scrub timeline
        const convergenceTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: 'top 78%',
            end: 'center center',
            scrub: 1.2,
            onUpdate: (self) => {
              // Trigger the "sealed moment" once convergence completes (>= 92% scroll progress)
              if (self.progress >= 0.92) {
                if (!hasSealed) {
                  hasSealed = true

                  // United magnetic bump animation for portraits (Bride bumps right, Groom bumps left)
                  gsap.timeline()
                    .to(leftCard, { x: 12, scale: 1.015, duration: 0.2, ease: 'power2.out' })
                    .to(leftCard, { x: 0, scale: 1, duration: 0.6, ease: 'elastic.out(1, 0.6)' })

                  gsap.timeline()
                    .to(rightCard, { x: -12, scale: 1.015, duration: 0.2, ease: 'power2.out' })
                    .to(rightCard, { x: 0, scale: 1, duration: 0.6, ease: 'elastic.out(1, 0.6)' })

                  // Faint elegant seal pulse
                  gsap.timeline()
                    .to(centerHeart, { scale: 1.12, opacity: 1, duration: 0.25, ease: 'power2.out' })
                    .to(centerHeart, { scale: 1, opacity: 0.85, duration: 0.45, ease: 'power2.inOut' })

                  // Reveal name letters for both cards exactly when sealing is reached
                  const leftChars = leftCard?.querySelectorAll('[data-couple-char]')
                  const rightChars = rightCard?.querySelectorAll('[data-couple-char]')

                  if (leftChars?.length) {
                    animate(leftChars, {
                      opacity: [0, 1],
                      translateY: [24, 0],
                      duration: 700,
                      delay: (_el: Element, idx: number) => idx * 30,
                      easing: 'outExpo',
                    })
                  }
                  if (rightChars?.length) {
                    animate(rightChars, {
                      opacity: [0, 1],
                      translateY: [24, 0],
                      duration: 700,
                      delay: (_el: Element, idx: number) => idx * 30,
                      easing: 'outExpo',
                    })
                  }
                }
              } else if (self.progress < 0.85) {
                // Reset flag when scrolling back up
                hasSealed = false
              }
            },
          },
        })

        // Convergence tween mapping: portraits align perfectly to center (xPercent 0)
        convergenceTimeline
          .to(leftCard, { xPercent: 0, opacity: 1, scale: 1, ease: 'none' }, 0)
          .to(rightCard, { xPercent: 0, opacity: 1, scale: 1, ease: 'none' }, 0)
          .to(centerHeart, { opacity: 0.85, scale: 1, ease: 'none' }, 0)
      })

      // ─── MOBILE/TABLET (< 1024px) — Clean Stacked Fallback ───
      mm.add("(max-width: 1023px)", () => {
        const cards = gsap.utils.toArray<HTMLElement>('[data-couple-card]')
        cards.forEach((card, i) => {
          gsap.from(card, {
            opacity: 0,
            y: 40,
            duration: 1.0,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 65%',
              toggleActions: 'play none none none',
            },
            delay: i * 0.2,
            onComplete: () => {
              const chars = card.querySelectorAll('[data-couple-char]')
              if (chars.length) {
                animate(chars, {
                  opacity: [0, 1],
                  translateY: [24, 0],
                  duration: 700,
                  delay: (_el: Element, idx: number) => idx * 35,
                  easing: 'outExpo',
                })
              }
            },
          })
        })

        gsap.from('[data-couple-heart]', {
          opacity: 0,
          scale: 0.7,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 65%',
            toggleActions: 'play none none none',
          },
          delay: 0.25,
        })
      })
    }, el)

    return () => ctx.revert()
  }, [shouldReduceMotion])

  return (
    <section
      ref={sectionRef}
      id="couple"
      data-section
      data-theme="dark"
      data-wow="true"
      className="relative overflow-hidden bg-[#050505] py-24 text-[#F5F5F0] md:py-32 lg:py-40"
    >
      {/* Top/bottom hairlines */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[#F5F5F0]/10" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-[#F5F5F0]/10" aria-hidden="true" />

      <Container>
        {/* Header */}
        <div className="mx-auto max-w-[800px] text-center">
          <span
            data-couple-header-label
            className="mb-5 block font-mono text-[10px] uppercase tracking-[0.34em] text-[#F5F5F0]/50"
            style={{ opacity: 0 }}
          >
            The Couple
          </span>
          <h2
            className="font-serif text-[clamp(40px,7vw,96px)] font-light leading-[0.92] text-[#F5F5F0]"
            aria-label={`${weddingData.bride.firstName} & ${weddingData.groom.firstName}`}
          >
            <SplitHeaderTitle text={`${weddingData.bride.firstName} & ${weddingData.groom.firstName}`} />
          </h2>
          <div
            data-couple-header-line
            className="mx-auto mt-6 h-px w-20 bg-[#F5F5F0]/15"
            aria-hidden="true"
            style={{ opacity: 0, transform: 'scaleX(0)' }}
          />
          <p
            data-couple-header-sub
            className="mx-auto mt-5 max-w-[400px] font-serif text-[17px] italic leading-relaxed text-[#F5F5F0]/55 md:text-[19px]"
            style={{ opacity: 0 }}
          >
            Dua hati yang kini melangkah bersama.
          </p>
        </div>

        {/* Cards grid */}
        <div className="relative mx-auto mt-16 grid max-w-[960px] grid-cols-1 gap-8 md:mt-20 md:grid-cols-2 md:gap-5 lg:gap-8">
          {/* Desktop heart — centered between portraits */}
          <div
            data-couple-heart
            className="pointer-events-none absolute left-1/2 top-[38%] z-10 hidden -translate-x-1/2 -translate-y-1/2 md:block"
          >
            <EditorialHeart
              isActive={heartIsActive}
              shouldReduceMotion={shouldReduceMotion}
              className="h-24 w-24 lg:h-28 lg:w-28"
            />
          </div>

          {/* Bride */}
          <PersonCard
            person={weddingData.bride}
            side="bride"
            active={activeSide === 'bride'}
            inactive={activeSide === 'groom'}
            onEnter={() => setActiveSide('bride')}
            onLeave={() => setActiveSide(null)}
          />

          {/* Mobile heart — between stacked cards */}
          <div
            data-couple-heart
            className="-my-2 flex items-center justify-center py-1 md:hidden"
          >
            <EditorialHeart
              isActive={heartIsActive}
              shouldReduceMotion={shouldReduceMotion}
              className="h-14 w-14"
            />
          </div>

          {/* Groom */}
          <PersonCard
            person={weddingData.groom}
            side="groom"
            active={activeSide === 'groom'}
            inactive={activeSide === 'bride'}
            onEnter={() => setActiveSide('groom')}
            onLeave={() => setActiveSide(null)}
          />
        </div>
      </Container>
    </section>
  )
}

export default CoupleSection
