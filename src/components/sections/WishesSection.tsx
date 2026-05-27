import { useMemo, useState } from 'react'
import { Quote } from 'lucide-react'
import { weddingData } from '../../data/wedding.data'
import { GuestWish } from '../../types/wish'
import { useReducedMotionSafe } from '../../hooks/useReducedMotionSafe'

interface WishesSectionProps {
  guestWishes?: GuestWish[]
}

function getInitials(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return '??'
  return words.slice(0, 2).map((word) => word[0]?.toUpperCase()).join('')
}

function WishMonogram({ name }: { name: string }) {
  return (
    <span
      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#F5F5F0]/18 bg-[#050505] font-serif text-[16px] text-[#F5F5F0] transition-colors duration-300 group-hover/card:border-[#F5F5F0]/38"
      aria-hidden="true"
    >
      {getInitials(name)}
    </span>
  )
}

function CompactWishCard({
  wish,
  onHoverChange,
}: {
  wish: GuestWish
  onHoverChange?: (isHovered: boolean) => void
}) {
  const isNew = wish.source === 'rsvp'

  return (
    <article
      onMouseEnter={() => onHoverChange?.(true)}
      onMouseLeave={() => onHoverChange?.(false)}
      className={`group/card relative flex h-[184px] w-[320px] shrink-0 overflow-hidden border bg-[#F5F5F0]/[0.035] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#F5F5F0]/28 sm:w-[350px] sm:p-6 lg:w-[380px] ${
        isNew ? 'border-[#F5F5F0]/18' : 'border-[#F5F5F0]/12'
      }`}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#F5F5F0]/[0.06] via-transparent to-transparent opacity-70 transition-opacity duration-300 group-hover/card:opacity-100" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-[1px] border border-[#F5F5F0]/[0.035]" aria-hidden="true" />
      <div className="pointer-events-none absolute left-0 top-0 h-px w-20 bg-[#F5F5F0]/18 transition-all duration-300 group-hover/card:w-28 group-hover/card:bg-[#F5F5F0]/34" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-5 -top-5 text-[#F5F5F0]/[0.035] transition-opacity duration-300 group-hover/card:opacity-95" aria-hidden="true">
        <Quote size={78} strokeWidth={1} />
      </div>
      <div className="pointer-events-none absolute left-0 top-0 h-2.5 w-2.5 border-l border-t border-[#F5F5F0]/28" aria-hidden="true" />
      <div className="pointer-events-none absolute right-0 top-0 h-2.5 w-2.5 border-r border-t border-[#F5F5F0]/16" aria-hidden="true" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-2.5 w-2.5 border-b border-l border-[#F5F5F0]/14" aria-hidden="true" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-2.5 w-2.5 border-b border-r border-[#F5F5F0]/20" aria-hidden="true" />

      <div className="relative z-10 flex min-h-0 flex-1 flex-col justify-between">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <WishMonogram name={wish.name} />
            <div className="min-w-0">
              <h3 className="truncate text-[15px] font-semibold text-[#F5F5F0]">{wish.name}</h3>
              <span className="mt-1 block truncate font-mono text-[9px] uppercase text-[#A4A4A4]">
                {wish.time}
              </span>
            </div>
          </div>

          {isNew && (
            <span
              role="status"
              aria-label="Ucapan baru"
              className="shrink-0 border border-[#F5F5F0]/18 px-2 py-1 font-mono text-[8px] uppercase text-[#A4A4A4]"
            >
              Baru
            </span>
          )}
        </div>

        <p
          className="my-4 overflow-hidden text-[15px] leading-[1.62] text-[#A4A4A4] transition-colors duration-300 group-hover/card:text-[#F5F5F0]/88 sm:text-[16px]"
          style={{
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 2,
          }}
        >
          {wish.message}
        </p>

        <div className="flex items-center justify-between border-t border-[#F5F5F0]/10 pt-3 font-mono text-[10px] uppercase text-[#A4A4A4]">
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#F5F5F0]/42" aria-hidden="true" />
            <span>{wish.attending ? 'Hadir' : 'Tidak Hadir'}</span>
          </span>
          <span className="h-px w-10 bg-[#F5F5F0]/16" aria-hidden="true" />
        </div>
      </div>
    </article>
  )
}

function buildRows(wishes: GuestWish[]) {
  if (wishes.length === 0) return []

  const minimumCards = Math.max(8, wishes.length * 2)
  const expanded = Array.from({ length: minimumCards }, (_, index) => wishes[index % wishes.length])
  const firstOffset = Math.ceil(expanded.length / 3)
  const secondOffset = Math.ceil(expanded.length / 2)

  return [
    expanded,
    [...expanded.slice(firstOffset), ...expanded.slice(0, firstOffset)],
    [...expanded.slice(secondOffset), ...expanded.slice(0, secondOffset)],
  ]
}

export default function WishesSection({ guestWishes = [] }: WishesSectionProps) {
  const { shouldReduceMotion } = useReducedMotionSafe()
  const [pausedRowIndex, setPausedRowIndex] = useState<number | null>(null)

  const allWishes = useMemo(() => {
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

  const rows = useMemo(() => buildRows(allWishes), [allWishes])

  return (
    <section
      id="wishes"
      data-section
      data-theme="dark"
      data-global-reveal="true"
      className="overflow-hidden bg-[#050505] py-24 text-[#F5F5F0] md:py-32"
    >
      <style>
        {`
          @keyframes wishes-marquee-left {
            from { transform: translate3d(0, 0, 0); }
            to { transform: translate3d(-50%, 0, 0); }
          }

          @keyframes wishes-marquee-right {
            from { transform: translate3d(-50%, 0, 0); }
            to { transform: translate3d(0, 0, 0); }
          }
        `}
      </style>

      <div className="container-base">
        <div className="mx-auto mb-14 flex max-w-[680px] flex-col items-center text-center md:mb-16">
          <div data-animate="line" className="mb-8 h-12 w-px bg-[#F5F5F0]/15" aria-hidden="true" />
          <span data-animate="text" className="mb-4 font-mono text-[10px] uppercase text-[#A4A4A4]">
            Doa &amp; Ucapan
          </span>
          <h2 data-animate="title" className="mb-6 font-serif text-[44px] font-light leading-[1.02] text-[#F5F5F0] md:text-[64px]">
            Ucapan dari Mereka
          </h2>
          <p data-animate="text" className="max-w-md text-[15px] leading-7 text-[#A4A4A4]">
            Terima kasih atas setiap doa dan ucapan yang telah diberikan.
          </p>
        </div>

        {allWishes.length === 0 ? (
          <div className="mx-auto max-w-[420px] border border-[#F5F5F0]/12 bg-[#F5F5F0]/[0.035] p-8 text-center">
            <p className="mb-3 font-serif text-[30px] font-light text-[#F5F5F0]">Belum ada ucapan.</p>
            <p className="text-[14px] leading-7 text-[#A4A4A4]">
              Jadilah yang pertama mengirim doa untuk kami.
            </p>
          </div>
        ) : shouldReduceMotion ? (
          <div className="mx-auto flex max-w-[1120px] flex-wrap justify-center gap-4" data-animate="card">
            {allWishes.map((wish) => (
              <CompactWishCard key={wish.id} wish={wish} />
            ))}
          </div>
        ) : (
          <div className="relative -mx-4 space-y-4 sm:-mx-8" data-animate="card">
            {rows.map((row, rowIndex) => {
              const direction = rowIndex % 2 === 0 ? 'wishes-marquee-left' : 'wishes-marquee-right'
              const duration = rowIndex === 1 ? 82 : rowIndex === 2 ? 94 : 74
              const displayRow = [...row, ...row]

              return (
                <div
                  key={`wish-row-${rowIndex}`}
                  className="group/row overflow-hidden py-1 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
                >
                  <div
                    className="flex w-max gap-4 group-hover/row:[animation-play-state:paused]"
                    style={{
                      animation: `${direction} ${duration}s linear infinite`,
                      animationPlayState: pausedRowIndex === rowIndex ? 'paused' : 'running',
                    }}
                  >
                    {displayRow.map((wish, index) => (
                      <CompactWishCard
                        key={`${wish.id}-${rowIndex}-${index}`}
                        wish={wish}
                        onHoverChange={(isHovered) => {
                          setPausedRowIndex((current) => {
                            if (isHovered) return rowIndex
                            return current === rowIndex ? null : current
                          })
                        }}
                      />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
