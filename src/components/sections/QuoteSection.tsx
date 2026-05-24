import { weddingData } from '../../data/wedding.data';
import { Container } from '../ui/Container';
import { DecorativeLine } from '../ui/DecorativeLine';

export function QuoteSection() {
  return (
    <section id="quote" data-section data-theme="light" data-global-reveal="true" className="bg-white py-section relative">
      <DecorativeLine className="absolute top-0 left-0" dark />
      <Container>
        <div className="max-w-3xl mx-auto text-center px-4">
          <h3 data-animate="title" className="font-serif text-2xl md:text-4xl text-burgundy italic mb-8 leading-snug md:leading-snug">
            "{weddingData.wedding.quote.text}"
          </h3>
          <p data-animate="text" className="font-sans text-sm tracking-widest text-taupe uppercase">
            {weddingData.wedding.quote.author}
          </p>
        </div>
      </Container>
    </section>
  );
}
