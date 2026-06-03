import { Youtube, ArrowRight } from 'lucide-react'

export default function LiveStreamSection() {
  const sectionClass = 'text-[#F5F5F0]';
  const textClass = 'text-[#F5F5F0]';
  const mutedClass = 'text-[#A4A4A4]';

  return (
    <section 
      id="live-stream" 
      data-section
      data-theme="dark" 
      className={`relative overflow-hidden py-24 md:py-32 transition-colors duration-500 ${sectionClass}`}
    >
      {/* Base warm tint (same as CountdownSection) */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background: 'linear-gradient(180deg, rgba(18,12,8,1) 0%, rgba(12,8,5,1) 40%, rgba(18,14,10,1) 100%)',
        }}
      />

      {/* Different Pattern 1: Dot grid texture - Increased opacity and size */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.28]" aria-hidden="true"
        style={{
          backgroundImage: 'radial-gradient(rgba(211,165,117,0.35) 1.5px, transparent 1.5px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Different Pattern 2: Vertical light stripes - Increased opacity and width */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.16]" aria-hidden="true"
        style={{
          backgroundImage: `
            repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(211,165,117,0.3) 40px, rgba(211,165,117,0.3) 42px)
          `,
        }}
      />

      {/* Subtle bottom-right radial glow - Increased intensity */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background: 'radial-gradient(ellipse 70% 60% at 85% 85%, rgba(211,165,117,0.15) 0%, transparent 75%)',
        }}
      />

      {/* Subtle top-left radial glow - Increased intensity */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background: 'radial-gradient(ellipse 50% 50% at 15% 15%, rgba(211,165,117,0.12) 0%, transparent 75%)',
        }}
      />

      {/* Smooth transition gradients to blend textures seamlessly with RsvpSection (top) and GallerySection (bottom) */}
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-32 md:h-48 z-[2] bg-gradient-to-b from-[#050505] to-transparent" aria-hidden="true" />
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 md:h-48 z-[2] bg-gradient-to-t from-[#050505] to-transparent" aria-hidden="true" />
      
      <div className="absolute left-1/2 top-0 h-px w-[min(520px,72vw)] -translate-x-1/2 bg-[#F5F5F0]/[0.06] z-[3]" />
      
      <div
        className="container-base mx-auto max-w-4xl text-center flex flex-col items-center relative z-10"
        data-aos="fade-up"
        data-aos-duration="700"
        data-aos-easing="ease-out-cubic"
      >
        <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-full border transition-colors duration-500 border-[#F5F5F0]/15 bg-[#F5F5F0]/[0.02]">
          <Youtube size={28} className={textClass} strokeWidth={1.2} aria-hidden="true" />
        </div>
        
        <span className={`mb-4 font-mono text-[10px] uppercase transition-colors duration-500 ${mutedClass}`}>
          Virtual Wedding
        </span>
        
        <h2 className={`mb-6 font-athene text-[44px] leading-[1.02] md:text-[56px] ${textClass}`}>
          Live Streaming
        </h2>
        
        <p className={`mb-10 max-w-xl mx-auto font-montserrat text-[15px] font-semibold leading-7 transition-colors duration-500 ${mutedClass}`}>
          Bagi keluarga dan sahabat yang tidak dapat hadir secara langsung, kami mengundang Anda untuk bergabung secara virtual dalam momen bahagia kami.
        </p>

        <div>
          <a
            href="https://youtube.com/@albianshoting?si=VwQ_Ba9Hx6QPbIiw" 
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center justify-center gap-4 border border-[#F5F5F0]/20 bg-[#F5F5F0]/[0.03] px-8 py-4 transition-all duration-500 hover:border-[#F5F5F0]/50 hover:bg-[#F5F5F0]/[0.08]"
          >
            <span className={`font-mono text-[11px] uppercase tracking-wider transition-colors duration-500 ${textClass}`}>
              Tonton Live Streaming
            </span>
            <ArrowRight
              size={16}
              strokeWidth={1.5}
              className={`transition-all duration-500 group-hover:translate-x-1 ${textClass}`}
              aria-hidden="true"
            />
          </a>
        </div>
      </div>
    </section>
  )
}

