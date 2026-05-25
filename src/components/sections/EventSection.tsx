import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { weddingData } from '../../data/wedding.data'
import { useReducedMotionSafe } from '../../hooks/useReducedMotionSafe'

interface SpotlightEventCardProps {
  event: typeof weddingData.events[0]
  index: number
  isActive: boolean
  onSelect: () => void
  shouldReduceMotion: boolean
}

function SpotlightEventCard({ event, index, isActive, onSelect, shouldReduceMotion }: SpotlightEventCardProps) {
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (shouldReduceMotion) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`)
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`)
  }

  return (
    <article
      className={`group relative flex flex-col h-full border transition-all duration-700 ease-out rounded-[2px] overflow-hidden ${
        isActive 
          ? 'bg-[rgba(245,245,240,0.035)] border-[rgba(245,245,240,0.30)] opacity-100 shadow-[0_0_40px_rgba(245,245,240,0.02)]' 
          : 'bg-[rgba(245,245,240,0.02)] border-[rgba(245,245,240,0.10)] opacity-[0.84] hover:opacity-100 hover:border-[rgba(245,245,240,0.22)]'
      }`}
      onMouseMove={handleMouseMove}
      data-animate="card"
    >
      {/* Spotlight Hover Effect */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-0"
        style={{
          background: `radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(245,245,240,0.12), transparent 40%)`
        }}
        aria-hidden="true"
      />

      {/* Decorative Corner Marks & Active Hairline */}
      {isActive && (
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(245,245,240,0.3)] to-transparent opacity-60 z-10" aria-hidden="true" />
      )}
      <div className={`absolute top-0 left-0 w-2 h-2 border-t border-l pointer-events-none z-10 transition-colors duration-700 ${isActive ? 'border-[rgba(245,245,240,0.4)]' : 'border-[rgba(245,245,240,0.2)] group-hover:border-[rgba(245,245,240,0.3)]'}`} aria-hidden="true" />
      <div className={`absolute top-0 right-0 w-2 h-2 border-t border-r pointer-events-none z-10 transition-colors duration-700 ${isActive ? 'border-[rgba(245,245,240,0.4)]' : 'border-[rgba(245,245,240,0.2)] group-hover:border-[rgba(245,245,240,0.3)]'}`} aria-hidden="true" />
      <div className={`absolute bottom-0 left-0 w-2 h-2 border-b border-l pointer-events-none z-10 transition-colors duration-700 ${isActive ? 'border-[rgba(245,245,240,0.4)]' : 'border-[rgba(245,245,240,0.2)] group-hover:border-[rgba(245,245,240,0.3)]'}`} aria-hidden="true" />
      <div className={`absolute bottom-0 right-0 w-2 h-2 border-b border-r pointer-events-none z-10 transition-colors duration-700 ${isActive ? 'border-[rgba(245,245,240,0.4)]' : 'border-[rgba(245,245,240,0.2)] group-hover:border-[rgba(245,245,240,0.3)]'}`} aria-hidden="true" />

      {/* Selection Area (Button) */}
      <button
        onClick={onSelect}
        aria-pressed={isActive}
        aria-label={`Pilih acara ${event.title}`}
        className="relative z-10 w-full text-left p-8 md:p-12 pb-4 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#F5F5F0] focus-visible:ring-inset"
      >
        <div className="flex items-center gap-4 mb-5">
          <span className={`font-mono text-[10px] tracking-[0.2em] transition-colors duration-500 ${isActive ? 'text-[#F5F5F0]' : 'text-[#777777]'}`}>
            {String(index + 1).padStart(2, '0')} /
          </span>
          <span className={`font-mono text-[9px] tracking-[0.3em] uppercase transition-colors duration-500 ${isActive ? 'text-[#A4A4A4]' : 'text-[#777777]'}`}>
            {event.subtitle}
          </span>
        </div>
        <h3 className={`font-serif text-[32px] md:text-[40px] font-light leading-tight transition-colors duration-500 ${isActive ? 'text-[#F5F5F0]' : 'text-[#A4A4A4] group-hover:text-[#F5F5F0]'}`}>
          {event.title}
        </h3>
      </button>

      {/* Detail Rows (Always Visible) */}
      <div className="relative z-20 px-8 md:px-12 pb-8 md:pb-12 flex-grow flex flex-col justify-between">
        <motion.div
          initial={false}
          animate={{ 
            opacity: isActive ? 1 : 0.75, 
            y: shouldReduceMotion ? 0 : (isActive ? 0 : 4) 
          }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="flex flex-col gap-6 flex-grow"
        >
          <div className="flex flex-col border-t border-[rgba(245,245,240,0.08)] pt-6 gap-5">
            {/* Date & Time */}
            <div className="flex flex-col gap-1.5">
              <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#777777]">Date & Time</span>
              <span className="font-sans text-[14px] text-[#F5F5F0] tracking-wide">{event.date}</span>
              <span className="font-sans text-[14px] text-[#A4A4A4] tracking-wide">{event.time}</span>
            </div>

            {/* Venue & Address */}
            <div className="flex flex-col gap-1.5 mt-2">
              <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#777777]">Venue</span>
              <span className="font-sans text-[14px] text-[#F5F5F0] font-medium tracking-wide">{event.venue}</span>
              <span className="font-sans text-[13px] text-[#A4A4A4] leading-relaxed max-w-sm">{event.address}</span>
            </div>
          </div>
        </motion.div>

        {/* Magnetic-style Maps CTA */}
        <div className="mt-8 flex justify-start">
          <a
            href={event.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Lihat lokasi ${event.title} di Google Maps`}
            className="group/link inline-flex items-center gap-3 pb-2 border-b border-[rgba(245,245,240,0.15)] hover:border-[#F5F5F0] transition-colors duration-500 focus-visible:outline-none focus-visible:border-[#F5F5F0]"
          >
            <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#A4A4A4] group-hover/link:text-[#F5F5F0] transition-colors duration-500">
              Lihat Lokasi
            </span>
            <ArrowUpRight size={14} strokeWidth={1.5} className="text-[#777777] group-hover/link:text-[#F5F5F0] transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-all duration-500" aria-hidden="true" />
          </a>
        </div>
      </div>
    </article>
  )
}

export default function EventSection() {
  const events = weddingData.events ?? []
  const { shouldReduceMotion } = useReducedMotionSafe()
  
  const [activeEventId, setActiveEventId] = useState(events[0]?.id || '')

  return (
    <section 
      id="event" 
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
            The Ceremony
          </span>
          <h2 data-animate="title" className="font-serif text-[40px] md:text-[56px] text-[#F5F5F0] font-light leading-[1.1] mb-6">
            Detail <span className="italic text-[#A4A4A4]">Acara</span>
          </h2>
          <p data-animate="text" className="font-sans text-[13px] md:text-[14px] text-[#A4A4A4] leading-relaxed mb-8 max-w-md">
            Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu.
          </p>
        </div>

        {/* Spotlight Ceremony Cards Board */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 max-w-[1100px] mx-auto lg:items-start">
          {events.map((event, index) => (
            <div 
              key={event.id} 
              className={index === 1 ? 'lg:mt-12' : ''} // Staggered overlap for editorial feel
            >
              <SpotlightEventCard
                event={event}
                index={index}
                isActive={activeEventId === event.id}
                onSelect={() => setActiveEventId(event.id)}
                shouldReduceMotion={shouldReduceMotion}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
