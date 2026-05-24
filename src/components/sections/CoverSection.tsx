import { useState } from 'react';
import { weddingData } from '../../data/wedding.data';
import { MagneticButton } from '../ui/MagneticButton';
import { useScrollLock } from '../../hooks/useScrollLock';
import { cn } from '../../lib/utils';
import { Reveal } from '../ui/Reveal';

export function CoverSection() {
  const [isOpen, setIsOpen] = useState(false);
  
  // Lock scroll while cover is open
  useScrollLock(!isOpen);

  const handleOpen = () => {
    setIsOpen(true);
    // You could also add GSAP animations here to fade out the cover smoothly
  };

  return (
    <div 
      id="cover"
      data-section
      data-theme="dark"
      className={cn(
        'fixed inset-0 z-50 flex flex-col items-center justify-center bg-black transition-transform duration-1000 ease-[cubic-bezier(0.76,0,0.24,1)]',
        isOpen ? '-translate-y-full' : 'translate-y-0'
      )}
    >
      <div className="absolute inset-0 opacity-40">
        <img 
          src={weddingData.gallery[0].src} 
          alt="Cover Background" 
          className="w-full h-full object-cover grayscale opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center px-6">
        <Reveal delay={200}>
          <span className="label-caps text-taupe mb-6 block">The Wedding Of</span>
        </Reveal>
        
        <Reveal delay={400}>
          <h1 className="font-serif text-hero-mobile md:text-hero-desktop text-white mb-4">
            {weddingData.bride.firstName} <span className="text-taupe italic font-light">&amp;</span> {weddingData.groom.firstName}
          </h1>
        </Reveal>
        
        <Reveal delay={600}>
          <p className="font-sans text-light-gray tracking-[0.2em] mb-12">
            {weddingData.wedding.dateFormatted}
          </p>
        </Reveal>

        <Reveal delay={800}>
          <div className="flex flex-col items-center gap-4 mb-10">
            <p className="font-sans text-sm text-muted-gray">Dear Guest,</p>
            <p className="font-sans text-white text-lg font-medium">You are invited</p>
          </div>
          
          <MagneticButton onClick={handleOpen} variant="outline" dark>
            Open Invitation
          </MagneticButton>
        </Reveal>
      </div>
    </div>
  );
}
