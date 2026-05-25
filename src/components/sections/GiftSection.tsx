import { useState, useRef, useEffect } from 'react'
import { Copy, Check, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { weddingData } from '../../data/wedding.data'
import { useReducedMotionSafe } from '../../hooks/useReducedMotionSafe'
import { cn } from '../../lib/utils'

// Robust clipboard fallback function
const fallbackCopyTextToClipboard = (text: string) => {
  try {
    const textArea = document.createElement("textarea")
    textArea.value = text
    
    // Avoid scrolling to bottom
    textArea.style.top = "0"
    textArea.style.left = "0"
    textArea.style.position = "fixed"
    textArea.style.opacity = "0"
    
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    
    const successful = document.execCommand('copy')
    document.body.removeChild(textArea)
    return successful
  } catch (err) {
    return false
  }
}

export default function GiftSection() {
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [copyError, setCopyError] = useState<boolean>(false)
  const { shouldReduceMotion } = useReducedMotionSafe()
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleCopy = async (id: string, text: string) => {
    // Clear any existing timeouts
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    
    let success = false
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(text)
        success = true
      } catch (err) {
        success = fallbackCopyTextToClipboard(text)
      }
    } else {
      success = fallbackCopyTextToClipboard(text)
    }

    if (success) {
      setCopiedId(id)
      setCopyError(false)
    } else {
      setCopiedId(id)
      setCopyError(true)
    }

    timeoutRef.current = setTimeout(() => {
      setCopiedId(null)
      setCopyError(false)
    }, 2500)
  }

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  return (
    <section 
      id="gift" 
      data-section 
      data-theme="dark" 
      data-global-reveal="true" 
      className="py-24 md:py-32 bg-[#050505] relative overflow-hidden"
    >
      <div className="container-base max-w-[1200px] mx-auto relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-20 items-start">
          
          {/* Left Column: Editorial Note */}
          <div className="flex flex-col max-w-md">
            <span data-animate="text" className="font-mono text-[9px] md:text-[10px] tracking-[0.4em] uppercase text-[#A4A4A4] mb-4">
              Wedding Gift
            </span>
            <h2 
              data-animate="title"
              className="font-serif text-[40px] md:text-[56px] text-[#F5F5F0] font-light leading-[1.1] mb-8"
            >
              Amplop <span className="italic text-[#A4A4A4]">Digital</span>
            </h2>
            
            <div data-animate="text" className="space-y-6">
              <p className="font-sans text-[14px] md:text-[15px] leading-relaxed text-[#F5F5F0]/80">
                Doa restu dan kehadiran Anda adalah anugerah terbesar bagi kami. Namun, apabila Anda ingin memberikan tanda kasih secara terpisah, Anda dapat mengirimkannya melalui rekening berikut.
              </p>
              <p className="font-sans text-[12px] md:text-[13px] text-[#A4A4A4] border-l border-[rgba(245,245,240,0.1)] pl-4">
                Setiap bentuk perhatian yang diberikan sangat berarti dan kami hargai dengan sepenuh hati.
              </p>
            </div>
          </div>

          {/* Right Column: Gift Vault Ledger */}
          <div className="w-full flex flex-col gap-4">
            {weddingData.gifts.length > 0 ? (
              weddingData.gifts.map((gift, idx) => {
                const isCopied = copiedId === gift.id
                const isError = isCopied && copyError
                const isSuccess = isCopied && !copyError
                
                return (
                  <div 
                    key={gift.id}
                    data-animate="card"
                    className="relative border border-[rgba(245,245,240,0.1)] bg-[rgba(245,245,240,0.02)] p-6 md:p-8 hover:bg-[rgba(245,245,240,0.04)] hover:border-[rgba(245,245,240,0.15)] transition-colors duration-500 overflow-hidden group"
                  >
                    {/* Corner marks decoration */}
                    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[rgba(245,245,240,0.2)]" />
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[rgba(245,245,240,0.2)]" />
                    
                    {/* Faint Watermark */}
                    <span 
                      className="absolute -bottom-4 right-2 text-[80px] font-serif text-[rgba(245,245,240,0.02)] select-none pointer-events-none group-hover:text-[rgba(245,245,240,0.03)] transition-colors duration-500" 
                      aria-hidden="true"
                    >
                      GIFT
                    </span>

                    <div className="relative z-10">
                      {/* Top Meta */}
                      <div className="flex items-center justify-between mb-8">
                        <span className="font-mono text-[9px] md:text-[10px] tracking-[0.3em] text-[#A4A4A4] uppercase">
                          {gift.bank}
                        </span>
                        <span className="font-mono text-[9px] text-[rgba(245,245,240,0.3)]">
                          {(idx + 1).toString().padStart(2, '0')}
                        </span>
                      </div>

                      {/* Account Details */}
                      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-4">
                        <div className="flex flex-col gap-1">
                          <span 
                            className="font-serif text-[24px] md:text-[32px] text-[#F5F5F0] tracking-[0.1em] font-light break-all tabular-nums"
                            style={{ fontVariantNumeric: 'tabular-nums' }}
                          >
                            {gift.accountNumber}
                          </span>
                          <span className="font-sans text-[13px] text-[#A4A4A4]">
                            A.n. {gift.accountName}
                          </span>
                        </div>

                        {/* Action Button */}
                        <button
                          type="button"
                          onClick={() => handleCopy(gift.id, gift.accountNumber)}
                          aria-label={`Salin nomor rekening ${gift.bank}`}
                          className={cn(
                            "flex items-center justify-center gap-2 px-6 py-3 border text-[10px] uppercase font-mono tracking-[0.2em] transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#F5F5F0]",
                            isSuccess 
                              ? "border-[rgba(245,245,240,0.4)] text-[#F5F5F0] bg-[rgba(245,245,240,0.05)]" 
                              : isError
                              ? "border-red-900/50 text-red-200 bg-red-900/20"
                              : "border-[rgba(245,245,240,0.15)] text-[#A4A4A4] hover:border-[rgba(245,245,240,0.3)] hover:text-[#F5F5F0]"
                          )}
                        >
                          {isSuccess ? (
                            <>
                              <Check size={14} strokeWidth={1.5} />
                              <span>Tersalin</span>
                            </>
                          ) : isError ? (
                            <>
                              <AlertCircle size={14} strokeWidth={1.5} />
                              <span>Gagal</span>
                            </>
                          ) : (
                            <>
                              <Copy size={14} strokeWidth={1.5} />
                              <span>Salin</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="border border-[rgba(245,245,240,0.05)] p-12 text-center">
                <p className="font-sans text-[14px] text-[#A4A4A4] italic">Gift information will be available soon.</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Global Toast Overlay */}
      <AnimatePresence>
        {copiedId && (
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] pointer-events-none"
            role="status"
          >
            <div className={cn(
              "px-6 py-3 rounded-full border shadow-2xl backdrop-blur-md flex items-center gap-3",
              copyError 
                ? "bg-red-950/80 border-red-900/50 text-red-200" 
                : "bg-[#050505]/90 border-[rgba(245,245,240,0.1)] text-[#F5F5F0]"
            )}>
              {copyError ? (
                <AlertCircle size={16} strokeWidth={1.5} />
              ) : (
                <Check size={16} strokeWidth={1.5} className="text-[#A4A4A4]" />
              )}
              <span className="font-sans text-[13px]">
                {copyError 
                  ? "Gagal menyalin, silakan salin manual." 
                  : "Nomor rekening berhasil disalin."}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
