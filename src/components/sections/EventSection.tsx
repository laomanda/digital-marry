import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, Calendar, Clock, MapPin } from 'lucide-react'
import eventBg from '../../assets/lainnya/bg-event.webp'
import { weddingData } from '../../data/wedding.data'
import { useReducedMotionSafe } from '../../hooks/useReducedMotionSafe'
import { usePalette } from '../../hooks/usePalette'
import { gsap, ScrollTrigger } from '../../lib/gsap'

type EventItem = (typeof weddingData.events)[number]

interface EventCardProps {
  event: EventItem
  index: number
  isActive: boolean
  onSelect: () => void
  shouldReduceMotion: boolean
  compact?: boolean
  isBurgundy?: boolean
  isTaupe?: boolean
}

interface CheckpointDotProps {
  isActive: boolean
  shouldReduceMotion: boolean
  className?: string
  isBurgundy?: boolean
  isTaupe?: boolean
}

function CheckpointDot({ isActive, shouldReduceMotion, className = '', isBurgundy = false, isTaupe = false }: CheckpointDotProps) {
  return (
    <motion.span
      data-checkpoint-dot
      initial={false}
      animate={{ scale: shouldReduceMotion ? 1 : isActive ? 1.04 : 1 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={`pointer-events-none flex h-9 w-9 items-center justify-center rounded-full border transition-colors duration-500 ${
        isActive 
          ? (isTaupe ? 'border-[rgba(17,17,17,0.42)] opacity-100' : isBurgundy ? 'border-[rgba(245,245,240,0.42)] opacity-100' : 'border-[#F5F5F0]/42 opacity-100')
          : (isTaupe ? 'border-[rgba(17,17,17,0.24)] opacity-60' : isBurgundy ? 'border-[rgba(245,245,240,0.24)] opacity-60' : 'border-[#F5F5F0]/24 opacity-60')
      } ${isTaupe ? 'bg-[#C9AD8F]' : isBurgundy ? 'bg-[#2B1018]' : 'bg-[#050505]'} ${className}`}
      style={{ boxShadow: isTaupe ? '0 0 0 7px #C9AD8F' : isBurgundy ? '0 0 0 7px #4A1F2A' : '0 0 0 7px #050505' }}
      aria-hidden="true"
    >
      <span
        className={`h-2 w-2 rounded-full transition-colors duration-500 ${
          isActive 
            ? (isTaupe ? 'bg-[#111111]' : 'bg-[#F5F5F0]') 
            : (isTaupe ? 'bg-[rgba(17,17,17,0.58)]' : isBurgundy ? 'bg-[rgba(245,245,240,0.65)]' : 'bg-[#A4A4A4]')
        }`}
      />
    </motion.span>
  )
}

function EventCard({
  event,
  index,
  isActive,
  onSelect,
  shouldReduceMotion,
  compact = false,
  isBurgundy = false,
  isTaupe = false,
}: EventCardProps) {
  const number = String(index + 1).padStart(2, '0')

  return (
    <motion.article
      initial={false}
      animate={{
        y: shouldReduceMotion ? 0 : isActive ? -4 : 0,
        opacity: isActive ? 1 : 0.84,
        borderColor: isTaupe
          ? isActive ? 'rgba(17,17,17,0.34)' : 'rgba(17,17,17,0.16)'
          : isBurgundy 
            ? isActive ? 'rgba(245,245,240,0.35)' : 'rgba(245,245,240,0.16)'
            : isActive ? 'rgba(245,245,240,0.35)' : 'rgba(245,245,240,0.12)',
        backgroundColor: isTaupe
          ? isActive ? 'rgba(245,245,240,0.48)' : 'rgba(245,245,240,0.34)'
          : isBurgundy 
            ? isActive ? 'rgba(35,12,20,0.68)' : 'rgba(35,12,20,0.52)'
            : isActive ? 'rgba(5,5,5,0.62)' : 'rgba(5,5,5,0.50)',
      }}
      whileHover={shouldReduceMotion ? undefined : { y: -4, opacity: 1, borderColor: isTaupe ? 'rgba(17,17,17,0.34)' : isBurgundy ? 'rgba(245,245,240,0.35)' : 'rgba(245,245,240,0.35)' }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={onSelect}
      onClick={onSelect}
      className={`group/card relative h-full overflow-hidden border text-left outline-none backdrop-blur-[2px] transition-colors duration-500 ${
        compact ? 'p-6 md:p-8' : 'p-8 lg:p-10 [@media(max-height:650px)]:p-6'
      }`}
    >
      <span
        className={`pointer-events-none absolute right-4 top-1 font-serif text-[112px] leading-none md:right-6 md:text-[148px] [@media(max-height:650px)]:text-[96px] ${isTaupe ? 'text-[rgba(17,17,17,0.055)]' : 'text-[#F5F5F0]/[0.045]'}`}
        aria-hidden="true"
      >
        {number}
      </span>
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br via-transparent to-transparent opacity-70 ${isTaupe ? 'from-[rgba(17,17,17,0.035)]' : 'from-[#F5F5F0]/[0.055]'}`}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/card:opacity-100"
        style={{ background: isTaupe ? 'radial-gradient(circle at 22% 0%, rgba(17,17,17,0.055), transparent 42%)' : 'radial-gradient(circle at 22% 0%, rgba(245,245,240,0.08), transparent 42%)' }}
        aria-hidden="true"
      />
      <div className={`pointer-events-none absolute left-0 top-0 h-px w-10 transition-all duration-500 group-hover/card:w-20 ${isTaupe ? 'bg-[rgba(17,17,17,0.18)] group-hover/card:bg-[rgba(17,17,17,0.38)]' : 'bg-[#F5F5F0]/20 group-hover/card:bg-[#F5F5F0]/45'}`} aria-hidden="true" />
      <div className={`pointer-events-none absolute bottom-0 right-0 h-px w-10 transition-all duration-500 group-hover/card:w-20 ${isTaupe ? 'bg-[rgba(17,17,17,0.14)] group-hover/card:bg-[rgba(17,17,17,0.34)]' : 'bg-[#F5F5F0]/15 group-hover/card:bg-[#F5F5F0]/35'}`} aria-hidden="true" />
      <div className={`pointer-events-none absolute left-0 top-0 h-3 w-3 border-l border-t transition-opacity duration-500 ${isActive ? (isTaupe ? 'border-[rgba(17,17,17,0.40)] opacity-100' : 'border-[#F5F5F0]/45 opacity-100') : (isTaupe ? 'border-[rgba(17,17,17,0.18)] opacity-0 group-hover/card:opacity-100' : 'border-[#F5F5F0]/20 opacity-0 group-hover/card:opacity-100')}`} aria-hidden="true" />
      <div className={`pointer-events-none absolute right-0 top-0 h-3 w-3 border-r border-t transition-opacity duration-500 ${isActive ? (isTaupe ? 'border-[rgba(17,17,17,0.40)] opacity-100' : 'border-[#F5F5F0]/45 opacity-100') : (isTaupe ? 'border-[rgba(17,17,17,0.18)] opacity-0 group-hover/card:opacity-100' : 'border-[#F5F5F0]/20 opacity-0 group-hover/card:opacity-100')}`} aria-hidden="true" />
      <div className={`pointer-events-none absolute bottom-0 left-0 h-3 w-3 border-b border-l transition-opacity duration-500 ${isActive ? (isTaupe ? 'border-[rgba(17,17,17,0.40)] opacity-100' : 'border-[#F5F5F0]/45 opacity-100') : (isTaupe ? 'border-[rgba(17,17,17,0.18)] opacity-0 group-hover/card:opacity-100' : 'border-[#F5F5F0]/20 opacity-0 group-hover/card:opacity-100')}`} aria-hidden="true" />
      <div className={`pointer-events-none absolute bottom-0 right-0 h-3 w-3 border-b border-r transition-opacity duration-500 ${isActive ? (isTaupe ? 'border-[rgba(17,17,17,0.40)] opacity-100' : 'border-[#F5F5F0]/45 opacity-100') : (isTaupe ? 'border-[rgba(17,17,17,0.18)] opacity-0 group-hover/card:opacity-100' : 'border-[#F5F5F0]/20 opacity-0 group-hover/card:opacity-100')}`} aria-hidden="true" />

      <div className="relative z-10 flex h-full flex-col">
        <div className="mb-7 flex items-start justify-between gap-5 [@media(max-height:650px)]:mb-5">
          <div>
            <span className={`mb-4 block font-mono text-[10px] uppercase transition-colors duration-500 ${isTaupe ? 'text-[rgba(17,17,17,0.58)]' : isBurgundy ? 'text-[rgba(245,245,240,0.65)]' : 'text-[#A4A4A4]'}`}>
              Rangkaian {number}
            </span>
            <p className={`mb-3 font-mono text-[10px] uppercase transition-colors duration-500 ${isTaupe ? 'text-[rgba(17,17,17,0.58)]' : isBurgundy ? 'text-[rgba(245,245,240,0.65)]' : 'text-[#A4A4A4]'}`}>
              {event.subtitle}
            </p>
            <h3 className={`font-serif text-[38px] font-light leading-[1.02] md:text-[48px] [@media(max-height:650px)]:text-[36px] ${isTaupe ? 'text-[#111111]' : 'text-[#F5F5F0]'}`}>
              {event.title}
            </h3>
          </div>

          <button
            type="button"
            onClick={(eventClick) => {
              eventClick.stopPropagation()
              onSelect()
            }}
            aria-pressed={isActive}
            aria-label={`Pilih acara ${event.title}`}
            className={`shrink-0 border px-3 py-2 font-mono text-[9px] uppercase transition-colors duration-300 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 ${isTaupe ? 'focus-visible:outline-[rgba(17,17,17,0.50)]' : 'focus-visible:outline-[#F5F5F0]'} ${
              isActive
                ? (isTaupe ? 'border-[rgba(17,17,17,0.35)] text-[#111111]' : 'border-[#F5F5F0]/35 text-[#F5F5F0]')
                : (isTaupe ? 'border-[rgba(17,17,17,0.18)] text-[rgba(17,17,17,0.58)] hover:border-[rgba(17,17,17,0.34)] hover:text-[#111111]' : isBurgundy ? 'border-[#F5F5F0]/18 text-[rgba(245,245,240,0.65)] hover:border-[#F5F5F0]/35 hover:text-[#F5F5F0]' : 'border-[#F5F5F0]/12 text-[#A4A4A4] hover:border-[#F5F5F0]/30 hover:text-[#F5F5F0]')
            }`}
          >
            {isActive ? 'Dipilih' : 'Pilih'}
          </button>
        </div>

        <div className="mt-8 flex flex-col gap-6 border-t pt-7 [@media(max-height:650px)]:mt-5 [@media(max-height:650px)]:gap-4 [@media(max-height:650px)]:pt-5">
          <div className="grid grid-cols-[18px_1fr] gap-4">
            <Calendar size={16} strokeWidth={1.5} className={`mt-0.5 transition-colors duration-500 ${isTaupe ? 'text-[rgba(17,17,17,0.58)]' : isBurgundy ? 'text-[rgba(245,245,240,0.65)]' : 'text-[#A4A4A4]'}`} aria-hidden="true" />
            <dl>
              <dt className={`mb-1 font-mono text-[9px] uppercase transition-colors duration-500 ${isTaupe ? 'text-[rgba(17,17,17,0.58)]' : isBurgundy ? 'text-[rgba(245,245,240,0.65)]' : 'text-[#A4A4A4]'}`}>Tanggal &amp; Waktu</dt>
              <dd className={`text-[14px] leading-6 ${isTaupe ? 'text-[#111111]' : 'text-[#F5F5F0]'}`}>{event.date}</dd>
              <dd className={`mt-1 flex items-center gap-2 text-[14px] leading-6 transition-colors duration-500 ${isTaupe ? 'text-[rgba(17,17,17,0.58)]' : isBurgundy ? 'text-[rgba(245,245,240,0.65)]' : 'text-[#A4A4A4]'}`}>
                <Clock size={14} strokeWidth={1.5} aria-hidden="true" />
                <span>{event.time}</span>
              </dd>
            </dl>
          </div>

          <div className="grid grid-cols-[18px_1fr] gap-4">
            <MapPin size={16} strokeWidth={1.5} className={`mt-0.5 transition-colors duration-500 ${isTaupe ? 'text-[rgba(17,17,17,0.58)]' : isBurgundy ? 'text-[rgba(245,245,240,0.65)]' : 'text-[#A4A4A4]'}`} aria-hidden="true" />
            <dl>
              <dt className={`mb-1 font-mono text-[9px] uppercase transition-colors duration-500 ${isTaupe ? 'text-[rgba(17,17,17,0.58)]' : isBurgundy ? 'text-[rgba(245,245,240,0.65)]' : 'text-[#A4A4A4]'}`}>Lokasi</dt>
              <dd className={`text-[14px] font-medium leading-6 ${isTaupe ? 'text-[#111111]' : 'text-[#F5F5F0]'}`}>{event.venue}</dd>
              <dd className={`mt-1 text-[13px] leading-6 transition-colors duration-500 ${isTaupe ? 'text-[rgba(17,17,17,0.58)]' : isBurgundy ? 'text-[rgba(245,245,240,0.65)]' : 'text-[#A4A4A4]'}`}>{event.address}</dd>
            </dl>
          </div>
        </div>

        <div className="mt-8 pt-2 [@media(max-height:650px)]:mt-5">
          <a
            href={event.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(eventClick) => eventClick.stopPropagation()}
            aria-label={`Lihat lokasi ${event.title} di Google Maps`}
            className={`group/link inline-flex items-center gap-3 border-b pb-2 font-mono text-[10px] uppercase transition-colors duration-500 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 ${isTaupe ? 'focus-visible:outline-[rgba(17,17,17,0.50)]' : 'focus-visible:outline-[#F5F5F0]'} ${
              isActive
                ? (isTaupe ? 'border-[rgba(17,17,17,0.45)] text-[#111111]' : 'border-[#F5F5F0]/45 text-[#F5F5F0]')
                : (isTaupe ? 'border-[rgba(17,17,17,0.20)] text-[rgba(17,17,17,0.58)] hover:border-[rgba(17,17,17,0.45)] hover:text-[#111111]' : isBurgundy ? 'border-[rgba(245,245,240,0.25)] text-[rgba(245,245,240,0.65)] hover:border-[#F5F5F0]/45 hover:text-[#F5F5F0]' : 'border-[#F5F5F0]/18 text-[#A4A4A4] hover:border-[#F5F5F0]/45 hover:text-[#F5F5F0]')
            }`}
          >
            <span>Lihat Lokasi</span>
            <ArrowUpRight
              size={14}
              strokeWidth={1.5}
              className="transition-transform duration-300 group-hover/link:translate-x-1 group-hover/link:-translate-y-1"
              aria-hidden="true"
            />
          </a>
        </div>
      </div>
    </motion.article>
  )
}

interface HorizontalStageProps {
  events: EventItem[]
  activeEventId: string
  setActiveEventId: (id: string) => void
  shouldReduceMotion: boolean
  stageRef: React.RefObject<HTMLDivElement>
  trackRef: React.RefObject<HTMLDivElement>
  isBurgundy?: boolean
  isTaupe?: boolean
}

function HorizontalStage({
  events,
  activeEventId,
  setActiveEventId,
  shouldReduceMotion,
  stageRef,
  trackRef,
  isBurgundy = false,
  isTaupe = false,
}: HorizontalStageProps) {
  const firstEvent = events[0]
  const secondEvent = events[1]

  if (!firstEvent || !secondEvent) return null

  return (
    <div ref={stageRef} className="relative hidden h-[clamp(620px,82vh,760px)] min-h-[620px] overflow-x-hidden overflow-y-visible lg:block [@media(max-height:650px)]:h-[420px] [@media(max-height:650px)]:min-h-[420px]">
      <div
        ref={trackRef}
        data-horizontal-track
        className="relative flex h-full w-[210vw] items-start"
      >
        <svg
          className="pointer-events-none absolute left-0 top-[calc(clamp(96px,16vh,156px)-110px)] z-10 h-[220px] w-full [@media(max-height:650px)]:top-[-48px]"
          viewBox="0 0 2100 220"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            data-route-base
            d="M300 110 H370 M410 110 H520 C 650 110 670 72 790 72 C 910 72 930 110 1050 110 C 1170 110 1190 148 1310 148 C 1430 148 1460 110 1590 110 H1690 M1730 110 H1800"
            fill="none"
            stroke={isTaupe ? "rgba(17,17,17,0.18)" : isBurgundy ? "rgba(245,245,240,0.18)" : "rgba(245,245,240,0.14)"}
            strokeWidth="1.8"
            className="transition-colors duration-500"
          />
          <path
            data-route-progress
            d="M300 110 H370 M410 110 H520 C 650 110 670 72 790 72 C 910 72 930 110 1050 110 C 1170 110 1190 148 1310 148 C 1430 148 1460 110 1590 110 H1690 M1730 110 H1800"
            fill="none"
            opacity="0"
            stroke={isTaupe ? "rgba(17,17,17,0.48)" : isBurgundy ? "rgba(245,245,240,0.48)" : "rgba(245,245,240,0.42)"}
            strokeLinecap="round"
            strokeWidth="2"
            className="transition-colors duration-500"
          />
        </svg>

        <div
          data-date-marker
          className="absolute left-1/2 top-[clamp(52px,11vh,118px)] z-10 flex -translate-x-1/2 flex-col items-center text-center [@media(max-height:650px)]:top-[18px]"
        >
          <span className={`mb-4 h-10 w-px transition-colors duration-500 ${isTaupe ? 'bg-[rgba(17,17,17,0.22)]' : isBurgundy ? 'bg-[rgba(245,245,240,0.22)]' : 'bg-[#F5F5F0]/20'}`} aria-hidden="true" />
          <span className={`border px-6 py-4 font-mono text-[10px] uppercase transition-colors duration-500 ${isTaupe ? 'bg-[#C9AD8F] border-[rgba(17,17,17,0.18)] text-[#111111]' : isBurgundy ? 'bg-[#2B1018] border-[rgba(245,245,240,0.18)] text-[#F5F5F0]' : 'bg-[#050505] border-[#F5F5F0]/14 text-[#F5F5F0]'}`}>
            Akad menuju Resepsi
          </span>
          <span className={`mt-4 h-10 w-px transition-colors duration-500 ${isTaupe ? 'bg-[rgba(17,17,17,0.22)]' : isBurgundy ? 'bg-[rgba(245,245,240,0.22)]' : 'bg-[#F5F5F0]/20'}`} aria-hidden="true" />
        </div>

        <div className="relative flex h-full w-[78vw] items-start justify-center pt-[calc(clamp(96px,16vh,156px)+34px)] [@media(max-height:650px)]:pt-[96px]">
          <div className="pointer-events-none absolute left-1/2 top-[clamp(96px,16vh,156px)] z-30 -translate-x-1/2 -translate-y-1/2 [@media(max-height:650px)]:top-[62px]" aria-hidden="true">
            <CheckpointDot
              isActive={activeEventId === firstEvent.id}
              shouldReduceMotion={shouldReduceMotion}
              isBurgundy={isBurgundy}
              isTaupe={isTaupe}
            />
          </div>
          <div data-event-card className="relative z-20 w-[min(560px,58vw)]">
            <EventCard
              event={firstEvent}
              index={0}
              isActive={activeEventId === firstEvent.id}
              onSelect={() => setActiveEventId(firstEvent.id)}
              shouldReduceMotion={shouldReduceMotion}
              isBurgundy={isBurgundy}
              isTaupe={isTaupe}
            />
          </div>
        </div>

        <div className="flex h-full w-[54vw] items-center justify-center">
          <div className="max-w-[360px] text-center">
            <span className={`mb-5 block font-mono text-[10px] uppercase transition-colors duration-500 ${isTaupe ? 'text-[rgba(17,17,17,0.58)]' : isBurgundy ? 'text-[rgba(245,245,240,0.65)]' : 'text-[#A4A4A4]'}`}>
              Tanggal Acara
            </span>
            <p className={`font-serif text-[56px] font-light leading-none ${isTaupe ? 'text-[#111111]' : 'text-[#F5F5F0]'}`}>
              {weddingData.wedding.dateFormatted}
            </p>
          </div>
        </div>

        <div className="relative flex h-full w-[78vw] items-start justify-center pt-[calc(clamp(96px,16vh,156px)+34px)] [@media(max-height:650px)]:pt-[96px]">
          <div className="pointer-events-none absolute left-1/2 top-[clamp(96px,16vh,156px)] z-30 -translate-x-1/2 -translate-y-1/2 [@media(max-height:650px)]:top-[62px]" aria-hidden="true">
            <CheckpointDot
              isActive={activeEventId === secondEvent.id}
              shouldReduceMotion={shouldReduceMotion}
              isBurgundy={isBurgundy}
              isTaupe={isTaupe}
            />
          </div>
          <div data-event-card className="relative z-20 w-[min(560px,58vw)]">
            <EventCard
              event={secondEvent}
              index={1}
              isActive={activeEventId === secondEvent.id}
              onSelect={() => setActiveEventId(secondEvent.id)}
              shouldReduceMotion={shouldReduceMotion}
              isBurgundy={isBurgundy}
              isTaupe={isTaupe}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

interface StaticTimelineProps {
  events: EventItem[]
  activeEventId: string
  setActiveEventId: (id: string) => void
  shouldReduceMotion: boolean
  className?: string
  isBurgundy?: boolean
  isTaupe?: boolean
}

function StaticTimeline({
  events,
  activeEventId,
  setActiveEventId,
  shouldReduceMotion,
  className = '',
  isBurgundy = false,
  isTaupe = false,
}: StaticTimelineProps) {
  return (
    <div className={`relative mx-auto max-w-[760px] ${className}`}>
      <svg
        className="pointer-events-none absolute bottom-0 left-0 top-0 z-0 h-full w-10"
        viewBox="0 0 40 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M20 2 C 20 28 20 72 20 98"
          fill="none"
          stroke={isTaupe ? "rgba(17,17,17,0.18)" : isBurgundy ? "rgba(245,245,240,0.18)" : "rgba(245,245,240,0.14)"}
          strokeWidth="1.8"
          className="transition-colors duration-500"
        />
        <path
          d="M20 2 C 20 28 20 72 20 98"
          fill="none"
          stroke={isTaupe ? "rgba(17,17,17,0.48)" : isBurgundy ? "rgba(245,245,240,0.48)" : "rgba(245,245,240,0.42)"}
          strokeLinecap="round"
          strokeWidth="2"
          className="transition-colors duration-500"
        />
      </svg>

      <div className="relative z-10 grid gap-10">
        {events.map((event, index) => {
          const isActive = activeEventId === event.id

          return (
            <div key={event.id} className="grid grid-cols-[40px_1fr] gap-4">
              <CheckpointDot isActive={isActive} shouldReduceMotion={shouldReduceMotion} isBurgundy={isBurgundy} isTaupe={isTaupe} />
              <div data-event-card>
                <EventCard
                  event={event}
                  index={index}
                  isActive={isActive}
                  onSelect={() => setActiveEventId(event.id)}
                  shouldReduceMotion={shouldReduceMotion}
                  compact
                  isBurgundy={isBurgundy}
                  isTaupe={isTaupe}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function EventSection() {
  const events = weddingData.events ?? []
  const { shouldReduceMotion } = useReducedMotionSafe()
  const sectionRef = useRef<HTMLElement | null>(null)
  const bgImgRef = useRef<HTMLImageElement | null>(null)
  const stageRef = useRef<HTMLDivElement | null>(null)
  const trackRef = useRef<HTMLDivElement | null>(null)
  const [activeEventId, setActiveEventId] = useState(events[0]?.id || '')

  const { palette } = usePalette();
  const isBurgundy = palette === 'burgundy';
  const isTaupe = palette === 'taupe';

  useEffect(() => {
    if (!sectionRef.current || shouldReduceMotion) return

    let media: ReturnType<typeof gsap.matchMedia> | null = null

    const ctx = gsap.context(() => {
      media = gsap.matchMedia()

      media.add('(min-width: 1024px)', () => {
        const root = sectionRef.current
        const bgImg = bgImgRef.current
        const stage = stageRef.current
        const track = trackRef.current

        if (!root || !bgImg || !stage || !track) return undefined

        const header = root.querySelector<HTMLElement>('[data-route-header]')
        const routeBase = track.querySelector<SVGPathElement>('[data-route-base]')
        const routeProgress = track.querySelector<SVGPathElement>('[data-route-progress]')
        const dateMarker = track.querySelector<HTMLElement>('[data-date-marker]')
        const cards = Array.from(track.querySelectorAll<HTMLElement>('[data-event-card]'))

        if (!routeProgress) return undefined

        const routeLength = routeProgress.getTotalLength()

        gsap.set(header, { opacity: 0, y: 28 })
        gsap.set(routeBase, { opacity: 1 })
        gsap.set(routeProgress, {
          opacity: 0,
          strokeDasharray: routeLength,
          strokeDashoffset: routeLength,
        })
        gsap.set(dateMarker, { opacity: 0.24, y: 20 })
        gsap.set(cards, { opacity: 0.78, y: 0 })
        gsap.to(header, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: root,
            start: 'top 75%',
            once: true,
          },
        })

        const getDistance = () => Math.max(0, track.scrollWidth - stage.clientWidth)

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: stage,
            start: 'top top',
            end: () => `+=${Math.max(900, getDistance())}`,
            pin: true,
            scrub: 1.1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const nextEventId = self.progress < 0.58 ? events[0]?.id : events[1]?.id
              if (!nextEventId) return
              setActiveEventId((current) => (current === nextEventId ? current : nextEventId))
            },
          },
        })

        timeline
          .to(track, { x: () => -getDistance(), duration: 1, ease: 'none' }, 0)
          .fromTo(
            bgImg,
            { xPercent: -57, scale: 1.02 },
            { xPercent: -43, scale: 1.02, duration: 1, ease: 'none' },
            0
          )
          .to(routeProgress, { opacity: 1, duration: 0.08, ease: 'none' }, 0)
          .to(routeProgress, { strokeDashoffset: 0, duration: 1, ease: 'none' }, 0)
          .to(dateMarker, { opacity: 1, y: 0, duration: 0.24, ease: 'none' }, 0.34)

        ScrollTrigger.refresh()

        return () => {
          timeline.scrollTrigger?.kill()
          timeline.kill()
        }
      })
    }, sectionRef)

    return () => {
      media?.revert()
      ctx.revert()
    }
  }, [events, shouldReduceMotion])

  return (
    <section
      ref={sectionRef}
      id="event"
      data-section
      data-theme="dark"
      data-global-reveal="true"
      className={`relative overflow-hidden py-24 md:py-32 lg:py-24 [@media(max-height:650px)]:py-8 transition-colors duration-500 ${isTaupe ? 'bg-[#C9AD8F] text-[#111111]' : isBurgundy ? 'bg-[#4A1F2A] text-[#F5F5F0]' : 'bg-[#050505] text-[#F5F5F0]'}`}
    >
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
        <img
          ref={bgImgRef}
          src={eventBg}
          alt=""
          aria-hidden="true"
          className={`absolute left-1/2 top-0 h-full max-w-none object-cover object-center will-change-transform max-lg:w-[115vw] max-lg:-translate-x-1/2 ${isTaupe ? 'max-lg:opacity-[0.34] lg:opacity-[0.42]' : 'max-lg:opacity-[0.34] lg:opacity-[0.52]'} lg:w-[140vw]`}
          style={{ filter: isTaupe ? 'grayscale(1) contrast(1.02) brightness(1.06)' : 'grayscale(1) contrast(1.04) brightness(0.82)' }}
        />
        <div className={`absolute inset-0 transition-colors duration-500 ${isTaupe ? 'bg-[rgba(201,173,143,0.72)] md:bg-[rgba(201,173,143,0.64)]' : isBurgundy ? 'bg-[rgba(74,31,42,0.72)] md:bg-[rgba(74,31,42,0.68)]' : 'bg-[#050505]/72 md:bg-[#050505]/62'}`} />
        <div
          className="absolute inset-0 transition-colors duration-500"
          style={{
            background: isTaupe
              ? 'radial-gradient(ellipse at center, rgba(201,173,143,0.20) 0%, rgba(201,173,143,0.78) 72%, #C9AD8F 100%)'
              : isBurgundy
                ? 'radial-gradient(ellipse at center, rgba(74,31,42,0.20) 0%, rgba(74,31,42,0.76) 72%, #4A1F2A 100%)'
                : 'radial-gradient(ellipse at center, rgba(5,5,5,0.18) 0%, rgba(5,5,5,0.78) 72%, #050505 100%)',
          }}
        />
      </div>
      <div className={`pointer-events-none absolute inset-x-0 top-0 z-[3] h-36 transition-colors duration-500 md:h-48 ${isTaupe ? 'bg-gradient-to-b from-[#C9AD8F] via-[rgba(201,173,143,0.70)] to-transparent' : isBurgundy ? 'bg-gradient-to-b from-[#4A1F2A] via-[#4A1F2A]/70 to-transparent' : 'bg-gradient-to-b from-[#050505] via-[#050505]/70 to-transparent'}`} aria-hidden="true" />
      <div className={`pointer-events-none absolute inset-x-0 bottom-0 z-[3] h-36 transition-colors duration-500 md:h-48 ${isTaupe ? 'bg-gradient-to-t from-[#C9AD8F] via-[rgba(201,173,143,0.70)] to-transparent' : isBurgundy ? 'bg-gradient-to-t from-[#4A1F2A] via-[#4A1F2A]/70 to-transparent' : 'bg-gradient-to-t from-[#050505] via-[#050505]/70 to-transparent'}`} aria-hidden="true" />

      <div className="relative z-10">
        <div className="container-base">
          <div data-route-header className="mx-auto mb-12 flex max-w-[720px] flex-col items-center text-center md:mb-14 lg:mb-0 [@media(max-height:650px)]:max-w-[600px]">
            <span className={`mb-5 block font-mono text-[10px] uppercase transition-colors duration-500 [@media(max-height:650px)]:mb-2 [@media(max-height:650px)]:text-[9px] ${isTaupe ? 'text-[rgba(17,17,17,0.58)]' : isBurgundy ? 'text-[rgba(245,245,240,0.65)]' : 'text-[#A4A4A4]'}`}>
              Rangkaian Acara
            </span>
            <h2 className={`font-serif text-[44px] font-light leading-[1.02] md:text-[68px] lg:text-[82px] [@media(max-height:650px)]:text-[50px] ${isTaupe ? 'text-[#111111]' : 'text-[#F5F5F0]'}`}>
              Detail Acara
            </h2>
            <p className={`mt-6 max-w-[560px] text-[15px] leading-7 transition-colors duration-500 md:text-[16px] [@media(max-height:650px)]:mt-3 [@media(max-height:650px)]:max-w-[480px] [@media(max-height:650px)]:text-[13px] [@media(max-height:650px)]:leading-5 ${isTaupe ? 'text-[rgba(17,17,17,0.58)]' : isBurgundy ? 'text-[rgba(245,245,240,0.65)]' : 'text-[#A4A4A4]'}`}>
              Dengan penuh sukacita, kami mengundang Anda untuk hadir dan memberikan doa restu.
            </p>
            <span className={`mt-8 hidden h-12 w-px transition-colors duration-500 lg:block [@media(max-height:650px)]:mt-5 [@media(max-height:650px)]:h-7 ${isTaupe ? 'bg-[rgba(17,17,17,0.18)]' : isBurgundy ? 'bg-[rgba(245,245,240,0.18)]' : 'bg-[#F5F5F0]/12'}`} aria-hidden="true" />
          </div>
        </div>

        {!shouldReduceMotion && (
          <HorizontalStage
            events={events}
            activeEventId={activeEventId}
            setActiveEventId={setActiveEventId}
            shouldReduceMotion={shouldReduceMotion}
            stageRef={stageRef}
            trackRef={trackRef}
            isBurgundy={isBurgundy}
            isTaupe={isTaupe}
          />
        )}

        <div className="container-base">
          <StaticTimeline
            events={events}
            activeEventId={activeEventId}
            setActiveEventId={setActiveEventId}
            shouldReduceMotion={shouldReduceMotion}
            className={shouldReduceMotion ? 'block' : 'lg:hidden'}
            isBurgundy={isBurgundy}
            isTaupe={isTaupe}
          />
        </div>
      </div>
    </section>
  )
}
