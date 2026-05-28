import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { weddingData } from '../../data/wedding.data'
import { useReducedMotionSafe } from '../../hooks/useReducedMotionSafe'
import DomeGallery from '../ui/DomeGallery'

export default function GallerySection() {
  const { shouldReduceMotion } = useReducedMotionSafe()
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)
  const entranceButtonRef = useRef<HTMLButtonElement | null>(null)

  const [palette, setPalette] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.localStorage.getItem('navbar_palette') || 'black';
    }
    return 'black';
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const current = window.localStorage.getItem('navbar_palette') || 'black';
      if (current !== palette) {
        setPalette(current);
      }
    }, 250);
    return () => clearInterval(interval);
  }, [palette]);

  const isBurgundy = palette === 'burgundy';
  const isTaupe = palette === 'taupe';

  const sectionClass = isTaupe
    ? 'bg-[#C9AD8F] text-[#111111]'
    : isBurgundy
      ? 'bg-[#4A1F2A] text-[#F5F5F0]'
      : 'bg-[#050505] text-[#F5F5F0]';

  const mutedClass = isTaupe
    ? 'text-[rgba(17,17,17,0.58)]'
    : isBurgundy
      ? 'text-[rgba(245,245,240,0.65)]'
      : 'text-[#A4A4A4]';

  const textClass = isTaupe ? 'text-[#111111]' : 'text-[#F5F5F0]';

  const overlayBlurColor = isTaupe
    ? '#C9AD8F'
    : isBurgundy
      ? '#2B1018'
      : '#050505';

  const fullscreenBgClass = isTaupe
    ? 'bg-[#C9AD8F] text-[#111111]'
    : isBurgundy
      ? 'bg-[#2B1018] text-[#F5F5F0]'
      : 'bg-[#050505] text-[#F5F5F0]';

  const images = useMemo(
    () =>
      weddingData.gallery.map((img) => ({
        src: img.src,
        alt: img.alt || 'Wedding gallery photo',
      })),
    []
  )

  const closeGallery = useCallback(() => {
    setIsGalleryOpen(false)
    window.setTimeout(() => entranceButtonRef.current?.focus(), 0)
  }, [])

  useEffect(() => {
    if (!isGalleryOpen) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isGalleryOpen])

  return (
    <section
      id="gallery"
      data-section
      data-theme={isTaupe ? "light" : "dark"}
      data-wow="true"
      className={`relative overflow-hidden py-24 md:py-32 transition-colors duration-500 ${sectionClass}`}
    >
      <div className="pointer-events-none absolute inset-0 opacity-45" aria-hidden="true">
        <div className={`absolute left-1/2 top-1/2 h-[460px] w-[460px] -translate-x-1/2 -translate-y-1/2 rounded-full border transition-colors duration-500 ${isTaupe ? 'border-[rgba(17,17,17,0.06)]' : isBurgundy ? 'border-[rgba(245,245,240,0.08)]' : 'border-[#F5F5F0]/[0.055]'}`} />
        <div className={`absolute inset-x-0 top-1/2 h-px transition-colors duration-500 ${isTaupe ? 'bg-[rgba(17,17,17,0.06)]' : isBurgundy ? 'bg-[rgba(245,245,240,0.08)]' : 'bg-[#F5F5F0]/[0.055]'}`} />
      </div>

      <div className="container-base relative z-10">
        <div className={`relative mx-auto flex min-h-[520px] max-w-5xl items-center justify-center overflow-hidden border px-6 py-20 text-center transition-colors duration-500 md:px-12 ${isTaupe ? 'border-[rgba(17,17,17,0.16)] bg-[rgba(245,245,240,0.30)]' : isBurgundy ? 'border-[rgba(245,245,240,0.18)] bg-[rgba(35,12,20,0.38)]' : 'border-[#F5F5F0]/10 bg-[#F5F5F0]/[0.018]'}`}>
          {images.length > 0 && (
            <div className={`pointer-events-none absolute inset-x-[-8%] top-1/2 hidden -translate-y-1/2 gap-4 md:flex ${isTaupe ? 'opacity-20' : 'opacity-20'}`} aria-hidden="true">
              {images.slice(0, 5).map((image, index) => (
                <div
                  key={`${image.src}-${index}`}
                  className={`h-[250px] flex-1 overflow-hidden border transition-colors duration-500 ${isTaupe ? 'border-[rgba(17,17,17,0.12)]' : isBurgundy ? 'border-[rgba(245,245,240,0.18)]' : 'border-[#F5F5F0]/10'}`}
                  style={{ transform: `translateY(${index % 2 === 0 ? -24 : 24}px)` }}
                >
                  <img
                    src={image.src}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover grayscale"
                  />
                </div>
              ))}
            </div>
          )}

          <div className={`absolute inset-0 transition-colors duration-500 ${isTaupe ? 'bg-[rgba(201,173,143,0.76)]' : isBurgundy ? 'bg-[rgba(74,31,42,0.72)]' : 'bg-[#050505]/72'}`} aria-hidden="true" />
          <div className={`pointer-events-none absolute left-0 top-0 h-3 w-3 border-l border-t transition-colors duration-500 ${isTaupe ? 'border-[rgba(17,17,17,0.22)]' : isBurgundy ? 'border-[rgba(245,245,240,0.30)]' : 'border-[#F5F5F0]/30'}`} aria-hidden="true" />
          <div className={`pointer-events-none absolute right-0 top-0 h-3 w-3 border-r border-t transition-colors duration-500 ${isTaupe ? 'border-[rgba(17,17,17,0.22)]' : isBurgundy ? 'border-[rgba(245,245,240,0.30)]' : 'border-[#F5F5F0]/30'}`} aria-hidden="true" />
          <div className={`pointer-events-none absolute bottom-0 left-0 h-3 w-3 border-b border-l transition-colors duration-500 ${isTaupe ? 'border-[rgba(17,17,17,0.22)]' : isBurgundy ? 'border-[rgba(245,245,240,0.20)]' : 'border-[#F5F5F0]/20'}`} aria-hidden="true" />
          <div className={`pointer-events-none absolute bottom-0 right-0 h-3 w-3 border-b border-r transition-colors duration-500 ${isTaupe ? 'border-[rgba(17,17,17,0.22)]' : isBurgundy ? 'border-[rgba(245,245,240,0.20)]' : 'border-[#F5F5F0]/20'}`} aria-hidden="true" />

          <div className="relative z-10 mx-auto flex max-w-[620px] flex-col items-center">
            <span className={`mb-5 font-mono text-[10px] uppercase transition-colors duration-500 ${mutedClass}`}>
              Galeri
            </span>
            <h2 className={`mb-6 font-serif text-[48px] font-light leading-[1.02] md:text-[78px] ${textClass}`}>
              Momen Berharga
            </h2>
            <p className={`mb-9 max-w-md text-[15px] leading-7 transition-colors duration-500 ${mutedClass}`}>
              Beberapa potongan cerita yang kami simpan sebagai kenangan.
            </p>
            <button
              ref={entranceButtonRef}
              type="button"
              onClick={() => setIsGalleryOpen(true)}
              className={`group inline-flex items-center gap-4 border px-6 py-4 font-mono text-[10px] uppercase transition-colors duration-300 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 ${textClass} ${isTaupe ? 'border-[rgba(17,17,17,0.18)] hover:border-[rgba(17,17,17,0.46)] hover:bg-[rgba(17,17,17,0.035)] focus-visible:outline-[rgba(17,17,17,0.50)]' : isBurgundy ? 'border-[rgba(245,245,240,0.18)] hover:border-[rgba(245,245,240,0.48)] focus-visible:outline-[#F5F5F0]' : 'border-[#F5F5F0]/16 hover:border-[#F5F5F0]/45 focus-visible:outline-[#F5F5F0]'}`}
            >
              <span>Masuk Galeri</span>
              <ArrowRight size={15} strokeWidth={1.5} className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isGalleryOpen && (
          <motion.div
            key="gallery-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0.1 : 0.35 }}
            className={`fixed inset-0 z-[120] overflow-hidden transition-colors duration-500 ${fullscreenBgClass}`}
            role="dialog"
            aria-modal="true"
            aria-label="Galeri foto pernikahan"
          >
            <header className="pointer-events-none absolute left-[max(1.25rem,env(safe-area-inset-left,0px))] top-[max(1.25rem,env(safe-area-inset-top,0px))] z-[130] flex items-center gap-4 md:left-8 md:top-8">
              <button
                type="button"
                onClick={closeGallery}
                aria-label="Kembali dari galeri"
                className={`pointer-events-auto border px-5 py-3 font-mono text-[10px] uppercase transition-colors duration-300 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 ${textClass} ${isTaupe ? 'border-[rgba(17,17,17,0.20)] bg-[rgba(245,245,240,0.46)] hover:border-[rgba(17,17,17,0.46)] focus-visible:outline-[rgba(17,17,17,0.50)]' : isBurgundy ? 'border-[rgba(245,245,240,0.20)] bg-[rgba(43,16,24,0.78)] hover:border-[rgba(245,245,240,0.48)] focus-visible:outline-[#F5F5F0]' : 'border-[#F5F5F0]/16 bg-[#050505]/72 hover:border-[#F5F5F0]/45 focus-visible:outline-[#F5F5F0]'}`}
              >
                Kembali
              </button>
              <span className={`pointer-events-auto hidden font-mono text-[10px] uppercase transition-colors duration-500 sm:inline ${mutedClass}`}>
                Galeri
              </span>
            </header>

            <DomeGallery
              images={images}
              grayscale
              fit={0.56}
              minRadius={520}
              maxRadius={900}
              segments={35}
              dragSensitivity={22}
              dragDampening={0.75}
              overlayBlurColor={overlayBlurColor}
              imageBorderRadius="18px"
              openedImageBorderRadius="18px"
              openedImageWidth="min(78vw, 520px)"
              openedImageHeight="min(78vh, 620px)"
              shouldReduceMotion={shouldReduceMotion}
              onRequestClose={closeGallery}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
