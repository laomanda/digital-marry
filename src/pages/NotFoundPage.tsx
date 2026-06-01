import { useEffect, useState } from 'react'
import { motion, Variants } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { weddingData } from '../data/wedding.data'
import CustomCursor from '../components/layout/CustomCursor'
import GrainOverlay from '../components/layout/GrainOverlay'

export default function NotFoundPage() {
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setShouldReduceMotion(mediaQuery.matches)

    const handler = (e: MediaQueryListEvent) => setShouldReduceMotion(e.matches)
    mediaQuery.addEventListener('change', handler)

    // Optionally set document title
    document.title = '404 - Halaman Tidak Ditemukan'

    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    if (shouldReduceMotion) return

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [shouldReduceMotion])

  const handleReturn = () => {
    window.location.href = '/'
  }

  const coupleName = `${weddingData.groom.firstName} & ${weddingData.bride.firstName}`

  // Animation Variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } 
    },
  }

  const lineVariants: Variants = {
    hidden: { scaleX: 0, opacity: 0 },
    visible: { 
      scaleX: 1, 
      opacity: 1, 
      transition: { duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.8 } 
    },
  }

  return (
    <>
      <CustomCursor />
      <GrainOverlay />
      <div className="relative min-h-[100dvh] w-full bg-[#050505] text-[#F5F5F0] overflow-hidden flex items-center justify-center p-6 safe-area-padding cursor-none">
      
      {/* Interactive Spotlight (Only if motion is allowed) */}
      {!shouldReduceMotion && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-1000"
          animate={{
            background: `radial-gradient(800px circle at ${mousePos.x}px ${mousePos.y}px, rgba(245,245,240,0.035), transparent 40%)`
          }}
          transition={{ type: 'tween', ease: 'linear', duration: 0.1 }}
        />
      )}

      {/* Static Subtle Ambient Background Effects */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(245,245,240,0.015)_0%,transparent_100%)]" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(to_right,rgba(245,245,240,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(245,245,240,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_30%,transparent_100%)] opacity-20" aria-hidden="true" />

      {/* Giant Background Cursive 404 Ghost */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 3, ease: 'easeOut' }}
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-script text-[45vw] font-light leading-none text-[#F5F5F0]/[0.02] select-none z-0 mix-blend-screen" 
        style={{ fontFamily: "'Great Vibes', cursive" }}
        aria-hidden="true"
      >
        404
      </motion.div>

      <motion.main 
        className="relative z-10 w-full max-w-[720px]"
        variants={containerVariants}
        initial={shouldReduceMotion ? "visible" : "hidden"}
        animate="visible"
      >
        <div className="relative overflow-hidden text-center group">
          
          {/* Elegant Card Background with subtle hover effect */}
          <div className="absolute inset-0 border border-[#F5F5F0]/10 bg-[#F5F5F0]/[0.015] backdrop-blur-sm transition-colors duration-700 group-hover:bg-[#F5F5F0]/[0.025] group-hover:border-[#F5F5F0]/20" />
          
          <div className="relative p-10 md:p-16">
            {/* Animated Decorative Corners */}
            <motion.span className="absolute left-4 top-4 h-6 w-6 border-l border-t border-[#F5F5F0]/30" initial={{ opacity: 0, x: -10, y: -10 }} animate={{ opacity: 1, x: 0, y: 0 }} transition={{ duration: 1, delay: 1 }} aria-hidden="true" />
            <motion.span className="absolute right-4 top-4 h-6 w-6 border-r border-t border-[#F5F5F0]/30" initial={{ opacity: 0, x: 10, y: -10 }} animate={{ opacity: 1, x: 0, y: 0 }} transition={{ duration: 1, delay: 1 }} aria-hidden="true" />
            <motion.span className="absolute bottom-4 left-4 h-6 w-6 border-b border-l border-[#F5F5F0]/30" initial={{ opacity: 0, x: -10, y: 10 }} animate={{ opacity: 1, x: 0, y: 0 }} transition={{ duration: 1, delay: 1 }} aria-hidden="true" />
            <motion.span className="absolute bottom-4 right-4 h-6 w-6 border-b border-r border-[#F5F5F0]/30" initial={{ opacity: 0, x: 10, y: 10 }} animate={{ opacity: 1, x: 0, y: 0 }} transition={{ duration: 1, delay: 1 }} aria-hidden="true" />

            {/* Content */}
            <div className="flex flex-col items-center max-w-[480px] mx-auto">
              
              <motion.p variants={itemVariants} className="font-mono text-[10px] md:text-[11px] uppercase tracking-[0.4em] text-[#A4A4A4] mb-6">
                Halaman Tidak Ditemukan
              </motion.p>
              
              <motion.h1 variants={itemVariants} className="font-serif text-[110px] md:text-[160px] font-light leading-none tracking-tight text-[#F5F5F0] mb-2 drop-shadow-sm">
                404
              </motion.h1>

              {/* Elegant divider */}
              <motion.div variants={lineVariants} className="h-px w-24 bg-gradient-to-r from-transparent via-[#F5F5F0]/30 to-transparent my-6 origin-center" />
              
              <motion.h2 variants={itemVariants} className="font-serif text-[28px] md:text-[38px] font-light leading-[1.2] mb-6 italic text-[#F5F5F0]/90">
                Sepertinya Anda tersesat di antara cerita kami.
              </motion.h2>
              
              <motion.p variants={itemVariants} className="font-sans text-[13px] md:text-[14px] leading-relaxed tracking-wide text-[#A4A4A4] mb-12 font-light max-w-[85%]">
                Halaman yang Anda tuju tidak tersedia atau sudah berpindah.<br className="hidden md:block" /> Silakan kembali ke halaman utama undangan <span className="font-script text-[18px] not-italic text-[#F5F5F0]/80" style={{ fontFamily: "'Great Vibes', cursive" }}>{coupleName}</span>.
              </motion.p>

              <motion.button
                variants={itemVariants}
                onClick={handleReturn}
                className="group/btn relative inline-flex items-center justify-center gap-4 border border-[#F5F5F0]/20 bg-[#F5F5F0]/[0.02] px-8 py-4 font-mono text-[10px] uppercase tracking-[0.2em] text-[#F5F5F0] transition-all duration-500 hover:border-[#F5F5F0]/60 hover:bg-[#F5F5F0]/10 hover:shadow-[0_0_20px_rgba(245,245,240,0.05)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#F5F5F0] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505] overflow-hidden"
                aria-label="Kembali ke halaman utama undangan"
              >
                {/* Button shine effect */}
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[#F5F5F0]/10 to-transparent transition-transform duration-1000 ease-out group-hover/btn:translate-x-full" />
                
                <ArrowLeft size={14} className="relative z-10 transition-transform duration-300 group-hover/btn:-translate-x-1" strokeWidth={1.5} />
                <span className="relative z-10">Kembali ke Undangan</span>
              </motion.button>
              
            </div>
          </div>
        </div>
      </motion.main>
    </div>
    </>
  )
}
