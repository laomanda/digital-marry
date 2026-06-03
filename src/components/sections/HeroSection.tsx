import { useEffect, useRef } from 'react'
import { gsap } from '../../lib/gsap'
import { weddingData } from '../../data/wedding.data'
import { useReducedMotionSafe } from '../../hooks/useReducedMotionSafe'
import heroImageLocal from '../../assets/lainnya/foto/hero-section.webp'
import heroImageMobile from '../../assets/lainnya/foto/galeri-4.webp'
type HeroSectionProps = {
  isInvitationOpen: boolean
}

type HeroNameLineProps = {
  text: string
  className?: string
}

function HeroNameLine({ text, className }: HeroNameLineProps) {
  return (
    <span aria-hidden="true" className={className}>
      {text.split('').map((char, index) => (
        <span
          key={`${char}-${index}`}
          data-hero-char
          className="inline-block will-change-transform"
          style={{ opacity: 0 }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  )
}

export default function HeroSection({ isInvitationOpen }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const nameRef = useRef<HTMLHeadingElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const { shouldReduceMotion, shouldReduceHeavyMotion } = useReducedMotionSafe()
  const overlayIntroOpacity = 0.15
  const overlayInitialOpacity = 0.45
  const overlayScrollOpacity = 0.28

  const rootClass = 'bg-[#050505]'
  const textClass = 'text-[#F5F5F0]'
  const mutedClass = 'text-[rgba(245,245,240,0.58)]'
  const dimClass = 'text-[rgba(245,245,240,0.42)]'

  const lineStrong = 'bg-[rgba(245,245,240,0.22)]'
  const lineMedium = 'bg-[rgba(245,245,240,0.28)]'
  const lineSoft = 'bg-[rgba(245,245,240,0.14)]'

  const overlayGradientClass = 'bg-[linear-gradient(90deg,rgba(5,5,5,0.30)_0%,rgba(5,5,5,0.15)_34%,rgba(5,5,5,0.05)_72%,rgba(5,5,5,0.20)_100%)]'
  const overlayRadialStyle = 'radial-gradient(circle at 72% 28%, transparent 0%, rgba(5,5,5,0.08) 34%, rgba(5,5,5,0.30) 100%)'
  const bottomFadeClass = 'from-[#050505] via-[#050505]/78'

  const coupleName = `${weddingData.groom.firstName} & ${weddingData.bride.firstName}`
  const heroImage = heroImageLocal

  useEffect(() => {
    if (!isInvitationOpen) return
    if (!sectionRef.current) return

    const root = sectionRef.current
    let isActive = true
    let cleanupPointerDepth: (() => void) | undefined
    let scrollTimeline: gsap.core.Timeline | undefined

    const ctx = gsap.context(() => {
      const bgScale = root.querySelector<HTMLElement>('[data-hero-bg-scale]')
      const chars = Array.from(nameRef.current?.querySelectorAll<HTMLElement>('[data-hero-char]') ?? [])
      const animatedElements = Array.from(root.querySelectorAll<HTMLElement>('[data-hero-animate]'))
      const lines = Array.from(root.querySelectorAll<HTMLElement>('[data-hero-line]'))
      const scrollIndicator = root.querySelector<HTMLElement>('[data-hero-scroll]')

      if (shouldReduceMotion) {
        gsap.set(bgRef.current, { x: 0, y: 0 })
        gsap.set(bgScale, { opacity: 1, scale: 1, y: 0 })
        gsap.set(overlayRef.current, { opacity: overlayIntroOpacity })
        gsap.set(contentRef.current, { opacity: 1, y: 0 })
        if (animatedElements.length) gsap.set(animatedElements, { opacity: 1, y: 0, x: 0 })
        if (lines.length) gsap.set(lines, { opacity: 1, scaleX: 1, scaleY: 1 })
        if (chars.length) gsap.set(chars, { opacity: 1, y: 0 })
        if (scrollIndicator) gsap.set(scrollIndicator, { opacity: 1, y: 0 })
        return
      }

      gsap.set(bgRef.current, { x: 0, y: 0, force3D: true })
      gsap.set(bgScale, { opacity: 1, scale: shouldReduceHeavyMotion ? 1 : 1.055, y: 0, force3D: true })
      gsap.set(overlayRef.current, { opacity: overlayInitialOpacity })
      gsap.set(contentRef.current, { opacity: 1, y: 0, force3D: true })
      if (animatedElements.length) gsap.set(animatedElements, { opacity: 0, y: 18, force3D: true })
      if (lines.length) gsap.set(lines, { opacity: 0, scaleX: 0, transformOrigin: 'left center' })
      if (chars.length) gsap.set(chars, { opacity: 0, y: 24, force3D: true })
      if (scrollIndicator) gsap.set(scrollIndicator, { opacity: 0, y: 10, force3D: true })

      if (!shouldReduceHeavyMotion && bgScale && contentRef.current && overlayRef.current) {
        scrollTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.45,
            invalidateOnRefresh: true,
          },
        })

        scrollTimeline
          .to(bgScale, { scale: 1.025, y: 34, ease: 'none', force3D: true }, 0)
          .to(contentRef.current, { opacity: 0.22, y: -24, ease: 'none', force3D: true }, 0)
          .to(overlayRef.current, { opacity: overlayScrollOpacity, ease: 'none' }, 0)
      }

      const intro = gsap.timeline({
        delay: 0.16,
      })

      intro
        .to(bgScale, { scale: 1, duration: shouldReduceHeavyMotion ? 0.85 : 1.45, ease: 'power3.out', force3D: true }, 0)
        .to(overlayRef.current, { opacity: overlayIntroOpacity, duration: 1.0, ease: 'power2.out' }, 0.06)

      if (lines.length) {
        intro.to(
          lines,
          {
            opacity: 1,
            scaleX: 1,
            duration: 0.65,
            stagger: 0.08,
            ease: 'power2.out',
          },
          0.36,
        )
      }

      if (animatedElements.length) {
        intro.to(
          animatedElements,
          {
            opacity: 1,
            y: 0,
            duration: 0.58,
            stagger: 0.08,
            ease: 'power3.out',
            force3D: true,
          },
          0.52,
        )
      }

      if (chars.length) {
        intro.to(
          chars,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.026,
            ease: 'power3.out',
            force3D: true,
          },
          0.72,
        )
      }

      if (scrollIndicator) {
        intro.to(scrollIndicator, { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out', force3D: true }, 1.42)
      }

      intro.call(() => {
        if (!isActive) return
        if (shouldReduceHeavyMotion && contentRef.current) {
          gsap.set(contentRef.current, { clearProps: 'willChange' })
        }
      })

      const canUsePointerDepth =
        !shouldReduceHeavyMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches && bgRef.current

      if (canUsePointerDepth && bgRef.current) {
        const moveX = gsap.quickTo(bgRef.current, 'x', { duration: 0.55, ease: 'power3.out' })
        const moveY = gsap.quickTo(bgRef.current, 'y', { duration: 0.55, ease: 'power3.out' })
        const maxDepth = 7
        let pointerFrame = 0
        let latestPointer: PointerEvent | null = null

        const updatePointerDepth = () => {
          pointerFrame = 0
          const event = latestPointer
          if (!event) return

          const rect = root.getBoundingClientRect()
          if (rect.bottom < 0 || rect.top > window.innerHeight) return

          const x = ((event.clientX - rect.left) / rect.width - 0.5) * maxDepth
          const y = ((event.clientY - rect.top) / rect.height - 0.5) * maxDepth

          moveX(x)
          moveY(y)
        }

        const handlePointerMove = (event: PointerEvent) => {
          latestPointer = event
          if (!pointerFrame) pointerFrame = window.requestAnimationFrame(updatePointerDepth)
        }

        const resetPointerDepth = () => {
          latestPointer = null
          if (pointerFrame) {
            window.cancelAnimationFrame(pointerFrame)
            pointerFrame = 0
          }
          moveX(0)
          moveY(0)
        }

        window.addEventListener('pointermove', handlePointerMove)
        root.addEventListener('pointerleave', resetPointerDepth)

        cleanupPointerDepth = () => {
          resetPointerDepth()
          window.removeEventListener('pointermove', handlePointerMove)
          root.removeEventListener('pointerleave', resetPointerDepth)
        }
      }

      if (scrollIndicator) {
        gsap.to(scrollIndicator.querySelector('[data-hero-scroll-dot]'), {
          y: 44,
          opacity: 0.25,
          repeat: -1,
          yoyo: true,
          duration: 1.35,
          ease: 'power1.inOut',
        })
      }
    }, sectionRef)

    return () => {
      isActive = false
      cleanupPointerDepth?.()
      scrollTimeline?.scrollTrigger?.kill()
      scrollTimeline?.kill()
      ctx.revert()
    }
  }, [isInvitationOpen, shouldReduceMotion, shouldReduceHeavyMotion])

  return (
    <section
      ref={sectionRef}
      id="hero"
      data-section
      data-theme="dark"
      data-wow="true"
      className={`relative min-h-screen w-full overflow-hidden transition-colors duration-500 ${rootClass}`}
    >
      <div ref={bgRef} className="absolute inset-0 will-change-transform" aria-hidden="true">
        <div data-hero-bg-scale className="absolute inset-0 will-change-transform">
          <picture className="h-full w-full">
            <source media="(max-width: 767px)" srcSet={heroImageMobile} />
            <img
              src={heroImageLocal}
              alt=""
              aria-hidden="true"
              className={`h-full w-full scale-[1.02] object-cover transition-all duration-500 contrast-[1.06] brightness-[0.96]`}
              loading="eager"
              decoding="async"
            />
          </picture>
        </div>
      </div>

      <div
        ref={overlayRef}
        data-hero-overlay
        className={`absolute inset-0 transition-colors duration-500 ${rootClass}`}
        style={{ opacity: overlayInitialOpacity }}
      />
      <div className={`pointer-events-none absolute inset-0 transition-colors duration-500 ${overlayGradientClass}`} />
      <div
        className="pointer-events-none absolute inset-0 transition-colors duration-500"
        style={{ background: overlayRadialStyle }}
      />
      <div className={`pointer-events-none absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t transition-colors duration-500 ${bottomFadeClass} to-transparent`} />

      <div className="pointer-events-none absolute left-6 right-6 top-8 z-10 md:left-10 md:right-10 lg:left-16 lg:right-16">
        <div data-hero-line className={`h-px w-full transition-colors duration-500 ${lineStrong}`} />
      </div>
      <div className="pointer-events-none absolute bottom-8 left-6 right-6 z-10 md:left-10 md:right-10 lg:left-16 lg:right-16">
        <div data-hero-line className={`h-px w-full transition-colors duration-500 ${lineSoft}`} />
      </div>

      <div
        ref={contentRef}
        data-hero-content
        className="relative z-10 flex min-h-screen flex-col justify-end px-6 pb-20 pt-28 md:px-10 md:pb-24 lg:px-16 lg:pb-28"
      >
        <div className="grid items-end gap-10 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <div className="max-w-[1040px]">
            <p
              className={`label-caps mb-5 md:mb-6 transition-colors duration-500 ${mutedClass}`}
            >
              The Wedding Of
            </p>

            <h1
              ref={nameRef}
              aria-label={coupleName}
              className={`max-w-[11ch] font-athene text-[clamp(58px,13vw,172px)] leading-[0.82] tracking-normal md:max-w-[10.5ch] transition-colors duration-500 ${textClass}`}
            >
              <HeroNameLine text={weddingData.groom.firstName} className="block" />
              <span className="block">
                <span
                  data-hero-char
                  className={`mr-4 inline-block italic text-[0.44em] will-change-transform md:mr-6 transition-colors duration-500 ${dimClass}`}
                  style={{ opacity: 0 }}
                >
                  &amp;
                </span>
                <HeroNameLine text={weddingData.bride.firstName} className="inline" />
              </span>
            </h1>

            <div className="mt-7 flex flex-col gap-5 md:mt-8 md:flex-row md:items-end md:gap-9">
              <div
                className={`h-px w-28 md:w-36 transition-colors duration-500 ${lineMedium}`}
              />
              <div className="max-w-xl">
                <p
                  className={`mb-3 font-mono text-[11px] uppercase tracking-[0.42em] md:text-[12px] transition-colors duration-500 ${mutedClass}`}
                >
                  {weddingData.wedding.dateFormatted}
                </p>
                <p
                  className={`max-w-md font-montserrat text-[17px] font-semibold leading-[1.65] transition-colors duration-500 md:text-[20px] ${mutedClass}`}
                >
                  Sebuah undangan untuk merayakan cinta yang telah kami rawat bersama
                </p>
              </div>
            </div>
          </div>

          <aside
            data-hero-scroll
            aria-hidden="true"
            className="hidden min-h-[180px] lg:flex lg:items-end lg:justify-end"
          >
            <div className={`relative flex h-40 w-[11rem] items-end justify-end transition-colors duration-500 ${dimClass}`}>
              <div className="mr-7 flex flex-col items-end gap-3 pb-1">
                <span className={`font-mono text-[10px] uppercase tracking-[0.34em] transition-colors duration-500 ${mutedClass}`}>
                  Scroll
                </span>
                <span className={`h-px w-16 transition-colors duration-500 ${lineStrong}`} />
                <span className={`font-mono text-[9px] uppercase tracking-[0.28em] transition-colors duration-500 ${dimClass}`}>
                  Lanjutkan
                </span>
              </div>

              <div className={`relative h-28 w-px overflow-hidden transition-colors duration-500 ${lineSoft}`}>
                <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-[#F5F5F0]/45 to-transparent transition-colors duration-500" />
                <span
                  data-hero-scroll-dot
                  className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 rounded-full border transition-colors duration-500 border-[#F5F5F0]/70 bg-[#050505] shadow-[0_0_16px_rgba(245,245,240,0.18)]"
                />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
