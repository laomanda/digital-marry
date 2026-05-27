import { useRef, useEffect } from 'react'
import { Heart } from 'lucide-react'
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
      if (shouldReduceMotion) {
        gsap.set('.closing-reveal, .closing-char, .closing-seal, .closing-credit', {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: 'blur(0px)',
        })
        return
      }

      if (bgRef.current) {
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

      const revealTl = gsap.timeline({
        scrollTrigger: { trigger: sectionRef.current, start: 'top 65%' },
      })

      revealTl
        .fromTo(
          '.closing-label',
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }
        )
        .fromTo(
          '.closing-quote',
          { opacity: 0, y: 22 },
          { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' },
          '-=0.25'
        )
        .fromTo(
          '.closing-author',
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.65, ease: 'power3.out' },
          '-=0.45'
        )

      gsap.fromTo(
        '.closing-char',
        { opacity: 0, y: 40, filter: 'blur(6px)' },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.9,
          stagger: 0.04,
          ease: 'expo.out',
          scrollTrigger: { trigger: '.closing-signature', start: 'top 85%' },
        }
      )

      const bottomTl = gsap.timeline({
        scrollTrigger: { trigger: '.closing-signature', start: 'top 75%' },
      })

      bottomTl
        .fromTo(
          '.closing-date',
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.65, ease: 'power3.out' },
          0.35
        )
        .fromTo(
          '.closing-thanks',
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out' },
          '-=0.32'
        )
        .fromTo(
          '.closing-seal',
          { opacity: 0, scale: 0.85 },
          { opacity: 0.72, scale: 1, duration: 0.5, ease: 'power3.out' },
          '-=0.25'
        )
        .to('.closing-seal', {
          opacity: 1,
          scale: 1.12,
          duration: 0.18,
          ease: 'power2.out',
        })
        .to('.closing-seal', {
          opacity: 0.72,
          scale: 1,
          duration: 0.28,
          ease: 'power2.out',
        })
        .fromTo(
          '.closing-credit',
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out' },
          '-=0.18'
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
      className="relative -mt-px min-h-screen w-full flex flex-col justify-end overflow-hidden bg-[#050505] pb-32 md:pb-40 pt-32 px-6 md:px-12"
    >
      {/* Background Image Vault */}
      <div
        ref={bgRef}
        className="absolute inset-0 will-change-transform z-0"
        style={{
          WebkitMaskImage:
            'linear-gradient(to bottom, transparent 0%, transparent 9%, rgba(0,0,0,0.08) 23%, rgba(0,0,0,0.34) 42%, rgba(0,0,0,0.74) 62%, #000 82%)',
          maskImage:
            'linear-gradient(to bottom, transparent 0%, transparent 9%, rgba(0,0,0,0.08) 23%, rgba(0,0,0,0.34) 42%, rgba(0,0,0,0.74) 62%, #000 82%)',
        }}
      >
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
        
        {/* Top/Left Section: Final blessing note */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-6 md:max-w-[600px] md:ml-auto md:mr-12">
          <span className="closing-label closing-reveal font-mono text-[9px] md:text-[10px] tracking-[0.4em] uppercase text-[#A4A4A4]">
            Terima Kasih
          </span>
          
          
          <p className="closing-quote closing-reveal font-serif italic text-[19px] md:text-[26px] text-[#F5F5F0] leading-relaxed font-light">
            &ldquo;{weddingData.closingQuote.text}&rdquo;
          </p>

          
          <p className="closing-author closing-reveal font-sans text-[11px] md:text-[12px] uppercase tracking-[0.3em] text-[#A4A4A4] mt-1">
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

          <div className="closing-bottom closing-reveal flex flex-col items-center md:items-start gap-4 mt-2">
            <p className="closing-date closing-reveal font-mono text-[9px] md:text-[11px] tracking-[0.5em] uppercase text-[#A4A4A4]">
              {weddingData.wedding.dateFormatted}
            </p>
            <p className="closing-thanks closing-reveal font-sans text-[13px] md:text-[14px] text-[#A4A4A4] max-w-md leading-relaxed border-t border-[rgba(245,245,240,0.1)] pt-4 mt-2">
              Terima kasih telah menjadi bagian dari hari paling berharga dalam hidup kami. Kehadiran dan doa Anda adalah berkah yang tak ternilai.
            </p>
            <div className="closing-seal flex items-center gap-3 pt-1 text-[#F5F5F0]/70" aria-hidden="true">
              <span className="h-px w-10 bg-[#F5F5F0]/20" />
              <Heart size={14} strokeWidth={1.25} />
              <span className="h-px w-10 bg-[#F5F5F0]/20" />
            </div>
          </div>
          
        </div>
      </div>

      <p className="closing-credit closing-reveal absolute bottom-6 left-1/2 z-20 -translate-x-1/2 font-mono text-[9px] uppercase tracking-[0.24em] text-[#A4A4A4]/70 md:bottom-8">
        Created by Jakkob Panj
      </p>

      {/* Footer Bridge (Absolute Bottom) */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#050505] to-transparent z-10 pointer-events-none" />
    </section>
  )
}
