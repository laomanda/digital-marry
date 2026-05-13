import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { weddingData } from '../../data/wedding.data'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

gsap.registerPlugin(ScrollTrigger)

interface PersonCardProps {
  name: string
  parents: string
  description: string
  photo: string
  role: 'bride' | 'groom'
  animClass: string
}

function PersonCard({ name, parents, description, photo, role, animClass }: PersonCardProps) {
  return (
    <div className={`${animClass} flex flex-col gap-6`}>
      {/* Image */}
      <div
        className="relative overflow-hidden border border-[rgba(255,255,255,0.08)] group"
        style={{ aspectRatio: '4/5' }}
      >
        <img
          src={photo}
          alt={`Portrait of ${name}`}
          className="w-full h-full object-cover mono-img transition-transform duration-700 group-hover:scale-[1.08]"
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(5,5,5,0.6)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        {/* Role label */}
        <div className="absolute top-4 left-4">
          <span className="label-caps text-[rgba(245,242,236,0.5)] tracking-[0.3em]">
            {role === 'bride' ? 'Mempelai Wanita' : 'Mempelai Pria'}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-3">
        <h3
          style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontSize: 'clamp(28px,3vw,40px)' }}
          className="text-off-white"
        >
          {name}
        </h3>
        <p className="font-sans text-[13px] text-muted-gray leading-relaxed">{parents}</p>
        <div className="w-8 h-px bg-[rgba(245,242,236,0.15)] my-1" />
        <p className="font-sans text-[15px] text-[rgba(245,242,236,0.55)] leading-relaxed italic">
          {description}
        </p>
      </div>
    </div>
  )
}

export default function CoupleSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const prefersReduced = usePrefersReducedMotion()

  useEffect(() => {
    if (prefersReduced) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.couple-title',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: '.couple-title', start: 'top 80%' } }
      )
      gsap.fromTo(
        '.bride-card',
        { opacity: 0, x: -80, rotate: -3 },
        {
          opacity: 1,
          x: 0,
          rotate: 0,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.bride-card', start: 'top 80%' },
        }
      )
      gsap.fromTo(
        '.groom-card',
        { opacity: 0, x: 80, rotate: 3 },
        {
          opacity: 1,
          x: 0,
          rotate: 0,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.groom-card', start: 'top 80%' },
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [prefersReduced])

  return (
    <section id="couple" ref={sectionRef} className="section-padding bg-[#0a0a0a]">
      <div className="container-base">
        {/* Title */}
        <div className="couple-title text-center mb-20">
          <span className="label-caps text-muted-gray tracking-[0.35em] block mb-4">The Couple</span>
          <h2
            style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontSize: 'clamp(36px,5vw,64px)' }}
            className="text-off-white"
          >
            Dua Jiwa, Satu Perjalanan
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 max-w-4xl mx-auto">
          <PersonCard
            name={weddingData.bride.fullName}
            parents={weddingData.bride.parents}
            description={weddingData.bride.description}
            photo={weddingData.bride.photo}
            role="bride"
            animClass="bride-card"
          />
          <PersonCard
            name={weddingData.groom.fullName}
            parents={weddingData.groom.parents}
            description={weddingData.groom.description}
            photo={weddingData.groom.photo}
            role="groom"
            animClass="groom-card"
          />
        </div>

        {/* Ampersand */}
        <div className="text-center mt-16">
          <span
            style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: 'clamp(80px,12vw,160px)' }}
            className="text-[rgba(245,242,236,0.04)] leading-none select-none"
          >
            &amp;
          </span>
        </div>
      </div>
    </section>
  )
}
