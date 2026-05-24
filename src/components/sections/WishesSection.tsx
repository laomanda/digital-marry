import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { weddingData } from '../../data/wedding.data'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

gsap.registerPlugin(ScrollTrigger)

export default function WishesSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const prefersReduced = usePrefersReducedMotion()

  useEffect(() => {
    if (prefersReduced) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.wish-card',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [prefersReduced])

  return (
    <section id="wishes" ref={sectionRef} data-section data-theme="dark" className="section-padding bg-[#050505]">
      <div className="container-base">
        <div className="text-center mb-16">
          <span className="label-caps text-muted-gray tracking-[0.35em] block mb-4">Ucapan</span>
          <h2
            style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontSize: 'clamp(36px,5vw,56px)' }}
            className="text-off-white"
          >
            Doa &amp; Ucapan
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {weddingData.wishes.map((wish) => (
            <div
              key={wish.id}
              className="wish-card border border-[rgba(255,255,255,0.07)] p-6 bg-[rgba(255,255,255,0.015)]"
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <p className="font-sans text-[14px] text-off-white font-medium">{wish.name}</p>
                  <p className="label-caps text-[rgba(138,138,138,0.5)] mt-0.5 tracking-[0.2em]">{wish.time}</p>
                </div>
                {wish.attending && (
                  <span className="label-caps text-[10px] border border-[rgba(245,242,236,0.12)] px-2.5 py-1 text-[rgba(245,242,236,0.4)] tracking-[0.2em] shrink-0">
                    Hadir
                  </span>
                )}
              </div>
              <p className="font-sans text-[14px] text-[rgba(245,242,236,0.45)] leading-relaxed italic">
                &ldquo;{wish.message}&rdquo;
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
