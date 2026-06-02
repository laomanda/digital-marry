import { useRef, useEffect, useState } from 'react';
import { gsap } from '../../lib/gsap';
import { weddingData } from '../../data/wedding.data';
import { useReducedMotionSafe } from '../../hooks/useReducedMotionSafe';
import { Container } from '../ui/Container';
import loveStoryBackground from '../../assets/lainnya/foto/story.webp';
import loveStoryFeatureImage from '../../assets/lainnya/foto/story-thumbnail.webp';
import loveStoryCard1 from '../../assets/lainnya/love-story/1.webp';
import loveStoryCard2 from '../../assets/lainnya/love-story/2.webp';
import loveStoryCard3 from '../../assets/lainnya/love-story/3.webp';
import loveStoryCard4 from '../../assets/lainnya/love-story/4.webp';
import loveStoryCard5 from '../../assets/lainnya/love-story/5.webp';

const loveStoryCards = [
  loveStoryCard1,
  loveStoryCard2,
  loveStoryCard3,
  loveStoryCard4,
  loveStoryCard5,
];

export function LoveStorySection() {
  const sectionRef = useRef<HTMLElement>(null);
  
  const { prefersReducedMotion, shouldReduceHeavyMotion, shouldReduceMotion } = useReducedMotionSafe();
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(max-width: 1023px)').matches;
  });

  const sectionBgClass = 'bg-[#111111]';

  const rawStoryData = weddingData.loveStory?.length
    ? weddingData.loveStory
    : [
        { date: '2018', title: 'First Meet', description: 'A brief encounter that sparked a lifetime of memories.' },
        { date: '2020', title: 'Growing Closer', description: 'Finding comfort in each other during the quiet moments.' },
        { date: '2023', title: 'The Proposal', description: 'A simple question, a profound answer.' }
      ];

  const storyData = rawStoryData.slice(0, 5).map((story, index) => ({
    ...story,
    image: loveStoryCards[index],
  }));

  const mapNodes = [
    { x: 15, y: 10, align: 'right' },
    { x: 85, y: 30, align: 'left' },
    { x: 15, y: 50, align: 'right' },
    { x: 85, y: 70, align: 'left' },
    { x: 25, y: 90, align: 'right' }
  ];

  const backgroundImageOpacity = isMobile || shouldReduceHeavyMotion || prefersReducedMotion ? 0.65 : 0.55;
  const backgroundOverlay = isMobile || shouldReduceHeavyMotion || prefersReducedMotion
    ? 'linear-gradient(rgba(5,5,5,0.15), rgba(5,5,5,0.15)), radial-gradient(circle at center, rgba(5,5,5,0.02) 0%, rgba(5,5,5,0.20) 100%)'
    : 'linear-gradient(rgba(5,5,5,0.20), rgba(5,5,5,0.25)), radial-gradient(circle at center, rgba(5,5,5,0.05) 0%, rgba(5,5,5,0.35) 100%)';

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mobileQuery = window.matchMedia('(max-width: 1023px)');
    const updateMobileState = () => setIsMobile(mobileQuery.matches);

    updateMobileState();
    if (mobileQuery.addEventListener) {
      mobileQuery.addEventListener('change', updateMobileState);
    } else {
      mobileQuery.addListener(updateMobileState);
    }

    return () => {
      if (mobileQuery.removeEventListener) {
        mobileQuery.removeEventListener('change', updateMobileState);
      } else {
        mobileQuery.removeListener(updateMobileState);
      }
    };
  }, []);

  // --- GSAP Entrance Reveals ---
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || shouldReduceMotion) return;

    let mm = gsap.matchMedia();
    
    const ctx = gsap.context(() => {
      
      // 1. Cinematic title image before the timeline
      const feature = el.querySelector<HTMLElement>('.love-feature');
      const featureImage = el.querySelector<HTMLElement>('.love-feature-image');
      const featureHorizontalLines = gsap.utils.toArray<HTMLElement>('.love-feature-hline');
      const featureVerticalLines = gsap.utils.toArray<HTMLElement>('.love-feature-vline');
      const featureMarks = gsap.utils.toArray<HTMLElement>('.love-feature-mark');

      if (feature && featureImage) {
        const featureTl = gsap.timeline({
          scrollTrigger: {
            trigger: feature,
            start: 'top 82%',
            toggleActions: 'play none none none',
            once: true
          }
        });

        featureTl
          .fromTo(
            featureImage,
            { y: 18, opacity: 0.001, scale: 0.985 },
            { y: 0, opacity: 1, scale: 1, duration: 0.85, ease: 'power3.out', clearProps: 'transform,opacity' }
          );

        if (featureMarks.length) {
          featureTl.fromTo(
            featureMarks,
            { opacity: 0, scale: 0.75 },
            { opacity: 1, scale: 1, duration: 0.45, stagger: 0.04, ease: 'power2.out' },
            '-=0.55'
          );
        }

        featureTl
          .fromTo(
            featureHorizontalLines,
            { scaleX: 0, opacity: 0, transformOrigin: 'center center' },
            { scaleX: 1, opacity: 1, duration: 0.65, stagger: 0.08, ease: 'power2.out' },
            '-=0.35'
          )
          .fromTo(
            featureVerticalLines,
            { scaleY: 0, opacity: 0, transformOrigin: 'top center' },
            { scaleY: 1, opacity: 1, duration: 0.65, ease: 'power2.out' },
            '-=0.45'
          );
      }

      // 2. Desktop SVG Path Draw & Desktop Cards
      mm.add("(min-width: 1024px)", () => {
        // SVG path highlight draw
        const path = el.querySelector('.desktop-path-highlight') as SVGPathElement;
        if (path) {
          const length = path.getTotalLength();
          gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
          gsap.to(path, {
            strokeDashoffset: 0,
            duration: 1.6,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: '.desktop-path-highlight',
              start: 'top 72%',
              toggleActions: 'play none none none',
              once: true
            }
          });
        }

        // Desktop item entrance reveals
        const desktopItems = gsap.utils.toArray<HTMLElement>('.desktop-item');
        
        desktopItems.forEach((item) => {
          const align = item.getAttribute('data-align');
          const dot = item.querySelector('.desktop-dot');
          const connector = item.querySelector('.desktop-connector');
          const cardWrapper = item.querySelector('.desktop-card-wrapper');
          
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: item,
              start: 'top 84%',
              toggleActions: 'play none none none',
              once: true
            }
          });
          
          if (dot) {
            tl.fromTo(dot, 
              { scale: 0.65, opacity: 0 },
              { scale: 1, opacity: 1, duration: 0.35, ease: 'power2.out', clearProps: 'transform,opacity' },
              0
            );
          }
          
          if (connector) {
            const origin = align === 'right' ? 'left center' : 'right center';
            tl.fromTo(connector,
              { scaleX: 0, opacity: 0, transformOrigin: origin },
              { scaleX: 1, opacity: 1, duration: 0.45, ease: 'power2.out', clearProps: 'transform,opacity' },
              0.1
            );
          }
          
          if (cardWrapper) {
            tl.fromTo(cardWrapper,
              { y: 24, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.62, ease: 'power2.out', clearProps: 'transform,opacity' },
              0.15
            );
          }
        });
      });

      // 3. Mobile Animation
      mm.add("(max-width: 1023px)", () => {
        const mobileItems = gsap.utils.toArray<HTMLElement>('.mobile-item', el);

        mobileItems.forEach((item) => {
          gsap.fromTo(item,
            { y: 18, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.52,
              ease: 'power2.out',
              clearProps: 'transform,opacity',
              scrollTrigger: {
                trigger: item,
                start: 'top 88%',
                toggleActions: 'play none none none',
                once: true
              }
            }
          );
        });
      });

      // 4. Closing Note Animation
      const closingTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.closing-note-container',
          start: 'top 88%',
          toggleActions: 'play none none none',
          once: true
        }
      });
      
      closingTl.fromTo('.closing-line',
        { scaleY: 0 },
        { scaleY: 1, duration: 0.65, ease: 'power2.out', transformOrigin: 'top center', clearProps: 'transform' }
      );
      
      closingTl.fromTo('.closing-dot',
        { scale: 0.7, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.35, ease: 'power2.out', clearProps: 'transform,opacity' },
        '-=0.4'
      );
      
      closingTl.fromTo('.closing-note',
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.55, ease: 'power2.out', clearProps: 'transform,opacity' },
        '-=0.3'
      );

    }, el);

    return () => {
      ctx.revert();
      mm.revert();
    };
  }, [shouldReduceMotion, shouldReduceHeavyMotion, backgroundImageOpacity]);

  return (
    <section
      id="love-story"
      data-section
      data-theme="dark"
      data-wow="true"
      className={`py-20 sm:py-24 md:py-32 lg:py-48 relative -mt-px overflow-hidden transition-colors duration-500 ${sectionBgClass}`}
      ref={sectionRef}
    >
      {/* Cinematic static background image */}
      <img
        src={loveStoryBackground}
        loading="lazy"
        decoding="async"
        className="love-story-bg absolute inset-0 h-full w-full object-cover pointer-events-none"
        style={{ opacity: backgroundImageOpacity }}
        alt=""
        aria-hidden="true"
      />

      {/* Lightweight Overlay */}
      <div
        className="love-story-overlay absolute inset-0 pointer-events-none z-[1]"
        style={{ background: backgroundOverlay }}
      />

      {/* Top/Bottom Gradient Fades */}
      <div className="absolute top-0 left-0 right-0 h-40 md:h-64 z-[2] bg-gradient-to-b transition-colors duration-1000 pointer-events-none from-[#050505] to-[#050505]/0" />
      <div className="absolute bottom-0 left-0 right-0 h-40 md:h-64 z-[2] bg-gradient-to-t transition-colors duration-1000 pointer-events-none from-[#050505] to-[#050505]/0" />

      <Container>
        {/* Cinematic title image before the story flow */}
        <div className="love-feature relative z-10 mx-auto mb-16 max-w-[920px] px-2 md:mb-24 lg:mb-32">
          <div className="love-feature-hline mx-auto mb-7 h-px w-20 bg-gradient-to-r from-transparent via-[#F5F5F0]/28 to-transparent md:w-32" aria-hidden="true" />
          <div className="group relative mx-auto overflow-hidden">
            <div className="love-feature-image relative aspect-[4314/2116] overflow-hidden will-change-transform">
              <img
                src={loveStoryFeatureImage}
                alt="Jalan Menyatunya Dua Hati"
                width={4314}
                height={2116}
                loading="eager"
                fetchPriority="high"
                decoding="async"
                className="absolute inset-0 h-full w-full object-contain transition-transform duration-700 group-hover:scale-[1.01] motion-reduce:transition-none"
              />
            </div>
          </div>

          <div className="mt-7 flex flex-col items-center" aria-hidden="true">
            <div className="love-feature-vline h-12 w-px origin-top bg-gradient-to-b from-[#F5F5F0]/26 to-transparent md:h-16" />
            <div className="mt-2 h-[7px] w-[7px] rounded-full border border-[#F5F5F0]/24 bg-[#F5F5F0]/55 shadow-[0_0_14px_rgba(245,245,240,0.16)]" />
          </div>
        </div>

        {/* TIMELINE CONTAINER */}
        <div 
          className="relative max-w-[1100px] mx-auto w-full z-10"
          style={{ height: isMobile ? 'auto' : '2600px' }}
        >
          {isMobile ? (
            /* --- MOBILE TIMELINE (Static CSS, No Scroll State, Lightweight) --- */
            <div className="mobile-timeline-container relative max-w-[520px] mx-auto w-full flex flex-col gap-10 pt-4 pb-8">
              {/* Static Vertical Line System */}
              <div className="absolute left-[30px] top-8 bottom-0 w-[2px] -translate-x-1/2 bg-[#F5F5F0]/12" aria-hidden="true">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-[#F5F5F0]/26 to-transparent" />
                
              </div>

              {storyData.map((story: any, i: number) => {
                const imageUrl = story.image;
                return (
                  <div key={story.id || i} className="mobile-item relative w-full flex items-start group">
                    {/* Dot with Tick Marks */}
                    <div className="mobile-dot absolute left-[30px] top-8 -translate-x-1/2 -translate-y-1/2 z-10 flex items-center justify-center" aria-hidden="true">
                      {/* Outer Dot */}
                      <div className="w-4 h-4 rounded-full bg-[#111111] border border-[#F5F5F0]/32 shadow-[0_0_0_4px_#111111,0_0_8px_rgba(245,245,240,0.12)] flex items-center justify-center group-hover:border-[#F5F5F0]/60 group-hover:scale-110 group-hover:shadow-[0_0_12px_rgba(245,245,240,0.28),0_0_0_4px_#111111] transition-all duration-500">
                        {/* Inner Dot */}
                        <div className="w-1.5 h-1.5 rounded-full bg-[#F5F5F0]/80 group-hover:bg-[#F5F5F0] group-hover:scale-125 transition-all duration-500" />
                      </div>
                    </div>
                    
                    {/* Horizontal Connector */}
                    <div 
                      className="mobile-connector absolute left-[30px] top-8 h-[2px] w-[30px] -translate-y-1/2 z-0 opacity-75 group-hover:opacity-100 transition-opacity duration-500" 
                      aria-hidden="true"
                      style={{ background: 'linear-gradient(to right, rgba(245,245,240,0.32), rgba(245,245,240,0.14), transparent)' }}
                    />

                    {/* Story Artwork Card */}
                    <div className="mobile-card w-full pl-[60px] pr-3 relative z-10">
                      <figure className="w-full rounded-[2px] border border-[#F5F5F0]/16 bg-[#050505]/82 p-2 shadow-[0_14px_34px_rgba(0,0,0,0.34)] relative overflow-hidden transition-all duration-500 ease-out group-hover:border-[#F5F5F0]/30 group-hover:shadow-[0_20px_42px_rgba(0,0,0,0.46)] group-hover:-translate-y-1 active:scale-[0.99]">
                        <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 overflow-hidden" aria-hidden="true">
                          <div 
                            className="absolute top-0 h-full w-[250%]"
                            style={{
                              left: '-75%',
                              background: 'linear-gradient(115deg, transparent 40%, rgba(245,245,240,0.06) 45%, rgba(245,245,240,0.22) 50%, rgba(245,245,240,0.06) 55%, transparent 60%)',
                              mixBlendMode: 'plus-lighter'
                            }}
                          />
                        </div>

                        <div className="relative z-10 overflow-hidden rounded-[2px]">
                          <img
                            src={imageUrl}
                            alt={`${story.title} - ${story.date || `Cerita ${i + 1}`}`}
                            className="block h-auto w-full transition-transform duration-700 ease-out group-hover:scale-[1.015]"
                            loading="lazy"
                            decoding="async"
                          />
                        </div>
                      </figure>
                    </div>
                  </div>
                );
              })}

              {/* Mobile Closing Note */}
              <div className="mobile-closing-note relative mt-8 flex w-full justify-center px-6 text-center">
                <div className="relative z-10 max-w-[300px]">
                  <span className="block font-athene text-[18px] leading-tight tracking-wide text-[#D6D6D0]/80">
                    Kini, kami melangkah bersama.
                  </span>
                </div>
              </div>
            </div>
          ) : (
            /* --- DESKTOP TIMELINE (Fixed SVG, Hover Interactions, No React Scroll State) --- */
            <>
              {/* Fixed SVG Curved Path */}
              <div className="absolute inset-0 pointer-events-none z-0" aria-hidden="true">
                <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                  {/* Base continuous path */}
                  <path
                    className="desktop-path-base"
                    d="M 15 5 C 50 5, 85 15, 85 25 C 85 35, 15 35, 15 45 C 15 55, 85 55, 85 65 C 85 75, 25 75, 25 85 C 25 93, 50 93, 50 100"
                    fill="none"
                    stroke="rgba(245,245,240,0.16)"
                    strokeWidth="0.2"
                    vectorEffect="non-scaling-stroke"
                  />
                  {/* Editorial dotted highlight overlay */}
                  <path
                    className="desktop-path-highlight"
                    d="M 15 5 C 50 5, 85 15, 85 25 C 85 35, 15 35, 15 45 C 15 55, 85 55, 85 65 C 85 75, 25 75, 25 85 C 25 93, 50 93, 50 100"
                    fill="none"
                    stroke="rgba(245,245,240,0.28)"
                    strokeWidth="0.12"
                    strokeDasharray="2 10"
                    opacity="0.45"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
              </div>

              {/* Cards & Nodes */}
              <div className="relative w-full h-full">
                {storyData.map((story: any, i: number) => {
                  const node = mapNodes[i];
                  if (!node) return null;

                  const imageUrl = story.image;
                  const connectorDir = node.align === 'right' ? 'right' : 'left';
                  
                  return (
                    <div
                      key={story.id || i}
                      className="absolute desktop-item group z-10"
                      style={{ left: `${node.x}%`, top: `${node.y}%` }}
                      data-align={node.align}
                    >
                      {/* Horizontal Connector from Dot toward Card */}
                      <div
                        className="desktop-connector absolute top-0 -translate-y-1/2 h-[2px] w-10"
                        aria-hidden="true"
                        style={{
                          [connectorDir === 'right' ? 'left' : 'right']: '6px',
                          background: connectorDir === 'right'
                            ? 'linear-gradient(to right, rgba(245,245,240,0.24), transparent)'
                            : 'linear-gradient(to left, rgba(245,245,240,0.24), transparent)'
                        }}
                      />

                      {/* Fixed Anchor Dot */}
                      <div className="desktop-dot absolute w-[10px] h-[10px] rounded-full bg-[#111111] border border-[#F5F5F0]/40 group-hover:bg-[#F5F5F0] group-hover:scale-125 group-hover:shadow-[0_0_12px_rgba(245,245,240,0.5)] transition-all duration-500 -translate-x-1/2 -translate-y-1/2" />

                      {/* Content Card Wrapper */}
                      <div
                        className={`desktop-card-wrapper absolute top-1/2 -translate-y-1/2 z-10 ${
                          node.align === 'right' ? 'left-8 xl:left-12' : 'right-8 xl:right-12'
                        }`}
                      >
                        {/* Story Artwork Card */}
                        <figure className="desktop-card relative w-[360px] overflow-hidden rounded-[2px] border border-[#F5F5F0]/16 bg-[#050505]/82 p-2 shadow-[0_16px_38px_rgba(0,0,0,0.34)] transition-all duration-500 ease-out group-hover:-translate-y-[6px] group-hover:border-[#F5F5F0]/30 group-hover:shadow-[0_22px_48px_rgba(0,0,0,0.50)] xl:w-[440px]">
                          <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 overflow-hidden" aria-hidden="true">
                            <div 
                              className="absolute top-0 h-full w-[250%]"
                              style={{
                                left: '-75%',
                                background: 'linear-gradient(115deg, transparent 40%, rgba(245,245,240,0.06) 45%, rgba(245,245,240,0.22) 50%, rgba(245,245,240,0.06) 55%, transparent 60%)',
                                mixBlendMode: 'plus-lighter'
                              }}
                            />
                          </div>

                          <div className="relative z-10 overflow-hidden rounded-[2px]">
                            <img
                              src={imageUrl}
                              alt={`${story.title} - ${story.date || `Cerita ${i + 1}`}`}
                              className="block h-auto w-full transition-transform duration-700 ease-out group-hover:scale-[1.012]"
                              loading="lazy"
                              decoding="async"
                            />
                          </div>
                        </figure>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Closing Note with Final Connector */}
        {!isMobile && (
          <div className="closing-note-container mt-6 md:mt-24 lg:mt-40 flex flex-col items-center text-center relative z-10">
            {/* Elegant vertical connector → dot → hairlines → text */}
            <div className="closing-connector hidden md:flex flex-col items-center" aria-hidden="true">
              <div className="closing-line w-px h-16 lg:h-24 bg-gradient-to-b from-[#F5F5F0]/20 via-[#F5F5F0]/12 to-transparent origin-top" />
              <div className="relative flex items-center justify-center my-3">
                {/* Horizontal decorative hairlines */}
                <div className="absolute w-12 h-px bg-gradient-to-r from-transparent via-[#F5F5F0]/20 to-transparent" />
                {/* Center dot */}
                <div className="closing-dot w-[6px] h-[6px] rounded-full bg-[#F5F5F0]/50 border border-[#F5F5F0]/20 shadow-[0_0_8px_rgba(245,245,240,0.1)]" />
              </div>
            </div>
            <span className="closing-note mt-4 block font-athene text-[18px] tracking-wide text-[#D6D6D0]/80 md:text-[22px] lg:text-[24px]">
              Kini, kami melangkah bersama.
            </span>
          </div>
        )}

      </Container>
    </section>
  );
}

export default LoveStorySection;
