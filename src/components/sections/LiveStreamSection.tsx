import { Youtube, ArrowRight } from 'lucide-react'

export default function LiveStreamSection() {
  const sectionClass = 'bg-[#050505] text-[#F5F5F0]';
  const textClass = 'text-[#F5F5F0]';
  const mutedClass = 'text-[#A4A4A4]';

  return (
    <section 
      id="live-stream" 
      data-section
      data-theme="dark" 
      className={`relative overflow-hidden py-24 md:py-32 transition-colors duration-500 ${sectionClass}`}
    >
      <div className="absolute left-1/2 top-0 h-px w-[min(520px,72vw)] -translate-x-1/2 bg-[#F5F5F0]/[0.06]" />
      
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
            href="https://youtube.com" 
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

