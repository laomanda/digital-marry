import { useRef, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { gsap } from '../../lib/gsap'
import { weddingData } from '../../data/wedding.data'
import { useReducedMotionSafe } from '../../hooks/useReducedMotionSafe'
import { cn } from '../../lib/utils'

export default function GallerySection() {
  const sectionRef = useRef<HTMLElement>(null)
  const { shouldReduceMotion } = useReducedMotionSafe()
  const [selectedImage, setSelectedImage] = useState<typeof weddingData.gallery[0] | null>(null)

  // GSAP Scroll Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.gallery-item').forEach((item, i) => {
        // Safe Reveal Animation
        gsap.fromTo(
          item,
          { opacity: 0, scale: shouldReduceMotion ? 1 : 1.08, y: shouldReduceMotion ? 0 : 48 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 1.2,
            ease: 'power3.out',
            delay: shouldReduceMotion ? 0 : (i % 3) * 0.1,
            scrollTrigger: { trigger: item, start: 'top 90%' },
          }
        )

        // Parallax Effect (Only for non-reduced motion on screens >= 768px)
        if (!shouldReduceMotion && window.innerWidth >= 768) {
          const img = item.querySelector('img')
          if (img) {
            const speed = i % 3 === 0 ? -30 : i % 3 === 1 ? 25 : -15
            gsap.fromTo(
              img,
              { yPercent: speed * -1 },
              {
                yPercent: speed,
                ease: 'none',
                scrollTrigger: {
                  trigger: item,
                  start: 'top bottom',
                  end: 'bottom top',
                  scrub: 1.5,
                },
              }
            )
          }
        }
      })
    }, sectionRef)
    
    return () => ctx.revert()
  }, [shouldReduceMotion])

  // Body Scroll Lock & Escape Key for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedImage(null)
    }

    if (selectedImage) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedImage])

  return (
    <section 
      id="gallery" 
      ref={sectionRef} 
      data-section 
      data-theme="dark"
      data-wow="true" 
      className="py-24 md:py-32 bg-[#050505] overflow-hidden"
    >
      <div className="container-base max-w-[1200px] mx-auto">
        
        {/* Editorial Header */}
        <div className="flex flex-col md:flex-row items-start justify-between gap-8 md:gap-12 mb-16 md:mb-24">
          <div className="flex flex-col gap-4 max-w-md">
            <span className="font-mono text-[9px] md:text-[10px] tracking-[0.4em] uppercase text-[#A4A4A4]">
              06 / MEMORY WALL
            </span>
            <h2 className="font-serif text-[40px] md:text-[56px] text-[#F5F5F0] font-light leading-[1.1]">
              Momen <span className="italic text-[#A4A4A4]">Berharga</span>
            </h2>
          </div>
          
          <div className="flex flex-col gap-4 max-w-[280px] md:text-right md:items-end">
            <p className="font-sans text-[13px] md:text-[14px] text-[#A4A4A4] leading-relaxed">
              Momen berharga sebelum hari bahagia. Kisah yang tersimpan dalam balutan waktu.
            </p>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 lg:gap-6">
          {weddingData.gallery.length > 0 ? (
            weddingData.gallery.map((img, idx) => {
              // Numbering formatting
              const itemNumber = (idx + 1).toString().padStart(2, '0')
              
              return (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => setSelectedImage(img)}
                  aria-label={`Lihat gambar: ${img.alt}`}
                  className={cn(
                    "gallery-item relative overflow-hidden group w-full border border-[rgba(245,245,240,0.05)] bg-[rgba(245,245,240,0.01)] text-left focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#F5F5F0]",
                    img.span === 'tall' ? 'sm:row-span-2' : img.span === 'wide' ? 'sm:col-span-2' : ''
                  )}
                  style={{ aspectRatio: img.span === 'tall' ? '3/4' : img.span === 'wide' ? '16/9' : '4/5' }}
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    className={cn(
                      "w-full h-full object-cover grayscale transition-all duration-700 ease-out",
                      "group-hover:scale-[1.04] group-hover:brightness-110"
                    )}
                  />
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none flex flex-col justify-between p-5 md:p-6">
                    {/* Top Meta */}
                    <span className="font-mono text-[9px] tracking-[0.2em] text-[#F5F5F0]/60 transform -translate-y-2 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                      {itemNumber}
                    </span>
                    
                    {/* Bottom Caption */}
                    <span className="font-mono text-[9px] md:text-[10px] tracking-[0.3em] uppercase text-[#F5F5F0] transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                      {img.alt}
                    </span>
                  </div>
                </button>
              )
            })
          ) : (
            <div className="col-span-full py-20 text-center border border-[rgba(245,245,240,0.05)]">
              <p className="font-sans text-[14px] text-[#A4A4A4] italic">Gallery will be available soon.</p>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox / Preview Modal */}
      <AnimatePresence>
        {selectedImage && (
          <div 
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12"
            role="dialog"
            aria-modal="true"
            aria-label={`Preview: ${selectedImage.alt}`}
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 bg-[#050505]/95 backdrop-blur-sm cursor-pointer"
              onClick={() => setSelectedImage(null)}
              aria-hidden="true"
            />
            
            {/* Content Container */}
            <motion.div
              initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.98, y: shouldReduceMotion ? 0 : 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.98, y: shouldReduceMotion ? 0 : 20 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} // smooth apple-like ease
              className="relative w-full h-full max-w-5xl flex flex-col items-center justify-center pointer-events-none"
            >
              <img 
                src={selectedImage.src} 
                alt={selectedImage.alt}
                className="w-full h-full max-h-[85vh] object-contain grayscale pointer-events-auto shadow-2xl"
              />
              <div className="absolute bottom-4 md:bottom-0 left-0 right-0 text-center pointer-events-none">
                <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#F5F5F0]/70 bg-[#050505]/50 px-4 py-2 backdrop-blur-md">
                  {selectedImage.alt}
                </span>
              </div>
            </motion.div>

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedImage(null)}
              aria-label="Tutup galeri"
              className="absolute top-6 right-6 p-4 text-[#A4A4A4] hover:text-[#F5F5F0] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#F5F5F0] z-[101]"
            >
              <X size={24} strokeWidth={1.5} />
            </button>
          </div>
        )}
      </AnimatePresence>
    </section>
  )
}
