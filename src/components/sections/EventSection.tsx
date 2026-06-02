import { useLayoutEffect, useRef, useState, memo, type RefObject } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, Calendar, Clock, MapPin } from 'lucide-react'
import eventBg from '../../assets/lainnya/bg-event.webp'
import galeri5 from '../../assets/lainnya/foto/galeri-5.webp'
import { weddingData } from '../../data/wedding.data'
import { useReducedMotionSafe } from '../../hooks/useReducedMotionSafe'
import { gsap, ScrollTrigger } from '../../lib/gsap'

type EventItem = (typeof weddingData.events)[number]

const parseDate = (dateStr: string) => {
  const parts = dateStr.split(',')
  const dayName = parts[0]?.trim().toUpperCase() || 'MINGGU'
  
  const rest = parts[1]?.trim() || ''
  const dateParts = rest.split(' ')
  const day = dateParts[0] || '14'
  const month = dateParts[1]?.toUpperCase() || 'JUNI'
  const year = dateParts[2] || '2026'

  return { dayName, day, month, year }
}

const formatAddress = (addressStr: string) => {
  if (addressStr.includes('Kabupaten')) {
    const parts = addressStr.split('Kabupaten')
    return (
      <>
        {parts[0]?.trim()} <br />
        Kabupaten {parts[1]?.trim()}
      </>
    )
  }
  return addressStr
}

interface MobileEventLayoutProps {
  events: EventItem[]
}

function MobileEventLayout({ events }: MobileEventLayoutProps) {
  return (
    <div className="w-full max-w-[540px] mx-auto px-4 py-8 lg:hidden">
      {events.map((event, index) => {
        const { dayName, day, month, year } = parseDate(event.date)
        const isAkad = event.id === 'akad'
        const title = isAkad ? 'HOLY MATRIMONY' : 'RECEPTION'

        return (
          <div key={event.id} className="flex flex-col items-center">
            {/* Event Title */}
            <h3 className="font-athene text-[20px] xs:text-[22px] sm:text-[24px] leading-tight text-[#F5F5F0] tracking-[0.08em] uppercase text-center mb-6 font-medium">
              {title}
            </h3>

            {/* Date and Time Grid */}
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 xs:gap-3 sm:gap-4 w-full max-w-[420px] mx-auto mb-6">
              {/* Left Column - Day */}
              <div className="border-y border-[#F5F5F0]/30 py-2 text-center flex items-center justify-center min-h-[34px] w-full">
                <span className="font-athene text-[8px] xs:text-[9px] tracking-[0.18em] text-[#F5F5F0]">
                  {dayName}
                </span>
              </div>

              {/* Center Column - Date Stack */}
              <div className="flex flex-col items-center justify-center px-3 sm:px-4 text-center min-w-[56px] xs:min-w-[64px]">
                <span className="font-athene text-[7px] xs:text-[8px] tracking-[0.25em] text-[#F5F5F0]/70 uppercase leading-none mb-1">
                  {month}
                </span>
                <span className="font-athene text-[20px] xs:text-[24px] sm:text-[28px] font-medium leading-none text-[#F5F5F0] py-0.5">
                  {day}
                </span>
                <span className="font-athene text-[7px] xs:text-[8px] tracking-[0.25em] text-[#F5F5F0]/70 uppercase leading-none mt-1">
                  {year}
                </span>
              </div>

              {/* Right Column - Time */}
              <div className="border-y border-[#F5F5F0]/30 py-2 text-center flex items-center justify-center min-h-[34px] w-full">
                <span className="font-montserrat text-[7px] xs:text-[8px] font-medium tracking-[0.05em] text-[#F5F5F0] whitespace-nowrap">
                  {event.time.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Address */}
            <div className="max-w-[340px] mx-auto text-center font-montserrat tracking-wide px-4">
              <p className="text-[10px] sm:text-[11px] font-semibold text-[#F5F5F0] mb-1">
                {event.venue}
              </p>
              <p className="text-[9px] sm:text-[10px] font-normal leading-[1.6] text-[#F5F5F0]/85">
                {formatAddress(event.address)}
              </p>
            </div>

            {/* Google Maps Button */}
            {event.mapsUrl && (
              <div className="mt-5 flex justify-center">
                <a
                  href={event.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center bg-[#F5F5F0]/20 backdrop-blur-sm hover:bg-[#F5F5F0]/30 active:scale-95 text-[#F5F5F0] px-5 py-2 rounded-full font-montserrat text-[8px] font-semibold tracking-[0.18em] transition-all duration-300"
                >
                  GOOGLE MAPS
                </a>
              </div>
            )}

            {/* Separator - show only between events */}
            {index < events.length - 1 && (
              <div className="flex justify-center my-10 w-full">
                <div className="h-16 w-[1.5px] bg-[#F5F5F0]/30" />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

interface EventCardProps {
  event: EventItem
  index: number
  isActive: boolean
  onSelect: () => void
  shouldReduceMotion: boolean
  compact?: boolean
}

interface CheckpointDotProps {
  isActive: boolean
  shouldReduceMotion: boolean
  className?: string
}

function CheckpointDot({ isActive, shouldReduceMotion, className = '' }: CheckpointDotProps) {
  return (
    <motion.span
      data-checkpoint-dot
      initial={false}
      animate={{ scale: shouldReduceMotion ? 1 : isActive ? 1.04 : 1 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={`pointer-events-none flex h-9 w-9 items-center justify-center rounded-full border transition-colors duration-500 ${
        isActive
          ? 'border-[#F5F5F0]/42 opacity-100'
          : 'border-[#F5F5F0]/24 opacity-60'
      } bg-[#050505] ${className}`}
      style={{ boxShadow: '0 0 0 7px #050505' }}
      aria-hidden="true"
    >
      <span
        className={`h-2 w-2 rounded-full transition-colors duration-500 ${
          isActive ? 'bg-[#F5F5F0]' : 'bg-[#A4A4A4]'
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
}: EventCardProps) {
  const number = String(index + 1).padStart(2, '0')

  return (
    <motion.article
      initial={false}
      animate={{
        y: shouldReduceMotion ? 0 : isActive ? -4 : 0,
        opacity: isActive ? 1 : 0.84,
        borderColor: isActive ? 'rgba(245,245,240,0.35)' : 'rgba(245,245,240,0.12)',
        backgroundColor: isActive ? 'rgba(5,5,5,0.62)' : 'rgba(5,5,5,0.50)',
      }}
      whileHover={shouldReduceMotion ? undefined : { y: -4, opacity: 1, borderColor: 'rgba(245,245,240,0.35)' }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={onSelect}
      onClick={onSelect}
      className={`group/card relative h-full overflow-hidden border text-left outline-none backdrop-blur-[2px] transition-colors duration-500 ${
        compact ? 'p-6 md:p-7' : 'p-8 lg:p-10 [@media(max-height:650px)]:p-6'
      }`}
    >
      <span
        className="pointer-events-none absolute right-4 top-1 font-athene text-[112px] leading-none text-[#F5F5F0]/[0.045] md:right-6 md:text-[148px] [@media(max-height:650px)]:text-[96px]"
        aria-hidden="true"
      >
        {number}
      </span>
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#F5F5F0]/[0.055] via-transparent to-transparent opacity-70"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/card:opacity-100"
        style={{ background: 'radial-gradient(circle at 22% 0%, rgba(245,245,240,0.08), transparent 42%)' }}
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute left-0 top-0 h-px w-10 bg-[#F5F5F0]/20 transition-all duration-500 group-hover/card:w-20 group-hover/card:bg-[#F5F5F0]/45" aria-hidden="true" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-px w-10 bg-[#F5F5F0]/15 transition-all duration-500 group-hover/card:w-20 group-hover/card:bg-[#F5F5F0]/35" aria-hidden="true" />
      <div className={`pointer-events-none absolute left-0 top-0 h-3 w-3 border-l border-t transition-opacity duration-500 ${isActive ? 'border-[#F5F5F0]/45 opacity-100' : 'border-[#F5F5F0]/20 opacity-0 group-hover/card:opacity-100'}`} aria-hidden="true" />
      <div className={`pointer-events-none absolute right-0 top-0 h-3 w-3 border-r border-t transition-opacity duration-500 ${isActive ? 'border-[#F5F5F0]/45 opacity-100' : 'border-[#F5F5F0]/20 opacity-0 group-hover/card:opacity-100'}`} aria-hidden="true" />
      <div className={`pointer-events-none absolute bottom-0 left-0 h-3 w-3 border-b border-l transition-opacity duration-500 ${isActive ? 'border-[#F5F5F0]/45 opacity-100' : 'border-[#F5F5F0]/20 opacity-0 group-hover/card:opacity-100'}`} aria-hidden="true" />
      <div className={`pointer-events-none absolute bottom-0 right-0 h-3 w-3 border-b border-r transition-opacity duration-500 ${isActive ? 'border-[#F5F5F0]/45 opacity-100' : 'border-[#F5F5F0]/20 opacity-0 group-hover/card:opacity-100'}`} aria-hidden="true" />

      <div className="relative z-10 flex h-full flex-col">
        <div className={`${compact ? 'mb-6' : 'mb-7'} flex items-start justify-between gap-5 [@media(max-height:650px)]:mb-5`}>
          <div>
            <span className="mb-4 block font-mono text-[10px] uppercase text-[#A4A4A4] transition-colors duration-500">
              Rangkaian {number}
            </span>
            <p className="mb-3 font-mono text-[10px] uppercase text-[#A4A4A4] transition-colors duration-500">
              {event.subtitle}
            </p>
            <h3 className={`${compact ? 'text-[34px] md:text-[42px]' : 'text-[38px] md:text-[48px]'} font-athene leading-[1.02] text-[#F5F5F0] [@media(max-height:650px)]:text-[34px]`}>
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
            className={`shrink-0 border px-3 py-2 font-mono text-[9px] uppercase transition-colors duration-300 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-[#F5F5F0] ${
              isActive
                ? 'border-[#F5F5F0]/35 text-[#F5F5F0]'
                : 'border-[#F5F5F0]/12 text-[#A4A4A4] hover:border-[#F5F5F0]/30 hover:text-[#F5F5F0]'
            }`}
          >
            {isActive ? 'Dipilih' : 'Pilih'}
          </button>
        </div>

        <div className={`${compact ? 'mt-6 gap-5 pt-6' : 'mt-8 gap-6 pt-7'} flex flex-col border-t [@media(max-height:650px)]:mt-5 [@media(max-height:650px)]:gap-4 [@media(max-height:650px)]:pt-5`}>
          <div className="grid grid-cols-[18px_1fr] gap-4">
            <Calendar size={16} strokeWidth={1.5} className="mt-0.5 text-[#A4A4A4] transition-colors duration-500" aria-hidden="true" />
            <dl>
              <dt className="mb-1 font-mono text-[9px] uppercase text-[#A4A4A4] transition-colors duration-500">Tanggal &amp; Waktu</dt>
              <dd className="font-montserrat text-[14px] font-semibold leading-6 text-[#F5F5F0]">{event.date}</dd>
              <dd className="mt-1 flex items-center gap-2 font-montserrat text-[14px] font-semibold leading-6 text-[#A4A4A4] transition-colors duration-500">
                <Clock size={14} strokeWidth={1.5} aria-hidden="true" />
                <span>{event.time}</span>
              </dd>
            </dl>
          </div>

          <div className="grid grid-cols-[18px_1fr] gap-4">
            <MapPin size={16} strokeWidth={1.5} className="mt-0.5 text-[#A4A4A4] transition-colors duration-500" aria-hidden="true" />
            <dl>
              <dt className="mb-1 font-mono text-[9px] uppercase text-[#A4A4A4] transition-colors duration-500">Lokasi</dt>
              <dd className="font-montserrat text-[14px] font-semibold leading-6 text-[#F5F5F0]">{event.venue}</dd>
              <dd className="mt-1 font-montserrat text-[13px] font-semibold leading-6 text-[#A4A4A4] transition-colors duration-500">{event.address}</dd>
            </dl>
          </div>
        </div>

        <div className={`${compact ? 'mt-6' : 'mt-8'} pt-2 [@media(max-height:650px)]:mt-5`}>
          <a
            href={event.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(eventClick) => eventClick.stopPropagation()}
            aria-label={`Lihat lokasi ${event.title} di Google Maps`}
            className={`group/link inline-flex items-center gap-3 border-b pb-2 font-mono text-[10px] uppercase transition-colors duration-500 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-[#F5F5F0] ${
              isActive
                ? 'border-[#F5F5F0]/45 text-[#F5F5F0]'
                : 'border-[#F5F5F0]/18 text-[#A4A4A4] hover:border-[#F5F5F0]/45 hover:text-[#F5F5F0]'
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
  stageRef: RefObject<HTMLDivElement>
  trackRef: RefObject<HTMLDivElement>
}

function HorizontalStage({
  events,
  activeEventId,
  setActiveEventId,
  shouldReduceMotion,
  stageRef,
  trackRef,
}: HorizontalStageProps) {
  const firstEvent = events[0]
  const secondEvent = events[1]

  if (!firstEvent || !secondEvent) return null

  return (
    <div className="gsap-pin-wrapper w-full relative">
      <div ref={stageRef} className="relative hidden h-[clamp(620px,82vh,780px)] min-h-[620px] overflow-x-hidden overflow-y-visible lg:block [@media(max-height:650px)]:h-[560px] [@media(max-height:650px)]:min-h-[560px]">
        <div
          ref={trackRef}
          data-horizontal-track
          className="relative flex h-full w-[210vw] transform-gpu items-start"
        >
          <svg
          className="pointer-events-none absolute left-0 top-[calc(clamp(84px,13vh,138px)-98px)] z-10 h-[220px] w-full [@media(max-height:650px)]:top-[-54px]"
          viewBox="0 0 2100 220"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            data-route-base
            d="M300 110 H370 M410 110 H520 C 650 110 670 72 790 72 C 910 72 930 110 1050 110 C 1170 110 1190 148 1310 148 C 1430 148 1460 110 1590 110 H1690 M1730 110 H1800"
            fill="none"
            stroke="rgba(245,245,240,0.14)"
            strokeWidth="1.8"
            className="transition-colors duration-500"
          />
          <path
            data-route-progress
            d="M300 110 H370 M410 110 H520 C 650 110 670 72 790 72 C 910 72 930 110 1050 110 C 1170 110 1190 148 1310 148 C 1430 148 1460 110 1590 110 H1690 M1730 110 H1800"
            fill="none"
            stroke="rgba(245,245,240,0.42)"
            strokeLinecap="round"
            strokeWidth="2"
            className="transition-colors duration-500"
          />
        </svg>

        <div
          data-date-marker
          className="absolute left-1/2 top-[clamp(36px,8vh,86px)] z-10 flex -translate-x-1/2 flex-col items-center text-center [@media(max-height:650px)]:top-[12px]"
        >
          <span className="mb-4 h-10 w-px bg-[#F5F5F0]/20 transition-colors duration-500" aria-hidden="true" />
          <span className="border border-[#F5F5F0]/14 bg-[#050505] px-6 py-4 font-mono text-[10px] uppercase text-[#F5F5F0] transition-colors duration-500">
            Akad menuju Resepsi
          </span>
          <span className="mt-4 h-10 w-px bg-[#F5F5F0]/20 transition-colors duration-500" aria-hidden="true" />
        </div>

        <div className="relative flex h-full w-[78vw] items-start justify-center pt-[calc(clamp(84px,13vh,138px)+34px)] [@media(max-height:650px)]:pt-[82px]">
          <div className="pointer-events-none absolute left-1/2 top-[clamp(84px,13vh,138px)] z-30 -translate-x-1/2 -translate-y-1/2 [@media(max-height:650px)]:top-[58px]" aria-hidden="true">
            <CheckpointDot
              isActive={activeEventId === firstEvent.id}
              shouldReduceMotion={shouldReduceMotion}
            />
          </div>
          <div data-event-card className="relative z-20 w-[min(560px,58vw)]">
            <EventCard
              event={firstEvent}
              index={0}
              isActive={activeEventId === firstEvent.id}
              onSelect={() => setActiveEventId(firstEvent.id)}
              shouldReduceMotion={shouldReduceMotion}
              compact
            />
          </div>
        </div>

        <div className="flex h-full w-[54vw] items-center justify-center">
          <div className="max-w-[520px] text-center">
            <span className="mb-5 block font-mono text-[10px] uppercase text-[#A4A4A4] transition-colors duration-500">
              Tanggal Acara
            </span>
            <p className="whitespace-nowrap font-athene text-[clamp(36px,4.2vw,56px)] leading-none text-[#F5F5F0]">
              {weddingData.wedding.dateFormatted}
            </p>
          </div>
        </div>

        <div className="relative flex h-full w-[78vw] items-start justify-center pt-[calc(clamp(84px,13vh,138px)+34px)] [@media(max-height:650px)]:pt-[82px]">
          <div className="pointer-events-none absolute left-1/2 top-[clamp(84px,13vh,138px)] z-30 -translate-x-1/2 -translate-y-1/2 [@media(max-height:650px)]:top-[58px]" aria-hidden="true">
            <CheckpointDot
              isActive={activeEventId === secondEvent.id}
              shouldReduceMotion={shouldReduceMotion}
            />
          </div>
          <div data-event-card className="relative z-20 w-[min(560px,58vw)]">
            <EventCard
              event={secondEvent}
              index={1}
              isActive={activeEventId === secondEvent.id}
              onSelect={() => setActiveEventId(secondEvent.id)}
              shouldReduceMotion={shouldReduceMotion}
              compact
            />
          </div>
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
}

function StaticTimeline({
  events,
  activeEventId,
  setActiveEventId,
  shouldReduceMotion,
  className = '',
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
          stroke="rgba(245,245,240,0.14)"
          strokeWidth="1.8"
          className="transition-colors duration-500"
        />
        <path
          d="M20 2 C 20 28 20 72 20 98"
          fill="none"
          stroke="rgba(245,245,240,0.42)"
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
              <CheckpointDot isActive={isActive} shouldReduceMotion={shouldReduceMotion} />
              <div data-event-card>
                <EventCard
                  event={event}
                  index={index}
                  isActive={isActive}
                  onSelect={() => setActiveEventId(event.id)}
                  shouldReduceMotion={shouldReduceMotion}
                  compact
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const EventSection = memo(function EventSection() {
  const events = weddingData.events ?? []
  const { shouldReduceHeavyMotion, shouldReduceMotion } = useReducedMotionSafe()
  const sectionRef = useRef<HTMLElement | null>(null)
  const stageRef = useRef<HTMLDivElement | null>(null)
  const trackRef = useRef<HTMLDivElement | null>(null)
  const [activeEventId, setActiveEventId] = useState(events[0]?.id || '')

  useLayoutEffect(() => {
    if (shouldReduceHeavyMotion) return

    const root = sectionRef.current
    const stage = stageRef.current
    const track = trackRef.current

    if (!root || !stage || !track) return

    const ctx = gsap.context(() => {
      const routeProgress = track.querySelector<SVGPathElement>('[data-route-progress]')
      const dateMarker = track.querySelector<HTMLElement>('[data-date-marker]')
      const routeLength = routeProgress?.getTotalLength() ?? 0
      const getDistance = () => Math.max(0, track.scrollWidth - stage.clientWidth)

      gsap.set(track, { x: 0, force3D: true })

      if (routeProgress && routeLength > 0) {
        gsap.set(routeProgress, {
          opacity: 0.72,
          strokeDasharray: routeLength,
          strokeDashoffset: routeLength,
        })
      }

      gsap.set(dateMarker, { opacity: 0.45, y: 12 })

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: stage,
          start: 'top top',
          end: () => `+=${Math.max(900, getDistance())}`,
          pin: true,
          pinSpacing: true,
          scrub: 0.85,
          anticipatePin: 0.8,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const nextEventId = self.progress < 0.58 ? events[0]?.id : events[1]?.id
            if (!nextEventId) return
            setActiveEventId((current) => (current === nextEventId ? current : nextEventId))
          },
        },
      })

      timeline
        .to(track, { x: () => -getDistance(), duration: 1, ease: 'none', force3D: true }, 0)
        .to(routeProgress, { strokeDashoffset: 0, duration: 1, ease: 'none' }, 0)
        .to(dateMarker, { opacity: 1, y: 0, duration: 0.3, ease: 'none' }, 0.34)
    }, sectionRef)

    const refreshId = window.requestAnimationFrame(() => ScrollTrigger.refresh())

    return () => {
      window.cancelAnimationFrame(refreshId)
      ctx.revert()
    }
  }, [events, shouldReduceHeavyMotion])

  return (
    <section
      ref={sectionRef}
      id="event"
      data-section
      data-theme="dark"
      className="relative overflow-hidden bg-[#050505] py-24 text-[#F5F5F0] transition-colors duration-500 md:py-32 lg:py-24"
    >
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
        {/* Mobile Background */}
        <img
          src={galeri5}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover object-center opacity-[0.34] lg:hidden"
          style={{ filter: 'grayscale(1) contrast(1.04) brightness(0.80)' }}
        />
        {/* Desktop Background */}
        <img
          src={eventBg}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover object-center opacity-[0.46] lg:opacity-[0.52] hidden lg:block"
          style={{ filter: 'grayscale(1) contrast(1.04) brightness(0.82)' }}
        />
        <div className="absolute inset-0 bg-[#050505]/72 transition-colors duration-500 md:bg-[#050505]/62 lg:bg-[#050505]/62" />
        <div
          className="absolute inset-0 transition-colors duration-500"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(5,5,5,0.15) 0%, rgba(5,5,5,0.80) 75%, #050505 100%)',
          }}
        />
      </div>
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[3] h-36 bg-gradient-to-b from-[#050505] via-[#050505]/70 to-transparent transition-colors duration-500 md:h-48" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] h-36 bg-gradient-to-t from-[#050505] via-[#050505]/70 to-transparent transition-colors duration-500 md:h-48" aria-hidden="true" />

      <div className="relative z-10">
        <div className="container-base hidden lg:block">
          <div className="mx-auto flex max-w-[720px] flex-col items-center text-center">
            <span className="mb-5 block font-mono text-[10px] uppercase text-[#A4A4A4] transition-colors duration-500">
              Rangkaian Acara
            </span>
            <h2 className="font-athene text-[44px] leading-[1.02] text-[#F5F5F0] md:text-[68px] lg:text-[82px]">
              Detail Acara
            </h2>
            <p className="mt-6 max-w-[560px] font-montserrat text-[15px] font-semibold leading-7 text-[#A4A4A4] transition-colors duration-500 md:text-[16px]">
              Dengan penuh sukacita, kami mengundang Anda untuk hadir dan memberikan doa restu.
            </p>
            <span className="mt-8 h-12 w-px bg-[#F5F5F0]/12 transition-colors duration-500 lg:h-9" aria-hidden="true" />
          </div>
        </div>

        {!shouldReduceHeavyMotion && (
          <HorizontalStage
            events={events}
            activeEventId={activeEventId}
            setActiveEventId={setActiveEventId}
            shouldReduceMotion={shouldReduceMotion}
            stageRef={stageRef}
            trackRef={trackRef}
          />
        )}
      </div>

      <div className="container-base relative z-10">
        {/* Mobile Redesigned Layout */}
        <MobileEventLayout events={events} />

        {/* Desktop Fallback Timeline (only shown if motion is reduced and screen is lg) */}
        {shouldReduceHeavyMotion && (
          <StaticTimeline
            events={events}
            activeEventId={activeEventId}
            setActiveEventId={setActiveEventId}
            shouldReduceMotion={shouldReduceMotion}
            className="mt-12 md:mt-16 hidden lg:block"
          />
        )}
      </div>
    </section>
  )
})

export default EventSection
