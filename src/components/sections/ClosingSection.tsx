import { weddingData } from '../../data/wedding.data'
import logoImage from '../../assets/logo-400.webp'

export default function ClosingSection() {
  const fallbackImg = 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&q=80&fit=crop'
  const closingImage = weddingData.gallery?.[4]?.src || weddingData.gallery?.[0]?.src || fallbackImg

  return (
    <section
      id="closing"
      data-section
      data-theme="dark"
      className="relative flex min-h-screen w-full flex-col items-center justify-between overflow-hidden bg-[#050505] px-6 py-12 md:py-20 text-[#F5F5F0]"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={closingImage}
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover opacity-50 grayscale transition-opacity duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505] opacity-90" />
      </div>

      {/* Top Content */}
      <div 
        className="relative z-10 mt-16 md:mt-24 flex w-full max-w-4xl flex-col items-center gap-6 text-center md:gap-8"
        data-aos="fade-up"
        data-aos-duration="1000"
      >
        <h2 className="font-athene text-[5.5vw] sm:text-[34px] leading-[1.15] md:text-[56px] lg:text-[72px] uppercase tracking-wide">
          <span className="whitespace-nowrap">Dengan Penuh Rasa Syukur</span><br />
          <span className="whitespace-nowrap">Atas Kehadiran Dan</span><br />
          <span className="whitespace-nowrap">Doa Restu Anda</span>
        </h2>
        <p className="max-w-[600px] font-montserrat text-[13px] md:text-[15px] leading-relaxed text-[#F5F5F0]/90">
          Kami tidak sabar untuk berbagi momen spesial ini bersama Anda. Kehadiran Anda akan membuat hari kami menjadi lebih bermakna.
        </p>
        <img 
          src={logoImage} 
          alt="Wedding Logo" 
          className="mt-6 w-[120px] object-contain opacity-90 md:mt-8 md:w-[150px]" 
        />
      </div>

      {/* Bottom Content */}
      <div 
        className="relative z-10 mb-8 mt-12 flex w-full flex-col items-center text-center"
        data-aos="fade-in"
        data-aos-duration="1000"
        data-aos-delay="300"
      >
        <p className="font-montserrat text-[10px] md:text-xs opacity-50">
          © 2026 Jakkob Panj, All rights reserved.
        </p>
      </div>
    </section>
  )
}
