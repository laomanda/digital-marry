import { useRef, useEffect } from 'react'
import { gsap } from '../../lib/gsap'
import { weddingData } from '../../data/wedding.data'
import { useReducedMotionSafe } from '../../hooks/useReducedMotionSafe'

export default function ClosingSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)
  const { shouldReduceMotion } = useReducedMotionSafe()

  const closingName = `${weddingData.bride.firstName} & ${weddingData.groom.firstName}`
  const fallbackImg = "https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&q=80&fit=crop"
  const closingImage = weddingData.gallery?.[4]?.src || weddingData.gallery?.[0]?.src || fallbackImg

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Slow background zoom (Skip if reduced motion)
      if (!shouldReduceMotion && bgRef.current) {
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
      }

      // 2. Kicker, Text & Line Reveal
      gsap.fromTo(
        '.closing-reveal',
        { opacity: 0, y: shouldReduceMotion ? 0 : 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          stagger: 0.2,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 65%' },
        }
      )

      // 3. Signature Letter Stagger
      gsap.fromTo(
        '.closing-char',
        { opacity: 0, y: shouldReduceMotion ? 0 : 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.04,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.closing-signature', start: 'top 85%' },
        }
      )
    }, sectionRef)
    
    return () => ctx.revert()
  }, [shouldReduceMotion])

  return (
    <section 
      id="closing" 
      ref={sectionRef} 
      data-section 
      data-theme="dark" 
      data-wow="true"
      className="relative min-h-screen w-full flex flex-col justify-end overflow-hidden pb-32 md:pb-40 pt-32 px-6 md:px-12"
    >
      {/* Background Image Vault */}
      <div ref={bgRef} className="absolute inset-0 will-change-transform z-0">
        <img
          src={closingImage}
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover grayscale opacity-60"
        />
        {/* Dual Vignette Overlay for maximum readability */}
        <div className="absolute inset-0 bg-[#050505]/70" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#050505_100%)] opacity-90" />
      </div>

      {/* Asymmetric Content Layout */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto flex flex-col justify-between min-h-[60vh] gap-24">
        
        {/* Top/Left Section: The Final Note */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-6 md:max-w-[600px] md:ml-auto md:mr-12">
          <span className="closing-reveal font-mono text-[9px] md:text-[10px] tracking-[0.4em] uppercase text-[#A4A4A4]">
            Final Note
          </span>
          
          <div className="closing-reveal w-12 h-px bg-[rgba(245,245,240,0.15)] my-2" />
          
          <p className="closing-reveal font-serif italic text-[20px] md:text-[28px] text-[#F5F5F0] leading-relaxed font-light">
            &ldquo;{weddingData.closingQuote.text}&rdquo;
          </p>
          
          <p className="closing-reveal font-sans text-[11px] md:text-[12px] uppercase tracking-[0.3em] text-[#A4A4A4] mt-2">
            — {weddingData.closingQuote.author}
          </p>
        </div>

        {/* Bottom/Right Section: The Massive Signature */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-8 mt-auto">
          
          {/* Accessible Staggered Signature */}
          <h2
            className="closing-signature font-serif font-light text-[#F5F5F0]"
            style={{
              fontSize: 'clamp(56px, 12vw, 160px)',
              lineHeight: 0.85,
              letterSpacing: '-0.03em',
            }}
            aria-label={closingName}
          >
            {closingName.split('').map((char, i) => (
              <span
                key={i}
                aria-hidden="true"
                className="closing-char inline-block"
                style={{ display: char === ' ' ? 'inline' : 'inline-block' }}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </h2>

          <div className="closing-reveal flex flex-col items-center md:items-start gap-4 mt-2">
            <p className="font-mono text-[9px] md:text-[11px] tracking-[0.5em] uppercase text-[#A4A4A4]">
              {weddingData.wedding.dateFormatted}
            </p>
            <p className="font-sans text-[13px] md:text-[14px] text-[#A4A4A4] max-w-md leading-relaxed border-t border-[rgba(245,245,240,0.1)] pt-4 mt-2">
              Terima kasih telah menjadi bagian dari hari paling berharga dalam hidup kami. Kehadiran dan doa Anda adalah berkah yang tak ternilai.
            </p>
          </div>
          
        </div>
      </div>

      {/* Footer Bridge (Absolute Bottom) */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#050505] to-transparent z-10 pointer-events-none" />
    </section>
  )
}
