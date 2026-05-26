import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Instagram } from 'lucide-react'
import { animate } from 'animejs'
import { gsap } from '../../lib/gsap'
import { weddingData } from '../../data/wedding.data'
import { useReducedMotionSafe } from '../../hooks/useReducedMotionSafe'
import { Container } from '../ui/Container'

type Person = typeof weddingData.bride

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
      <div className={`mt-6 ${side === 'groom' ? 'text-right' : 'text-left'}`}>
        <h3
          className="font-serif text-[clamp(36px,5vw,64px)] font-light leading-[0.9] text-[#F5F5F0]"
          aria-label={person.fullName}
        >
          <SplitName name={person.firstName} />
        </h3>

        <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#F5F5F0]/45">
          {person.fullName}
        </p>

        <div className={`my-4 h-px w-10 bg-[#F5F5F0]/15 ${side === 'groom' ? 'ml-auto' : ''}`} />

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

  useEffect(() => {
    const el = sectionRef.current
    if (!el || shouldReduceMotion) {
      // Make everything visible immediately
      el?.querySelectorAll<HTMLElement>('[data-couple-char]').forEach((c) => {
        c.style.opacity = '1'
      })
      return
    }

    const ctx = gsap.context(() => {
      // Header entrance
      gsap.from('[data-couple-header]', {
        opacity: 0,
        y: 30,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      })

      // Cards entrance
      const cards = gsap.utils.toArray<HTMLElement>('[data-couple-card]')
      cards.forEach((card, i) => {
        gsap.from(card, {
          opacity: 0,
          y: 40,
          x: i === 0 ? -30 : 30,
          scale: 0.96,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 65%',
            toggleActions: 'play none none none',
          },
          delay: i * 0.15,
          onComplete: () => {
            // Anime.js name letter reveal after card is visible
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

      // Ampersand entrance
      gsap.from('[data-couple-amp]', {
        opacity: 0,
        scale: 0.85,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 65%',
          toggleActions: 'play none none none',
        },
        delay: 0.3,
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
        <div data-couple-header className="mx-auto max-w-[800px] text-center">
          <span className="mb-5 block font-mono text-[10px] uppercase tracking-[0.34em] text-[#F5F5F0]/50">
            The Couple
          </span>
          <h2 className="font-serif text-[clamp(40px,7vw,96px)] font-light leading-[0.92] text-[#F5F5F0]">
            {weddingData.bride.firstName} & {weddingData.groom.firstName}
          </h2>
          <div className="mx-auto mt-6 h-px w-20 bg-[#F5F5F0]/15" aria-hidden="true" />
          <p className="mx-auto mt-5 max-w-[400px] font-serif text-[17px] italic leading-relaxed text-[#F5F5F0]/55 md:text-[19px]">
            Dua hati yang kini melangkah bersama.
          </p>
        </div>

        {/* Cards grid */}
        <div className="relative mx-auto mt-16 grid max-w-[1000px] grid-cols-1 gap-12 md:mt-20 md:grid-cols-2 md:gap-8 lg:gap-14">
          {/* Center ampersand */}
          <div
            data-couple-amp
            className="pointer-events-none absolute left-1/2 top-1/2 z-0 hidden -translate-x-1/2 -translate-y-1/2 select-none md:block"
            aria-hidden="true"
          >
            <span className="font-serif text-[200px] font-light leading-none text-[#F5F5F0]/[0.04] lg:text-[260px]">
              &
            </span>
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
