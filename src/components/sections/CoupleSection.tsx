import { weddingData } from '../../data/wedding.data';
import { Container } from '../ui/Container';
import { Instagram } from 'lucide-react';

export function CoupleSection() {
  return (
    <section 
      id="couple" 
      data-section 
      data-theme="light" 
      data-global-reveal="true" 
      className="bg-[#F5F5F0] py-24 md:py-32 lg:py-48 relative overflow-hidden"
    >
      <Container>
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-20 md:mb-32 relative z-10">
          <span 
            data-animate="text" 
            className="font-sans text-[11px] md:text-[12px] tracking-[0.25em] text-[#555555] uppercase mb-6"
          >
            The Couple
          </span>
          <h2 
            data-animate="title"
            className="font-serif text-[36px] md:text-[56px] lg:text-[72px] text-[#111111] leading-[1.1] font-light"
          >
            {weddingData.bride.firstName} & {weddingData.groom.firstName}
          </h2>
          <div data-animate="line" className="w-px h-16 md:h-24 bg-[#111111]/20 mt-10 md:mt-12" />
        </div>

        {/* Spread Container */}
        <div className="max-w-[1100px] mx-auto flex flex-col gap-24 lg:gap-40">
          
          {/* BRIDE BLOCK */}
          <div className="relative flex flex-col lg:flex-row items-center lg:items-start gap-10 lg:gap-16" data-animate="card">
            
            {/* Ghost Text */}
            <div 
              className="absolute -top-24 lg:-top-32 -left-10 lg:-left-20 z-0 pointer-events-none hidden lg:block" 
              aria-hidden="true"
            >
              <span className="font-serif text-[180px] lg:text-[240px] text-[#111111] opacity-[0.03] leading-none select-none">
                BRIDE
              </span>
            </div>

            {/* Photo Area */}
            <div className="relative z-10 w-[85%] md:w-[60%] lg:w-[45%] max-w-[460px] group">
              <div 
                className="relative overflow-hidden w-full bg-[#E8E6DF] transition-transform duration-700 ease-out md:group-hover:-rotate-1 md:group-hover:scale-[1.01]" 
                style={{ aspectRatio: '4/5' }}
              >
                <img
                  src={weddingData.bride.photo}
                  alt={`Portrait of ${weddingData.bride.firstName}`}
                  className="w-full h-full object-cover grayscale contrast-[1.05] transition-all duration-700 ease-out group-hover:scale-[1.05] group-hover:contrast-[1.15] group-hover:brightness-[1.05]"
                />
                <div className="absolute inset-0 border border-[#111111]/12 pointer-events-none transition-colors duration-700 group-hover:border-[#111111]/[0.28]" />
              </div>
            </div>

            {/* Text Area */}
            <div className="relative z-20 w-[90%] md:w-[70%] lg:w-[50%] flex flex-col items-center lg:items-start text-center lg:text-left lg:pt-32">
              <h3 className="font-serif text-[40px] md:text-[56px] lg:text-[72px] leading-[1.1] text-[#111111] mb-6">
                {weddingData.bride.fullName}
              </h3>
              <div className="w-12 h-px bg-[#111111]/20 mb-8" />
              <p className="font-sans text-[13px] md:text-[14px] text-[#555555] mb-6 uppercase tracking-widest">
                {weddingData.bride.parents}
              </p>
              {weddingData.bride.description && (
                <p className="font-serif italic text-[16px] md:text-[18px] text-[#777777] leading-relaxed max-w-[360px]">
                  "{weddingData.bride.description}"
                </p>
              )}
              {weddingData.bride.instagram && (
                <a 
                  href={`https://instagram.com/${weddingData.bride.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-10 flex items-center gap-3 text-[#555555] opacity-50 hover:opacity-100 transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#111111] group/ig"
                  aria-label={`${weddingData.bride.firstName}'s Instagram`}
                >
                  <Instagram size={16} strokeWidth={1.5} className="transition-transform duration-300 group-hover/ig:translate-x-1" />
                  <span className="font-mono text-[11px] md:text-[12px] tracking-widest">{weddingData.bride.instagram}</span>
                </a>
              )}
            </div>
          </div>

          {/* GROOM BLOCK */}
          <div className="relative flex flex-col lg:flex-row-reverse items-center lg:items-start gap-10 lg:gap-16" data-animate="card">
            
            {/* Ghost Text */}
            <div 
              className="absolute -top-24 lg:-top-32 -right-10 lg:-right-20 z-0 pointer-events-none hidden lg:block" 
              aria-hidden="true"
            >
              <span className="font-serif text-[180px] lg:text-[240px] text-[#111111] opacity-[0.03] leading-none select-none">
                GROOM
              </span>
            </div>

            {/* Photo Area */}
            <div className="relative z-10 w-[85%] md:w-[60%] lg:w-[45%] max-w-[460px] group">
              <div 
                className="relative overflow-hidden w-full bg-[#E8E6DF] transition-transform duration-700 ease-out md:group-hover:rotate-1 md:group-hover:scale-[1.01]" 
                style={{ aspectRatio: '4/5' }}
              >
                <img
                  src={weddingData.groom.photo}
                  alt={`Portrait of ${weddingData.groom.firstName}`}
                  className="w-full h-full object-cover grayscale contrast-[1.05] transition-all duration-700 ease-out group-hover:scale-[1.05] group-hover:contrast-[1.15] group-hover:brightness-[1.05]"
                />
                <div className="absolute inset-0 border border-[#111111]/12 pointer-events-none transition-colors duration-700 group-hover:border-[#111111]/[0.28]" />
              </div>
            </div>

            {/* Text Area */}
            <div className="relative z-20 w-[90%] md:w-[70%] lg:w-[50%] flex flex-col items-center lg:items-end text-center lg:text-right lg:pt-32">
              <h3 className="font-serif text-[40px] md:text-[56px] lg:text-[72px] leading-[1.1] text-[#111111] mb-6">
                {weddingData.groom.fullName}
              </h3>
              <div className="w-12 h-px bg-[#111111]/20 mb-8" />
              <p className="font-sans text-[13px] md:text-[14px] text-[#555555] mb-6 uppercase tracking-widest">
                {weddingData.groom.parents}
              </p>
              {weddingData.groom.description && (
                <p className="font-serif italic text-[16px] md:text-[18px] text-[#777777] leading-relaxed max-w-[360px]">
                  "{weddingData.groom.description}"
                </p>
              )}
              {weddingData.groom.instagram && (
                <a 
                  href={`https://instagram.com/${weddingData.groom.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-10 flex items-center gap-3 text-[#555555] opacity-50 hover:opacity-100 transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#111111] group/ig"
                  aria-label={`${weddingData.groom.firstName}'s Instagram`}
                >
                  <Instagram size={16} strokeWidth={1.5} className="transition-transform duration-300 group-hover/ig:translate-x-1" />
                  <span className="font-mono text-[11px] md:text-[12px] tracking-widest">{weddingData.groom.instagram}</span>
                </a>
              )}
            </div>
          </div>

        </div>
      </Container>
    </section>
  );
}

export default CoupleSection;
