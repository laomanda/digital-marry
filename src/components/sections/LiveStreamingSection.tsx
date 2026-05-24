import { weddingData } from '../../data/wedding.data';
import { Container } from '../ui/Container';
import { SectionTitle } from '../ui/SectionTitle';
import { Reveal } from '../ui/Reveal';
import { MagneticButton } from '../ui/MagneticButton';
import { Video } from 'lucide-react';

export function LiveStreamingSection() {
  return (
    <section id="live-streaming" data-section data-theme="dark" className="bg-burgundy py-section relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80')] bg-cover bg-center mix-blend-overlay" />
      
      <Container className="relative z-10">
        <Reveal>
          <SectionTitle 
            title={weddingData.liveStreaming.title} 
            subtitle="Virtual Attendance"
            dark
          />
        </Reveal>
        
        <Reveal delay={200}>
          <div className="max-w-2xl mx-auto text-center mt-8 mb-12">
            <p className="text-white/80 leading-relaxed font-sans">
              {weddingData.liveStreaming.description}
            </p>
          </div>
        </Reveal>

        <Reveal delay={400}>
          <div className="flex justify-center">
            <a href={weddingData.liveStreaming.link} target="_blank" rel="noopener noreferrer">
              <MagneticButton dark variant="outline" className="gap-3">
                <Video size={16} />
                Watch on {weddingData.liveStreaming.platform}
              </MagneticButton>
            </a>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
