import { useRef, useEffect } from 'react';
import { gsap } from '../../lib/gsap';
import { weddingData } from '../../data/wedding.data';
import { useReducedMotionSafe } from '../../hooks/useReducedMotionSafe';
import { Container } from '../ui/Container';

export function LoveStorySection() {
  const sectionRef = useRef<HTMLElement>(null);
  
  // Desktop Refs
  const desktopContainerRef = useRef<HTMLDivElement>(null);
  const desktopPathRef = useRef<SVGPathElement>(null);

  // Mobile Refs
  const mobileContainerRef = useRef<HTMLDivElement>(null);
  const mobilePathRef = useRef<SVGLineElement>(null);

  const { shouldReduceMotion } = useReducedMotionSafe();

  const rawStoryData = weddingData.loveStory?.length 
    ? weddingData.loveStory 
    : [
        { id: 1, date: '2018', title: 'First Meet', description: 'A brief encounter that sparked a lifetime of memories.' },
        { id: 2, date: '2020', title: 'Growing Closer', description: 'Finding comfort in each other during the quiet moments.' },
        { id: 3, date: '2023', title: 'The Proposal', description: 'A simple question, a profound answer.' }
      ];

  // Layout desktop story map saat ini curated untuk maksimal 5 chapter.
  // Data lebih dari 5 sengaja dipotong agar koordinat map tetap aman.
  const storyData = rawStoryData.slice(0, 5);

  // Coordinates for the 5 points in a 100x100 grid for desktop map
  // Jarak Y dibuat merata (selisih 20%) dan diakhiri di 85% agar kartu terakhir tidak overlap dengan footer
  const mapNodes = [
    { x: 15, y: 5, align: 'right' },
    { x: 85, y: 25, align: 'left' },
    { x: 15, y: 45, align: 'right' },
    { x: 85, y: 65, align: 'left' },
    { x: 25, y: 85, align: 'right' }
  ];

  useEffect(() => {
    if (shouldReduceMotion) return;

    let mm: gsap.MatchMedia;
    
    const ctx = gsap.context(() => {
      mm = gsap.matchMedia();

      // Intro Animation (Universal)
      gsap.from('.intro-anim', {
        y: 40,
        opacity: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none none'
        }
      });

      // Closing Animation (Universal)
      gsap.from('.closing-anim', {
        y: 20,
        opacity: 0,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.closing-anim',
          start: 'top 90%',
          toggleActions: 'play none none none'
        }
      });

      // Desktop Animations
      mm.add("(min-width: 1024px)", () => {
        if (desktopPathRef.current && desktopContainerRef.current) {
          gsap.to(desktopPathRef.current, {
            strokeDashoffset: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: desktopContainerRef.current,
              start: 'top 50%',
              end: 'bottom 75%',
              scrub: 1,
            }
          });
        }

        gsap.utils.toArray('.desktop-item').forEach((item: any) => {
          gsap.from(item.querySelector('.desktop-card'), {
            y: 40,
            opacity: 0,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 82%',
              toggleActions: 'play none none none'
            }
          });

          gsap.from(item.querySelector('.desktop-dot'), {
            scale: 0.5,
            opacity: 0,
            duration: 0.8,
            ease: 'back.out(1.7)',
            scrollTrigger: {
              trigger: item,
              start: 'top 82%',
              toggleActions: 'play none none none',
              onEnter: () => {
                const dot = item.querySelector('.desktop-dot');
                if (dot) dot.classList.add('is-active');
              }
            }
          });
        });
      });

      // Mobile Animations
      mm.add("(max-width: 1023px)", () => {
        if (mobilePathRef.current && mobileContainerRef.current) {
          gsap.to(mobilePathRef.current, {
            strokeDashoffset: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: mobileContainerRef.current,
              start: 'top 60%',
              end: 'bottom 85%',
              scrub: 1,
            }
          });
        }

        gsap.utils.toArray('.mobile-item').forEach((item: any) => {
          gsap.from(item.querySelector('.mobile-card'), {
            y: 40,
            opacity: 0,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 85%',
              toggleActions: 'play none none none'
            }
          });

          gsap.from(item.querySelector('.mobile-dot'), {
            scale: 0.5,
            opacity: 0,
            duration: 0.8,
            ease: 'back.out(1.7)',
            scrollTrigger: {
              trigger: item,
              start: 'top 85%',
              toggleActions: 'play none none none',
              onEnter: () => {
                const dot = item.querySelector('.mobile-dot');
                if (dot) dot.classList.add('is-active');
              }
            }
          });
        });
      });

    }, sectionRef);

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
      className="bg-[#111111] py-24 md:py-32 lg:py-48 relative overflow-hidden"
      ref={sectionRef}
    >
      <Container>
        {/* Intro Area */}
        <div className="flex flex-col items-center text-center mb-16 lg:mb-32 relative z-10">
          <span className="intro-anim font-mono text-[11px] md:text-[12px] tracking-[0.25em] text-[#A4A4A4] uppercase mb-6">
            Our Story
          </span>
          <h2 className="intro-anim font-serif text-[36px] md:text-[56px] lg:text-[72px] text-[#F5F5F0] leading-[1.1] font-light max-w-2xl">
            How It All Began
          </h2>
          <p className="intro-anim mt-6 text-[14px] md:text-[16px] text-[#A4A4A4] font-sans max-w-md px-4">
            A journey of two souls finding their way to each other, one beautiful moment at a time.
          </p>
        </div>

        {/* DESKTOP STORY MAP (lg+) */}
        <div className="hidden lg:block relative h-[2600px] xl:h-[3000px] max-w-[1100px] mx-auto w-full" ref={desktopContainerRef}>
          {/* Curved SVG Path */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
            {/* Background Path */}
            <path 
              d="M 15 5 C 50 5, 85 15, 85 25 C 85 35, 15 35, 15 45 C 15 55, 85 55, 85 65 C 85 75, 25 75, 25 85 C 25 93, 50 93, 50 100" 
              fill="none" 
              stroke="rgba(245,245,240,0.12)" 
              strokeWidth="1.5" 
              vectorEffect="non-scaling-stroke"
            />
            {/* Animated Draw Path */}
            <path 
              ref={desktopPathRef}
              d="M 15 5 C 50 5, 85 15, 85 25 C 85 35, 15 35, 15 45 C 15 55, 85 55, 85 65 C 85 75, 25 75, 25 85 C 25 93, 50 93, 50 100" 
              fill="none" 
              stroke="#F5F5F0" 
              strokeWidth="2" 
              vectorEffect="non-scaling-stroke"
              pathLength="1"
              strokeDasharray="1"
              style={{ strokeDashoffset: shouldReduceMotion ? 0 : 1 }}
              className="transition-opacity duration-300"
            />
          </svg>

          {/* Map Nodes / Cards */}
          {storyData.map((story: any, i) => {
            const node = mapNodes[i];
            if (!node) return null; // Safe fallback if more than 5 stories exist but nodes aren't mapped
            
            const imageUrl = story.image || story.photo || story.src || story.imageUrl;

            return (
              <div 
                key={story.id || i}
                className="absolute desktop-item group z-10"
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
              >
                {/* Marker */}
                <div className="absolute w-[10px] h-[10px] rounded-full bg-[#111111] border border-[#A4A4A4] group-hover:border-[#F5F5F0] group-hover:bg-[#F5F5F0] [&.is-active]:bg-[#F5F5F0] [&.is-active]:border-[#F5F5F0] transition-colors duration-500 -translate-x-1/2 -translate-y-1/2 desktop-dot shadow-[0_0_0_4px_#111111]" aria-hidden="true" />
                
                {/* Card */}
                <div className={`absolute top-1/2 -translate-y-1/2 w-[330px] xl:w-[400px] p-7 xl:p-10 border border-[#F5F5F0]/10 hover:border-[#F5F5F0]/30 transition-colors duration-700 bg-[#111111]/60 backdrop-blur-md desktop-card flex flex-col justify-center ${node.align === 'right' ? 'left-6 xl:left-10' : 'right-6 xl:right-10 text-right'}`}>
                  {/* Decorative Number */}
                  <div 
                    className={`absolute top-4 xl:top-6 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-700 font-serif text-[70px] xl:text-[100px] leading-none pointer-events-none select-none ${node.align === 'right' ? 'right-6 xl:right-8' : 'left-6 xl:left-8'}`}
                    aria-hidden="true"
                  >
                    0{i + 1}
                  </div>
                  
                  <div className="relative z-10">
                    {imageUrl && (
                      <div className="mb-4 xl:mb-6 w-full aspect-[16/10] overflow-hidden border border-[#F5F5F0]/10 rounded-[2px]">
                        <img 
                          src={imageUrl} 
                          alt={story.title}
                          className="w-full h-full object-cover grayscale opacity-90 hover:opacity-100 hover:contrast-125 hover:brightness-110 hover:scale-105 transition-all duration-700"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <span className="font-mono text-[10px] xl:text-[11px] uppercase tracking-[0.2em] text-[#A4A4A4] block mb-2">
                      {story.date}
                    </span>
                    <h3 className="font-serif text-[22px] xl:text-[28px] text-[#F5F5F0] mb-3 xl:mb-4 leading-tight">
                      {story.title}
                    </h3>
                    <p className="font-sans text-[13px] xl:text-[14px] leading-[1.8] text-[#888888]">
                      {story.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Closing Node Marker */}
          <div className="absolute left-[50%] top-[100%] -translate-x-1/2 -translate-y-1/2 z-10">
             <div className="w-[6px] h-[6px] rounded-full bg-[#F5F5F0] shadow-[0_0_0_4px_#111111]" aria-hidden="true" />
          </div>
        </div>

        {/* MOBILE FALLBACK TIMELINE (< lg) */}
        <div className="lg:hidden relative w-full mt-16 max-w-[500px] mx-auto px-4" ref={mobileContainerRef}>
          {/* Vertical Line */}
          <div className="absolute left-[36px] md:left-[48px] top-0 bottom-0 w-[2px] -translate-x-1/2 z-0">
            <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" aria-hidden="true" focusable="false">
              <line x1="1" y1="0" x2="1" y2="100%" stroke="rgba(245,245,240,0.15)" strokeWidth="1" />
              <line 
                ref={mobilePathRef}
                x1="1" 
                y1="0" 
                x2="1" 
                y2="100%" 
                stroke="#F5F5F0" 
                strokeWidth="1.5" 
                pathLength="1" 
                strokeDasharray="1" 
                style={{ strokeDashoffset: shouldReduceMotion ? 0 : 1 }}
                className="transition-opacity duration-300"
              />
            </svg>
          </div>

          <div className="flex flex-col gap-12 md:gap-16">
            {storyData.map((story: any, i) => {
              const imageUrl = story.image || story.photo || story.src || story.imageUrl;
              
              return (
                <div key={story.id || i} className="relative w-full flex items-start group mobile-item">
                  <div className="absolute left-[36px] md:left-[48px] top-6 -translate-x-1/2 z-10">
                    <div className="w-[9px] h-[9px] rounded-full bg-[#111111] border border-[#A4A4A4] group-hover:border-[#F5F5F0] group-hover:bg-[#F5F5F0] [&.is-active]:bg-[#F5F5F0] [&.is-active]:border-[#F5F5F0] transition-colors duration-500 mobile-dot shadow-[0_0_0_4px_#111111]" aria-hidden="true" />
                  </div>
                  
                  <div className="w-full pl-[72px] md:pl-[96px]">
                    <div className="p-7 md:p-8 border border-[#F5F5F0]/10 hover:border-[#F5F5F0]/30 transition-colors duration-700 relative bg-[#111111]/60 backdrop-blur-md mobile-card flex flex-col justify-center">
                      <div 
                        className="absolute top-4 md:top-6 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-700 font-serif text-[72px] leading-none right-6 pointer-events-none select-none"
                        aria-hidden="true"
                      >
                        0{i + 1}
                      </div>
                      
                      <div className="relative z-10 mt-1">
                        {imageUrl && (
                          <div className="mb-4 w-full aspect-[16/10] overflow-hidden border border-[#F5F5F0]/10 rounded-[2px]">
                            <img 
                              src={imageUrl} 
                              alt={story.title}
                              className="w-full h-full object-cover grayscale opacity-90 hover:opacity-100 hover:contrast-125 hover:brightness-110 hover:scale-105 transition-all duration-700"
                              loading="lazy"
                            />
                          </div>
                        )}
                        <span className="font-mono text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-[#A4A4A4] block mb-2">
                          {story.date}
                        </span>
                        <h3 className="font-serif text-[22px] md:text-[26px] text-[#F5F5F0] mb-3 leading-tight">
                          {story.title}
                        </h3>
                        <p className="font-sans text-[13px] md:text-[14px] leading-[1.7] text-[#888888]">
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

        {/* Closing Mini Note */}
        <div className="closing-anim mt-24 lg:mt-0 flex justify-center text-center relative z-10">
          <div className="flex flex-col items-center gap-6 lg:gap-8">
            <div className="w-px h-16 bg-gradient-to-b from-[#F5F5F0]/30 to-transparent hidden lg:block" />
            <span className="font-serif italic text-[18px] md:text-[22px] text-[#A4A4A4]">
              And now, forever begins.
            </span>
          </div>
        </div>

      </Container>
    </section>
  );
}

export default LoveStorySection;
