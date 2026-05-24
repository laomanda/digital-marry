import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { weddingData } from '../../data/wedding.data'

function GiftCard({ bank, accountNumber, accountName }: typeof weddingData.gifts[0]) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(accountNumber)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // fallback
    }
  }

  return (
    <div data-animate="card" className="gift-card border border-[rgba(255,255,255,0.08)] p-8 hover:border-[rgba(255,255,255,0.16)] transition-all duration-500 group">
      <span className="label-caps text-muted-gray tracking-[0.3em] block mb-5">{bank}</span>
      <div className="flex items-end justify-between gap-4">
        <div>
          <p
            style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontSize: 'clamp(24px,3vw,36px)' }}
            className="text-off-white tracking-wider mb-1"
          >
            {accountNumber}
          </p>
          <p className="font-sans text-[13px] text-muted-gray">{accountName}</p>
        </div>
        <button
          onClick={handleCopy}
          aria-label={`Copy ${bank} account number`}
          className="flex items-center gap-2 label-caps border border-[rgba(255,255,255,0.15)] px-4 py-3 text-muted-gray hover:text-off-white hover:border-[rgba(255,255,255,0.3)] transition-all duration-300 shrink-0"
        >
          {copied ? (
            <>
              <Check size={12} />
              <span>Tersalin</span>
            </>
          ) : (
            <>
              <Copy size={12} />
              <span>Salin</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default function GiftSection() {
  return (
    <section id="gift" data-section data-theme="light" data-global-reveal="true" className="section-padding bg-[#0a0a0a]">
      <div className="container-base max-w-2xl mx-auto">
        <div data-animate="title" className="text-center mb-16">
          <span className="label-caps text-muted-gray tracking-[0.35em] block mb-4">Hadiah</span>
          <h2
            style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontSize: 'clamp(36px,5vw,56px)' }}
            className="text-off-white"
          >
            Amplop Digital
          </h2>
          <p className="font-sans text-[15px] text-muted-gray mt-4 max-w-md mx-auto">
            Doa dan kehadiran Anda adalah hadiah terbaik bagi kami. Namun jika ingin memberikan lebih:
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {weddingData.gifts.map((gift) => (
            <GiftCard key={gift.id} {...gift} />
          ))}
        </div>
      </div>
    </section>
  )
}
