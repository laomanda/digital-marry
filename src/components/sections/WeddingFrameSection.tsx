import { weddingData } from '../../data/wedding.data';
import { Container } from '../ui/Container';
import { MagneticButton } from '../ui/MagneticButton';
import { Camera } from 'lucide-react';

export function WeddingFrameSection() {
  return (
    <section id="wedding-frame" data-section data-theme="light" data-global-reveal="true" className="bg-white py-section">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="aspect-[4/5] overflow-hidden" data-animate="image">
            <img 
              src={weddingData.weddingFrame.image} 
              alt="Wedding Frame Filter" 
              className="w-full h-full object-cover mono-img"
            />
          </div>
          
          <div className="flex flex-col items-start gap-6">
            <span data-animate="title" className="label-caps text-taupe">Interactive</span>
            
            <h2 data-animate="title" className="font-serif text-section-title text-black">
              {weddingData.weddingFrame.title}
            </h2>
            
            <p data-animate="text" className="text-black/70 leading-relaxed max-w-md font-sans">
              {weddingData.weddingFrame.description}
            </p>
            
            <div data-animate="button">
              <a href={weddingData.weddingFrame.link} target="_blank" rel="noopener noreferrer">
                <MagneticButton className="mt-4 gap-3">
                  <Camera size={16} />
                  Try Filter
                </MagneticButton>
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
