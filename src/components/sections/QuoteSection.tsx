import { useEffect, useRef } from 'react';
import { animate, stagger } from 'animejs';
import { weddingData } from '../../data/wedding.data';
import { Container } from '../ui/Container';
import { useReducedMotionSafe } from '../../hooks/useReducedMotionSafe';

export function QuoteSection() {
  const { shouldReduceMotion } = useReducedMotionSafe();
  const quoteRef = useRef<HTMLQuoteElement>(null);
  const markRef = useRef<HTMLSpanElement>(null);

  const hasAnimatedRef = useRef(false);

  const words = weddingData.wedding.quote.text.split(' ');

  useEffect(() => {
    if (shouldReduceMotion) return;

    const element = quoteRef.current;
    if (!element) return;

    let isUnmounted = false;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        
        if (entry.isIntersecting && !hasAnimatedRef.current) {
          hasAnimatedRef.current = true;

          if (isUnmounted) return;

          // Animate line in
          animate(element.querySelectorAll('[data-quote-elem="line"]'), {
            opacity: [0, 1],
            scaleY: [0, 1],
            duration: 1000,
            ease: 'outQuart'
          });

          // Animate labels/author in
          animate(element.querySelectorAll('[data-quote-elem="text"]'), {
            opacity: [0, 1],
            translateY: [12, 0],
            filter: ['blur(4px)', 'blur(0px)'],
            duration: 800,
            delay: stagger(200, { start: 200 }),
            ease: 'outCubic'
          });

          // Animate words in
          animate(element.querySelectorAll('[data-quote-word]'), {
            opacity: [0, 1],
            translateY: [12, 0],
            filter: ['blur(4px)', 'blur(0px)'],
            duration: 800,
            delay: stagger(40, { start: 100 }),
            ease: 'outCubic'
          });

          // Animate background quote mark in
          if (markRef.current) {
            animate(markRef.current, {
              opacity: [0, 0.03],
              scale: [0.96, 1],
              duration: 1200,
              ease: 'outQuart'
            });
          }

          observer.disconnect();
        }
      },
      { 
        threshold: 0.25,
        rootMargin: "0px 0px -10% 0px"
      }
    );

    observer.observe(element);

    return () => {
      isUnmounted = true;
      observer.disconnect();
      // Reset the ref on unmount so that if React StrictMode remounts the component,
      // it can animate the newly created DOM elements instead of getting stuck at opacity: 0.
      hasAnimatedRef.current = false;
    };
  }, [shouldReduceMotion]);

  return (
    <section 
      id="quote" 
      data-section 
      data-theme="light" 
      data-global-reveal="true" 
      className="bg-[#F5F5F0] py-20 md:py-28 lg:py-32 relative"
      ref={quoteRef} // Moved ref to section to encapsulate everything
    >
      <Container>
        <div className="max-w-[720px] mx-auto flex flex-col items-center text-center px-4 md:px-0">
          
          {/* Editorial Label */}
          <div className="flex flex-col items-center gap-6 mb-10 md:mb-14">
            <div 
              data-no-global-reveal="true" 
              data-quote-elem="line" 
              className="w-px h-12 md:h-16 bg-[#111111]/10 origin-top" 
              style={{ 
                opacity: shouldReduceMotion ? 1 : 0, 
                transform: shouldReduceMotion ? 'none' : 'scaleY(0)' 
              }} 
            />
            <span 
              data-no-global-reveal="true" 
              data-quote-elem="text" 
              className="font-sans text-[11px] md:text-[12px] tracking-[0.25em] text-[#555555] uppercase inline-block"
              style={{ 
                opacity: shouldReduceMotion ? 1 : 0, 
                transform: shouldReduceMotion ? 'none' : 'translateY(12px)' 
              }}
            >
              A Sacred Promise
            </span>
          </div>

          {/* Main Quote */}
          <blockquote className="relative" aria-label={weddingData.wedding.quote.text}>
            {/* Background Quote Mark (Quiet Contrast) */}
            <span 
              ref={markRef}
              aria-hidden="true" 
              className="absolute -top-12 md:-top-16 left-1/2 -translate-x-1/2 text-[120px] md:text-[180px] font-serif leading-none text-[#111111] select-none"
              style={{ 
                opacity: shouldReduceMotion ? 0.03 : 0, 
                transform: shouldReduceMotion ? 'scale(1) translateX(-50%)' : 'scale(0.96) translateX(-50%)',
                transformOrigin: 'left center'
              }}
            >
              "
            </span>
            <p 
              data-no-global-reveal="true"
              data-quote-text
              className="font-serif text-[28px] md:text-[40px] lg:text-[48px] text-[#111111] italic leading-[1.3] md:leading-[1.25] font-light tracking-normal relative z-10"
            >
              {words.map((word, index) => (
                <span 
                  key={index} 
                  data-quote-word
                  aria-hidden="true"
                  className="inline-block mr-[0.25em]"
                  style={{ 
                    opacity: shouldReduceMotion ? 1 : 0, 
                    transform: shouldReduceMotion ? 'none' : 'translateY(12px)'
                  }}
                >
                  {word}
                </span>
              ))}
            </p>
          </blockquote>

          {/* Author / Source */}
          <div 
            data-no-global-reveal="true" 
            data-quote-elem="text" 
            className="mt-10 md:mt-12 inline-block"
            style={{ 
              opacity: shouldReduceMotion ? 1 : 0, 
              transform: shouldReduceMotion ? 'none' : 'translateY(12px)' 
            }}
          >
            <span className="font-mono text-[12px] md:text-[13px] tracking-widest text-[#A4A4A4] uppercase">
              {weddingData.wedding.quote.author}
            </span>
          </div>

        </div>
      </Container>
    </section>
  );
}
