import { useRef, useEffect, useState } from 'react';
import { gsap, ScrollTrigger } from '../../lib/gsap';
import { weddingData } from '../../data/wedding.data';
import { useReducedMotionSafe } from '../../hooks/useReducedMotionSafe';
import { usePalette } from '../../hooks/usePalette';
import { Container } from '../ui/Container';
import { animate } from 'animejs';
import { Palette, Coffee, MessageCircle, Gem, Heart } from 'lucide-react';
import loveStoryVideo from '../../assets/video/love-story.mp4';

export function LoveStorySection() {
  const sectionRef = useRef<HTMLElement>(null);
  
  // Desktop Refs
  const desktopContainerRef = useRef<HTMLDivElement>(null);
  const desktopPathRef = useRef<SVGPathElement>(null);
  const desktopOrbRef = useRef<HTMLDivElement>(null);

  // Mobile Refs
  const mobileContainerRef = useRef<HTMLDivElement>(null);
  const mobilePathRef = useRef<SVGLineElement>(null);

  const { shouldReduceMotion } = useReducedMotionSafe();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [visitedIndex, setVisitedIndex] = useState<number>(-1);
  const activeIndexRef = useRef<number | null>(null);
  const visitedIndexRef = useRef<number>(-1);
  const hasFinalTriggeredRef = useRef(false);
  const [videoError, setVideoError] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isVideoInView, setIsVideoInView] = useState(false);

  useEffect(() => {
    if (shouldReduceMotion || isMobile || videoError) return;
    
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVideoInView(true);
        observer.disconnect();
      }
    }, { rootMargin: '800px 0px' });

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, [shouldReduceMotion, isMobile, videoError]);

  const { palette } = usePalette();
  const isBurgundy = palette === 'burgundy';
  const isTaupe = palette === 'taupe';

  const sectionBgClass = isTaupe 
    ? 'bg-[#C9AD8F]' 
    : isBurgundy 
      ? 'bg-[#4A1F2A]' 
      : 'bg-[#111111]';

  const headingClass = isTaupe ? 'text-[#111111]' : 'text-[#F5F5F0]';
  const mutedClass = isTaupe 
    ? 'text-[rgba(17,17,17,0.58)]' 
    : isBurgundy 
      ? 'text-[rgba(245,245,240,0.65)]' 
      : 'text-[#A4A4A4]';

  const fallbackImage = 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=80&fit=crop';

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const rawStoryData = weddingData.loveStory?.length 
    ? weddingData.loveStory 
    : [
        { date: '2018', title: 'First Meet', description: 'A brief encounter that sparked a lifetime of memories.' },
        { date: '2020', title: 'Growing Closer', description: 'Finding comfort in each other during the quiet moments.' },
        { date: '2023', title: 'The Proposal', description: 'A simple question, a profound answer.' }
      ];

  // Desktop map coordinates curated for up to 5 chapters.
  const storyData = rawStoryData.slice(0, 5);

  const mapNodes = [
    { x: 15, y: 5, align: 'right' },
    { x: 85, y: 25, align: 'left' },
    { x: 15, y: 45, align: 'right' },
    { x: 85, y: 65, align: 'left' },
    { x: 25, y: 85, align: 'right' }
  ];

  // Anime.js active index micro-reveals
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || activeIndex === null || shouldReduceMotion) return;

    // Desktop Micro-Reveals
    const dItems = el.querySelectorAll('.desktop-item');
    if (dItems[activeIndex]) {
      const num = dItems[activeIndex].querySelector('.chapter-number');
      const underline = dItems[activeIndex].querySelector('.chapter-underline');
      
      if (num) {
        animate(num, {
          opacity: [0.4, 1],
          translateY: [8, 0],
          duration: 400,
          ease: 'outQuad'
        });
      }
      if (underline) {
        animate(underline, {
          width: [0, 48],
          opacity: [0, 0.4],
          duration: 600,
          ease: 'outQuad'
        });
      }
    }

    // Reset previous desktop nodes dynamically via GSAP (highly optimized)
    dItems.forEach((item, index) => {
      if (index !== activeIndex) {
        const num = item.querySelector('.chapter-number');
        const underline = item.querySelector('.chapter-underline');
        if (num) gsap.to(num, { opacity: 0.4, y: 0, duration: 0.3, overwrite: 'auto' });
        if (underline) gsap.to(underline, { width: 0, opacity: 0, duration: 0.3, overwrite: 'auto' });
      }
    });

    // Mobile Micro-Reveals
    const mItems = el.querySelectorAll('.mobile-item');
    if (mItems[activeIndex]) {
      const num = mItems[activeIndex].querySelector('.chapter-number');
      const underline = mItems[activeIndex].querySelector('.chapter-underline');
      
      if (num) {
        animate(num, {
          opacity: [0.4, 1],
          translateY: [8, 0],
          duration: 400,
          ease: 'outQuad'
        });
      }
      if (underline) {
        animate(underline, {
          width: [0, 48],
          opacity: [0, 0.4],
          duration: 600,
          ease: 'outQuad'
        });
      }
    }

    // Reset previous mobile nodes
    mItems.forEach((item, index) => {
      if (index !== activeIndex) {
        const num = item.querySelector('.chapter-number');
        const underline = item.querySelector('.chapter-underline');
        if (num) gsap.to(num, { opacity: 0.4, y: 0, duration: 0.3, overwrite: 'auto' });
        if (underline) gsap.to(underline, { width: 0, opacity: 0, duration: 0.3, overwrite: 'auto' });
      }
    });

  }, [activeIndex, shouldReduceMotion]);

  // Main ScrollTrigger Hook
  useEffect(() => {
    // Reset final trigger flag on mount/re-render to prevent hot-reload desyncs
    hasFinalTriggeredRef.current = false;

    const el = sectionRef.current;
    if (!el) return;

    if (shouldReduceMotion) {
      // Force all visual components to static complete states
      el.querySelectorAll<HTMLElement>('.desktop-card, .mobile-card').forEach((c) => {
        c.style.opacity = '1';
        c.style.transform = 'none';
      });
      el.querySelectorAll<HTMLElement>('.desktop-dot, .mobile-dot').forEach((d) => {
        d.style.opacity = '1';
        d.style.transform = 'none';
      });
      el.querySelectorAll<HTMLElement>('.chapter-number').forEach((n) => {
        n.style.opacity = '1';
        n.style.transform = 'none';
      });
      el.querySelectorAll<HTMLElement>('.chapter-underline').forEach((u) => {
        u.style.opacity = '0.4';
        u.style.width = '48px';
      });
      el.querySelectorAll<HTMLElement>('.chapter-image-container').forEach((ic) => {
        ic.style.opacity = '1';
        ic.style.transform = 'none';
      });
      el.querySelectorAll<HTMLElement>('.desktop-image-parallax').forEach((pi) => {
        pi.style.transform = 'none';
      });
      el.querySelectorAll<HTMLElement>('.closing-anim span').forEach((s) => {
        s.style.opacity = '1';
        s.style.transform = 'none';
      });
      el.querySelectorAll<HTMLElement>('[data-final-decor]').forEach((fd) => {
        fd.style.opacity = '0.4';
        fd.style.transform = 'none';
      });
      el.querySelectorAll<HTMLElement>('[data-final-pulse]').forEach((fp) => {
        fp.style.opacity = '0.8';
        fp.style.transform = 'none';
      });
      return;
    }

    let mm: gsap.MatchMedia;
    
    const ctx = gsap.context(() => {
      mm = gsap.matchMedia();

      // ─── Universal Section Header Entrance ───
      gsap.from('.intro-anim', {
        y: 30,
        opacity: 0,
        duration: 1.0,
        stagger: 0.16,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      });

      // ─── Desktop Layout Rules (lg >= 1024px) ───
      mm.add("(min-width: 1024px)", () => {
        // Animate the path scroll-draw and traveler orb (Scrub: 1.2, no pin)
        if (desktopPathRef.current && desktopContainerRef.current) {
          const path = desktopPathRef.current;
          const length = path.getTotalLength();
          
          gsap.to(path, {
            strokeDashoffset: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: desktopContainerRef.current,
              start: 'top center',
              end: 'bottom center',
              scrub: 1.2,
              onUpdate: (self) => {
                const progress = self.progress;
                
                // Track path progress and move the orb
                if (desktopOrbRef.current) {
                  const point = path.getPointAtLength(progress * length);
                  gsap.set(desktopOrbRef.current, {
                    left: `${point.x}%`,
                    top: `${point.y}%`
                  });
                  
                  // Centralized Euclidean collision engine
                  let currentActive: number | null = null;
                  let highestVisited = -1;
                  
                  for (let idx = 0; idx < mapNodes.length; idx++) {
                    const node = mapNodes[idx];
                    const dx = point.x - node.x;
                    const dy = point.y - node.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    // Activate ONLY when orb physically overlaps dot (within 8.5 units in viewBox space)
                    if (distance <= 8.5) {
                      currentActive = idx;
                    }
                    
                    // Mark as visited when the orb meets or passes node vertical height
                    if (point.y >= node.y - 1.5) {
                      highestVisited = idx;
                    }
                  }
                  
                  // Reset if scrolled back to top
                  if (progress < 0.02) {
                    highestVisited = -1;
                  }
                  
                  // Guard state changes to minimize DOM writes and React render cycles
                  if (currentActive !== activeIndexRef.current) {
                    activeIndexRef.current = currentActive;
                    setActiveIndex(currentActive);
                  }
                  if (highestVisited !== visitedIndexRef.current) {
                    visitedIndexRef.current = highestVisited;
                    setVisitedIndex(highestVisited);
                  }
                }
              }
            }
          });
        }

        const items = gsap.utils.toArray<HTMLElement>('.desktop-item');
        items.forEach((item) => {
          const card = item.querySelector('.desktop-card');
          const dot = item.querySelector('.desktop-dot');
          const imgContainer = item.querySelector('.chapter-image-container');
          const parallaxImg = item.querySelector('.desktop-image-parallax');

          // Card Entrance Reveal (opacity 0 -> 0.72, y 40 -> 0) with clearProps so React controls it afterwards
          gsap.fromTo(card,
            { y: 40, opacity: 0 },
            {
              y: 0,
              opacity: 0.72,
              duration: 1.0,
              ease: 'power3.out',
              clearProps: 'opacity,transform',
              scrollTrigger: {
                trigger: item,
                start: 'top 82%',
                toggleActions: 'play none none none'
              }
            }
          );

          // Dot Marker Pop Entrance
          gsap.fromTo(dot,
            { scale: 0.4, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration: 0.6,
              ease: 'back.out(1.5)',
              scrollTrigger: {
                trigger: item,
                start: 'top 82%',
                toggleActions: 'play none none none'
              }
            }
          );

          // Image Entrance Reveal (opacity 0 -> 1, scale 1.08 -> 1, y 40 -> 0)
          if (imgContainer) {
            gsap.fromTo(imgContainer,
              { opacity: 0, scale: 1.08, y: 40 },
              {
                opacity: 1,
                scale: 1,
                y: 0,
                duration: 1.2,
                ease: 'power3.out',
                scrollTrigger: {
                  trigger: item,
                  start: 'top 85%',
                  toggleActions: 'play none none none'
                }
              }
            );
          }

          // Subtle Parallax drift inside chapter image (yPercent -6 to 6)
          if (parallaxImg) {
            gsap.fromTo(parallaxImg,
              { yPercent: -6 },
              {
                yPercent: 6,
                ease: 'none',
                scrollTrigger: {
                  trigger: item,
                  start: 'top bottom',
                  end: 'bottom top',
                  scrub: true
                }
              }
            );
          }
        });

        // Editorial Closing Moment Trigger
        const finalSection = el.querySelector('.closing-anim');
        if (finalSection) {
          ScrollTrigger.create({
            trigger: finalSection,
            start: 'top 88%',
            onEnter: () => {
              if (!hasFinalTriggeredRef.current) {
                hasFinalTriggeredRef.current = true;

                const tl = gsap.timeline();
                
                const span = finalSection.querySelector('span');
                if (span) {
                  tl.fromTo(span,
                    { opacity: 0, y: 24 },
                    { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' }
                  );
                }

                const finalDecor = finalSection.querySelector('[data-final-decor]');
                if (finalDecor) {
                  tl.fromTo(finalDecor,
                    { scaleY: 0, opacity: 0 },
                    { scaleY: 1, opacity: 0.4, duration: 0.8, ease: 'power2.out', transformOrigin: 'top center' },
                    '-=0.8'
                  );
                }

                const finalPulse = finalSection.querySelector('[data-final-pulse]');
                if (finalPulse) {
                  tl.fromTo(finalPulse,
                    { scale: 0, opacity: 0 },
                    { 
                      scale: 1, 
                      opacity: 0.8, 
                      duration: 0.6, 
                      ease: 'back.out(2)',
                      onComplete: () => {
                        gsap.to(finalPulse, {
                          scale: 1.3,
                          opacity: 0.5,
                          duration: 1.5,
                          yoyo: true,
                          repeat: -1,
                          ease: 'power1.inOut'
                        });
                      }
                    },
                    '-=0.4'
                  );
                }
              }
            }
          });
        }
      });

      // ─── Mobile Layout Rules (md/sm < 1024px) ───
      mm.add("(max-width: 1023px)", () => {
        // Draw the vertical mobile path line and set active indexes
        if (mobilePathRef.current && mobileContainerRef.current) {
          gsap.to(mobilePathRef.current, {
            strokeDashoffset: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: mobileContainerRef.current,
              start: 'top center',
              end: 'bottom center',
              scrub: 1.2,
              onUpdate: (self) => {
                const progress = self.progress;
                
                let currentActive: number | null = null;
                let highestVisited = -1;
                
                for (let idx = 0; idx < 5; idx++) {
                  const checkpointProgress = 0.05 + 0.20 * idx;
                  
                  // Contact active glow threshold
                  if (Math.abs(progress - checkpointProgress) <= 0.08) {
                    currentActive = idx;
                  }
                  
                  // Visited state
                  if (progress >= checkpointProgress - 0.015) {
                    highestVisited = idx;
                  }
                }
                
                // Guard state changes to minimize DOM writes and React render cycles
                if (currentActive !== activeIndexRef.current) {
                  activeIndexRef.current = currentActive;
                  setActiveIndex(currentActive);
                }
                if (highestVisited !== visitedIndexRef.current) {
                  visitedIndexRef.current = highestVisited;
                  setVisitedIndex(highestVisited);
                }
              }
            }
          });
        }

        const items = gsap.utils.toArray<HTMLElement>('.mobile-item');
        items.forEach((item) => {
          const card = item.querySelector('.mobile-card');
          const dot = item.querySelector('.mobile-dot');
          const imgContainer = item.querySelector('.chapter-image-container');

          // Mobile Card Entrance with clearProps so React classes take over
          gsap.fromTo(card,
            { y: 30, opacity: 0 },
            {
              y: 0,
              opacity: 0.72,
              duration: 1.0,
              ease: 'power3.out',
              clearProps: 'opacity,transform',
              scrollTrigger: {
                trigger: item,
                start: 'top 85%',
                toggleActions: 'play none none none'
              }
            }
          );

          // Mobile Dot Pop
          gsap.fromTo(dot,
            { scale: 0.4, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration: 0.6,
              ease: 'back.out(1.5)',
              scrollTrigger: {
                trigger: item,
                start: 'top 85%',
                toggleActions: 'play none none none'
              }
            }
          );

          // Mobile Image Entrance (no parallax)
          if (imgContainer) {
            gsap.fromTo(imgContainer,
              { opacity: 0, scale: 1.08, y: 30 },
              {
                opacity: 1,
                scale: 1,
                y: 0,
                duration: 1.2,
                ease: 'power3.out',
                scrollTrigger: {
                  trigger: item,
                  start: 'top 88%',
                  toggleActions: 'play none none none'
                }
              }
            );
          }
        });

        // Mobile Final Story Trigger
        const finalSection = el.querySelector('.closing-anim');
        if (finalSection) {
          ScrollTrigger.create({
            trigger: finalSection,
            start: 'top 92%',
            onEnter: () => {
              if (!hasFinalTriggeredRef.current) {
                hasFinalTriggeredRef.current = true;

                const tl = gsap.timeline();
                const span = finalSection.querySelector('span');
                if (span) {
                  tl.fromTo(span,
                    { opacity: 0, y: 15 },
                    { opacity: 1, y: 0, duration: 1.0, ease: 'power3.out' }
                  );
                }

                const finalDecor = finalSection.querySelector('[data-final-decor]');
                if (finalDecor) {
                  tl.fromTo(finalDecor,
                    { scaleY: 0, opacity: 0 },
                    { scaleY: 1, opacity: 0.4, duration: 0.8, ease: 'power2.out', transformOrigin: 'top center' },
                    '-=0.8'
                  );
                }

                const finalPulse = finalSection.querySelector('[data-final-pulse]');
                if (finalPulse) {
                  tl.fromTo(finalPulse,
                    { scale: 0, opacity: 0 },
                    { 
                      scale: 1, 
                      opacity: 0.8, 
                      duration: 0.6, 
                      ease: 'back.out(2)',
                      onComplete: () => {
                        gsap.to(finalPulse, {
                          scale: 1.3,
                          opacity: 0.5,
                          duration: 1.5,
                          yoyo: true,
                          repeat: -1,
                          ease: 'power1.inOut'
                        });
                      }
                    },
                    '-=0.4'
                  );
                }
              }
            }
          });
        }
      });

    }, el);

    return () => {
      if (mm) mm.revert();
      ctx.revert();
    };
  }, [shouldReduceMotion]);

  return (
    <section 
      id="love-story" 
      data-section 
      data-theme="dark" 
      data-wow="true" 
      className={`py-24 md:py-32 lg:py-48 relative -mt-px overflow-hidden transition-colors duration-500 ${sectionBgClass}`}
      ref={sectionRef}
    >
      {/* Fallback Static Background Image (always present behind video, or fully active when video is absent/disabled) */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center grayscale contrast-[1.05] brightness-[0.4] pointer-events-none mix-blend-luminosity transition-opacity duration-1000"
        style={{ 
          backgroundImage: `url(${fallbackImage})`,
          opacity: (shouldReduceMotion || videoError || isMobile) 
            ? (isTaupe ? 0.20 : 0.22) 
            : (isTaupe ? 0.15 : 0.10)
        }}
      />

      {/* Ambient Video Background Layer */}
      {!shouldReduceMotion && !videoError && !isMobile && isVideoInView && (
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="none"
          onError={() => setVideoError(true)}
          className={`absolute inset-0 w-full h-full object-cover grayscale transition-opacity duration-1000 pointer-events-none hidden lg:block ${isTaupe ? 'opacity-[0.28]' : 'opacity-[0.6]'}`}
          aria-hidden="true"
        >
          <source src={loveStoryVideo} type="video/mp4" />
        </video>
      )}

      {/* Radial Vignette & Backdrop Filter Overlay for Ultimate Contrast */}
      <div 
        className="absolute inset-0 pointer-events-none z-[1] transition-colors duration-1000" 
        style={{
          background: isTaupe
            ? 'radial-gradient(circle at center, rgba(201,173,143,0.34) 0%, rgba(201,173,143,0.76) 52%, rgba(111,82,58,0.34) 100%)'
            : isBurgundy 
              ? 'radial-gradient(circle at center, rgba(74,31,42,0.3) 0%, rgba(35,12,20,0.95) 100%)'
              : 'radial-gradient(circle at center, rgba(5,5,5,0.3) 0%, rgba(5,5,5,0.95) 100%)'
        }}
      />

      {/* Top Gradient Fade to blend with CoupleSection */}
      <div 
        className={`absolute top-0 left-0 right-0 h-40 md:h-64 z-[2] bg-gradient-to-b transition-colors duration-1000 pointer-events-none ${isTaupe ? 'from-[#C9AD8F] to-[#C9AD8F]/0' : isBurgundy ? 'from-[#4A1F2A] to-[#4A1F2A]/0' : 'from-[#050505] to-[#050505]/0'}`} 
      />

      {/* Bottom Gradient Fade to blend with CountdownSection */}
      <div 
        className={`absolute bottom-0 left-0 right-0 h-40 md:h-64 z-[2] bg-gradient-to-t transition-colors duration-1000 pointer-events-none ${isTaupe ? 'from-[#C9AD8F] to-[#C9AD8F]/0' : isBurgundy ? 'from-[#4A1F2A] to-[#4A1F2A]/0' : 'from-[#050505] to-[#050505]/0'}`} 
      />

      <Container>
        {/* Intro Header */}
        <div className="flex flex-col items-center text-center mb-16 lg:mb-32 relative z-10">
          <span className={`intro-anim font-mono text-[11px] md:text-[12px] tracking-[0.25em] uppercase mb-6 transition-colors duration-500 ${mutedClass}`}>
            Cerita Kami
          </span>
          <h2 className={`intro-anim font-serif text-[36px] md:text-[56px] lg:text-[72px] leading-[1.1] font-light max-w-2xl transition-colors duration-500 ${headingClass}`}>
            Awal Kisah Kami
          </h2>
          <p className={`intro-anim mt-6 text-[14px] md:text-[16px] font-sans max-w-md px-4 transition-colors duration-500 ${mutedClass}`}>
            Setiap cerita memiliki awal, dan inilah bagian kecil dari perjalanan kami.
          </p>
        </div>

        {/* DESKTOP STORY MAP (lg+) */}
        <div className="hidden lg:block relative h-[2600px] xl:h-[3000px] max-w-[1100px] mx-auto w-full" ref={desktopContainerRef}>
          {/* Curved SVG Path */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
            {/* Background Base Path */}
            <path 
              d="M 15 5 C 50 5, 85 15, 85 25 C 85 35, 15 35, 15 45 C 15 55, 85 55, 85 65 C 85 75, 25 75, 25 85 C 25 93, 50 93, 50 100" 
              fill="none" 
              stroke={isTaupe ? 'rgba(17,17,17,0.18)' : isBurgundy ? 'rgba(245,245,240,0.18)' : 'rgba(245,245,240,0.15)'} 
              strokeWidth="2.0" 
              vectorEffect="non-scaling-stroke"
              className="transition-colors duration-500"
            />
            {/* Animated Draw Progress Path */}
            <path 
              ref={desktopPathRef}
              d="M 15 5 C 50 5, 85 15, 85 25 C 85 35, 15 35, 15 45 C 15 55, 85 55, 85 65 C 85 75, 25 75, 25 85 C 25 93, 50 93, 50 100" 
              fill="none" 
              stroke={isTaupe ? 'rgba(17,17,17,0.48)' : isBurgundy ? 'rgba(245,245,240,0.45)' : 'rgba(245,245,240,0.42)'} 
              strokeWidth="2.0" 
              vectorEffect="non-scaling-stroke"
              pathLength="1"
              strokeDasharray="1"
              style={{ strokeDashoffset: shouldReduceMotion ? 0 : 1 }}
              className="transition-all duration-300"
            />
          </svg>

          {/* Traveling Indicator / Orb */}
          {!shouldReduceMotion && (
            <div 
              ref={desktopOrbRef}
              className={`absolute w-2.5 h-2.5 xl:w-3.5 xl:h-3.5 rounded-full z-20 pointer-events-none -translate-x-1/2 -translate-y-1/2 transition-colors duration-500 ${isTaupe ? 'bg-[#111111] shadow-[0_0_12px_rgba(17,17,17,0.32)]' : 'bg-[#F5F5F0] shadow-[0_0_12px_rgba(245,245,240,0.65)]'}`}
              style={{ left: '15%', top: '5%', opacity: 1 }}
              aria-hidden="true"
            />
          )}

          {/* Map Nodes / Cards */}
          {storyData.map((story: any, i) => {
            const node = mapNodes[i];
            if (!node) return null;
            
            const imageUrl = story.image || story.photo || story.src || story.imageUrl;
            
            // Define three-tier memory states
            const isActive = shouldReduceMotion ? false : (activeIndex === i);
            const isVisited = shouldReduceMotion ? true : (!isActive && visitedIndex >= i);

            return (
              <div 
                key={story.id || i}
                className="absolute desktop-item group z-10"
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
              >
                {/* Dot Marker */}
                <div 
                  className={[
                    'absolute w-[10px] h-[10px] rounded-full transition-all duration-500 -translate-x-1/2 -translate-y-1/2 desktop-dot',
                    isActive 
                      ? (isTaupe ? 'bg-[#111111] scale-125 border-[#111111] shadow-[0_0_10px_rgba(17,17,17,0.34)] z-20' : 'bg-[#F5F5F0] scale-150 border-[#F5F5F0] shadow-[0_0_14px_rgba(245,245,240,0.65)] z-20')
                      : isVisited 
                        ? (isTaupe ? 'bg-[rgba(17,17,17,0.80)] scale-100 border-[rgba(17,17,17,0.38)] shadow-none' : 'bg-[#F5F5F0]/80 scale-100 border-[#F5F5F0]/40 shadow-[0_0_8px_rgba(245,245,240,0.25)]')
                        : (isTaupe ? 'bg-[rgba(111,82,58,0.18)] border-[rgba(17,17,17,0.35)] shadow-none z-0' : isBurgundy ? 'bg-[#2B1018] border-[#A4A4A4]/40 shadow-none z-0' : 'bg-[#111111] border-[#A4A4A4]/40 shadow-none z-0')
                  ].join(' ')}
                  aria-hidden="true" 
                />
                
                {/* Chapter Card (Vow Letter Card style) */}
                <div 
                  className={[
                    'absolute top-1/2 w-[330px] xl:w-[400px] p-8 xl:p-10 border transition-all duration-[600ms] ease-out backdrop-blur-sm desktop-card flex flex-col justify-center rounded-[2px] overflow-hidden group/card cursor-pointer',
                    isActive 
                      ? (isTaupe ? 'bg-[rgba(245,245,240,0.48)] border-[rgba(17,17,17,0.32)] opacity-100 -translate-y-[calc(50%_+_6px)] shadow-[0_16px_40px_rgba(43,31,22,0.24)]' : isBurgundy ? 'bg-[rgba(35,12,20,0.95)] border-[#F5F5F0]/36 opacity-100 -translate-y-[calc(50%_+_6px)] shadow-[0_16px_40px_rgba(0,0,0,0.45)]' : 'bg-[#0B0B0B]/95 border-[#F5F5F0]/36 opacity-100 -translate-y-[calc(50%_+_6px)] shadow-[0_16px_40px_rgba(0,0,0,0.45)]')
                      : isVisited
                        ? (isTaupe ? 'bg-[rgba(245,245,240,0.36)] border-[rgba(17,17,17,0.20)] opacity-[0.88] hover:opacity-[0.95] hover:border-[rgba(17,17,17,0.28)] hover:-translate-y-[calc(50%_+_4px)] -translate-y-1/2 shadow-[0_8px_24px_rgba(43,31,22,0.15)]' : isBurgundy ? 'bg-[rgba(35,12,20,0.84)] border-[#F5F5F0]/20 opacity-[0.88] hover:opacity-[0.95] hover:border-[#F5F5F0]/28 hover:-translate-y-[calc(50%_+_4px)] -translate-y-1/2 shadow-[0_8px_24px_rgba(0,0,0,0.25)]' : 'bg-[#080808]/85 border-[#F5F5F0]/20 opacity-[0.88] hover:opacity-[0.95] hover:border-[#F5F5F0]/28 hover:-translate-y-[calc(50%_+_4px)] -translate-y-1/2 shadow-[0_8px_24px_rgba(0,0,0,0.25)]')
                        : (isTaupe ? 'bg-[rgba(245,245,240,0.28)] border-[rgba(17,17,17,0.12)] opacity-[0.45] hover:opacity-[0.72] hover:border-[rgba(17,17,17,0.18)] hover:-translate-y-[calc(50%_+_2px)] -translate-y-1/2 shadow-none pointer-events-none' : isBurgundy ? 'bg-[rgba(35,12,20,0.70)] border-[#F5F5F0]/10 opacity-[0.45] hover:opacity-[0.72] hover:border-[#F5F5F0]/20 hover:-translate-y-[calc(50%_+_2px)] -translate-y-1/2 shadow-none pointer-events-none' : 'bg-[#080808]/70 border-[#F5F5F0]/10 opacity-[0.45] hover:opacity-[0.72] hover:border-[#F5F5F0]/20 hover:-translate-y-[calc(50%_+_2px)] -translate-y-1/2 shadow-none pointer-events-none'),
                    node.align === 'right' ? 'left-6 xl:left-10' : 'right-6 xl:right-10 text-right'
                  ].join(' ')}
                >
                  {/* Top Hairline */}
                  <div 
                    className={[
                      'absolute top-0 left-8 right-8 h-px transition-colors duration-[600ms]',
                      isActive 
                        ? (isTaupe ? 'bg-[rgba(17,17,17,0.20)]' : 'bg-[#F5F5F0]/25') 
                        : isVisited 
                          ? (isTaupe ? 'bg-[rgba(17,17,17,0.12)]' : 'bg-[#F5F5F0]/15') 
                          : (isTaupe ? 'bg-[rgba(17,17,17,0.06)]' : 'bg-[#F5F5F0]/5')
                    ].join(' ')}
                    aria-hidden="true"
                  />

                  {/* Inner Glow vignette */}
                  <div 
                    className={[
                      'absolute inset-0 pointer-events-none transition-opacity duration-700 ease-out',
                      isActive ? 'opacity-100' : isVisited ? 'opacity-50' : 'opacity-0'
                    ].join(' ')}
                    style={{
                      background: isTaupe ? 'radial-gradient(circle at top left, rgba(17,17,17,0.055) 0%, transparent 70%)' : 'radial-gradient(circle at top left, rgba(245,245,240,0.08) 0%, transparent 70%)'
                    }}
                    aria-hidden="true"
                  />

                  {/* Large Ghost Number */}
                  <div 
                    className={[
                      'absolute top-6 font-serif text-[72px] leading-none select-none pointer-events-none transition-all duration-700 ease-out font-light',
                      isTaupe ? 'text-[#111111]' : 'text-[#F5F5F0]',
                      isActive 
                        ? (isTaupe ? 'opacity-[0.08] translate-y-0 scale-100' : 'opacity-[0.065] translate-y-0 scale-100') 
                        : isVisited 
                          ? (isTaupe ? 'opacity-[0.05] translate-y-0 scale-98' : 'opacity-[0.04] translate-y-0 scale-98') 
                          : (isTaupe ? 'opacity-[0.025] translate-y-1 scale-95' : 'opacity-[0.015] translate-y-1 scale-95'),
                      node.align === 'right' ? 'right-6' : 'left-6'
                    ].join(' ')}
                    aria-hidden="true"
                  >
                    0{i + 1}
                  </div>

                  {/* Corner Accent Marks */}
                  <div 
                    className={[
                      'absolute inset-3 pointer-events-none border transition-all duration-700 ease-out rounded-[1px]',
                      isActive 
                        ? (isTaupe ? 'border-[rgba(17,17,17,0.12)]' : 'border-[#F5F5F0]/8') 
                        : isVisited 
                          ? (isTaupe ? 'border-[rgba(17,17,17,0.08)]' : 'border-[#F5F5F0]/5') 
                          : 'border-transparent'
                    ].join(' ')}
                    aria-hidden="true"
                  >
                    <div className={['absolute top-0 left-0 w-2 h-2 border-t border-l transition-colors duration-500', isActive ? (isTaupe ? 'border-[rgba(17,17,17,0.24)]' : 'border-[#F5F5F0]/30') : isVisited ? (isTaupe ? 'border-[rgba(17,17,17,0.16)]' : 'border-[#F5F5F0]/20') : (isTaupe ? 'border-[rgba(17,17,17,0.08)]' : 'border-[#F5F5F0]/10')].join(' ')} />
                    <div className={['absolute top-0 right-0 w-2 h-2 border-t border-r transition-colors duration-500', isActive ? (isTaupe ? 'border-[rgba(17,17,17,0.24)]' : 'border-[#F5F5F0]/30') : isVisited ? (isTaupe ? 'border-[rgba(17,17,17,0.16)]' : 'border-[#F5F5F0]/20') : (isTaupe ? 'border-[rgba(17,17,17,0.08)]' : 'border-[#F5F5F0]/10')].join(' ')} />
                    <div className={['absolute bottom-0 left-0 w-2 h-2 border-b border-l transition-colors duration-500', isActive ? (isTaupe ? 'border-[rgba(17,17,17,0.24)]' : 'border-[#F5F5F0]/30') : isVisited ? (isTaupe ? 'border-[rgba(17,17,17,0.16)]' : 'border-[#F5F5F0]/20') : (isTaupe ? 'border-[rgba(17,17,17,0.08)]' : 'border-[#F5F5F0]/10')].join(' ')} />
                    <div className={['absolute bottom-0 right-0 w-2 h-2 border-b border-r transition-colors duration-500', isActive ? (isTaupe ? 'border-[rgba(17,17,17,0.24)]' : 'border-[#F5F5F0]/30') : isVisited ? (isTaupe ? 'border-[rgba(17,17,17,0.16)]' : 'border-[#F5F5F0]/20') : (isTaupe ? 'border-[rgba(17,17,17,0.08)]' : 'border-[#F5F5F0]/10')].join(' ')} />
                  </div>

                  <div className="relative z-10">
                    {/* Grayscale Nested Image Container */}
                    {imageUrl && (
                      <div className={`chapter-image-container mb-5 w-full aspect-[16/10] overflow-hidden border rounded-[2px] transition-colors duration-500 ${isTaupe ? 'border-[rgba(17,17,17,0.12)]' : 'border-[#F5F5F0]/10'}`}>
                        <div 
                          className={[
                            'w-full h-full overflow-hidden transition-transform duration-700 ease-out',
                            (isActive && !shouldReduceMotion) ? 'scale-[1.04]' : 'scale-100'
                          ].join(' ')}
                        >
                          <img 
                            src={imageUrl} 
                            alt={story.title}
                            className={`desktop-image-parallax w-full h-[120%] -mt-[10%] object-cover grayscale transition-[filter] duration-500 ${isTaupe ? 'contrast-[1.0] brightness-[1.0]' : 'contrast-[1.05] brightness-[0.9]'}`}
                            loading="lazy"
                          />
                        </div>
                      </div>
                    )}

                    {/* Date Block with Context Icon and line */}
                    <div className={['flex items-center gap-3 mb-2.5', node.align === 'right' ? '' : 'flex-row-reverse'].join(' ')}>
                      <span className={`transition-colors duration-500 ${isTaupe ? 'text-[rgba(17,17,17,0.66)] group-hover/card:text-[rgba(17,17,17,0.90)]' : 'text-[#F5F5F0]/50 group-hover/card:text-[#F5F5F0]/90'}`}>
                        {i === 0 && <Palette size={13} strokeWidth={1.5} />}
                        {i === 1 && <Coffee size={13} strokeWidth={1.5} />}
                        {i === 2 && <MessageCircle size={13} strokeWidth={1.5} />}
                        {i === 3 && <Gem size={13} strokeWidth={1.5} />}
                        {i === 4 && <Heart size={13} strokeWidth={1.5} />}
                      </span>
                      <span 
                        className={[
                          'font-mono text-[10px] xl:text-[11px] uppercase tracking-[0.25em] transition-colors duration-500',
                          isActive ? (isTaupe ? 'text-[rgba(17,17,17,0.90)]' : 'text-[#F5F5F0]/90') : isVisited ? (isTaupe ? 'text-[rgba(17,17,17,0.76)]' : isBurgundy ? 'text-[rgba(245,245,240,0.80)]' : 'text-[#A4A4A4]/80') : (isTaupe ? 'text-[rgba(17,17,17,0.48)]' : isBurgundy ? 'text-[rgba(245,245,240,0.45)]' : 'text-[#A4A4A4]/40')
                        ].join(' ')}
                      >
                        {story.date}
                      </span>
                      <div className={`w-6 h-px bg-gradient-to-r transition-colors duration-500 ${isTaupe ? 'from-[rgba(17,17,17,0.22)]' : 'from-[#F5F5F0]/15'} to-transparent`} />
                    </div>

                    <h3 
                      className={[
                        'font-serif text-[22px] xl:text-[28px] mb-3 leading-[1.25] font-light transition-colors duration-500',
                        isActive ? (isTaupe ? 'text-[#111111]' : 'text-[#F5F5F0]') : isVisited ? (isTaupe ? 'text-[rgba(17,17,17,0.82)]' : 'text-[#F5F5F0]/85') : (isTaupe ? 'text-[rgba(17,17,17,0.55)]' : isBurgundy ? 'text-[rgba(245,245,240,0.50)]' : 'text-[#F5F5F0]/50')
                      ].join(' ')}
                    >
                      {story.title}
                    </h3>
                    <p 
                      className={[
                        'font-sans text-[13px] xl:text-[14px] leading-[1.85] transition-colors duration-500 max-w-prose',
                        isActive ? (isTaupe ? 'text-[rgba(17,17,17,0.74)]' : isBurgundy ? 'text-[rgba(245,245,240,0.72)]' : 'text-[#A4A4A4]') : isVisited ? (isTaupe ? 'text-[rgba(17,17,17,0.64)]' : isBurgundy ? 'text-[rgba(245,245,240,0.60)]' : 'text-[#A4A4A4]/80') : (isTaupe ? 'text-[rgba(17,17,17,0.48)]' : isBurgundy ? 'text-[rgba(245,245,240,0.45)]' : 'text-[#A4A4A4]/50')
                      ].join(' ')}
                    >
                      {story.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}


        </div>

        {/* MOBILE FALLBACK TIMELINE (< lg) */}
        <div className="lg:hidden relative w-full mt-16 max-w-[500px] mx-auto px-4" ref={mobileContainerRef}>
          {/* Vertical Path Line */}
          <div className="absolute left-[28px] md:left-[48px] top-0 bottom-0 w-[2px] -translate-x-1/2 z-0">
            <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" aria-hidden="true" focusable="false">
              <line x1="1" y1="0" x2="1" y2="100%" stroke={isTaupe ? 'rgba(17,17,17,0.18)' : isBurgundy ? "rgba(245,245,240,0.18)" : "rgba(245,245,240,0.14)"} strokeWidth="1.6" className="transition-colors duration-500" />
              <line 
                ref={mobilePathRef}
                x1="1" 
                y1="0" 
                x2="1" 
                y2="100%" 
                stroke={isTaupe ? 'rgba(17,17,17,0.48)' : isBurgundy ? "rgba(245,245,240,0.45)" : "rgba(245,245,240,0.45)"} 
                strokeWidth="1.8" 
                pathLength="1" 
                strokeDasharray="1" 
                style={{ strokeDashoffset: shouldReduceMotion ? 0 : 1 }}
                className="transition-all duration-300"
              />
            </svg>
          </div>

          <div className="flex flex-col gap-12 md:gap-16">
            {storyData.map((story: any, i) => {
              const imageUrl = story.image || story.photo || story.src || story.imageUrl;
              
              // Define three-tier memory states on mobile
              const isActive = shouldReduceMotion ? false : (activeIndex === i);
              const isVisited = shouldReduceMotion ? true : (!isActive && visitedIndex >= i);
              
              return (
                <div key={story.id || i} className="relative w-full flex items-start group mobile-item">
                  {/* Timeline Dot */}
                  <div className="absolute left-[28px] md:left-[48px] top-6 -translate-x-1/2 z-10">
                    <div 
                      className={[
                        'w-[9px] h-[9px] rounded-full transition-all duration-500 mobile-dot',
                        isTaupe ? 'shadow-[0_0_0_4px_#C9AD8F]' : isBurgundy ? 'shadow-[0_0_0_4px_#4A1F2A]' : 'shadow-[0_0_0_4px_#111111]',
                        isActive 
                          ? (isTaupe ? 'bg-[#111111] scale-125 border-[#111111] shadow-[0_0_10px_rgba(17,17,17,0.34)]' : 'bg-[#F5F5F0] scale-125 border-[#F5F5F0] shadow-[0_0_10px_rgba(245,245,240,0.5)]')
                          : isVisited 
                            ? (isTaupe ? 'bg-[rgba(17,17,17,0.80)] border-[rgba(17,17,17,0.38)] shadow-none' : 'bg-[#F5F5F0]/80 border-[#F5F5F0]/40 shadow-[0_0_6px_rgba(245,245,240,0.15)]')
                            : (isTaupe ? 'bg-[rgba(111,82,58,0.18)] border-[rgba(17,17,17,0.35)] shadow-none' : isBurgundy ? 'bg-[#2B1018] border-[#A4A4A4]/40 shadow-none' : 'bg-[#111111] border-[#A4A4A4]/40 shadow-none')
                      ].join(' ')}
                      aria-hidden="true" 
                    />
                  </div>
                  
                  {/* Content Container */}
                  <div className="w-full pl-[56px] md:pl-[96px]">
                    <div 
                      className={[
                        'w-full p-5 sm:p-8 border transition-all duration-[600ms] ease-out mobile-card flex flex-col justify-center rounded-[2px] overflow-hidden group/card cursor-pointer relative backdrop-blur-sm',
                        isActive 
                          ? (isTaupe ? 'bg-[rgba(245,245,240,0.50)] border-[rgba(17,17,17,0.32)] opacity-100 -translate-y-1 shadow-[0_12px_32px_rgba(43,31,22,0.24)]' : isBurgundy ? 'bg-[rgba(35,12,20,0.96)] border-[#F5F5F0]/36 opacity-100 -translate-y-1 shadow-[0_12px_32px_rgba(0,0,0,0.5)]' : 'bg-[#0B0B0B]/95 border-[#F5F5F0]/36 opacity-100 -translate-y-1 shadow-[0_12px_32px_rgba(0,0,0,0.5)]')
                          : isVisited 
                            ? (isTaupe ? 'bg-[rgba(245,245,240,0.36)] border-[rgba(17,17,17,0.20)] opacity-[0.95] hover:-translate-y-1 shadow-[0_6px_20px_rgba(43,31,22,0.15)]' : isBurgundy ? 'bg-[rgba(35,12,20,0.88)] border-[#F5F5F0]/20 opacity-[0.95] hover:-translate-y-1 shadow-[0_6px_20px_rgba(0,0,0,0.3)]' : 'bg-[#080808]/90 border-[#F5F5F0]/20 opacity-[0.95] hover:-translate-y-1 shadow-[0_6px_20px_rgba(0,0,0,0.3)]')
                            : (isTaupe ? 'bg-[rgba(245,245,240,0.28)] border-[rgba(17,17,17,0.12)] opacity-[0.80] hover:-translate-y-0.5 shadow-none pointer-events-none' : isBurgundy ? 'bg-[rgba(35,12,20,0.78)] border-[#F5F5F0]/10 opacity-[0.80] hover:-translate-y-0.5 shadow-none pointer-events-none' : 'bg-[#080808]/80 border-[#F5F5F0]/10 opacity-[0.80] hover:-translate-y-0.5 shadow-none pointer-events-none')
                      ].join(' ')}
                    >
                      {/* Top Hairline */}
                      <div 
                        className={[
                          'absolute top-0 left-6 right-6 h-px transition-colors duration-[600ms]',
                          isActive 
                            ? (isTaupe ? 'bg-[rgba(17,17,17,0.20)]' : 'bg-[#F5F5F0]/25') 
                            : isVisited 
                              ? (isTaupe ? 'bg-[rgba(17,17,17,0.12)]' : 'bg-[#F5F5F0]/15') 
                              : (isTaupe ? 'bg-[rgba(17,17,17,0.06)]' : 'bg-[#F5F5F0]/5')
                        ].join(' ')}
                        aria-hidden="true"
                      />

                      {/* Inner Glow vignette */}
                      <div 
                        className={[
                          'absolute inset-0 pointer-events-none transition-opacity duration-700 ease-out',
                          isActive ? 'opacity-100' : isVisited ? 'opacity-50' : 'opacity-0'
                        ].join(' ')}
                        style={{
                          background: isTaupe ? 'radial-gradient(circle at top left, rgba(17,17,17,0.055) 0%, transparent 70%)' : 'radial-gradient(circle at top left, rgba(245,245,240,0.08) 0%, transparent 70%)'
                        }}
                        aria-hidden="true"
                      />

                      {/* Large Ghost Number */}
                      <div 
                        className={[
                          'absolute top-5 right-5 font-serif text-[60px] leading-none select-none pointer-events-none transition-all duration-700 ease-out font-light',
                          isActive 
                            ? (isTaupe ? 'opacity-[0.08] translate-y-0 scale-100 text-[#111111]' : 'opacity-[0.08] translate-y-0 scale-100 text-[#F5F5F0]') 
                            : isVisited 
                              ? (isTaupe ? 'opacity-[0.05] translate-y-0 scale-98 text-[#111111]' : 'opacity-[0.05] translate-y-0 scale-98 text-[#F5F5F0]') 
                              : (isTaupe ? 'opacity-[0.025] translate-y-1 scale-95 text-[#111111]' : 'opacity-[0.02] translate-y-1 scale-95 text-[#F5F5F0]')
                        ].join(' ')}
                        aria-hidden="true"
                      >
                        0{i + 1}
                      </div>

                      {/* Corner Accent Marks */}
                      <div 
                        className={[
                          'absolute inset-3 pointer-events-none border transition-all duration-700 ease-out rounded-[1px]',
                          isActive 
                            ? 'border-[#F5F5F0]/8' 
                            : isVisited 
                              ? 'border-[#F5F5F0]/5' 
                              : 'border-transparent'
                        ].join(' ')}
                        aria-hidden="true"
                      >
                        <div className={['absolute top-0 left-0 w-2 h-2 border-t border-l transition-colors duration-500', isActive ? (isTaupe ? 'border-[rgba(17,17,17,0.24)]' : 'border-[#F5F5F0]/30') : isVisited ? (isTaupe ? 'border-[rgba(17,17,17,0.16)]' : 'border-[#F5F5F0]/15') : (isTaupe ? 'border-[rgba(17,17,17,0.08)]' : 'border-[#F5F5F0]/5')].join(' ')} />
                        <div className={['absolute top-0 right-0 w-2 h-2 border-t border-r transition-colors duration-500', isActive ? (isTaupe ? 'border-[rgba(17,17,17,0.24)]' : 'border-[#F5F5F0]/30') : isVisited ? (isTaupe ? 'border-[rgba(17,17,17,0.16)]' : 'border-[#F5F5F0]/15') : (isTaupe ? 'border-[rgba(17,17,17,0.08)]' : 'border-[#F5F5F0]/5')].join(' ')} />
                        <div className={['absolute bottom-0 left-0 w-2 h-2 border-b border-l transition-colors duration-500', isActive ? (isTaupe ? 'border-[rgba(17,17,17,0.24)]' : 'border-[#F5F5F0]/30') : isVisited ? (isTaupe ? 'border-[rgba(17,17,17,0.16)]' : 'border-[#F5F5F0]/15') : (isTaupe ? 'border-[rgba(17,17,17,0.08)]' : 'border-[#F5F5F0]/5')].join(' ')} />
                        <div className={['absolute bottom-0 right-0 w-2 h-2 border-b border-r transition-colors duration-500', isActive ? (isTaupe ? 'border-[rgba(17,17,17,0.24)]' : 'border-[#F5F5F0]/30') : isVisited ? (isTaupe ? 'border-[rgba(17,17,17,0.16)]' : 'border-[#F5F5F0]/15') : (isTaupe ? 'border-[rgba(17,17,17,0.08)]' : 'border-[#F5F5F0]/5')].join(' ')} />
                      </div>

                      <div className="relative z-10">
                        {/* Image for Mobile (No GSAP Parallax but hover scale enabled) */}
                        {imageUrl && (
                          <div className={`chapter-image-container mb-4 w-full aspect-[16/10] overflow-hidden border rounded-[2px] transition-colors duration-500 ${isTaupe ? 'border-[rgba(17,17,17,0.12)]' : 'border-[#F5F5F0]/10'}`}>
                            <div 
                              className={[
                                'w-full h-full overflow-hidden transition-transform duration-700 ease-out',
                                (isActive && !shouldReduceMotion) ? 'scale-[1.04]' : 'scale-100'
                              ].join(' ')}
                            >
                              <img 
                                src={imageUrl} 
                                alt={story.title}
                                className={`w-full h-full object-cover grayscale transition-[filter] duration-500 ${isTaupe ? 'contrast-[1.0] brightness-[1.0]' : 'contrast-[1.05] brightness-[0.9]'}`}
                                loading="lazy"
                              />
                            </div>
                          </div>
                        )}

                        {/* Date Block with Context Icon and line */}
                        <div className="flex items-center gap-3 mb-2.5">
                          <span 
                            className={[
                              'transition-colors duration-500',
                                isActive 
                                  ? (isTaupe ? 'text-[#111111]' : 'text-white') 
                                  : isVisited 
                                    ? (isTaupe ? 'text-[rgba(17,17,17,0.76)]' : 'text-[#F5F5F0]/70') 
                                    : (isTaupe ? 'text-[rgba(17,17,17,0.48)]' : 'text-[#A4A4A4]/40')
                            ].join(' ')}
                          >
                            {i === 0 && <Palette size={13} strokeWidth={1.5} />}
                            {i === 1 && <Coffee size={13} strokeWidth={1.5} />}
                            {i === 2 && <MessageCircle size={13} strokeWidth={1.5} />}
                            {i === 3 && <Gem size={13} strokeWidth={1.5} />}
                            {i === 4 && <Heart size={13} strokeWidth={1.5} />}
                          </span>
                          <span 
                            className={[
                              'font-mono text-[10px] md:text-[11px] uppercase tracking-[0.25em] transition-colors duration-500',
                                isActive 
                                  ? (isTaupe ? 'text-[#111111]' : 'text-white') 
                                  : isVisited 
                                    ? (isTaupe ? 'text-[rgba(17,17,17,0.82)]' : 'text-[#F5F5F0]/80') 
                                    : (isTaupe ? 'text-[rgba(17,17,17,0.48)]' : isBurgundy ? 'text-[rgba(245,245,240,0.45)]' : 'text-[#A4A4A4]/50')
                            ].join(' ')}
                          >
                            {story.date}
                          </span>
                          <div 
                            className={[
                              'w-6 h-px transition-colors duration-500',
                                isActive
                                  ? (isTaupe ? 'bg-[rgba(17,17,17,0.34)]' : 'bg-[#F5F5F0]/40')
                                  : isVisited
                                    ? (isTaupe ? 'bg-[rgba(17,17,17,0.22)]' : 'bg-[#F5F5F0]/20')
                                    : (isTaupe ? 'bg-[rgba(17,17,17,0.12)]' : 'bg-[#F5F5F0]/10')
                            ].join(' ')}
                          />
                        </div>

                        <h3 
                          className={[
                            'font-serif text-[22px] md:text-[26px] mb-3 leading-[1.25] font-light transition-colors duration-500',
                              isActive 
                                ? (isTaupe ? 'text-[#111111] font-medium' : 'text-white font-medium') 
                                : isVisited 
                                  ? (isTaupe ? 'text-[rgba(17,17,17,0.82)]' : 'text-[#F5F5F0]/85') 
                                  : (isTaupe ? 'text-[rgba(17,17,17,0.55)]' : 'text-[#F5F5F0]/50')
                          ].join(' ')}
                        >
                          {story.title}
                        </h3>
                        <p 
                          className={[
                            'font-sans text-[13px] md:text-[14px] leading-[1.85] transition-colors duration-500 max-w-prose',
                                isActive 
                                ? (isTaupe ? 'text-[rgba(17,17,17,0.74)]' : isBurgundy ? 'text-[rgba(245,245,240,0.72)]' : 'text-white')
                                : isVisited 
                                  ? (isTaupe ? 'text-[rgba(17,17,17,0.64)]' : isBurgundy ? 'text-[rgba(245,245,240,0.60)]' : 'text-[#A4A4A4]/80') 
                                  : (isTaupe ? 'text-[rgba(17,17,17,0.48)]' : isBurgundy ? 'text-[rgba(245,245,240,0.45)]' : 'text-[#A4A4A4]/40')
                          ].join(' ')}
                        >
                          {story.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Closing Notes (Romantic final trigger) */}
        <div className="closing-anim mt-24 lg:mt-32 flex justify-center text-center relative z-10">
          <div className="flex flex-col items-center gap-6 lg:gap-8">
            {/* Elegant Line with pulsing center dot */}
            <div className="relative flex items-center justify-center h-16 w-px">
              <div 
                data-final-decor 
                className={`absolute top-0 bottom-0 w-px transition-colors duration-500 ${isTaupe ? 'bg-gradient-to-b from-[rgba(17,17,17,0.30)] to-transparent' : isBurgundy ? 'bg-gradient-to-b from-[rgba(245,245,240,0.34)] to-transparent' : 'bg-gradient-to-b from-[#F5F5F0]/30 to-transparent'}`} 
                style={{ opacity: shouldReduceMotion ? 0.4 : 0, transform: shouldReduceMotion ? 'none' : 'scaleY(0)' }} 
              />
              <div 
                data-final-pulse 
                className={`absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full transition-colors duration-500 ${isTaupe ? 'bg-[#111111] shadow-[0_0_12px_rgba(17,17,17,0.4)]' : 'bg-[#F5F5F0] shadow-[0_0_12px_rgba(245,245,240,0.6)]'}`} 
                style={{ opacity: shouldReduceMotion ? 0.8 : 0, transform: shouldReduceMotion ? 'none' : 'scale(0)' }}
              />
            </div>
            <span 
              className={`font-serif italic text-[18px] md:text-[22px] px-4 block tracking-wide transition-opacity transition-colors duration-500 ${isTaupe ? 'text-[rgba(17,17,17,0.72)]' : isBurgundy ? 'text-[rgba(245,245,240,0.65)]' : 'text-[#A4A4A4]'}`} 
              style={{ opacity: shouldReduceMotion ? 1 : 0 }}
            >
              Kini, kami melangkah bersama.
            </span>
          </div>
        </div>

      </Container>
    </section>
  );
}

export default LoveStorySection;
