import { useState, useEffect } from 'react'
import { cn } from '../../lib/utils'
import { Heart, CalendarDays, Images, MailCheck } from 'lucide-react'

const navLinks = [
  { label: 'Cerita Kami', href: '#love-story', icon: Heart },
  { label: 'Acara', href: '#event', icon: CalendarDays },
  { label: 'Galeri', href: '#gallery', icon: Images },
  { label: 'RSVP', href: '#rsvp', icon: MailCheck },
]

interface NavbarProps {
  visible?: boolean;
}

export default function Navbar({ visible = true }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <>
      <header
        aria-hidden={!visible}
        {...(!visible && { inert: "true" })}
        className={cn(
          'fixed top-0 left-0 right-0 z-40 transition-all duration-700',
          !visible ? 'opacity-0 -translate-y-4 pointer-events-none' : 'opacity-100 translate-y-0',
          scrolled && visible
            ? 'bg-[rgba(5,5,5,0.85)] backdrop-blur-md border-b border-[rgba(255,255,255,0.06)]'
            : 'bg-transparent'
        )}
      >
        <nav className="container-base flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a
            href="#hero"
            className="font-serif text-[20px] text-off-white tracking-wider focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-off-white/30 rounded px-1"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400 }}
          >
            A &amp; R
          </a>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => {
              const Icon = link.icon
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="label-caps text-muted-gray hover:text-off-white transition-all duration-300 group relative inline-flex items-center gap-2 py-1.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-off-white/30 rounded px-1"
                  >
                    <Icon 
                      aria-hidden="true" 
                      className="w-3.5 h-3.5 stroke-[1.25] text-muted-gray/70 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:rotate-3 group-hover:text-off-white" 
                    />
                    <span className="relative z-10 transition-colors duration-300">
                      {link.label}
                    </span>
                    {/* Underline hairline animation from left to right */}
                    <span 
                      className="absolute bottom-0 left-0 h-[1px] w-0 bg-off-white transition-all duration-300 group-hover:w-full" 
                      aria-hidden="true"
                    />
                  </a>
                </li>
              )
            })}
          </ul>

          {/* Mobile menu button */}
          <button
            className="md:hidden flex flex-col gap-[5px] p-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-off-white/30 rounded"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className={cn('block w-5 h-px bg-off-white transition-transform duration-300', menuOpen && 'rotate-45 translate-y-[6px]')} />
            <span className={cn('block w-5 h-px bg-off-white transition-opacity duration-300', menuOpen && 'opacity-0')} />
            <span className={cn('block w-5 h-px bg-off-white transition-transform duration-300', menuOpen && '-rotate-45 -translate-y-[6px]')} />
          </button>
        </nav>
      </header>

      {/* Mobile menu */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-[rgba(5,5,5,0.97)] flex flex-col items-center justify-center gap-8 transition-all duration-500',
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
      >
        {navLinks.map((link) => {
          const Icon = link.icon
          return (
            <a
              key={link.href}
              href={link.href}
              className="group font-serif text-[32px] text-off-white hover:text-muted-gray transition-colors flex items-center gap-4 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-off-white/30 rounded px-2"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
              onClick={() => setMenuOpen(false)}
            >
              <Icon 
                aria-hidden="true" 
                className="w-6 h-6 stroke-[1] text-off-white/40 group-hover:text-muted-gray transition-colors duration-300"
              />
              <span>{link.label}</span>
            </a>
          )
        })}
      </div>
    </>
  )
}
