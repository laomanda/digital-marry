import { useState, useEffect } from 'react'
import { cn } from '../../lib/utils'

const navLinks = [
  { label: 'Cerita Kami', href: '#love-story' },
  { label: 'Acara', href: '#events' },
  { label: 'Galeri', href: '#gallery' },
  { label: 'RSVP', href: '#rsvp' },
]

export default function Navbar() {
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
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          scrolled
            ? 'bg-[rgba(5,5,5,0.85)] backdrop-blur-md border-b border-[rgba(255,255,255,0.06)]'
            : 'bg-transparent'
        )}
      >
        <nav className="container-base flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a
            href="#hero"
            className="font-serif text-[20px] text-off-white tracking-wider"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400 }}
          >
            A &amp; R
          </a>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="label-caps text-muted-gray hover:text-off-white transition-colors duration-300"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Mobile menu button */}
          <button
            className="md:hidden flex flex-col gap-[5px] p-2"
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
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="font-serif text-[32px] text-off-white hover:text-muted-gray transition-colors"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
            onClick={() => setMenuOpen(false)}
          >
            {link.label}
          </a>
        ))}
      </div>
    </>
  )
}
