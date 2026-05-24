import { weddingData } from '../../data/wedding.data';
import { Container } from '../ui/Container';
import { Reveal } from '../ui/Reveal';
import { MagneticButton } from '../ui/MagneticButton';
import { Camera } from 'lucide-react';

export function WeddingFrameSection() {
  return (
    <section id="wedding-frame" data-section data-theme="light" className="bg-white py-section">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <Reveal direction="right">
            <div className="aspect-[4/5] overflow-hidden">
              <img 
                src={weddingData.weddingFrame.image} 
                alt="Wedding Frame Filter" 
                className="w-full h-full object-cover mono-img"
              />
            </div>
          </Reveal>
          
          <div className="flex flex-col items-start gap-6">
            <Reveal direction="left">
              <span className="label-caps text-taupe">Interactive</span>
            </Reveal>
            
            <Reveal direction="left" delay={100}>
              <h2 className="font-serif text-section-title text-black">
                {weddingData.weddingFrame.title}
              </h2>
            </Reveal>
            
            <Reveal direction="left" delay={200}>
              <p className="text-black/70 leading-relaxed max-w-md font-sans">
                {weddingData.weddingFrame.description}
              </p>
            </Reveal>
            
            <Reveal direction="left" delay={300}>
              <a href={weddingData.weddingFrame.link} target="_blank" rel="noopener noreferrer">
                <MagneticButton className="mt-4 gap-3">
                  <Camera size={16} />
                  Try Filter
                </MagneticButton>
              </a>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
