import { useEffect, useRef } from 'react'
import { animate } from 'animejs'
import { gsap, ScrollTrigger } from '../../lib/gsap'
import { weddingData } from '../../data/wedding.data'
import { useReducedMotionSafe } from '../../hooks/useReducedMotionSafe'
import { usePalette } from '../../hooks/usePalette'

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
  const { shouldReduceMotion } = useReducedMotionSafe()
  const { palette } = usePalette()

  const isBurgundy = palette === 'burgundy'
  const isTaupe = palette === 'taupe'

  const overlayIntroOpacity = isTaupe ? 0.58 : 0.48
  const overlayInitialOpacity = isTaupe ? 0.78 : 0.86
  const overlayScrollOpacity = isTaupe ? 0.70 : 0.78

  const rootClass = isTaupe ? 'bg-[#C9AD8F]' : isBurgundy ? 'bg-[#4A1F2A]' : 'bg-[#050505]'
  const textClass = isTaupe ? 'text-[#111111]' : 'text-[#F5F5F0]'
  const mutedClass = isTaupe ? 'text-[rgba(17,17,17,0.58)]' : 'text-[rgba(245,245,240,0.58)]'
  const dimClass = isTaupe ? 'text-[rgba(17,17,17,0.42)]' : 'text-[rgba(245,245,240,0.42)]'
  
  const lineStrong = isTaupe ? 'bg-[rgba(17,17,17,0.22)]' : 'bg-[rgba(245,245,240,0.22)]'
  const lineMedium = isTaupe ? 'bg-[rgba(17,17,17,0.22)]' : 'bg-[rgba(245,245,240,0.28)]'
  const lineSoft = isTaupe ? 'bg-[rgba(17,17,17,0.14)]' : 'bg-[rgba(245,245,240,0.14)]'

  const overlayGradientClass = isTaupe
    ? 'bg-[linear-gradient(90deg,rgba(201,173,143,0.92)_0%,rgba(201,173,143,0.66)_34%,rgba(201,173,143,0.20)_72%,rgba(201,173,143,0.52)_100%)]'
    : isBurgundy
      ? 'bg-[linear-gradient(90deg,rgba(74,31,42,0.92)_0%,rgba(74,31,42,0.62)_34%,rgba(74,31,42,0.18)_72%,rgba(74,31,42,0.48)_100%)]'
      : 'bg-[linear-gradient(90deg,rgba(5,5,5,0.92)_0%,rgba(5,5,5,0.62)_34%,rgba(5,5,5,0.18)_72%,rgba(5,5,5,0.48)_100%)]'

  const overlayRadialStyle = isTaupe
    ? 'radial-gradient(circle at 72% 28%, transparent 0%, rgba(201,173,143,0.28) 34%, rgba(111,82,58,0.42) 100%)'
    : isBurgundy
      ? 'radial-gradient(circle at 72% 28%, transparent 0%, rgba(74,31,42,0.28) 34%, rgba(74,31,42,0.78) 100%)'
      : 'radial-gradient(circle at 72% 28%, transparent 0%, rgba(5,5,5,0.28) 34%, rgba(5,5,5,0.78) 100%)'

  const bottomFadeClass = isTaupe
    ? 'from-[#C9AD8F] via-[rgba(201,173,143,0.78)]'
    : isBurgundy
      ? 'from-[#4A1F2A] via-[#4A1F2A]/78'
      : 'from-[#050505] via-[#050505]/78'

  const coupleName = `${weddingData.bride.firstName} & ${weddingData.groom.firstName}`
  const heroImage =
    weddingData.gallery?.[1]?.src ||
    weddingData.gallery?.[0]?.src ||
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&q=85&fit=crop'

  useEffect(() => {
    if (!isInvitationOpen) return
    if (!sectionRef.current) return

    const root = sectionRef.current
    let isActive = true
    let cleanupPointerDepth: (() => void) | undefined
    let scrollTimeline: gsap.core.Timeline | undefined

    const ctx = gsap.context(() => {
      const bgScale = root.querySelector<HTMLElement>('[data-hero-bg-scale]')
      const chars = nameRef.current?.querySelectorAll<HTMLElement>('[data-hero-char]')
      const animatedElements = root.querySelectorAll<HTMLElement>('[data-hero-animate]')
      const lines = root.querySelectorAll<HTMLElement>('[data-hero-line]')
      const scrollIndicator = root.querySelector<HTMLElement>('[data-hero-scroll]')

      if (shouldReduceMotion) {
        gsap.set(bgRef.current, { x: 0, y: 0 })
        gsap.set(bgScale, { opacity: 1, scale: 1, y: 0 })
        gsap.set(overlayRef.current, { opacity: overlayIntroOpacity })
        gsap.set(contentRef.current, { opacity: 1, y: 0 })
        gsap.set(animatedElements, { opacity: 1, y: 0, x: 0 })
        gsap.set(lines, { opacity: 1, scaleX: 1, scaleY: 1 })
        gsap.set(chars || [], { opacity: 1, y: 0 })
        gsap.set(scrollIndicator, { opacity: 1, y: 0 })
        return
      }

      gsap.set(bgRef.current, { x: 0, y: 0 })
      gsap.set(bgScale, { opacity: 1, scale: 1.12, y: 0 })
      gsap.set(overlayRef.current, { opacity: overlayInitialOpacity })
      gsap.set(contentRef.current, { opacity: 1, y: 0 })
      gsap.set(animatedElements, { opacity: 0, y: 18 })
      gsap.set(lines, { opacity: 0, scaleX: 0, transformOrigin: 'left center' })
      gsap.set(chars || [], { opacity: 0, y: 40 })
      gsap.set(scrollIndicator, { opacity: 0, y: 12 })

      const createScrollTimeline = () => {
        if (!isActive || !bgScale || !contentRef.current || !overlayRef.current) return

        scrollTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.9,
          },
        })

        scrollTimeline
          .to(bgScale, { scale: 1.08, y: 72, ease: 'none' }, 0)
          .to(contentRef.current, { opacity: 0.08, y: -56, ease: 'none' }, 0)
          .to(overlayRef.current, { opacity: overlayScrollOpacity, ease: 'none' }, 0)

        ScrollTrigger.refresh()
      }

      const intro = gsap.timeline({
        delay: 0.16,
        onComplete: createScrollTimeline,
      })

      intro
        .to(bgScale, { scale: 1, duration: 2.35, ease: 'power3.out' }, 0)
        .to(overlayRef.current, { opacity: overlayIntroOpacity, duration: 1.8, ease: 'power2.out' }, 0.08)
        .to(
          lines,
          {
            opacity: 1,
            scaleX: 1,
            duration: 0.9,
            stagger: 0.12,
            ease: 'power2.out',
          },
          0.48,
        )
        .to(
          animatedElements,
          {
            opacity: 1,
            y: 0,
            duration: 0.78,
            stagger: 0.1,
            ease: 'power3.out',
          },
          0.68,
        )
        .call(
          () => {
            if (!chars?.length) return

            animate(chars, {
              opacity: [0, 1],
              translateY: [40, 0],
              duration: 950,
              delay: (_el: Element, index: number) => index * 34,
              ease: 'outExpo',
            })
          },
          [],
          0.96,
        )
        .to(scrollIndicator, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, 2.05)

      const canUsePointerDepth =
        window.matchMedia('(hover: hover) and (pointer: fine)').matches && bgRef.current

      if (canUsePointerDepth && bgRef.current) {
        const moveX = gsap.quickTo(bgRef.current, 'x', { duration: 0.75, ease: 'power3.out' })
        const moveY = gsap.quickTo(bgRef.current, 'y', { duration: 0.75, ease: 'power3.out' })
        const maxDepth = 12

        const handlePointerMove = (event: PointerEvent) => {
          const rect = root.getBoundingClientRect()
          if (rect.bottom < 0 || rect.top > window.innerHeight) return

          const x = ((event.clientX - rect.left) / rect.width - 0.5) * maxDepth
          const y = ((event.clientY - rect.top) / rect.height - 0.5) * maxDepth

          moveX(x)
          moveY(y)
        }

        const resetPointerDepth = () => {
          moveX(0)
          moveY(0)
        }

        window.addEventListener('pointermove', handlePointerMove)
        root.addEventListener('pointerleave', resetPointerDepth)

        cleanupPointerDepth = () => {
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
  }, [isInvitationOpen, shouldReduceMotion])

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
          <img
            src={heroImage}
            alt=""
            aria-hidden="true"
            className={`h-full w-full scale-[1.02] object-cover grayscale transition-all duration-500 ${isTaupe ? 'contrast-[1.05] brightness-[1.05]' : 'contrast-[1.12] brightness-[0.82]'}`}
            loading="eager"
          />
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
              className={`max-w-[11ch] font-serif text-[clamp(58px,13vw,172px)] font-light leading-[0.82] tracking-normal md:max-w-[10.5ch] transition-colors duration-500 ${textClass}`}
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              <HeroNameLine text={weddingData.bride.firstName} className="block" />
              <span className="block">
                <span
                  data-hero-char
                  className={`mr-4 inline-block italic text-[0.44em] will-change-transform md:mr-6 transition-colors duration-500 ${dimClass}`}
                  style={{ opacity: 0 }}
                >
                  &amp;
                </span>
                <HeroNameLine text={weddingData.groom.firstName} className="inline" />
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
                  className={`max-w-md font-serif text-[17px] italic leading-[1.65] md:text-[20px] transition-colors duration-500 ${mutedClass}`}
                  style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}
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
                <span className={`absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent to-transparent transition-colors duration-500 ${isTaupe ? 'via-[#111111]/40' : 'via-[#F5F5F0]/45'}`} />
                <span
                  data-hero-scroll-dot
                  className={`absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 rounded-full border transition-colors duration-500 ${
                    isTaupe 
                      ? 'border-[rgba(17,17,17,0.6)] bg-[#C9AD8F] shadow-[0_0_16px_rgba(17,17,17,0.16)]'
                      : isBurgundy 
                        ? 'border-[#F5F5F0]/70 bg-[#4A1F2A] shadow-[0_0_16px_rgba(245,245,240,0.18)]' 
                        : 'border-[#F5F5F0]/70 bg-[#050505] shadow-[0_0_16px_rgba(245,245,240,0.18)]'
                  }`}
                />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
