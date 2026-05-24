import { MapPin, Clock, Calendar } from 'lucide-react'
import { weddingData } from '../../data/wedding.data'

export default function EventSection() {
  return (
    <section id="event" data-section data-theme="light" data-global-reveal="true" className="section-padding bg-[#0a0a0a]">
      <div className="container-base">
        {/* Title */}
        <div data-animate="title" className="text-center mb-20">
          <span className="label-caps text-muted-gray tracking-[0.35em] block mb-4">Save the Date</span>
          <h2
            style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontSize: 'clamp(36px,5vw,64px)' }}
            className="text-off-white"
          >
            Detail Acara
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {weddingData.events.map((event) => (
            <div data-animate="card"
              key={event.id}
              className="event-card group relative border border-[rgba(255,255,255,0.08)] p-10 hover:-translate-y-2 transition-transform duration-500 hover:border-[rgba(255,255,255,0.18)]"
              style={{ background: 'linear-gradient(135deg, #111111 0%, #0a0a0a 100%)' }}
            >
              {/* Top label */}
              <span className="label-caps text-muted-gray tracking-[0.3em] block mb-6">
                {event.subtitle}
              </span>

              {/* Event name */}
              <h3
                style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontSize: 'clamp(28px,3vw,40px)' }}
                className="text-off-white mb-8"
              >
                {event.title}
              </h3>

              {/* Details */}
              <div className="flex flex-col gap-4 mb-10">
                <div className="flex items-start gap-3">
                  <Calendar size={14} className="text-muted-gray mt-0.5 shrink-0" />
                  <span className="font-sans text-[14px] text-[rgba(245,242,236,0.55)]">{event.date}</span>
                </div>
                <div className="flex items-start gap-3">
                  <Clock size={14} className="text-muted-gray mt-0.5 shrink-0" />
                  <span className="font-sans text-[14px] text-[rgba(245,242,236,0.55)]">{event.time}</span>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin size={14} className="text-muted-gray mt-0.5 shrink-0" />
                  <div>
                    <p className="font-sans text-[14px] text-off-white font-medium">{event.venue}</p>
                    <p className="font-sans text-[13px] text-[rgba(245,242,236,0.4)] mt-0.5">{event.address}</p>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <a
                href={event.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="label-caps text-muted-gray hover:text-off-white transition-colors flex items-center gap-2 group/link"
              >
                <span>Lihat Lokasi</span>
                <span className="transform group-hover/link:translate-x-1 transition-transform">→</span>
              </a>

              {/* Decorative corner */}
              <div className="absolute top-4 right-4 w-6 h-6 border-t border-r border-[rgba(255,255,255,0.08)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-4 left-4 w-6 h-6 border-b border-l border-[rgba(255,255,255,0.08)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
