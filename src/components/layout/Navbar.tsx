import { type CSSProperties, useEffect, useState } from 'react'
import { AnimatePresence, motion, type Variants } from 'framer-motion'
import {
  BookOpen,
  CalendarDays,
  Gift,
  Heart,
  Home,
  Images,
  MailCheck,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '../../lib/utils'
import { weddingData } from '../../data/wedding.data'
import { useReducedMotionSafe } from '../../hooks/useReducedMotionSafe'

const navLinks = [
  { number: '01', label: 'Home', href: '#hero', subtitle: 'Pembuka', icon: Home },
  { number: '02', label: 'Couple', href: '#couple', subtitle: 'Bride and groom', icon: Heart },
  { number: '03', label: 'Story', href: '#love-story', subtitle: 'Cerita Kami', icon: BookOpen },
  { number: '04', label: 'Event', href: '#event', subtitle: 'Waktu dan Tempat', icon: CalendarDays },
  { number: '05', label: 'RSVP', href: '#rsvp', subtitle: 'Konfirmasi Hadir', icon: MailCheck },
  { number: '06', label: 'Gallery', href: '#gallery', subtitle: 'Momen Berharga', icon: Images },
  { number: '07', label: 'Gift', href: '#gift', subtitle: 'Tanda Kasih', icon: Gift },
]

const palettes = {
  black: {
    label: 'Black',
    bg: '#050505',
    text: '#F5F5F0',
    muted: '#A4A4A4',
    border: 'rgba(245,245,240,0.16)',
  },
  burgundy: {
    label: 'Burgundy',
    bg: '#4A1F2A',
    text: '#F5F5F0',
    muted: 'rgba(245,245,240,0.65)',
    border: 'rgba(245,245,240,0.18)',
  },
  taupe: {
    label: 'Warm Taupe',
    bg: '#C9AD8F',
    text: '#111111',
    muted: 'rgba(17,17,17,0.58)',
    border: 'rgba(17,17,17,0.18)',
  },
} as const

type PaletteKey = keyof typeof palettes

const PALETTE_STORAGE_KEY = 'navbar_palette'

interface NavbarProps {
  visible?: boolean
}

function getStoredPalette(): PaletteKey {
  if (typeof window === 'undefined') return 'black'

  try {
    const storedPalette = window.localStorage.getItem(PALETTE_STORAGE_KEY)
    return storedPalette && storedPalette in palettes ? (storedPalette as PaletteKey) : 'black'
  } catch {
    return 'black'
  }
}

function MenuIconMark({ Icon }: { Icon: LucideIcon }) {
  return (
    <span
      aria-hidden="true"
      className="relative flex h-9 w-9 shrink-0 items-center justify-center text-[color:var(--menu-muted)] transition-colors duration-300 group-hover:text-[color:var(--menu-text)] md:h-10 md:w-10"
    >
      <span className="absolute left-0 top-0 h-2.5 w-2.5 border-l border-t border-[color:var(--menu-border)] transition-all duration-500 ease-out group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 group-hover:border-[color:var(--menu-text)]" />
      <span className="absolute bottom-0 right-0 h-2.5 w-2.5 border-b border-r border-[color:var(--menu-border)] transition-all duration-500 ease-out group-hover:translate-x-0.5 group-hover:translate-y-0.5 group-hover:border-[color:var(--menu-text)]" />
      <span className="absolute inset-[7px] border border-[color:var(--menu-border)] transition-all duration-500 ease-out group-hover:inset-[5px] group-hover:border-[color:var(--menu-text)]" />
      <Icon className="relative h-4 w-4 stroke-[1.15] transition-transform duration-500 ease-out group-hover:-translate-y-0.5 group-hover:scale-110 md:h-[18px] md:w-[18px]" />
    </span>
  )
}

export default function Navbar({ visible = true }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [palette, setPalette] = useState<PaletteKey>(getStoredPalette)
  const { shouldReduceMotion } = useReducedMotionSafe()
  const coupleName = `${weddingData.bride.firstName} & ${weddingData.groom.firstName}`
  const activePalette = palettes[palette]
  const paletteKeys = Object.keys(palettes) as PaletteKey[]
  const menuThemeStyle = {
    '--menu-bg': activePalette.bg,
    '--menu-text': activePalette.text,
    '--menu-muted': activePalette.muted,
    '--menu-border': activePalette.border,
  } as CSSProperties

  useEffect(() => {
    if (!visible) {
      setMenuOpen(false)
    }
  }, [visible])

  useEffect(() => {
    if (!visible || !menuOpen) return

    const previousBodyOverflow = document.body.style.overflow
    const previousHtmlOverflow = document.documentElement.style.overflow
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousBodyOverflow
      document.documentElement.style.overflow = previousHtmlOverflow
    }
  }, [menuOpen, visible])

  useEffect(() => {
    if (!visible || !menuOpen) return

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
      }
    }

    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [menuOpen, visible])

  const overlayVariants: Variants = shouldReduceMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: 0.2 } },
        exit: { opacity: 0, transition: { duration: 0.18 } },
      }
    : {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: 0.55, ease: 'easeOut' } },
        exit: { opacity: 0, transition: { duration: 0.35, ease: 'easeOut' } },
      }

  const listVariants: Variants = shouldReduceMotion
    ? {
        initial: {},
        animate: { transition: { staggerChildren: 0 } },
        exit: {},
      }
    : {
        initial: {},
        animate: { transition: { staggerChildren: 0.055, delayChildren: 0.12 } },
        exit: { transition: { staggerChildren: 0.035, staggerDirection: -1 } },
      }

  const itemVariants: Variants = shouldReduceMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: 0.22 } },
        exit: { opacity: 0, transition: { duration: 0.14 } },
      }
    : {
        initial: { opacity: 0, y: 24 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.58, ease: 'easeOut' } },
        exit: { opacity: 0, y: 12, transition: { duration: 0.22, ease: 'easeIn' } },
      }

  const closeMenu = () => setMenuOpen(false)

  const selectPalette = (key: PaletteKey) => {
    setPalette(key)

    try {
      window.localStorage.setItem(PALETTE_STORAGE_KEY, key)
    } catch {
      // Palette persistence is optional; the menu should keep working without storage.
    }
  }

  return (
    <>
      <div
        aria-hidden={!visible}
        {...(!visible && { inert: 'true' })}
        className={cn(
          'fixed right-[max(1.5rem,env(safe-area-inset-right,0px))] top-[max(1.5rem,env(safe-area-inset-top,0px))] z-[9000] h-12 w-12 transition-all duration-500 md:right-10 md:top-8',
          visible
            ? 'pointer-events-auto translate-y-0 scale-100 opacity-100'
            : 'pointer-events-none -translate-y-2 scale-95 opacity-0',
        )}
      >
        <motion.button
          type="button"
          data-cursor="true"
          data-cursor-label={menuOpen ? 'CLOSE' : 'OPEN'}
          className="group relative flex h-12 w-12 items-center justify-center rounded-full border border-[rgba(245,245,240,0.18)] bg-[rgba(5,5,5,0.25)] text-[#F5F5F0] shadow-[0_16px_44px_rgba(0,0,0,0.22)] outline-none backdrop-blur-[6px] transition-colors duration-300 hover:border-[rgba(245,245,240,0.34)] hover:bg-[rgba(5,5,5,0.38)] focus-visible:ring-1 focus-visible:ring-[#F5F5F0]/55"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
          aria-expanded={menuOpen}
          aria-controls="fullscreen-navigation"
          whileHover={shouldReduceMotion ? undefined : { scale: 1.04 }}
          whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
        >
          <span className="relative block h-4 w-6" aria-hidden="true">
            <motion.span
              className="absolute left-0 top-[3px] h-px w-6 origin-center bg-current"
              animate={menuOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
              transition={{ duration: shouldReduceMotion ? 0.12 : 0.3, ease: 'easeOut' }}
            />
            <motion.span
              className="absolute left-0 top-[11px] h-px w-6 origin-center bg-current"
              animate={menuOpen ? { rotate: -45, y: -3 } : { rotate: 0, y: 0 }}
              transition={{ duration: shouldReduceMotion ? 0.12 : 0.3, ease: 'easeOut' }}
            />
          </span>
        </motion.button>
      </div>

      <AnimatePresence>
        {visible && menuOpen && (
          <motion.div
            id="fullscreen-navigation"
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-[8990] overflow-y-auto overflow-x-hidden bg-[var(--menu-bg)] text-[color:var(--menu-text)]"
            style={menuThemeStyle}
            variants={overlayVariants}
            initial="initial"
            animate={{
              ...overlayVariants.animate,
              backgroundColor: activePalette.bg,
              color: activePalette.text,
            }}
            exit="exit"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,var(--menu-border),transparent_38%)]" />
            <span className="pointer-events-none absolute left-5 top-24 h-12 w-12 border-l border-t border-[color:var(--menu-border)] md:left-10 md:top-28" />
            <span className="pointer-events-none absolute bottom-8 right-5 h-12 w-12 border-b border-r border-[color:var(--menu-border)] md:bottom-10 md:right-10" />

            <div className="container-base relative flex min-h-dvh flex-col justify-center pb-5 pt-20 md:pt-20">
              <div className="mb-3 flex items-end justify-between gap-6 border-b border-[color:var(--menu-border)] pb-3 md:mb-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-[color:var(--menu-muted)]">
                  Navigation
                </p>
                <div
                  aria-hidden="true"
                  className="hidden items-center justify-end opacity-80 transition-opacity duration-300 sm:flex"
                >
                  <span
                    className="font-serif text-[30px] italic leading-none tracking-normal text-[color:var(--menu-text)] opacity-65 md:text-[40px]"
                    style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400 }}
                  >
                    I
                  </span>
                  <span
                    className="mx-2 font-serif text-[20px] italic leading-none tracking-normal text-[color:var(--menu-muted)] md:text-[26px]"
                    style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400 }}
                  >
                    &amp;
                  </span>
                  <span
                    className="font-serif text-[30px] italic leading-none tracking-normal text-[color:var(--menu-text)] opacity-65 md:text-[40px]"
                    style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400 }}
                  >
                    R
                  </span>
                </div>
              </div>

              <motion.nav
                aria-label="Navigasi utama"
                variants={listVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <ul className="grid gap-0">
                  {navLinks.map((link) => {
                    const Icon = link.icon

                    return (
                      <motion.li key={link.href} variants={itemVariants}>
                        <a
                          href={link.href}
                          data-cursor-label={link.label.toUpperCase()}
                          className="group grid grid-cols-[2.25rem_2.75rem_minmax(0,1fr)] items-center gap-3 border-b border-[color:var(--menu-border)] py-3 transition-colors duration-300 hover:border-[color:var(--menu-text)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[color:var(--menu-text)] sm:grid-cols-[3.5rem_3rem_minmax(0,1fr)_auto] sm:gap-5 md:py-3"
                          onClick={closeMenu}
                        >
                          <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-[color:var(--menu-muted)] transition-colors duration-300 group-hover:text-[color:var(--menu-text)]">
                            {link.number}
                          </span>
                          <MenuIconMark Icon={Icon} />
                          <span
                            className="font-serif text-[clamp(32px,4.8vw,58px)] leading-[0.9] tracking-normal text-[color:var(--menu-text)] opacity-75 transition-all duration-500 group-hover:translate-x-2 group-hover:opacity-100"
                            style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400 }}
                          >
                            {link.label}
                          </span>
                          <span className="col-start-3 max-w-[13rem] pb-1 font-mono text-[10px] uppercase tracking-[0.24em] text-[color:var(--menu-muted)] opacity-80 transition-opacity duration-300 group-hover:opacity-100 sm:col-start-auto sm:text-right">
                            {link.subtitle}
                          </span>
                        </a>
                      </motion.li>
                    )
                  })}
                </ul>
              </motion.nav>

              <div className="mt-3 flex flex-col gap-3 border-t border-[color:var(--menu-border)] pt-3 font-mono text-[10px] uppercase tracking-[0.28em] text-[color:var(--menu-muted)] md:flex-row md:items-end md:justify-between">
                <span>{coupleName}</span>

                <div className="flex flex-col gap-2 md:items-end">
                  <span>Warna Menu</span>
                  <div className="flex flex-wrap items-center gap-3">
                    {paletteKeys.map((key) => {
                      const paletteOption = palettes[key]
                      const isActive = palette === key

                      return (
                        <motion.button
                          key={key}
                          type="button"
                          aria-label={`Gunakan warna ${paletteOption.label}`}
                          aria-pressed={isActive}
                          className="group/palette flex items-center gap-2 rounded-[2px] outline-none focus-visible:ring-1 focus-visible:ring-[color:var(--menu-text)]"
                          onClick={() => selectPalette(key)}
                          whileHover={shouldReduceMotion ? undefined : { scale: 1.04 }}
                          whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
                          transition={{ duration: 0.22, ease: 'easeOut' }}
                        >
                          <span
                            className={cn(
                              'flex h-9 w-9 items-center justify-center rounded-full border transition-colors duration-300 md:h-10 md:w-10',
                              isActive
                                ? 'border-[color:var(--menu-text)]'
                                : 'border-[color:var(--menu-border)]',
                            )}
                          >
                            <span
                              className="h-6 w-6 rounded-full border border-black/10 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)] md:h-7 md:w-7"
                              style={{ backgroundColor: paletteOption.bg }}
                            />
                          </span>
                          <span
                            className={cn(
                              'text-left text-[9px] tracking-[0.22em] transition-colors duration-300',
                              isActive
                                ? 'text-[color:var(--menu-text)]'
                                : 'text-[color:var(--menu-muted)] group-hover/palette:text-[color:var(--menu-text)]',
                            )}
                          >
                            {paletteOption.label}
                          </span>
                        </motion.button>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
