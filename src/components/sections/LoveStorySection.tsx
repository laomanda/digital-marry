import { useRef, useEffect } from 'react'
import { gsap } from '../../lib/gsap'
import { weddingData } from '../../data/wedding.data'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

export default function LoveStorySection() {
  const sectionRef = useRef<HTMLElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)
  const prefersReduced = usePrefersReducedMotion()

  useEffect(() => {
    if (prefersReduced) return
    const ctx = gsap.context(() => {
      // Draw timeline line
      if (lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            duration: 2,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 60%',
              end: 'bottom 80%',
              scrub: 1,
            },
          }
        )
      }

      // Items left
      gsap.fromTo(
        '.story-left',
        { opacity: 0, x: -80 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          stagger: 0.2,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 65%' },
        }
      )
      // Items right
      gsap.fromTo(
        '.story-right',
        { opacity: 0, x: 80 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          stagger: 0.2,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 65%' },
        }
      )
      // Dots
      gsap.fromTo(
        '.story-dot',
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          stagger: 0.2,
          ease: 'back.out(2)',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 65%' },
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [prefersReduced])

  return (
    <section id="love-story" ref={sectionRef} data-section data-theme="dark" className="section-padding bg-[#050505]">
      <div className="container-base">
        {/* Title */}
        <div className="text-center mb-20">
          <span className="label-caps text-muted-gray tracking-[0.35em] block mb-4">Love Story</span>
          <h2
            style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontSize: 'clamp(36px,5vw,64px)' }}
            className="text-off-white"
          >
            Perjalanan Kami
          </h2>
        </div>

        {/* Timeline */}
        <div className="relative max-w-3xl mx-auto">
          {/* Center line */}
          <div
            ref={lineRef}
            className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-[rgba(245,242,236,0.12)] origin-top"
          />

          <div className="flex flex-col gap-16">
            {weddingData.loveStory.map((item, i) => {
              const isLeft = i % 2 === 0
              return (
                <div key={item.id} className="relative flex items-center">
                  {/* Left content (odd items) / empty (even) */}
                  <div className={`w-5/12 pr-10 ${isLeft ? 'story-left text-right' : 'hidden md:block'}`}>
                    {isLeft ? (
                      <>
                        <span className="label-caps text-muted-gray tracking-[0.3em] block mb-2">{item.date}</span>
                        <h4
                          style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontSize: '24px' }}
                          className="text-off-white mb-2"
                        >
                          {item.title}
                        </h4>
                        <p className="font-sans text-[14px] text-[rgba(245,242,236,0.45)] leading-relaxed">
                          {item.description}
                        </p>
                      </>
                    ) : null}
                  </div>

                  {/* Center dot */}
                  <div className="story-dot absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full border border-[rgba(245,242,236,0.3)] bg-[#050505] z-10" />

                  {/* Right content (even items) / empty (odd) */}
                  <div className={`w-5/12 ml-auto pl-10 ${!isLeft ? 'story-right' : 'hidden md:block'}`}>
                    {!isLeft ? (
                      <>
                        <span className="label-caps text-muted-gray tracking-[0.3em] block mb-2">{item.date}</span>
                        <h4
                          style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontSize: '24px' }}
                          className="text-off-white mb-2"
                        >
                          {item.title}
                        </h4>
                        <p className="font-sans text-[14px] text-[rgba(245,242,236,0.45)] leading-relaxed">
                          {item.description}
                        </p>
                      </>
                    ) : null}
                  </div>

                  {/* Mobile layout - show all below center */}
                </div>
              )
            })}
          </div>

          {/* Mobile single column */}
          <div className="md:hidden mt-16 flex flex-col gap-10">
            {weddingData.loveStory.map((item) => (
              <div key={`m-${item.id}`} className="border-l border-[rgba(245,242,236,0.12)] pl-6">
                <span className="label-caps text-muted-gray tracking-[0.3em] block mb-2">{item.date}</span>
                <h4
                  style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontSize: '22px' }}
                  className="text-off-white mb-2"
                >
                  {item.title}
                </h4>
                <p className="font-sans text-[14px] text-[rgba(245,242,236,0.45)] leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
