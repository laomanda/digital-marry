import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { weddingData } from '../../data/wedding.data'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

gsap.registerPlugin(ScrollTrigger)

export default function ClosingSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)
  const prefersReduced = usePrefersReducedMotion()

  useEffect(() => {
    if (prefersReduced) return
    const ctx = gsap.context(() => {
      if (!bgRef.current) return
      // Slow background zoom
      gsap.fromTo(
        bgRef.current,
        { scale: 1 },
        {
          scale: 1.12,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 2,
          },
        }
      )

      // Text reveals
      gsap.fromTo(
        '.closing-text',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
        }
      )

      // Letter stagger for name
      gsap.fromTo(
        '.closing-name-char',
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.03,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.closing-name', start: 'top 80%' },
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [prefersReduced])

  const closingName = 'Alya & Raka'

  return (
    <section id="closing" ref={sectionRef} data-section data-theme="dark" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div ref={bgRef} className="absolute inset-0 will-change-transform">
        <img
          src="https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&q=80&fit=crop"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover mono-img"
        />
        <div className="absolute inset-0 bg-[rgba(5,5,5,0.8)]" />
      </div>

      {/* Vignette */}
      <div className="absolute inset-0 bg-radial-gradient" style={{ background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.6) 100%)' }} />

      <div className="relative z-10 text-center px-6 py-20 flex flex-col items-center gap-8 max-w-4xl mx-auto">
        <div className="closing-text w-16 h-px bg-[rgba(245,242,236,0.2)]" />

        <p
          className="closing-text text-[rgba(245,242,236,0.5)]"
          style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(18px,2.5vw,24px)', fontStyle: 'italic' }}
        >
          &ldquo;{weddingData.closingQuote.text}&rdquo;
        </p>

        <p className="closing-text label-caps text-[rgba(245,242,236,0.3)] tracking-[0.3em]">
          {weddingData.closingQuote.author}
        </p>

        <div className="closing-text w-16 h-px bg-[rgba(245,242,236,0.2)]" />

        <h2
          className="closing-name"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 300,
            fontSize: 'clamp(60px,12vw,160px)',
            lineHeight: 0.9,
            letterSpacing: '-0.02em',
          }}
          aria-label={closingName}
        >
          {closingName.split('').map((char, i) => (
            <span
              key={i}
              className="closing-name-char inline-block text-off-white"
              style={{ display: char === ' ' ? 'inline' : 'inline-block' }}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </h2>

        <p className="closing-text label-caps text-[rgba(245,242,236,0.3)] tracking-[0.5em]">
          {weddingData.wedding.dateFormatted}
        </p>

        <p className="closing-text font-sans text-[14px] text-[rgba(245,242,236,0.35)] mt-4 max-w-md leading-relaxed">
          Terima kasih telah menjadi bagian dari hari paling berharga dalam hidup kami. Kehadiran dan doa Anda adalah berkah yang tak ternilai.
        </p>
      </div>

      {/* Bottom fade to footer */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#050505] to-transparent" />
    </section>
  )
}
