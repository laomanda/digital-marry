import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Instagram } from 'lucide-react'
import { animate } from 'animejs'
import { gsap } from '../../lib/gsap'
import { weddingData } from '../../data/wedding.data'
import { useReducedMotionSafe } from '../../hooks/useReducedMotionSafe'
import { Container } from '../ui/Container'

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
        isActive 
          ? 'scale-[1.12] text-[rgba(245,245,240,0.55)]' 
          : 'scale-100 text-[rgba(245,245,240,0.28)]',
        className,
      ].join(' ')}
      aria-hidden="true"
    >
      {/* Pulsing rings */}
      {!shouldReduceMotion && (
        <>
          <span
            className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border transition-colors duration-500 border-[#F5F5F0]/[0.06]`}
            style={{
              width: '140%',
              height: '140%',
              animation: 'couple-ring-pulse 4s ease-in-out infinite',
            }}
          />
          <span
            className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border transition-colors duration-500 border-[#F5F5F0]/[0.04]`}
            style={{
              width: '180%',
              height: '180%',
              animation: 'couple-ring-pulse 4s ease-in-out 1s infinite',
            }}
          />
          <span
            className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border transition-colors duration-500 border-[#F5F5F0]/[0.025]`}
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
          className="inline-block will-change-transform"
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
  person: any
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
        'group relative flex transform-gpu flex-col transition-opacity duration-500 will-change-transform',
        inactive ? 'opacity-[0.72]' : 'opacity-100',
      ].join(' ')}
    >
      {/* Portrait with editorial text overlay */}
      <div
        className={[
          'relative isolate aspect-[2/3] min-h-[540px] w-full overflow-hidden rounded-[2px] transition-colors duration-500 md:min-h-0',
          'bg-[#050505]',
          'border',
          active 
            ? 'border-[#F5F5F0]/50' 
            : 'border-[#F5F5F0]/15',
        ].join(' ')}
      >
        <img
          src={person.photo}
          alt={`Portrait of ${person.fullName}`}
          loading="eager"
          decoding="async"
          className={[
            'absolute inset-0 h-full w-full object-cover object-center',
            'brightness-[0.98] contrast-[1.03]',
            'transition-[filter,opacity] duration-700 ease-out',
            active ? 'opacity-100 brightness-[1.03]' : 'opacity-[0.98]',
          ].join(' ')}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050505]/92 via-[#050505]/42 to-transparent transition-colors duration-500 md:from-[#050505]/88 md:via-[#050505]/30" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[58%] bg-[radial-gradient(ellipse_at_bottom,rgba(5,5,5,0.62),transparent_70%)]" />

        <div className="absolute inset-x-0 bottom-0 z-10 p-6 pb-7 text-left sm:p-8 md:p-6 lg:p-7">
          <div className="relative max-w-[94%] md:max-w-[92%]">
            <span
              className="pointer-events-none absolute -left-1 top-[-0.42em] select-none font-athene text-[clamp(72px,19vw,118px)] leading-none text-[#F5F5F0]/[0.055] md:text-[clamp(58px,5.5vw,94px)]"
              aria-hidden="true"
            >
              {person.firstName}
            </span>

            <h3
              className="relative font-athene text-[clamp(50px,13.5vw,78px)] leading-[0.88] text-[#F5F5F0] drop-shadow-[0_8px_24px_rgba(0,0,0,0.45)] md:text-[clamp(42px,4.4vw,68px)]"
              aria-label={person.fullName}
            >
              <SplitName name={person.firstName} />
            </h3>

            <p className="relative mt-3 font-montserrat text-[clamp(17px,4.4vw,24px)] font-semibold leading-tight text-[#F5F5F0] drop-shadow-[0_4px_16px_rgba(0,0,0,0.45)] md:text-[clamp(13px,1.32vw,17px)]">
              {person.fullName}
            </p>

            <p className="relative mt-2 max-w-[96%] font-montserrat text-[clamp(16px,4vw,22px)] font-semibold leading-snug text-[#F5F5F0]/90 drop-shadow-[0_4px_16px_rgba(0,0,0,0.45)] md:text-[clamp(12px,1.22vw,15px)]">
              {person.parents}
            </p>

            <div className="mt-5 h-px w-full bg-[#F5F5F0]/55 shadow-[0_0_18px_rgba(245,245,240,0.10)] md:mt-4" aria-hidden="true" />

            {handle && (
              <a
                href={`https://instagram.com/${handle}`}
                target="_blank"
                rel="noopener noreferrer"
                className={[
                  'mt-4 inline-flex items-center justify-center gap-2 transition duration-300 md:mt-3',
                  'text-[#F5F5F0]/72 hover:text-[#F5F5F0]',
                  'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-2',
                  'focus-visible:ring-[#F5F5F0] focus-visible:ring-offset-[#050505]',
                ].join(' ')}
                aria-label={`Instagram ${person.fullName}`}
              >
                <Instagram size={14} strokeWidth={1.6} />
                <span className="font-mono text-[10px] tracking-[0.16em] md:text-[9px]">{person.instagram}</span>
                <ArrowUpRight
                  size={13}
                  strokeWidth={1.6}
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}

export function CoupleSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const { shouldReduceHeavyMotion, shouldReduceMotion } = useReducedMotionSafe()
  const [activeSide, setActiveSide] = useState<'bride' | 'groom' | null>(null)
  const heartIsActive = activeSide !== null
  const sectionClass = 'bg-[#050505] text-[#F5F5F0]'
  const headingClass = 'text-[#F5F5F0]'
  const mutedClass = 'text-[#F5F5F0]/55'

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const showStatic = () => {
      gsap.set(el.querySelectorAll('[data-couple-header-label], [data-couple-header-sub]'), {
        opacity: 1,
        y: 0,
      })
      gsap.set(el.querySelectorAll('[data-couple-header-char], [data-couple-char]'), {
        opacity: 1,
        y: 0,
      })
      gsap.set(el.querySelector('[data-couple-header-line]'), {
        opacity: 1,
        scaleX: 1,
      })
      gsap.set(el.querySelectorAll('[data-couple-card], [data-couple-heart]'), {
        opacity: 1,
        x: 0,
        y: 0,
        xPercent: 0,
        scale: 1,
      })
    }

    if (shouldReduceMotion || shouldReduceHeavyMotion) {
      showStatic()
      return
    }

    let mm: ReturnType<typeof gsap.matchMedia> | null = null

    const ctx = gsap.context(() => {
      // 1. Main header reveal.
      const headerTl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: 'top 82%',
          toggleActions: 'play none none none',
          once: true,
        },
      })

      headerTl
        .fromTo('[data-couple-header-label]',
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out', clearProps: 'transform,opacity' }
        )
        .fromTo('[data-couple-header-char]',
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, stagger: 0.025, duration: 0.55, ease: 'power2.out', clearProps: 'transform,opacity' },
          '-=0.35'
        )
        .fromTo('[data-couple-header-line]',
          { scaleX: 0, opacity: 0 },
          { scaleX: 1, opacity: 1, duration: 0.5, ease: 'power2.out', transformOrigin: 'center center', clearProps: 'transform,opacity' },
          '-=0.25'
        )
        .fromTo('[data-couple-header-sub]',
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out', clearProps: 'transform,opacity' },
          '-=0.25'
        )

      mm = gsap.matchMedia()

      // ─── DESKTOP (lg >= 1024px) — Scroll-Driven Convergence ───
      mm.add("(min-width: 1024px)", () => {
        const leftCard = el.querySelector('[data-couple-side="left"]')
        const rightCard = el.querySelector('[data-couple-side="right"]')
        const centerHeart = el.querySelector('[data-couple-heart-desktop]')
        const leftChars = leftCard?.querySelectorAll('[data-couple-char]')
        const rightChars = rightCard?.querySelectorAll('[data-couple-char]')
        const nameChars = [
          ...Array.from(leftChars || []),
          ...Array.from(rightChars || []),
        ]

        // Set initial convergence states: portraits far apart, low opacity, slightly scaled down
        gsap.set(leftCard, { xPercent: -12, opacity: 0, scale: 0.985, force3D: true, willChange: 'transform, opacity' })
        gsap.set(rightCard, { xPercent: 12, opacity: 0, scale: 0.985, force3D: true, willChange: 'transform, opacity' })
        gsap.set(centerHeart, { opacity: 0, scale: 0.92, force3D: true, willChange: 'transform, opacity' })
        gsap.set(nameChars, { opacity: 0, y: 14 })

        // One-shot reveal timeline. Avoid scroll-scrub so transforms never fight the user's scroll.
        const convergenceTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: 'top 78%',
            once: true,
          },
        })

        // Convergence tween mapping: portraits align perfectly to center (xPercent 0)
        convergenceTimeline
          .to(leftCard, { xPercent: 0, opacity: 1, scale: 1, duration: 0.8, ease: 'power3.out', clearProps: 'transform,opacity,willChange' }, 0)
          .to(rightCard, { xPercent: 0, opacity: 1, scale: 1, duration: 0.8, ease: 'power3.out', clearProps: 'transform,opacity,willChange' }, 0.08)
          .to(centerHeart, { opacity: 0.85, scale: 1, duration: 0.55, ease: 'power2.out', clearProps: 'transform,opacity,willChange' }, 0.28)
          .to(nameChars, { opacity: 1, y: 0, stagger: 0.025, duration: 0.45, ease: 'power2.out', clearProps: 'transform,opacity' }, 0.38)
      })

      // ─── MOBILE/TABLET (< 1024px) — Clean Stacked Fallback ───
      mm.add("(max-width: 1023px)", () => {
        const cards = gsap.utils.toArray<HTMLElement>('[data-couple-card]', el)
        const mobileHeart = el.querySelector<HTMLElement>('[data-couple-heart-mobile]')

        cards.forEach((card) => {
          const chars = card.querySelectorAll<HTMLElement>('[data-couple-char]')
          const cardTl = gsap.timeline({
            scrollTrigger: {
              trigger: card,
              start: 'top 86%',
              toggleActions: 'play none none none',
              once: true,
            },
          })

          cardTl
            .fromTo(card,
              { opacity: 0, y: 24, scale: 0.99 },
              { opacity: 1, y: 0, scale: 1, duration: 0.62, ease: 'power2.out', clearProps: 'transform,opacity,willChange' }
            )
            .to(chars,
              { opacity: 1, y: 0, stagger: 0.03, duration: 0.42, ease: 'power2.out', clearProps: 'transform,opacity' },
              '-=0.28'
            )
        })

        if (mobileHeart) {
          gsap.fromTo(mobileHeart,
            { opacity: 0, scale: 0.92 },
            {
              opacity: 1,
              scale: 1,
              duration: 0.5,
              ease: 'power2.out',
              clearProps: 'transform,opacity,willChange',
              scrollTrigger: {
                trigger: mobileHeart,
                start: 'top 88%',
                toggleActions: 'play none none none',
                once: true,
              },
            }
          )
        }
      })
    }, el)

    return () => {
      mm?.revert()
      ctx.revert()
    }
  }, [shouldReduceMotion, shouldReduceHeavyMotion])

  return (
    <section
      ref={sectionRef}
      id="couple"
      data-section
      data-theme="dark"
      data-wow="true"
      className={`relative overflow-hidden py-24 md:py-32 lg:py-40 transition-colors duration-500 ${sectionClass}`}
    >
      {/* Top/bottom hairlines */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px transition-colors duration-500 bg-[#F5F5F0]/10" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px transition-colors duration-500 bg-[#F5F5F0]/10" aria-hidden="true" />

      <Container>
        {/* Header */}
        <div className="mx-auto max-w-[800px] text-center">
          <span
            data-couple-header-label
            className="mb-5 block font-mono text-[10px] uppercase tracking-[0.34em] transition-colors duration-500 text-[#F5F5F0]/50"
            style={{ opacity: 0 }}
          >
            The Couple
          </span>
          <h2
            className={`font-athene text-[clamp(40px,7vw,96px)] leading-[0.92] transition-colors duration-500 ${headingClass}`}
            aria-label={`${weddingData.groom.firstName} & ${weddingData.bride.firstName}`}
          >
            <SplitHeaderTitle text={`${weddingData.groom.firstName} & ${weddingData.bride.firstName}`} />
          </h2>
          <div
            data-couple-header-line
            className="mx-auto mt-6 h-px w-20 transition-colors duration-500 bg-[#F5F5F0]/15"
            aria-hidden="true"
            style={{ opacity: 0, transform: 'scaleX(0)' }}
          />
          <p
            data-couple-header-sub
            className={`mx-auto mt-5 max-w-[400px] font-montserrat text-[17px] font-semibold leading-relaxed transition-colors duration-500 md:text-[19px] ${mutedClass}`}
            style={{ opacity: 0 }}
          >
            Dua hati yang kini melangkah bersama.
          </p>
        </div>

        {/* Cards grid */}
        <div className="relative mx-auto mt-16 grid max-w-[1100px] grid-cols-1 gap-8 md:mt-20 md:grid-cols-2 md:gap-6 lg:gap-8">
          {/* Desktop heart — centered between portraits */}
          <div
            data-couple-heart
            data-couple-heart-desktop
            className="pointer-events-none absolute left-1/2 top-[38%] z-10 hidden -translate-x-1/2 -translate-y-1/2 md:block"
          >
            <EditorialHeart
              isActive={heartIsActive}
              shouldReduceMotion={shouldReduceHeavyMotion}
              className="h-24 w-24 lg:h-28 lg:w-28"
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

          {/* Mobile heart — between stacked cards */}
          <div
            data-couple-heart
            data-couple-heart-mobile
            className="-my-2 flex items-center justify-center py-1 md:hidden"
          >
            <EditorialHeart
              isActive={heartIsActive}
              shouldReduceMotion={shouldReduceHeavyMotion}
              className="h-14 w-14"
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
        </div>
      </Container>
    </section>
  )
}

export default CoupleSection
