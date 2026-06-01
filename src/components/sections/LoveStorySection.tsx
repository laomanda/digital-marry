import { useRef, useEffect, useState } from 'react';
import { gsap } from '../../lib/gsap';
import { weddingData } from '../../data/wedding.data';
import { useReducedMotionSafe } from '../../hooks/useReducedMotionSafe';
import { Container } from '../ui/Container';
import loveStoryBackground from '../../assets/lainnya/foto/story.webp';

export function LoveStorySection() {
  const sectionRef = useRef<HTMLElement>(null);
  
  const { prefersReducedMotion, shouldReduceHeavyMotion, shouldReduceMotion } = useReducedMotionSafe();
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(max-width: 1023px)').matches;
  });

  const sectionBgClass = 'bg-[#111111]';
  const headingClass = 'text-[#F5F5F0]';
  const mutedClass = 'text-[#A4A4A4]';

  const rawStoryData = weddingData.loveStory?.length
    ? weddingData.loveStory
    : [
        { date: '2018', title: 'First Meet', description: 'A brief encounter that sparked a lifetime of memories.' },
        { date: '2020', title: 'Growing Closer', description: 'Finding comfort in each other during the quiet moments.' },
        { date: '2023', title: 'The Proposal', description: 'A simple question, a profound answer.' }
      ];

  const storyData = rawStoryData.slice(0, 5);

  const mapNodes = [
    { x: 15, y: 10, align: 'right' },
    { x: 85, y: 30, align: 'left' },
    { x: 15, y: 50, align: 'right' },
    { x: 85, y: 70, align: 'left' },
    { x: 25, y: 90, align: 'right' }
  ];

  const backgroundImageOpacity = isMobile || shouldReduceHeavyMotion || prefersReducedMotion ? 0.18 : 0.28;
  const backgroundOverlay = isMobile || shouldReduceHeavyMotion || prefersReducedMotion
    ? 'linear-gradient(rgba(5,5,5,0.80), rgba(5,5,5,0.86)), radial-gradient(circle at center, rgba(5,5,5,0.16) 0%, rgba(5,5,5,0.92) 100%)'
    : 'linear-gradient(rgba(5,5,5,0.66), rgba(5,5,5,0.7)), radial-gradient(circle at center, rgba(5,5,5,0.14) 0%, rgba(5,5,5,0.88) 100%)';

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
      
      // 1. Intro Header Animation
      gsap.from('.intro-anim', {
        y: 28,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 82%',
          toggleActions: 'play none none none'
        }
      });

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
              toggleActions: 'play none none none'
            }
          });
        }

        // Background reveal
        gsap.fromTo('.love-story-bg',
          { opacity: 0, scale: 1.02 },
          { 
            opacity: backgroundImageOpacity, 
            scale: 1, 
            duration: 1.2, 
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 82%',
              toggleActions: 'play none none none'
            }
          }
        );

        // Smooth Parallax Scroll Effect (only if heavy motion is allowed)
        if (!shouldReduceHeavyMotion) {
          gsap.fromTo('.love-story-bg',
            { yPercent: -10 },
            {
              yPercent: 10,
              ease: 'none',
              scrollTrigger: {
                trigger: el,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
              }
            }
          );
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
              toggleActions: 'play none none none'
            }
          });
          
          if (dot) {
            tl.fromTo(dot, 
              { scale: 0.65, opacity: 0 },
              { scale: 1, opacity: 1, duration: 0.35 },
              0
            );
          }
          
          if (connector) {
            const origin = align === 'right' ? 'left center' : 'right center';
            tl.fromTo(connector,
              { scaleX: 0, opacity: 0, transformOrigin: origin },
              { scaleX: 1, opacity: 1, duration: 0.45 },
              0.1
            );
          }
          
          if (cardWrapper) {
            tl.fromTo(cardWrapper,
              { y: 36, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.75, ease: 'power3.out' },
              0.15
            );
          }
        });
      });

      // 3. Mobile Animation
      mm.add("(max-width: 1023px)", () => {
        if (shouldReduceHeavyMotion) return;
        
        gsap.from('.mobile-item', {
          y: 20,
          opacity: 0,
          stagger: 0.08,
          duration: 0.55,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.mobile-timeline-container',
            start: 'top 86%',
            toggleActions: 'play none none none'
          }
        });
      });

      // 4. Closing Note Animation
      const closingTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.closing-note-container',
          start: 'top 88%',
          toggleActions: 'play none none none'
        }
      });
      
      closingTl.fromTo('.closing-line',
        { scaleY: 0 },
        { scaleY: 1, duration: 0.8, ease: 'power3.out', transformOrigin: 'top center' }
      );
      
      closingTl.fromTo('.closing-dot',
        { scale: 0.7, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.4, ease: 'power3.out' },
        '-=0.4'
      );
      
      closingTl.fromTo('.closing-note',
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
        '-=0.3'
      );

    }, el);

    return () => {
      ctx.revert();
      mm.revert();
    };
  }, [shouldReduceMotion, shouldReduceHeavyMotion, backgroundImageOpacity]);

  const showMobileCSSOrb = !prefersReducedMotion && !shouldReduceMotion && (!shouldReduceHeavyMotion || isMobile);

  return (
    <section
      id="love-story"
      data-section
      data-theme="dark"
      data-wow="true"
      className={`py-20 sm:py-24 md:py-32 lg:py-48 relative -mt-px overflow-hidden transition-colors duration-500 ${sectionBgClass}`}
      ref={sectionRef}
    >
      <style>
        {`
          @keyframes love-story-mobile-orb {
            0% { transform: translate3d(-50%, -20px, 0); opacity: 0; }
            15% { opacity: 0.8; }
            85% { opacity: 0.8; }
            100% { transform: translate3d(-50%, 100%, 0); opacity: 0; }
          }

          @keyframes card-shine-sweep {
            0% { transform: translate3d(-120%, 0, 0); }
            100% { transform: translate3d(120%, 0, 0); }
          }
        `}
      </style>

      {/* Cinematic Static Background Image with Parallax Overflow */}
      <img
        src={loveStoryBackground}
        loading="lazy"
        decoding="async"
        className="love-story-bg absolute -top-[10%] left-0 w-full h-[120%] object-cover pointer-events-none"
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
        {/* Intro Header */}
        <div className="flex flex-col items-center text-center mb-14 lg:mb-32 relative z-10">
          <span className={`intro-anim font-mono text-[11px] md:text-[12px] tracking-[0.25em] uppercase mb-6 transition-colors duration-500 ${mutedClass}`}>
            Cerita Kami
          </span>
          <h2 className={`intro-anim font-script text-[38px] md:text-[56px] lg:text-[72px] leading-[1.06] md:leading-[1.1] font-light max-w-[320px] px-4 md:max-w-2xl transition-colors duration-500 ${headingClass}`} style={{ fontFamily: "'Great Vibes', cursive", fontWeight: 400 }}>
            Awal Kisah Kami
          </h2>
          <p className="intro-anim mt-6 text-[14px] md:text-[16px] leading-7 font-sans max-w-md px-4 transition-colors duration-500 text-[#F5F5F0]/[0.64] md:text-[#A4A4A4]">
            Setiap cerita memiliki awal, dan inilah bagian kecil dari perjalanan kami.
          </p>
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
                
                {/* Optional CSS Decorative Orb */}
                {showMobileCSSOrb && (
                  <div 
                    className="absolute top-0 left-1/2 w-[8px] h-[8px] rounded-full border border-[#F5F5F0]/30 bg-[#111111] shadow-[0_0_6px_rgba(245,245,240,0.12)] flex items-center justify-center -translate-x-1/2 opacity-75"
                    style={{ animation: 'love-story-mobile-orb 6s ease-in-out infinite' }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-[#F5F5F0]/80" />
                  </div>
                )}
              </div>

              {storyData.map((story: any, i: number) => {
                const imageUrl = story.image || story.photo || story.src || story.imageUrl;
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

                    {/* Content Card (Premium Static Mobile Design with elegant hover) */}
                    <div className="mobile-card w-full pl-[60px] pr-3 relative z-10">
                      <div className="w-full p-5 rounded-[2px] bg-[#101010]/94 border border-[#F5F5F0]/18 shadow-[0_10px_28px_rgba(0,0,0,0.30)] flex flex-col relative overflow-hidden transition-all duration-500 ease-out group-hover:bg-[#0B0B0B]/95 group-hover:border-[#F5F5F0]/30 group-hover:shadow-[0_16px_32px_rgba(0,0,0,0.40)] group-hover:-translate-y-1 active:scale-[0.99] active:border-[#F5F5F0]/35">
                        {/* Elegant Shine Sweep Effect on Hover */}
                        <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 overflow-hidden" aria-hidden="true">
                          <div 
                            className="absolute top-0 h-full w-[250%]"
                            style={{
                              left: '-75%',
                              background: 'linear-gradient(115deg, transparent 40%, rgba(245,245,240,0.06) 45%, rgba(245,245,240,0.22) 50%, rgba(245,245,240,0.06) 55%, transparent 60%)',
                              animation: 'card-shine-sweep 1.6s ease-in-out infinite',
                              mixBlendMode: 'plus-lighter'
                            }}
                          />
                        </div>

                        {/* Top subtle hairline */}
                        <div className="absolute top-0 left-6 right-6 h-px bg-[#F5F5F0]/12 group-hover:bg-[#F5F5F0]/25 transition-colors duration-500" />

                        {imageUrl && (
                          <div className="w-full aspect-[16/10] overflow-hidden rounded-[2px] mb-4 border border-[#F5F5F0]/10 relative z-10">
                            <img src={imageUrl} alt={story.title} className="w-full h-full object-cover grayscale opacity-90 transition-all duration-700 ease-out group-hover:scale-105 group-hover:opacity-100 group-hover:grayscale-0" loading="lazy" decoding="async" />
                          </div>
                        )}
                        <div className="flex items-center gap-3 mb-2 relative z-10">
                          <span className="font-mono text-[10px] tracking-[0.25em] text-[#F5F5F0]/70 uppercase group-hover:text-[#F5F5F0]/90 transition-colors duration-500">{story.date}</span>
                          <div className="flex-1 h-px bg-gradient-to-r from-[#F5F5F0]/15 to-transparent" />
                        </div>
                        <h3 className="font-serif text-[22px] leading-tight mb-2 text-[#F5F5F0]/80 group-hover:text-[#F5F5F0] transition-colors duration-500 relative z-10">
                          {story.title}
                        </h3>
                        <p className="font-sans text-[14px] leading-7 text-[#F5F5F0]/72 group-hover:text-[#F5F5F0]/85 transition-colors duration-500 relative z-10">
                          {story.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Mobile Closing Note: Beautiful, left-aligned terminal node in perfect coordinate alignment */}
              <div className="mobile-closing-note relative w-full flex items-center mt-6">
                {/* Horizontal Connector pointing to note */}
                <div 
                  className="mobile-connector absolute left-[30px] top-1/2 h-[2px] w-[30px] -translate-y-1/2 z-0 opacity-40" 
                  aria-hidden="true"
                  style={{ background: 'linear-gradient(to right, rgba(245,245,240,0.32), rgba(245,245,240,0.14), transparent)' }}
                />
                
                {/* Closing Note Text Left Aligned (Exact same coordinates as cards) */}
                <div className="w-full pl-[60px] pr-3 relative z-10">
                  <span className="font-serif italic text-[18px] md:text-[22px] text-[#D6D6D0]/80 tracking-wide block">
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

                  const imageUrl = story.image || story.photo || story.src || story.imageUrl;
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
                        {/* Content Card */}
                        <div
                          className={`desktop-card relative overflow-hidden w-[340px] xl:w-[400px] p-8 xl:p-10 border rounded-[2px] bg-[#0A0A0A]/90 border-[#F5F5F0]/15 shadow-[0_8px_24px_rgba(0,0,0,0.25)] flex flex-col justify-center transition-all duration-500 ease-out group-hover:bg-[#0B0B0B]/95 group-hover:border-[#F5F5F0]/30 group-hover:shadow-[0_16px_40px_rgba(0,0,0,0.45)] group-hover:-translate-y-[6px] ${
                            node.align === 'right' ? '' : 'text-right'
                          }`}
                        >
                          {/* Elegant Shine Sweep Effect on Hover */}
                          <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 overflow-hidden" aria-hidden="true">
                            <div 
                              className="absolute top-0 h-full w-[250%]"
                              style={{
                                left: '-75%',
                                background: 'linear-gradient(115deg, transparent 40%, rgba(245,245,240,0.06) 45%, rgba(245,245,240,0.22) 50%, rgba(245,245,240,0.06) 55%, transparent 60%)',
                                animation: 'card-shine-sweep 1.6s ease-in-out infinite',
                                mixBlendMode: 'plus-lighter'
                              }}
                            />
                          </div>

                          <div className="absolute top-0 left-8 right-8 h-px bg-[#F5F5F0]/10 group-hover:bg-[#F5F5F0]/25 transition-colors duration-500" />

                          {imageUrl && (
                            <div className="w-full aspect-[16/10] overflow-hidden rounded-[2px] mb-5 border border-[#F5F5F0]/10 relative z-10">
                              <img src={imageUrl} alt={story.title} className="w-full h-full object-cover grayscale opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" loading="lazy" decoding="async" />
                            </div>
                          )}

                          <div className={`flex items-center gap-3 mb-2.5 relative z-10 ${node.align === 'right' ? '' : 'flex-row-reverse'}`}>
                            <span className="font-mono text-[11px] tracking-[0.25em] uppercase text-[#F5F5F0]/60 group-hover:text-[#F5F5F0]/90 transition-colors duration-500">
                              {story.date}
                            </span>
                            <div className="w-8 h-px bg-gradient-to-r from-[#F5F5F0]/20 to-transparent" />
                          </div>

                          <h3 className="font-serif text-[26px] xl:text-[30px] leading-[1.2] mb-3 text-[#F5F5F0]/80 group-hover:text-[#F5F5F0] transition-colors duration-500 relative z-10">
                            {story.title}
                          </h3>
                          <p className="font-sans text-[14px] leading-relaxed max-w-prose text-[#A4A4A4]/70 group-hover:text-[#A4A4A4] transition-colors duration-500 relative z-10">
                            {story.description}
                          </p>
                        </div>
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
            <span className="closing-note font-serif italic text-[18px] md:text-[22px] lg:text-[24px] text-[#D6D6D0]/80 mt-4 tracking-wide block">
              Kini, kami melangkah bersama.
            </span>
          </div>
        )}

      </Container>
    </section>
  );
}

export default LoveStorySection;
