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
      data-theme="dark"
      data-wow="true"
      className="relative overflow-hidden bg-[#050505] py-24 text-[#F5F5F0] md:py-32"
    >
      <div className="pointer-events-none absolute inset-0 opacity-45" aria-hidden="true">
        <div className="absolute left-1/2 top-1/2 h-[460px] w-[460px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#F5F5F0]/[0.055]" />
        <div className="absolute inset-x-0 top-1/2 h-px bg-[#F5F5F0]/[0.055]" />
      </div>

      <div className="container-base relative z-10">
        <div className="relative mx-auto flex min-h-[520px] max-w-5xl items-center justify-center overflow-hidden border border-[#F5F5F0]/10 bg-[#F5F5F0]/[0.018] px-6 py-20 text-center md:px-12">
          {images.length > 0 && (
            <div className="pointer-events-none absolute inset-x-[-8%] top-1/2 hidden -translate-y-1/2 gap-4 opacity-20 md:flex" aria-hidden="true">
              {images.slice(0, 5).map((image, index) => (
                <div
                  key={`${image.src}-${index}`}
                  className="h-[250px] flex-1 overflow-hidden border border-[#F5F5F0]/10"
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

          <div className="absolute inset-0 bg-[#050505]/72" aria-hidden="true" />
          <div className="pointer-events-none absolute left-0 top-0 h-3 w-3 border-l border-t border-[#F5F5F0]/30" aria-hidden="true" />
          <div className="pointer-events-none absolute right-0 top-0 h-3 w-3 border-r border-t border-[#F5F5F0]/30" aria-hidden="true" />
          <div className="pointer-events-none absolute bottom-0 left-0 h-3 w-3 border-b border-l border-[#F5F5F0]/20" aria-hidden="true" />
          <div className="pointer-events-none absolute bottom-0 right-0 h-3 w-3 border-b border-r border-[#F5F5F0]/20" aria-hidden="true" />

          <div className="relative z-10 mx-auto flex max-w-[620px] flex-col items-center">
            <span className="mb-5 font-mono text-[10px] uppercase text-[#A4A4A4]">
              Galeri
            </span>
            <h2 className="mb-6 font-serif text-[48px] font-light leading-[1.02] text-[#F5F5F0] md:text-[78px]">
              Momen Berharga
            </h2>
            <p className="mb-9 max-w-md text-[15px] leading-7 text-[#A4A4A4]">
              Beberapa potongan cerita yang kami simpan sebagai kenangan.
            </p>
            <button
              ref={entranceButtonRef}
              type="button"
              onClick={() => setIsGalleryOpen(true)}
              className="group inline-flex items-center gap-4 border border-[#F5F5F0]/16 px-6 py-4 font-mono text-[10px] uppercase text-[#F5F5F0] transition-colors duration-300 hover:border-[#F5F5F0]/45 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-[#F5F5F0]"
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
            className="fixed inset-0 z-[120] overflow-hidden bg-[#050505] text-[#F5F5F0]"
            role="dialog"
            aria-modal="true"
            aria-label="Galeri foto pernikahan"
          >
            <header className="pointer-events-none absolute left-5 top-5 z-[130] flex items-center gap-4 md:left-8 md:top-8">
              <button
                type="button"
                onClick={closeGallery}
                aria-label="Kembali dari galeri"
                className="pointer-events-auto border border-[#F5F5F0]/16 bg-[#050505]/72 px-5 py-3 font-mono text-[10px] uppercase text-[#F5F5F0] transition-colors duration-300 hover:border-[#F5F5F0]/45 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-[#F5F5F0]"
              >
                Kembali
              </button>
              <span className="pointer-events-auto hidden font-mono text-[10px] uppercase text-[#A4A4A4] sm:inline">
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
              overlayBlurColor="#050505"
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
