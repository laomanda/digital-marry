import { weddingData } from '../../data/wedding.data';
import { Container } from '../ui/Container';
import { SectionTitle } from '../ui/SectionTitle';

export function DressCodeSection() {
  return (
    <section id="dress-code" data-section data-theme="dark" data-global-reveal="true" className="bg-light-gray py-section">
      <Container>
        <div data-animate="title">
          <SectionTitle 
            title={weddingData.dressCode.title} 
            subtitle="Attire Guidelines"
          />
        </div>
        
        <div className="max-w-2xl mx-auto text-center mt-8 mb-12">
          <p data-animate="text" className="text-black/70 leading-relaxed font-sans">
            {weddingData.dressCode.description}
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-6 md:gap-12 mt-12">
          {weddingData.dressCode.colors.map((color) => (
            <div data-animate="card" key={color.name} className="flex flex-col items-center gap-3">
              <div 
                className="w-16 h-16 md:w-20 md:h-20 rounded-full shadow-sm border border-border-gray/30"
                style={{ backgroundColor: color.hex }}
              />
              <span className="font-sans text-xs tracking-widest uppercase text-black/80">
                {color.name}
              </span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
