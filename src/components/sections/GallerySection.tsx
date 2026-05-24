import { useRef, useEffect } from 'react'
import { gsap } from '../../lib/gsap'
import { weddingData } from '../../data/wedding.data'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

export default function GallerySection() {
  const sectionRef = useRef<HTMLElement>(null)
  const prefersReduced = usePrefersReducedMotion()

  useEffect(() => {
    if (prefersReduced) return
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.gallery-item').forEach((item, i) => {
        gsap.fromTo(
          item,
          { opacity: 0, scale: 1.15, y: 60 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 1.4,
            ease: 'power3.out',
            delay: i * 0.08,
            scrollTrigger: { trigger: item, start: 'top 85%' },
          }
        )

        // Parallax
        const speed = i % 3 === 0 ? -40 : i % 3 === 1 ? 30 : -20
        gsap.fromTo(
          item.querySelector('img'),
          { yPercent: speed * -1 },
          {
            yPercent: speed,
            ease: 'none',
            scrollTrigger: {
              trigger: item,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.5,
            },
          }
        )
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [prefersReduced])

  return (
    <section id="gallery" ref={sectionRef} data-section data-theme="light" className="section-padding bg-[#0a0a0a]">
      <div className="container-base">
        <div className="text-center mb-20">
          <span className="label-caps text-muted-gray tracking-[0.35em] block mb-4">Galeri</span>
          <h2
            style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontSize: 'clamp(36px,5vw,64px)' }}
            className="text-off-white"
          >
            Momen Berharga
          </h2>
        </div>

        {/* Masonry-like editorial grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {weddingData.gallery.map((img) => (
            <div
              key={img.id}
              className={`gallery-item relative overflow-hidden group ${img.span === 'tall' ? 'row-span-2' : img.span === 'wide' ? 'col-span-2' : ''}`}
              style={{ aspectRatio: img.span === 'tall' ? '4/5' : img.span === 'wide' ? '16/9' : '1/1' }}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover mono-img transition-all duration-700 group-hover:brightness-110 group-hover:scale-[1.02]"
              />
              {/* Hover overlay with caption */}
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(5,5,5,0.8)] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4">
                <p className="label-caps text-[rgba(245,242,236,0.7)] tracking-[0.2em] transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  {img.alt}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
