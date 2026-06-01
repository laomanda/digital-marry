import { useEffect, useState } from 'react'
import { AnimatePresence, motion, type Variants } from 'framer-motion'

import {
  BookOpen,
  CalendarDays,
  Gift,
  Heart,
  Home,
  Images,
  MailCheck,
} from 'lucide-react'
import { cn } from '../../lib/utils'
import { weddingData } from '../../data/wedding.data'
import { useReducedMotionSafe } from '../../hooks/useReducedMotionSafe'

const navLinks = [
  { number: '01', label: 'Home', href: '#hero', icon: Home },
  { number: '02', label: 'Couple', href: '#couple', icon: Heart },
  { number: '03', label: 'Story', href: '#love-story', icon: BookOpen },
  { number: '04', label: 'Event', href: '#event', icon: CalendarDays },
  { number: '05', label: 'RSVP', href: '#rsvp', icon: MailCheck },
  { number: '06', label: 'Gallery', href: '#gallery', icon: Images },
  { number: '07', label: 'Gift', href: '#gift', icon: Gift },
]

interface NavbarProps {
  visible?: boolean
}

export default function Navbar({ visible = true }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const { shouldReduceMotion } = useReducedMotionSafe()
  const coupleName = `${weddingData.groom.firstName} & ${weddingData.bride.firstName}`

  useEffect(() => {
    if (!visible) {
      setMenuOpen(false)
    }
  }, [visible])

  useEffect(() => {
    if (!visible || !menuOpen) return

    const previousBodyOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousBodyOverflow
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

  const drawerVariants: Variants = shouldReduceMotion
    ? {
        initial: { x: '100%', opacity: 0 },
        animate: { x: 0, opacity: 1, transition: { duration: 0.2 } },
        exit: { x: '100%', opacity: 0, transition: { duration: 0.2 } },
      }
    : {
        initial: { x: '100%' },
        animate: { x: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
        exit: { x: '100%', transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
      }

  const backdropVariants: Variants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.25 } },
    exit: { opacity: 0, transition: { duration: 0.25 } }
  }

  const listVariants: Variants = shouldReduceMotion
    ? {
        initial: {},
        animate: { transition: { staggerChildren: 0 } },
        exit: {},
      }
    : {
        initial: {},
        animate: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
        exit: { transition: { staggerChildren: 0.04, staggerDirection: -1 } },
      }

  const drawerItemVariants: Variants = shouldReduceMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: 0.22 } },
        exit: { opacity: 0, transition: { duration: 0.14 } },
      }
    : {
        initial: { opacity: 0, x: 20 },
        animate: { opacity: 1, x: 0, transition: { duration: 0.4, ease: 'easeOut' } },
        exit: { opacity: 0, x: 10, transition: { duration: 0.2, ease: 'easeIn' } },
      }

  const closeMenu = () => setMenuOpen(false)

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    closeMenu()
    if (href.startsWith('#')) {
      e.preventDefault()
      const targetId = href.substring(1)
      const targetElement = document.getElementById(targetId)
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      }
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
          aria-controls="drawer-navigation"
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
          <div className="fixed inset-0 z-[8990]">
            {/* Backdrop layer */}
            <motion.div
              className="fixed inset-0 bg-black/55 z-[90]"
              variants={backdropVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              onClick={closeMenu}
              aria-hidden="true"
            />
            
            {/* Drawer layer */}
            <motion.div
              id="drawer-navigation"
              role="dialog"
              aria-modal="true"
              aria-label="Menu navigasi"
              className="fixed right-0 top-0 h-[100dvh] w-[min(82vw,380px)] max-w-[380px] z-[100] bg-[#050505]/95 border-l border-[#F5F5F0]/14 overflow-y-auto shadow-[0_0_60px_rgba(0,0,0,0.45)] pt-[max(1.5rem,env(safe-area-inset-top))] pr-[max(1.25rem,env(safe-area-inset-right))] pb-[max(1.5rem,env(safe-area-inset-bottom))] pl-6"
              variants={drawerVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <div className="relative flex min-h-full flex-col">
                {/* Header */}
                <div className="flex items-center border-b border-[#F5F5F0]/10 pb-4 mb-6">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#A4A4A4]">
                    Navigation
                  </span>
                </div>

                {/* Nav Links */}
                <motion.nav
                  aria-label="Navigasi utama"
                  variants={listVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="flex-1"
                >
                  <ul className="flex flex-col">
                    {navLinks.map((link) => {
                      const Icon = link.icon
                      return (
                        <motion.li key={link.href} variants={drawerItemVariants}>
                          <a
                            href={link.href}
                            className="group block py-5 border-b border-[#F5F5F0]/10 text-left transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#F5F5F0]/50"
                            onClick={(e) => handleLinkClick(e, link.href)}
                          >
                            <div className="flex items-center gap-4 transition-transform duration-300 group-hover:translate-x-1">
                              <Icon 
                                size={18} 
                                className="text-[#A4A4A4] transition-colors duration-300 group-hover:text-[#F5F5F0]" 
                              />
                              <span className="pt-1 font-athene text-[34px] leading-none text-[#F5F5F0]/78 transition-colors duration-300 group-hover:text-[#F5F5F0]">
                                {link.label}
                              </span>
                            </div>
                          </a>
                        </motion.li>
                      )
                    })}
                  </ul>
                </motion.nav>

                {/* Footer */}
                <div className="mt-8 border-t border-[#F5F5F0]/10 pt-5 pb-2 text-left">
                  <p className="font-athene text-[24px] leading-none text-[#A4A4A4]">
                    {coupleName}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
