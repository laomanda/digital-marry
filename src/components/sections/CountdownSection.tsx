import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { weddingData } from '../../data/wedding.data'
import { useCountdown } from '../../hooks/useCountdown'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

gsap.registerPlugin(ScrollTrigger)

export default function CountdownSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const { days, hours, minutes, seconds, isPast } = useCountdown(weddingData.wedding.date)
  const prefersReduced = usePrefersReducedMotion()

  useEffect(() => {
    if (prefersReduced) return
    const ctx = gsap.context(() => {
      const targets = gsap.utils.toArray('.countdown-num')
      if (targets.length > 0) {
        gsap.fromTo(
          targets,
          { opacity: 0, scale: 0.7, y: 30 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 1,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
          }
        )
      }
    }, sectionRef)
    return () => ctx.revert()
  }, [prefersReduced])

  const items = [
    { value: days, label: 'Hari' },
    { value: hours, label: 'Jam' },
    { value: minutes, label: 'Menit' },
    { value: seconds, label: 'Detik' },
  ]

  return (
    <section id="countdown" ref={sectionRef} data-section data-theme="dark" className="section-padding bg-[#050505] relative overflow-hidden">
      {/* Background texture */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,255,255,0.5) 40px, rgba(255,255,255,0.5) 41px), repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,255,255,0.5) 40px, rgba(255,255,255,0.5) 41px)',
        }}
      />

      <div className="container-base text-center relative z-10">
        <span className="label-caps text-muted-gray tracking-[0.35em] block mb-4">Menghitung Hari</span>
        <h2
          style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontSize: 'clamp(28px,3vw,40px)' }}
          className="text-off-white mb-16"
        >
          {isPast ? 'Selamat Menempuh Hidup Baru' : 'Sampai Hari Istimewa'}
        </h2>

        {isPast ? (
          <p className="font-sans text-[16px] text-muted-gray">
            Hari yang dinantikan telah tiba. Selamat berbahagia!
          </p>
        ) : (
          <div className="flex items-start justify-center gap-6 md:gap-16">
            {items.map((item, i) => (
              <div key={item.label} className="countdown-num flex flex-col items-center gap-3">
                <span
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontWeight: 300,
                    fontSize: 'clamp(56px,8vw,120px)',
                    lineHeight: 1,
                  }}
                  className="text-off-white tabular-nums"
                >
                  {String(item.value).padStart(2, '0')}
                </span>
                <span className="label-caps text-muted-gray tracking-[0.3em]">{item.label}</span>
                {i < items.length - 1 && (
                  <div className="hidden md:block absolute" style={{ transform: 'translateX(calc(50% + 24px))', top: 0 }}>
                    <span
                      style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '80px', lineHeight: 1, color: 'rgba(245,242,236,0.1)' }}
                    >
                      :
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="w-px h-20 bg-[rgba(245,242,236,0.1)] mx-auto mt-16" />
        <p className="label-caps text-[rgba(138,138,138,0.4)] tracking-[0.4em] mt-4">
          {weddingData.wedding.dateFormatted}
        </p>
      </div>
    </section>
  )
}
