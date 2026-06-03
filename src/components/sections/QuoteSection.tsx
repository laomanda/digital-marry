import { useRef, useState, useEffect } from 'react'
import { Container } from '../ui/Container'
import slide1 from '../../assets/lainnya/foto/galeri-6.webp'
import slide2 from '../../assets/lainnya/foto/galeri-8.webp'
import slide3 from '../../assets/lainnya/foto/galeri-10.webp'
import slide4 from '../../assets/lainnya/foto/galeri-11.webp'
import slide5 from '../../assets/lainnya/bg-event.webp'
import slide6 from '../../assets/lainnya/foto/galeri-12.webp'
import quoteTopOrnament from '../../assets/lainnya/section-qoute.webp'
import quoteBottomOrnament from '../../assets/lainnya/section-qoute-1.webp'

const backgroundSlides = [slide1, slide2, slide3, slide4, slide5, slide6]

export function QuoteSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const sectionClass = 'bg-[#050505] text-[#F5F5F0]'

  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % backgroundSlides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section
      ref={sectionRef}
      id="quote"
      data-section
      data-theme="dark"
      className={`relative overflow-hidden px-0 py-0 transition-colors duration-500 ${sectionClass}`}
    >
      <Container className="relative z-10 px-0">
        <div
          ref={contentRef}
          className="relative mx-auto aspect-[9/16] w-full max-w-[min(100vw,calc(100svh*9/16),760px)] overflow-hidden bg-[#050505] text-center"
        >
          {backgroundSlides.map((slide, index) => (
            <img
              key={slide}
              src={slide}
              alt=""
              className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-1000 ease-in-out ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
              loading={index === 0 ? "eager" : "lazy"}
              decoding="async"
              aria-hidden="true"
            />
          ))}
          {/* Dark overlay to ensure white text/ornaments are readable against bright photos */}
          <div className="pointer-events-none absolute inset-0 bg-[#050505]/30" aria-hidden="true" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#050505]/70 via-transparent to-[#050505]/70" aria-hidden="true" />

          <img
            src={quoteTopOrnament}
            alt=""
            className="pointer-events-none absolute left-[7.5%] top-[10%] z-10 w-[72%] max-w-[560px] object-contain sm:left-[8%] sm:top-[10.5%] sm:w-[68%] md:left-[8.5%] md:top-[10.5%] md:w-[66%]"
            loading="lazy"
            decoding="async"
            data-aos="fade-right"
            data-aos-duration="700"
            data-aos-easing="ease-out-cubic"
            aria-hidden="true"
          />

          <img
            src={quoteBottomOrnament}
            alt=""
            className="pointer-events-none absolute bottom-[9%] right-[8%] z-10 w-[34%] max-w-[270px] object-contain sm:bottom-[8.5%] sm:right-[8.5%] sm:w-[32%] md:bottom-[8%] md:right-[8%] md:w-[30%]"
            loading="lazy"
            decoding="async"
            data-aos="fade-left"
            data-aos-duration="700"
            data-aos-easing="ease-out-cubic"
            data-aos-delay="120"
            aria-hidden="true"
          />
        </div>
      </Container>
    </section>
  )
}


