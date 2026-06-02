import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { gsap } from '../../lib/gsap'
import { weddingData } from '../../data/wedding.data'
import { Container } from '../ui/Container'
import { useReducedMotionSafe } from '../../hooks/useReducedMotionSafe'
import quoteBackground from '../../assets/lainnya/foto/galeri-6.webp'

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
  const { shouldReduceMotion, shouldReduceHeavyMotion } = useReducedMotionSafe()
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const markRef = useRef<HTMLSpanElement>(null)
  const [isQuoteHovered, setIsQuoteHovered] = useState(false)

  const sectionClass = 'bg-[#050505] text-[#F5F5F0]'
  const textClass = 'text-[#F5F5F0]'
  const mutedClass = 'text-[rgba(245,245,240,0.68)]'
  const lineStrongClass = 'bg-[rgba(245,245,240,0.15)]'
  const lineSoftClass = 'bg-[rgba(245,245,240,0.10)]'
  const decorClass = 'text-[#F5F5F0]/35'
  const quoteMarkClass = 'text-[#F5F5F0]'

  const quoteText = weddingData.wedding.quote.text
  const quoteAuthor = weddingData.wedding.quote.author

  useEffect(() => {
    const section = sectionRef.current
    const contentElement = contentRef.current
    if (!section || !contentElement) return

    const ctx = gsap.context(() => {
      const partElements = section.querySelectorAll<HTMLElement>('[data-quote-part]')

      gsap.set(markRef.current, { opacity: 0.04, scale: 1, rotate: 0 })

      if (shouldReduceMotion || shouldReduceHeavyMotion) {
        gsap.set(contentElement, {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          rotate: 0,
          scale: 1,
          transformOrigin: '50% 50%',
          clearProps: 'willChange',
        })
        gsap.set(partElements, { opacity: 1, y: 0, filter: 'blur(0px)', clearProps: 'willChange' })
        return
      }

      gsap.set(contentElement, {
        opacity: 0.18,
        y: 28,
        filter: shouldReduceHeavyMotion ? 'none' : 'blur(5px)',
        rotate: 2,
        scale: 0.985,
        transformOrigin: '50% 50%',
        willChange: 'opacity, transform, filter',
      })

      gsap.set(partElements, {
        opacity: 0.32,
        y: 14,
        filter: shouldReduceHeavyMotion ? 'none' : 'blur(3px)',
        willChange: 'opacity, transform, filter',
      })

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 76%',
          once: true,
          toggleActions: 'play none none none',
        },
        defaults: { ease: 'power3.out' },
      })

      timeline.to(
        contentElement,
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          rotate: 0,
          scale: 1,
          duration: 0.9,
          clearProps: 'willChange',
        },
        0,
      )

      timeline.to(
        partElements,
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.75,
          stagger: 0.05,
          clearProps: 'willChange',
        },
        0.12,
      )
    }, section)

    return () => {
      ctx.revert()
    }
  }, [shouldReduceMotion, shouldReduceHeavyMotion])

  return (
    <section
      ref={sectionRef}
      id="quote"
      data-section
      data-theme="dark"
      className={`relative overflow-hidden px-0 py-12 transition-colors duration-500 sm:py-14 md:py-16 lg:py-20 ${sectionClass}`}
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(245,245,240,0.05),rgba(5,5,5,0)_54%)]" />
      </div>

      <Container className="relative z-10">
        <div
          ref={contentRef}
          className="relative mx-auto flex aspect-[9/16] flex-col overflow-hidden text-center shadow-[0_28px_80px_rgba(0,0,0,0.42)]"
          style={{ width: 'min(88vw, calc((100svh - 96px) * 9 / 16), 520px)' }}
        >
          <img
            src={quoteBackground}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/72" aria-hidden="true" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_42%,rgba(0,0,0,0.58)_100%)]" aria-hidden="true" />
          <div className="pointer-events-none absolute inset-[14px] border border-white/22 sm:inset-[18px]" aria-hidden="true" />

          <div className="relative z-10 flex h-full flex-col px-7 py-8 sm:px-8 sm:py-9 md:px-10 md:py-11">
          <div
            data-animate="line"
            data-quote-part
            data-no-global-reveal="true"
            className={`mx-auto mb-5 h-px w-16 origin-center transition-colors duration-500 md:mb-6 md:w-20 ${lineStrongClass}`}
          />

          <div
            data-quote-part
            data-no-global-reveal="true"
            className="mb-auto grid w-full grid-cols-[1fr_auto_1fr] items-center gap-3 md:gap-4"
          >
            <span className={`h-px transition-colors duration-500 ${lineSoftClass}`} aria-hidden="true" />
            <span
              data-animate="text"
              data-no-global-reveal="true"
              className={`font-mono text-[9px] uppercase tracking-[0.26em] transition-colors duration-500 md:text-[10px] ${mutedClass}`}
            >
              A Sacred Promise
            </span>
            <span className={`h-px transition-colors duration-500 ${lineSoftClass}`} aria-hidden="true" />
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
              className={`pointer-events-none absolute left-1/2 top-[-0.58em] select-none font-serif text-[118px] font-light leading-none transition-colors duration-500 md:text-[150px] ${quoteMarkClass}`}
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                x: '-50%',
                opacity: shouldReduceMotion || shouldReduceHeavyMotion ? 0.04 : 0,
                scale: shouldReduceMotion || shouldReduceHeavyMotion ? 1 : 0.96,
                rotate: shouldReduceMotion || shouldReduceHeavyMotion ? 0 : -1.5,
              }}
              animate={{ opacity: isQuoteHovered ? 0.065 : shouldReduceMotion || shouldReduceHeavyMotion ? 0.04 : undefined }}
              transition={{ duration: 0.32, ease: 'easeOut' }}
            >
              &ldquo;
            </motion.span>

            <p
              data-no-global-reveal="true"
              data-quote-text
              className={`relative z-10 font-montserrat text-[clamp(13px,3.6vw,19px)] font-semibold leading-[1.62] tracking-normal transition-colors duration-500 ${textClass}`}
              style={{ textShadow: '0 2px 16px rgba(0,0,0,0.55)' }}
            >
              <QuoteWords text={quoteText} />
            </p>
          </motion.blockquote>

          <div
            data-animate="text"
            data-quote-part
            data-no-global-reveal="true"
            className="mt-7 md:mt-8"
          >
            <span className={`font-mono text-[10px] uppercase tracking-[0.24em] transition-colors duration-500 md:text-[11px] ${mutedClass}`}>
              {quoteAuthor}
            </span>
          </div>

          <div
            data-animate="line"
            data-quote-part
            data-no-global-reveal="true"
            className={`mx-auto mt-6 h-px w-16 origin-center transition-colors duration-500 md:mt-7 md:w-20 ${lineStrongClass}`}
          />

          <div
            data-animate="text"
            data-quote-part
            data-no-global-reveal="true"
            className={`absolute bottom-8 right-8 hidden font-mono text-[9px] uppercase tracking-[0.24em] transition-colors duration-500 lg:block ${decorClass}`}
            aria-hidden="true"
          >
            02 / Promise
          </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
