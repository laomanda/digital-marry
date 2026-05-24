export default function Footer() {
  return (
    <footer id="footer" data-theme="dark" data-global-reveal="true" className="bg-[#050505] border-t border-[rgba(255,255,255,0.06)] py-16">
      <div data-animate="text" className="container-base flex flex-col items-center gap-6 text-center">
        <h2
          className="text-off-white text-[28px]"
          style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400 }}
        >
          Alya &amp; Raka
        </h2>
        <nav className="flex flex-wrap justify-center gap-8">
          {['Cerita Kami', 'Acara', 'Galeri', 'RSVP'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(' ', '-')}`}
              className="label-caps text-muted-gray hover:text-off-white transition-colors"
            >
              {item}
            </a>
          ))}
        </nav>
        <div className="flex flex-col items-center gap-1">
          <p className="label-caps text-[rgba(138,138,138,0.5)]">Digital Invitation</p>
          <p className="label-caps text-[rgba(138,138,138,0.3)]">© 2024 Alya &amp; Raka — Made with Love</p>
        </div>
      </div>
    </footer>
  )
}
