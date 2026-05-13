import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { weddingData } from '../../data/wedding.data'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

gsap.registerPlugin(ScrollTrigger)

export default function OpeningSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const prefersReduced = usePrefersReducedMotion()

  useEffect(() => {
    if (prefersReduced) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.opening-line',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          stagger: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
          },
        }
      )
      gsap.fromTo(
        '.opening-ornament',
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.5,
          ease: 'power3.inOut',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          },
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [prefersReduced])

  return (
    <section id="opening" ref={sectionRef} className="section-padding bg-[#050505]">
      <div className="container-base max-w-3xl mx-auto text-center">
        {/* Ornament top */}
        <div className="opening-ornament origin-center w-24 h-px bg-[rgba(245,242,236,0.2)] mx-auto mb-16" />

        <div className="opening-line label-caps text-muted-gray tracking-[0.4em] mb-8">
          Bismillahirrahmanirrahim
        </div>

        <p
          className="opening-line text-off-white leading-relaxed mb-10"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(22px,3vw,32px)',
            fontWeight: 300,
            fontStyle: 'italic',
          }}
        >
          &ldquo;{weddingData.wedding.quote.text}&rdquo;
        </p>

        <p className="opening-line label-caps text-muted-gray tracking-[0.3em] mb-16">
          {weddingData.wedding.quote.author}
        </p>

        <p
          className="opening-line font-sans text-[16px] text-[rgba(245,242,236,0.55)] leading-relaxed"
        >
          {weddingData.wedding.openingQuote}
        </p>

        {/* Ornament bottom */}
        <div className="opening-ornament origin-center w-24 h-px bg-[rgba(245,242,236,0.2)] mx-auto mt-16" />
      </div>
    </section>
  )
}
