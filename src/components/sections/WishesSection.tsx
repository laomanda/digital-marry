import { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Quote } from 'lucide-react'
import { weddingData } from '../../data/wedding.data'
import { GuestWish } from '../../types/wish'
import { useReducedMotionSafe } from '../../hooks/useReducedMotionSafe'
import { cn } from '../../lib/utils'

interface WishesSectionProps {
  guestWishes?: GuestWish[]
}

export default function WishesSection({ guestWishes = [] }: WishesSectionProps) {
  const { shouldReduceMotion } = useReducedMotionSafe()

  // Merge live guest wishes with initial wedding data wishes
  const allWishes = useMemo(() => {
    // Map initial wishes to match GuestWish type structure if needed
    const mappedInitialWishes: GuestWish[] = weddingData.wishes.map((w) => ({
      id: w.id,
      name: w.name,
      message: w.message,
      attending: w.attending,
      time: w.time,
      source: 'seed',
    }))
    
    return [...guestWishes, ...mappedInitialWishes]
  }, [guestWishes])

  return (
    <section 
      id="wishes" 
      data-section 
      data-theme="dark" 
      data-global-reveal="true" 
      className="py-24 md:py-32 bg-[#050505] text-[#F5F5F0] overflow-hidden"
    >
      <div className="container-base">
        
        {/* Editorial Header */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-16 md:mb-24">
          <div data-animate="line" className="w-px h-16 bg-[rgba(245,245,240,0.15)] mb-8" aria-hidden="true" />
          <span data-animate="text" className="font-mono text-[9px] md:text-[10px] tracking-[0.4em] uppercase text-[#A4A4A4] mb-4">
            Guest Blessings
          </span>
          <h2 data-animate="title" className="font-serif text-[40px] md:text-[56px] text-[#F5F5F0] font-light leading-[1.1] mb-6">
            Doa &amp; <span className="italic text-[#A4A4A4]">Ucapan</span>
          </h2>
          <p data-animate="text" className="font-sans text-[13px] md:text-[14px] text-[#A4A4A4] leading-relaxed mb-6 max-w-md">
            Setiap doa dan harapan baik Anda adalah hadiah terindah yang akan selalu kami kenang dalam perjalanan ini.
          </p>
          <div data-animate="text" className="flex items-center gap-6 font-mono text-[10px] tracking-[0.2em] text-[#A4A4A4] border-t border-b border-[rgba(245,245,240,0.1)] py-3 px-6">
            <span>{allWishes.length} WISHES</span>
          </div>
        </div>

        {/* Wishes Wall (Masonry Layout) */}
        <div className="max-w-[1200px] mx-auto">
          {allWishes.length === 0 ? (
            <div className="text-center py-20 border border-[rgba(245,245,240,0.05)] bg-[rgba(245,245,240,0.01)] rounded-[2px]">
              <p className="font-sans text-[15px] text-[#A4A4A4] italic">Belum ada ucapan.</p>
            </div>
          ) : (
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 md:gap-8 space-y-6 md:space-y-8">
              <AnimatePresence initial={false}>
                {allWishes.map((wish) => {
                  const isNew = wish.source === 'rsvp'

                  return (
                    <motion.article
                      key={wish.id}
                      layout="position"
                      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : -20, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                      className="break-inside-avoid relative group flex flex-col p-8 md:p-10 bg-[rgba(245,245,240,0.02)] border border-[rgba(245,245,240,0.08)] hover:border-[rgba(245,245,240,0.22)] transition-colors duration-700 ease-out rounded-[2px] overflow-hidden"
                    >
                      {/* Decorative Background Quote */}
                      <div className="absolute -top-4 -right-4 opacity-5 group-hover:opacity-[0.08] transition-opacity duration-700 pointer-events-none transform -scale-x-100" aria-hidden="true">
                        <Quote size={120} strokeWidth={1} className="text-[#F5F5F0]" />
                      </div>
                      
                      {/* Subtle Spotlight Hover (CSS Only) */}
                      <div className="absolute inset-0 bg-gradient-to-br from-[rgba(245,245,240,0.03)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" aria-hidden="true" />

                      <div className="relative z-10 flex flex-col h-full">
                        <div className="flex items-start justify-between gap-4 mb-6">
                          <div className="flex flex-col gap-1.5">
                            <h3 className="font-sans text-[15px] text-[#F5F5F0] font-medium tracking-wide">
                              {wish.name}
                            </h3>
                            <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#777777]">
                              {wish.time}
                            </span>
                          </div>

                          <div className="flex flex-col items-end gap-2 shrink-0">
                            {isNew && (
                              <span 
                                role="status"
                                aria-label="Ucapan baru"
                                className="font-mono text-[8px] tracking-[0.3em] uppercase text-[#050505] bg-[#F5F5F0] px-2 py-1 rounded-[1px]"
                              >
                                Baru
                              </span>
                            )}
                            {wish.attending && (
                              <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#A4A4A4] border border-[rgba(245,245,240,0.15)] px-2 py-1">
                                Hadir
                              </span>
                            )}
                          </div>
                        </div>

                        <p className={cn(
                          "font-serif text-[18px] md:text-[20px] text-[rgba(245,245,240,0.75)] leading-[1.6] font-light",
                          isNew ? "italic text-[rgba(245,245,240,0.9)]" : ""
                        )}>
                          &ldquo;{wish.message}&rdquo;
                        </p>
                      </div>
                    </motion.article>
                  )
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
