import { useState } from 'react'
import { ArrowUpRight, Instagram } from 'lucide-react'
import { weddingData } from '../../data/wedding.data'
import { Container } from '../ui/Container'

const HEART_D =
  'M60 108 C60 108 8 78 8 38 C8 17.5 22 4 38 4 C49 4 56.5 11 60 18 C63.5 11 71 4 82 4 C98 4 112 17.5 112 38 C112 78 60 108 60 108Z'
const VB = 120

function EditorialHeart({
  isActive,
  className = '',
}: {
  isActive: boolean
  className?: string
}) {
  return (
    <div
      className={[
        'pointer-events-none relative select-none transition-[opacity,transform] duration-700',
        isActive
          ? 'scale-[1.04] opacity-100 text-[rgba(245,245,240,0.34)]'
          : 'scale-100 opacity-75 text-[rgba(245,245,240,0.28)]',
        className,
      ].join(' ')}
      aria-hidden="true"
    >
      <svg
        viewBox={`0 0 ${VB} ${VB}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative block"
        style={{ width: '100%', height: '100%' }}
      >
        <defs>
          <radialGradient id="heart-fill-glow" cx="50%" cy="45%" r="50%">
            <stop offset="0%" stopColor="rgba(245,245,240,0.055)" />
            <stop offset="100%" stopColor="rgba(245,245,240,0)" />
          </radialGradient>
        </defs>

        <path
          d={HEART_D}
          fill="url(#heart-fill-glow)"
          opacity={isActive ? 0.9 : 0.65}
        />
        <path
          d={HEART_D}
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          stroke="currentColor"
          fill="rgba(245,245,240,0.035)"
        />
      </svg>
    </div>
  )
}

function SplitHeaderTitle({ text }: { text: string }) {
  const words = text.split(' ')
  return (
    <>
      {words.map((word, wIdx) => (
        <span key={`word-${wIdx}`}>
          <span className="inline-block whitespace-nowrap">
            {word.split('').map((ch, i) => (
              <span
                key={`${ch}-${i}`}
                data-couple-header-char
                aria-hidden="true"
                className="inline-block"
              >
                {ch}
              </span>
            ))}
          </span>
          {wIdx < words.length - 1 && ' '}
        </span>
      ))}
    </>
  )
}

function SplitName({ name }: { name: string }) {
  const words = name.split(' ')
  return (
    <>
      {words.map((word, wIdx) => (
        <span key={`word-${wIdx}`}>
          <span className="inline-block whitespace-nowrap">
            {word.split('').map((ch, i) => (
              <span
                key={`${ch}-${i}`}
                data-couple-char
                aria-hidden="true"
                className="inline-block"
              >
                {ch}
              </span>
            ))}
          </span>
          {wIdx < words.length - 1 && ' '}
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
  aosDelay = 0,
}: {
  person: any
  side: 'bride' | 'groom'
  active: boolean
  inactive: boolean
  onEnter: () => void
  onLeave: () => void
  aosDelay?: number
}) {
  const handle = person.instagram?.replace('@', '')

  return (
    <div
      data-aos="fade-up"
      data-aos-duration="700"
      data-aos-easing="ease-out-cubic"
      data-aos-delay={aosDelay}
    >
      <article
        data-couple-card
        data-couple-side={side === 'groom' ? 'left' : 'right'}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        className={[
          'group relative flex transform-gpu flex-col transition-opacity duration-500',
          inactive ? 'opacity-[0.72]' : 'opacity-100',
        ].join(' ')}
      >
        <div className="relative isolate aspect-[2/3] min-h-[540px] w-full overflow-hidden rounded-[2px] bg-[#050505] transition-colors duration-500 md:min-h-0">
          <img
            src={person.photo}
            alt={`Portrait of ${person.fullName}`}
            loading="eager"
            decoding="async"
            className={[
              'absolute inset-0 h-full w-full object-cover object-center',
              'brightness-[0.98] contrast-[1.03]',
              'transition-opacity duration-700 ease-out',
              active ? 'opacity-100' : 'opacity-[0.98]',
            ].join(' ')}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050505]/92 via-[#050505]/42 to-transparent transition-colors duration-500 md:from-[#050505]/88 md:via-[#050505]/30" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[58%] bg-[radial-gradient(ellipse_at_bottom,rgba(5,5,5,0.62),transparent_70%)]" />

          <div className="absolute inset-x-0 bottom-0 z-10 p-6 pb-7 text-left sm:p-8 md:p-6 lg:p-7">
            <div className="relative max-w-[94%] md:max-w-[92%]">
              <span
                className="pointer-events-none absolute -left-1 top-[-0.42em] select-none font-athene text-[clamp(72px,19vw,118px)] leading-none text-[#F5F5F0]/[0.045] md:text-[clamp(58px,5.5vw,94px)]"
                aria-hidden="true"
              >
                {person.firstName}
              </span>

              <h3
                className="relative font-athene text-[clamp(50px,13.5vw,78px)] leading-[0.88] text-[#F5F5F0] drop-shadow-[0_6px_18px_rgba(0,0,0,0.38)] md:text-[clamp(42px,4.4vw,68px)]"
                aria-label={person.fullName}
              >
                <SplitName name={person.firstName} />
              </h3>

              <p className="relative mt-3 font-montserrat text-[clamp(17px,4.4vw,24px)] font-semibold leading-tight text-[#F5F5F0] drop-shadow-[0_3px_14px_rgba(0,0,0,0.38)] md:text-[clamp(13px,1.32vw,17px)]">
                {person.fullName}
              </p>

              <p className="relative mt-2 max-w-[96%] font-montserrat text-[clamp(16px,4vw,22px)] font-semibold leading-snug text-[#F5F5F0]/82 drop-shadow-[0_3px_14px_rgba(0,0,0,0.38)] md:text-[clamp(12px,1.22vw,15px)]">
                {person.parents}
              </p>

              {handle && (
                <a
                  href={`https://instagram.com/${handle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={[
                    'mt-5 inline-flex items-center justify-center gap-2 transition duration-300 md:mt-4',
                    'text-[#F5F5F0]/62 hover:text-[#F5F5F0]',
                    'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-2',
                    'focus-visible:ring-[#F5F5F0] focus-visible:ring-offset-[#050505]',
                  ].join(' ')}
                  aria-label={`Instagram ${person.fullName}`}
                >
                  <Instagram size={14} strokeWidth={1.6} />
                  <span className="font-mono text-[10px] tracking-[0.16em] md:text-[9px]">
                    {person.instagram}
                  </span>
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
    </div>
  )
}

export function CoupleSection() {
  const [activeSide, setActiveSide] = useState<'bride' | 'groom' | null>(null)
  const heartIsActive = activeSide !== null
  const sectionClass = 'bg-[#050505] text-[#F5F5F0]'
  const headingClass = 'text-[#F5F5F0]'
  const mutedClass = 'text-[#F5F5F0]/55'

  return (
    <section
      id="couple"
      data-section
      data-theme="dark"
      data-wow="true"
      className={`relative overflow-hidden py-24 transition-colors duration-500 md:py-32 lg:py-40 ${sectionClass}`}
    >
      <Container>
        <div
          className="mx-auto max-w-[800px] text-center"
          data-aos="fade-up"
          data-aos-duration="700"
          data-aos-easing="ease-out-cubic"
        >
          <span
            data-couple-header-label
            className="mb-5 block font-mono text-[10px] uppercase tracking-[0.34em] text-[#F5F5F0]/50 transition-colors duration-500"
          >
            The Couple
          </span>
          <h2
            className={`font-athene text-[clamp(32px,8.5vw,96px)] leading-[0.92] transition-colors duration-500 whitespace-nowrap ${headingClass}`}
            aria-label={`${weddingData.groom.firstName} & ${weddingData.bride.firstName}`}
          >
            <SplitHeaderTitle text={`${weddingData.groom.firstName} & ${weddingData.bride.firstName}`} />
          </h2>
          <p
            data-couple-header-sub
            className={`mx-auto mt-5 max-w-[400px] font-montserrat text-[17px] font-semibold leading-relaxed transition-colors duration-500 md:text-[19px] ${mutedClass}`}
          >
            Dua hati yang kini melangkah bersama.
          </p>
        </div>

        <div className="relative mx-auto mt-16 grid max-w-[1100px] grid-cols-1 gap-8 md:mt-20 md:grid-cols-2 md:gap-6 lg:gap-8">
          <div
            data-couple-heart
            data-couple-heart-desktop
            className="pointer-events-none absolute left-1/2 top-[38%] z-10 hidden -translate-x-1/2 -translate-y-1/2 md:block"
          >
            <EditorialHeart
              isActive={heartIsActive}
              className="h-24 w-24 lg:h-28 lg:w-28"
            />
          </div>

          <PersonCard
            person={weddingData.groom}
            side="groom"
            active={activeSide === 'groom'}
            inactive={activeSide === 'bride'}
            onEnter={() => setActiveSide('groom')}
            onLeave={() => setActiveSide(null)}
          />

          <div
            data-couple-heart
            data-couple-heart-mobile
            className="-my-2 flex items-center justify-center py-1 md:hidden"
          >
            <EditorialHeart
              isActive={heartIsActive}
              className="h-14 w-14"
            />
          </div>

          <PersonCard
            person={weddingData.bride}
            side="bride"
            active={activeSide === 'bride'}
            inactive={activeSide === 'groom'}
            onEnter={() => setActiveSide('bride')}
            onLeave={() => setActiveSide(null)}
            aosDelay={100}
          />
        </div>
      </Container>
    </section>
  )
}

export default CoupleSection
