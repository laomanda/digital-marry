import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { gsap, ScrollTrigger } from '../../lib/gsap'
import { weddingData } from '../../data/wedding.data'
import { Container } from '../ui/Container'
import { useReducedMotionSafe } from '../../hooks/useReducedMotionSafe'

function QuoteWords({ text }: { text: string }) {
  return (
    <>
      {text.split(' ').map((word, index) => (
        <span
          key={`${word}-${index}`}
          aria-hidden="true"
          className="mr-[0.24em] inline-block"
        >
          {word}
        </span>
      ))}
    </>
  )
}

export function QuoteSection() {
  const { shouldReduceMotion } = useReducedMotionSafe()
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const markRef = useRef<HTMLSpanElement>(null)
  const [isQuoteHovered, setIsQuoteHovered] = useState(false)

  const [palette, setPalette] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.localStorage.getItem('navbar_palette') || 'black'
    }
    return 'black'
  })

  useEffect(() => {
    const interval = setInterval(() => {
      const current = window.localStorage.getItem('navbar_palette') || 'black'
      if (current !== palette) {
        setPalette(current)
      }
    }, 250)
    return () => clearInterval(interval)
  }, [palette])

  const isBurgundy = palette === 'burgundy'

  const quoteText = weddingData.wedding.quote.text
  const quoteAuthor = weddingData.wedding.quote.author

  useEffect(() => {
    const section = sectionRef.current
    const contentElement = contentRef.current
    if (!section || !contentElement) return

    const ctx = gsap.context(() => {
      const partElements = section.querySelectorAll<HTMLElement>('[data-quote-part]')

      gsap.set(markRef.current, { opacity: 0.04, scale: 1, rotate: 0 })

      if (shouldReduceMotion) {
        gsap.set(contentElement, {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          rotate: 0,
          scale: 1,
          transformOrigin: '50% 50%',
        })
        gsap.set(partElements, { opacity: 1, y: 0, filter: 'blur(0px)' })
        return
      }

      gsap.set(contentElement, {
        opacity: 0.18,
        y: 28,
        filter: 'blur(5px)',
        rotate: 2,
        scale: 0.985,
        transformOrigin: '50% 50%',
        willChange: 'opacity, transform, filter',
      })

      gsap.set(partElements, {
        opacity: 0.32,
        y: 14,
        filter: 'blur(3px)',
        willChange: 'opacity, transform, filter',
      })

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top bottom-=12%',
          end: 'center center',
          scrub: true,
        },
      })

      timeline.to(
        contentElement,
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          rotate: 0,
          scale: 1,
          ease: 'none',
        },
        0,
      )

      timeline.to(
        partElements,
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          ease: 'none',
          stagger: 0.05,
        },
        0.04,
      )

      ScrollTrigger.refresh()
    }, section)

    return () => {
      ctx.revert()
    }
  }, [shouldReduceMotion])

  return (
    <section
      ref={sectionRef}
      id="quote"
      data-section
      data-theme="dark"
      data-global-reveal="true"
      className={`relative overflow-hidden px-0 py-24 md:py-32 lg:py-40 transition-colors duration-500 ${
        isBurgundy ? 'bg-[#4A1F2A] text-[#F5F5F0]' : 'bg-[#050505] text-[#F5F5F0]'
      }`}
    >
      <Container>
        <div
          ref={contentRef}
          className="relative mx-auto flex max-w-[900px] flex-col items-center px-4 text-center md:px-0"
        >
          <div
            data-animate="line"
            data-quote-part
            data-no-global-reveal="true"
            className={`mb-8 h-px w-20 origin-center transition-colors duration-500 md:mb-10 md:w-28 ${
              isBurgundy ? 'bg-[rgba(245,245,240,0.18)]' : 'bg-[rgba(245,245,240,0.15)]'
            }`}
          />

          <div
            data-quote-part
            data-no-global-reveal="true"
            className="mb-8 grid w-full grid-cols-[1fr_auto_1fr] items-center gap-4 md:mb-10"
          >
            <span className={`h-px transition-colors duration-500 ${isBurgundy ? 'bg-[rgba(245,245,240,0.14)]' : 'bg-[rgba(245,245,240,0.10)]'}`} aria-hidden="true" />
            <span
              data-animate="text"
              data-no-global-reveal="true"
              className={`font-mono text-[10px] uppercase tracking-[0.32em] transition-colors duration-500 md:text-[11px] ${
                isBurgundy ? 'text-[rgba(245,245,240,0.65)]' : 'text-[rgba(245,245,240,0.58)]'
              }`}
            >
              A Sacred Promise
            </span>
            <span className={`h-px transition-colors duration-500 ${isBurgundy ? 'bg-[rgba(245,245,240,0.14)]' : 'bg-[rgba(245,245,240,0.10)]'}`} aria-hidden="true" />
          </div>

          <motion.blockquote
            data-quote-part
            data-no-global-reveal="true"
            className="relative"
            aria-label={quoteText}
            onHoverStart={() => setIsQuoteHovered(true)}
            onHoverEnd={() => setIsQuoteHovered(false)}
          >
            <motion.span
              ref={markRef}
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-[-0.52em] select-none font-serif text-[150px] font-light leading-none text-[#F5F5F0] transition-colors duration-500 md:text-[220px]"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                x: '-50%',
                opacity: shouldReduceMotion ? 0.04 : 0,
                scale: shouldReduceMotion ? 1 : 0.96,
                rotate: shouldReduceMotion ? 0 : -1.5,
              }}
              animate={{ opacity: isQuoteHovered ? 0.065 : shouldReduceMotion ? 0.04 : undefined }}
              transition={{ duration: 0.32, ease: 'easeOut' }}
            >
              &ldquo;
            </motion.span>

            <p
              data-no-global-reveal="true"
              data-quote-text
              className="relative z-10 font-serif text-[clamp(30px,5vw,58px)] font-light italic leading-[1.26] tracking-normal text-[#F5F5F0] transition-colors duration-500"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              <QuoteWords text={quoteText} />
            </p>
          </motion.blockquote>

          <div
            data-animate="text"
            data-quote-part
            data-no-global-reveal="true"
            className="mt-10 md:mt-12"
          >
            <span className={`font-mono text-[11px] uppercase tracking-[0.28em] transition-colors duration-500 md:text-[12px] ${
              isBurgundy ? 'text-[rgba(245,245,240,0.65)]' : 'text-[rgba(245,245,240,0.48)]'
            }`}>
              {quoteAuthor}
            </span>
          </div>

          <div
            data-animate="line"
            data-quote-part
            data-no-global-reveal="true"
            className={`mt-10 h-px w-20 origin-center transition-colors duration-500 md:mt-12 md:w-28 ${
              isBurgundy ? 'bg-[rgba(245,245,240,0.18)]' : 'bg-[rgba(245,245,240,0.15)]'
            }`}
          />

          <div
            data-animate="text"
            data-quote-part
            data-no-global-reveal="true"
            className={`absolute -left-2 top-0 hidden font-mono text-[10px] uppercase tracking-[0.26em] transition-colors duration-500 lg:block ${
              isBurgundy ? 'text-[rgba(245,245,240,0.42)]' : 'text-[#F5F5F0]/35'
            }`}
            aria-hidden="true"
          >
            02 / Promise
          </div>
        </div>
      </Container>
    </section>
  )
}
