import { weddingData } from '../../data/wedding.data';
import { Container } from '../ui/Container';
import { SectionTitle } from '../ui/SectionTitle';
import { MagneticButton } from '../ui/MagneticButton';
import { Video } from 'lucide-react';

export function LiveStreamingSection() {
  return (
    <section id="live-streaming" data-section data-theme="dark" data-global-reveal="true" className="bg-burgundy py-section relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80')] bg-cover bg-center mix-blend-overlay" />
      
      <Container className="relative z-10">
        <div data-animate="title">
          <SectionTitle 
            title={weddingData.liveStreaming.title} 
            subtitle="Virtual Attendance"
            dark
          />
        </div>
        
        <div className="max-w-2xl mx-auto text-center mt-8 mb-12">
          <p data-animate="text" className="text-white/80 leading-relaxed font-sans">
            {weddingData.liveStreaming.description}
          </p>
        </div>

        <div data-animate="button" className="flex justify-center">
          <a href={weddingData.liveStreaming.link} target="_blank" rel="noopener noreferrer">
            <MagneticButton dark variant="outline" className="gap-3">
              <Video size={16} />
              Watch on {weddingData.liveStreaming.platform}
            </MagneticButton>
          </a>
        </div>
      </Container>
    </section>
  );
}
