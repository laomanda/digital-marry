import { Heart } from 'lucide-react'
import { weddingData } from '../../data/wedding.data'

export default function ClosingSection() {
  const closingName = `${weddingData.groom.firstName} & ${weddingData.bride.firstName}`
  const fallbackImg = 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&q=80&fit=crop'
  const closingImage = weddingData.gallery?.[4]?.src || weddingData.gallery?.[0]?.src || fallbackImg

  return (
    <section
      id="closing"
      data-section
      data-theme="dark"
      data-wow="true"
      className="relative -mt-px flex min-h-screen w-full flex-col justify-end overflow-hidden bg-[#050505] px-6 pb-32 pt-32 text-[#F5F5F0] transition-colors duration-500 md:px-12 md:pb-40"
    >
      <div
        className="absolute inset-0 z-0"
        style={{
          WebkitMaskImage:
            'linear-gradient(to bottom, rgba(0,0,0,0.24) 0%, rgba(0,0,0,0.58) 20%, rgba(0,0,0,0.88) 58%, #000 84%)',
          maskImage:
            'linear-gradient(to bottom, rgba(0,0,0,0.24) 0%, rgba(0,0,0,0.58) 20%, rgba(0,0,0,0.88) 58%, #000 84%)',
        }}
      >
        <img
          src={closingImage}
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover opacity-60 grayscale transition-opacity duration-500"
        />
        <div className="absolute inset-0 bg-[#050505]/56 transition-colors duration-500" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#050505_100%)] opacity-72 transition-colors duration-500" />
      </div>
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-28 bg-gradient-to-b from-[#050505] via-[#050505]/54 to-transparent md:h-36" aria-hidden="true" />

      <div className="relative z-10 mx-auto flex min-h-[60vh] w-full max-w-[1400px] flex-col justify-between gap-24">
        <div
          className="flex flex-col items-center gap-6 text-center md:ml-auto md:mr-12 md:max-w-[600px] md:items-start md:text-left"
          data-aos="fade-up"
          data-aos-duration="700"
          data-aos-easing="ease-out-cubic"
        >
          <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-[#A4A4A4] transition-colors duration-500 md:text-[10px]">
            Terima Kasih
          </span>

          <p className="font-montserrat text-[19px] font-semibold leading-relaxed text-[#F5F5F0] md:text-[26px]">
            &ldquo;{weddingData.closingQuote.text}&rdquo;
          </p>

          <p className="mt-1 font-montserrat text-[11px] font-semibold uppercase tracking-[0.3em] text-[#A4A4A4] transition-colors duration-500 md:text-[12px]">
            - {weddingData.closingQuote.author}
          </p>
        </div>

        <div
          className="mt-auto flex flex-col items-center gap-8 text-center md:items-start md:text-left"
          data-aos="fade-up"
          data-aos-duration="700"
          data-aos-easing="ease-out-cubic"
          data-aos-delay="80"
        >
          <h2
            className="whitespace-nowrap font-athene text-[#F5F5F0]"
            style={{
              fontSize: 'clamp(34px, 9.5vw, 160px)',
              lineHeight: 0.85,
              letterSpacing: '0em',
              maxWidth: '100%',
            }}
            aria-label={closingName}
          >
            {closingName.split('').map((char, index) => (
              <span
                key={`${char}-${index}`}
                aria-hidden="true"
                className="inline-block"
                style={{ display: char === ' ' ? 'inline' : 'inline-block' }}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </h2>

          <div className="mt-2 flex flex-col items-center gap-4 md:items-start">
            <p className="font-mono text-[9px] uppercase tracking-[0.5em] text-[#A4A4A4] transition-colors duration-500 md:text-[11px]">
              {weddingData.wedding.dateFormatted}
            </p>
            <p className="mt-2 max-w-md border-t border-[rgba(245,245,240,0.1)] pt-4 font-montserrat text-[13px] font-semibold leading-relaxed text-[#A4A4A4] transition-colors duration-500 md:text-[14px]">
              Terima kasih telah menjadi bagian dari hari paling berharga dalam hidup kami. Kehadiran dan doa Anda adalah berkah yang tak ternilai.
            </p>
            <div className="flex items-center gap-3 pt-1 text-[#F5F5F0]/70 transition-colors duration-500" aria-hidden="true">
              <span className="h-px w-10 bg-[#F5F5F0]/20 transition-colors duration-500" />
              <Heart size={14} strokeWidth={1.25} />
              <span className="h-px w-10 bg-[#F5F5F0]/20 transition-colors duration-500" />
            </div>
          </div>
        </div>
      </div>

      <p className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2 font-mono text-[9px] uppercase tracking-[0.24em] text-[#A4A4A4]/70 transition-colors duration-500 md:bottom-8">
        Created by Jakkob Panj
      </p>

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 h-40 bg-gradient-to-t from-[#050505] to-transparent transition-colors duration-500" />
    </section>
  )
}

