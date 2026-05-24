import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { weddingData } from '../../data/wedding.data'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

gsap.registerPlugin(ScrollTrigger)

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const prefersReduced = usePrefersReducedMotion()

  useEffect(() => {
    if (prefersReduced) return
    const ctx = gsap.context(() => {
      if (!bgRef.current || !overlayRef.current) return
      // Entrance
      const tl = gsap.timeline()
      tl.fromTo(bgRef.current, { scale: 1.25 }, { scale: 1, duration: 2.4, ease: 'power3.out' })
        .fromTo(overlayRef.current, { opacity: 1 }, { opacity: 0.55, duration: 2, ease: 'power2.out' }, 0)
        .fromTo('.hero-eyebrow', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, 0.8)
        .fromTo(
          '.hero-name-char',
          { opacity: 0, y: 60 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.04, ease: 'power3.out' },
          1.1
        )
        .fromTo('.hero-date', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 1.8)
        .fromTo('.hero-cta', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 2.0)

      // Scroll parallax
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        onUpdate: (self) => {
          if (bgRef.current) {
            gsap.set(bgRef.current, { y: self.progress * 120 })
          }
          if (contentRef.current) {
            gsap.set(contentRef.current, { opacity: 1 - self.progress * 2, y: self.progress * -60 })
          }
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [prefersReduced])

  const name = 'Alya & Raka'

  return (
    <section id="hero" ref={sectionRef} data-section data-theme="dark" className="relative h-screen w-full flex items-center justify-center overflow-hidden vignette">
      {/* Background image */}
      <div ref={bgRef} className="absolute inset-0 will-change-transform">
        <img
          src="https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&q=85&fit=crop"
          alt="Wedding hero background"
          className="w-full h-full object-cover mono-img"
        />
      </div>

      {/* Overlay */}
      <div ref={overlayRef} className="absolute inset-0 bg-black" style={{ opacity: 1 }} />

      {/* Decorative line left */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-3">
        <div className="w-px h-24 bg-[rgba(245,242,236,0.2)]" />
        <span className="label-caps text-[rgba(245,242,236,0.3)] [writing-mode:vertical-lr]">Scroll</span>
        <div className="w-px h-24 bg-[rgba(245,242,236,0.2)]" />
      </div>

      {/* Content */}
      <div ref={contentRef} className="relative z-10 text-center px-6 flex flex-col items-center gap-7">
        <p className="hero-eyebrow label-caps text-[rgba(245,242,236,0.55)] tracking-[0.4em] opacity-0">
          The Wedding of
        </p>

        <h1
          className="text-off-white leading-none"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 400,
            fontSize: 'clamp(52px,10vw,130px)',
            letterSpacing: '-0.02em',
          }}
          aria-label={name}
        >
          {name.split('').map((char, i) => (
            <span
              key={i}
              className="hero-name-char inline-block opacity-0"
              style={{ display: char === ' ' ? 'inline' : 'inline-block' }}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </h1>

        <p className="hero-date label-caps text-[rgba(245,242,236,0.4)] tracking-[0.5em] opacity-0">
          {weddingData.wedding.dateFormatted}
        </p>

        <button
          className="hero-cta mt-4 opacity-0 label-caps border border-[rgba(245,242,236,0.25)] text-off-white px-10 py-4 tracking-[0.3em] hover:bg-[rgba(245,242,236,0.08)] hover:border-[rgba(245,242,236,0.5)] transition-all duration-400"
          onClick={() => document.getElementById('opening')?.scrollIntoView({ behavior: 'smooth' })}
        >
          Buka Undangan
        </button>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#050505] to-transparent" />
    </section>
  )
}
