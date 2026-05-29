import { weddingData } from '../../data/wedding.data'

const footerLinks = [
  { label: 'Home', href: '#hero' },
  { label: 'Cerita', href: '#love-story' },
  { label: 'Acara', href: '#event' },
  { label: 'RSVP', href: '#rsvp' },
  { label: 'Galeri', href: '#gallery' },
  { label: 'Gift', href: '#gift' },
]

export default function Footer() {
  const coupleName = `${weddingData.groom.firstName} & ${weddingData.bride.firstName}`
  const weddingYear = new Date(weddingData.wedding.date).getFullYear()

  return (
    <footer
      id="footer"
      data-section
      data-theme="dark"
      data-global-reveal="true"
      className="bg-[#050505] border-t border-[rgba(245,245,240,0.08)] pt-16 pb-10"
    >
      <div className="container-base max-w-[1200px] mx-auto flex flex-col items-center gap-10 text-center">

        {/* Hairline Top Accent */}
        <div data-animate="line" className="w-12 h-px bg-[rgba(245,245,240,0.15)]" aria-hidden="true" />

        {/* Couple Signature */}
        <h2
          data-animate="title"
          className="font-serif text-[32px] md:text-[40px] text-[#F5F5F0] font-light tracking-[-0.02em]"
        >
          {coupleName}
        </h2>

        {/* Date */}
        <p data-animate="text" className="font-mono text-[10px] md:text-[11px] tracking-[0.5em] uppercase text-[#A4A4A4] -mt-4">
          {weddingData.wedding.dateFormatted}
        </p>

        {/* Footer Navigation */}
        <nav
          data-animate="text"
          aria-label="Footer navigation"
          className="flex flex-wrap justify-center gap-x-8 gap-y-3"
        >
          {footerLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="group relative font-mono text-[10px] md:text-[11px] uppercase tracking-[0.25em] text-[#A4A4A4] hover:text-[#F5F5F0] transition-colors duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#F5F5F0] py-1"
            >
              {link.label}
              {/* Underline hover effect */}
              <span
                className="absolute bottom-0 left-0 right-0 h-px bg-[#F5F5F0] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"
                aria-hidden="true"
              />
            </a>
          ))}
        </nav>

        {/* Divider */}
        <div data-animate="line" className="w-full max-w-xs h-px bg-[rgba(245,245,240,0.06)]" aria-hidden="true" />

        {/* Bottom Meta */}
        <div data-animate="text" className="flex flex-col items-center gap-2">
          <p className="font-mono text-[9px] tracking-[0.3em] uppercase text-[rgba(245,245,240,0.3)]">
            Digital Invitation
          </p>
          <p className="font-mono text-[9px] tracking-[0.2em] text-[rgba(245,245,240,0.2)]">
            © {weddingYear} {coupleName} — Made with care
          </p>
        </div>

        {/* Back to Top */}
        <a
          href="#hero"
          data-animate="text"
          className="font-mono text-[9px] tracking-[0.3em] uppercase text-[rgba(245,245,240,0.25)] hover:text-[#A4A4A4] transition-colors duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#F5F5F0]"
        >
          Back to top ↑
        </a>

      </div>
    </footer>
  )
}
