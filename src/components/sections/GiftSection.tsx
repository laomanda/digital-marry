import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, Check, Copy, HeartHandshake } from 'lucide-react'
import { animate } from 'animejs'
import { gsap } from '../../lib/gsap'
import { weddingData } from '../../data/wedding.data'
import { useReducedMotionSafe } from '../../hooks/useReducedMotionSafe'
import { cn } from '../../lib/utils'
import Folder from '../ui/Folder'

const fallbackCopyTextToClipboard = (text: string) => {
  try {
    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.style.top = '0'
    textArea.style.left = '0'
    textArea.style.position = 'fixed'
    textArea.style.opacity = '0'

    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()

    const successful = document.execCommand('copy')
    document.body.removeChild(textArea)
    return successful
  } catch {
    return false
  }
}

const getBankDisplay = (bank: string) => bank.replace(/^Bank\s+/i, '').trim()

const formatAccountNumber = (accountNumber: string) =>
  accountNumber.replace(/\s+/g, '').replace(/(.{4})/g, '$1 ').trim()

export default function GiftSection() {
  const gifts = weddingData.gifts
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [copyError, setCopyError] = useState(false)
  const [folderOpen, setFolderOpen] = useState(false)
  const [selectedGiftId, setSelectedGiftId] = useState(gifts[0]?.id ?? '')
  const { shouldReduceMotion, isMobile } = useReducedMotionSafe()
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const detailRef = useRef<HTMLElement | null>(null)
  const copyButtonRef = useRef<HTMLButtonElement | null>(null)

  const [palette, setPalette] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.localStorage.getItem('navbar_palette') || 'black';
    }
    return 'black';
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const current = window.localStorage.getItem('navbar_palette') || 'black';
      if (current !== palette) {
        setPalette(current);
      }
    }, 250);
    return () => clearInterval(interval);
  }, [palette]);

  const isBurgundy = palette === 'burgundy';
  const isTaupe = palette === 'taupe';

  const sectionClass = isTaupe
    ? 'bg-[#C9AD8F] text-[#111111]'
    : isBurgundy
      ? 'bg-[#4A1F2A] text-[#F5F5F0]'
      : 'bg-[#050505] text-[#F5F5F0]';

  const textClass = isTaupe ? 'text-[#111111]' : 'text-[#F5F5F0]';

  const mutedClass = isTaupe
    ? 'text-[rgba(17,17,17,0.58)]'
    : isBurgundy
      ? 'text-[rgba(245,245,240,0.65)]'
      : 'text-[#A4A4A4]';

  const folderInkClass = isTaupe
    ? 'text-[#111111]'
    : isBurgundy
      ? 'text-[#2B1018]'
      : 'text-[#050505]';

  const focusOutlineClass = isTaupe
    ? 'focus-visible:outline-[#111111]'
    : isBurgundy
      ? 'focus-visible:outline-[#2B1018]'
      : 'focus-visible:outline-[#050505]';

  const getFolderPaperClass = (isSelected: boolean) => {
    const baseClass = `relative grid h-full w-full place-items-center overflow-hidden rounded-[5px] border p-2 text-center transition-colors duration-300 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-1 ${focusOutlineClass} `;
    
    if (isTaupe) {
      return baseClass + cn(
        'bg-[linear-gradient(135deg,rgba(255,255,255,0.78),rgba(255,255,255,0.18)_58%,rgba(17,17,17,0.035))] text-[#111111]',
        isSelected 
          ? 'border-[rgba(17,17,17,0.36)]'
          : 'border-[rgba(17,17,17,0.16)] hover:border-[rgba(17,17,17,0.28)]'
      );
    }
    
    if (isBurgundy) {
      return baseClass + cn(
        'bg-[linear-gradient(135deg,rgba(255,255,255,0.78),rgba(255,255,255,0.18)_58%,rgba(43,16,24,0.035))] text-[#2B1018]',
        isSelected 
          ? 'border-[rgba(43,16,24,0.36)]' 
          : 'border-[rgba(43,16,24,0.16)] hover:border-[rgba(43,16,24,0.28)]'
      );
    }
    
    return baseClass + cn(
      'bg-[linear-gradient(135deg,rgba(255,255,255,0.78),rgba(255,255,255,0.18)_58%,rgba(5,5,5,0.035))] text-[#050505]',
      isSelected 
        ? 'border-[#050505]/32' 
        : 'border-[#050505]/12 hover:border-[#050505]/24'
    );
  };

  const getDetailPanelClass = () => {
    if (isTaupe) {
      return 'border-[rgba(17,17,17,0.14)] bg-[rgba(245,245,240,0.34)] hover:border-[rgba(17,17,17,0.24)]';
    }
    if (isBurgundy) {
      return 'border-[rgba(245,245,240,0.18)] bg-[rgba(35,12,20,0.46)] hover:border-[rgba(245,245,240,0.28)]';
    }
    return 'border-[#F5F5F0]/10 bg-[#F5F5F0]/[0.022] hover:border-[#F5F5F0]/18';
  };

  const getCopyButtonClass = () => {
    const base = 'inline-flex min-h-[58px] w-full items-center justify-center gap-2 border px-5 py-3 font-mono text-[10px] uppercase tracking-[0.2em] transition-colors duration-500 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 md:w-auto ';
    const focus = isTaupe ? 'focus-visible:outline-[rgba(17,17,17,0.50)]' : 'focus-visible:outline-[#F5F5F0]';
    
    if (copiedId === selectedGift?.id && !copyError) {
      if (isTaupe) return base + focus + ' border-[rgba(17,17,17,0.32)] bg-[rgba(17,17,17,0.045)] text-[#111111]';
      if (isBurgundy) return base + focus + ' border-[rgba(245,245,240,0.36)] bg-[rgba(245,245,240,0.055)] text-[#F5F5F0]';
      return base + focus + ' border-[#F5F5F0]/36 bg-[#F5F5F0]/[0.055] text-[#F5F5F0]';
    }
    if (copiedId === selectedGift?.id && copyError) {
      if (isTaupe) return base + focus + ' border-[rgba(17,17,17,0.24)] bg-[rgba(17,17,17,0.035)] text-[#111111]';
      if (isBurgundy) return base + focus + ' border-[rgba(245,245,240,0.26)] bg-[rgba(245,245,240,0.035)] text-[#F5F5F0]';
      return base + focus + ' border-[#F5F5F0]/26 bg-[#F5F5F0]/[0.035] text-[#F5F5F0]';
    }
    
    if (isTaupe) return base + focus + ' border-[rgba(17,17,17,0.14)] text-[rgba(17,17,17,0.58)] hover:border-[rgba(17,17,17,0.32)] hover:text-[#111111]';
    if (isBurgundy) return base + focus + ' border-[rgba(245,245,240,0.16)] text-[rgba(245,245,240,0.65)] hover:border-[rgba(245,245,240,0.36)] hover:text-[#F5F5F0]';
    return base + focus + ' border-[#F5F5F0]/14 text-[#A4A4A4] hover:border-[#F5F5F0]/32 hover:text-[#F5F5F0]';
  };

  const getToastClass = () => {
    if (isTaupe) return 'border-[rgba(17,17,17,0.14)] bg-[rgba(245,245,240,0.82)] text-[#111111] shadow-[0_18px_42px_rgba(43,31,22,0.18)]';
    if (isBurgundy) return 'border-[rgba(245,245,240,0.16)] bg-[rgba(43,16,24,0.92)] text-[#F5F5F0] shadow-[0_18px_42px_rgba(0,0,0,0.28)]';
    return 'border-[#F5F5F0]/14 bg-[#050505]/90 text-[#F5F5F0] shadow-[0_18px_42px_rgba(0,0,0,0.28)]';
  };

  const selectedGift = useMemo(
    () => gifts.find((gift) => gift.id === selectedGiftId) ?? gifts[0],
    [gifts, selectedGiftId]
  )

  const handleSelectGift = (id: string) => {
    setSelectedGiftId(id)
    setFolderOpen(true)
  }

  const folderItems = useMemo(
    () =>
      gifts.slice(0, 3).map((gift) => {
        const isSelected = selectedGiftId === gift.id
        const bankName = getBankDisplay(gift.bank)

        return (
          <button
            key={gift.id}
            type="button"
            aria-label={`Pilih amplop ${gift.bank}`}
            tabIndex={folderOpen ? 0 : -1}
            onClick={(event) => {
              event.stopPropagation()
              handleSelectGift(gift.id)
            }}
            onKeyDown={(event) => event.stopPropagation()}
            className={getFolderPaperClass(isSelected)}
          >
            <span className={`pointer-events-none absolute inset-[5px] border ${isTaupe ? 'border-[rgba(17,17,17,0.06)]' : isBurgundy ? 'border-[rgba(43,16,24,0.06)]' : 'border-[#050505]/[0.045]'}`} aria-hidden="true" />
            <span className={`pointer-events-none absolute left-2 right-2 top-2 h-px ${isTaupe ? 'bg-[rgba(17,17,17,0.14)]' : isBurgundy ? 'bg-[rgba(43,16,24,0.14)]' : 'bg-[#050505]/10'}`} aria-hidden="true" />

            <span className="flex flex-col items-center gap-1">
              <span className={`font-serif text-[11px] leading-none ${folderInkClass}`}>
                {bankName}
              </span>
              <span className={`h-px w-7 ${isTaupe ? 'bg-[rgba(17,17,17,0.18)]' : isBurgundy ? 'bg-[rgba(43,16,24,0.18)]' : 'bg-[#050505]/16'}`} aria-hidden="true" />
            </span>

            <span
              className={cn(
                'absolute bottom-2 right-2 flex h-1.5 w-1.5 items-center justify-center rounded-full border',
                isSelected ? (isTaupe ? 'border-[#111111]' : isBurgundy ? 'border-[#2B1018]' : 'border-[#050505]/50') : (isTaupe ? 'border-[rgba(17,17,17,0.24)]' : isBurgundy ? 'border-[rgba(43,16,24,0.24)]' : 'border-[#050505]/20')
              )}
              aria-hidden="true"
            >
              <span className={cn('h-[3px] w-[3px] rounded-full', isSelected && (isTaupe ? 'bg-[#111111]' : isBurgundy ? 'bg-[#2B1018]' : 'bg-[#050505]'))} />
            </span>
          </button>
        )
      }),
    [gifts, selectedGiftId, folderOpen, isBurgundy]
  )

  const handleCopy = async (id: string, text: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)

    let success = false

    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(text)
        success = true
      } catch {
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

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  useEffect(() => {
    const detail = detailRef.current
    if (!detail || !selectedGift) return

    const parts = detail.querySelectorAll('[data-gift-reveal]')
    const chars = detail.querySelectorAll('[data-account-char]')

    if (shouldReduceMotion) {
      parts.forEach((part) => {
        const element = part as HTMLElement
        element.style.opacity = '1'
        element.style.transform = 'translateY(0)'
      })
      chars.forEach((char) => {
        const element = char as HTMLElement
        element.style.opacity = '1'
        element.style.transform = 'translateY(0)'
      })
      return
    }

    const partAnimation = animate(parts, {
      opacity: [0, 1],
      translateY: [10, 0],
      duration: 520,
      delay: (_el: Element, index: number) => index * 55,
      ease: 'outCubic',
    })

    const digitAnimation = animate(chars, {
      opacity: [0, 1],
      translateY: [8, 0],
      duration: 560,
      delay: (_el: Element, index: number) => 110 + index * 22,
      ease: 'outExpo',
    })

    return () => {
      partAnimation.pause()
      digitAnimation.pause()
    }
  }, [selectedGift, shouldReduceMotion])

  useEffect(() => {
    if (!copiedId || copyError || shouldReduceMotion || copiedId !== selectedGift?.id) return

    const button = copyButtonRef.current
    if (!button) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        button,
        { scale: 1 },
        {
          scale: 1.03,
          duration: 0.16,
          repeat: 1,
          yoyo: true,
          ease: 'power2.out',
        }
      )
    }, button)

    return () => ctx.revert()
  }, [copiedId, copyError, selectedGift?.id, shouldReduceMotion])

  return (
    <section
      id="gift"
      data-section
      data-theme={isTaupe ? "light" : "dark"}
      data-global-reveal="true"
      className={`relative overflow-hidden py-24 md:py-32 transition-colors duration-500 ${sectionClass}`}
    >
      <div className="pointer-events-none absolute inset-0 opacity-60" aria-hidden="true">
        <div className={`absolute left-1/2 top-24 h-px w-[min(760px,78vw)] -translate-x-1/2 transition-colors duration-500 ${isTaupe ? 'bg-[rgba(17,17,17,0.06)]' : isBurgundy ? 'bg-[rgba(245,245,240,0.08)]' : 'bg-[#F5F5F0]/[0.06]'}`} />
      </div>

      <div className="container-base relative z-10 mx-auto max-w-[1180px]">
        <header className="mx-auto max-w-2xl text-center">
          <span data-animate="text" className={`mb-4 block font-mono text-[10px] uppercase tracking-[0.38em] transition-colors duration-500 ${mutedClass}`}>
            Hadiah
          </span>
          <h2
            data-animate="title"
            className={`font-serif text-[46px] font-light leading-[1.02] md:text-[78px] ${textClass}`}
          >
            Amplop Digital
          </h2>
          <p data-animate="text" className={`mx-auto mt-6 max-w-md text-[15px] leading-7 transition-colors duration-500 ${mutedClass}`}>
            Doa dan kehadiran Anda adalah hadiah terbaik bagi kami.
          </p>
        </header>

        <div className="relative mx-auto mt-14 grid max-w-6xl items-center gap-8 lg:mt-16 lg:grid-cols-[minmax(0,1fr)_minmax(360px,440px)] lg:gap-14">
          <div className={`pointer-events-none absolute left-[48%] top-1/2 hidden h-px w-20 lg:block transition-colors duration-500 ${isTaupe ? 'bg-[rgba(17,17,17,0.14)]' : isBurgundy ? 'bg-[rgba(245,245,240,0.18)]' : 'bg-[#F5F5F0]/12'}`} aria-hidden="true" />

          <div data-animate="card" className="relative flex min-h-[320px] flex-col items-center justify-center py-12 sm:min-h-[380px]">
            <Folder
              color="#CFCAC0"
              size={isMobile ? 1.18 : 1.68}
              items={folderItems}
              open={folderOpen}
              onOpenChange={setFolderOpen}
              ariaLabel={folderOpen ? 'Tutup amplop digital' : 'Buka amplop digital'}
              icon={
                <HeartHandshake
                  size={34}
                  strokeWidth={1.25}
                  className={isTaupe ? "text-[rgba(17,17,17,0.55)]" : isBurgundy ? "text-[#2B1018]/60" : "text-[#050505]/50"}
                  aria-hidden="true"
                />
              }
              className="origin-center"
            />
            <p className={`mt-16 max-w-xs text-center font-mono text-[10px] uppercase tracking-[0.24em] sm:mt-20 transition-colors duration-500 ${mutedClass}`}>
              Pilih amplop untuk melihat detail.
            </p>
          </div>

          <div data-animate="card" className="relative">
            <AnimatePresence mode="wait">
              {selectedGift ? (
                <motion.article
                  ref={detailRef}
                  key={selectedGift.id}
                  initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -10 }}
                  transition={{ duration: shouldReduceMotion ? 0.1 : 0.34, ease: [0.22, 1, 0.36, 1] }}
                  className={`relative overflow-hidden border p-5 transition-colors duration-500 md:p-6 ${getDetailPanelClass()}`}
                >
                  <div className={`pointer-events-none absolute inset-0 ${isTaupe ? 'bg-[linear-gradient(145deg,rgba(17,17,17,0.04),transparent_42%,rgba(17,17,17,0.018))]' : 'bg-[linear-gradient(145deg,rgba(245,245,240,0.055),transparent_42%,rgba(245,245,240,0.018))]'}`} aria-hidden="true" />
                  <div className={`pointer-events-none absolute inset-3 border transition-colors duration-500 ${isTaupe ? 'border-[rgba(17,17,17,0.04)]' : isBurgundy ? 'border-[rgba(245,245,240,0.06)]' : 'border-[#F5F5F0]/[0.035]'}`} aria-hidden="true" />
                  <div className={`pointer-events-none absolute left-0 top-0 h-3 w-3 border-l border-t transition-colors duration-500 ${isTaupe ? 'border-[rgba(17,17,17,0.18)]' : isBurgundy ? 'border-[rgba(245,245,240,0.28)]' : 'border-[#F5F5F0]/22'}`} aria-hidden="true" />
                  <div className={`pointer-events-none absolute bottom-0 right-0 h-3 w-3 border-b border-r transition-colors duration-500 ${isTaupe ? 'border-[rgba(17,17,17,0.18)]' : isBurgundy ? 'border-[rgba(245,245,240,0.24)]' : 'border-[#F5F5F0]/18'}`} aria-hidden="true" />

                  <div className="relative z-10">
                    <div data-gift-reveal className="mb-6 flex items-start justify-between gap-5">
                      <div>
                        <span className={`mb-3 block font-mono text-[10px] uppercase tracking-[0.3em] transition-colors duration-500 ${mutedClass}`}>
                          Amplop Digital
                        </span>
                        <h3 className={`font-serif text-[32px] font-light leading-none md:text-[38px] ${textClass}`}>
                          {selectedGift.bank}
                        </h3>
                      </div>
                      <span className={`mt-1 h-2 w-2 rounded-full border transition-colors duration-500 ${isTaupe ? 'border-[rgba(17,17,17,0.38)]' : isBurgundy ? 'border-[rgba(245,245,240,0.42)]' : 'border-[#F5F5F0]/30'}`} aria-hidden="true" />
                    </div>

                    <div data-gift-reveal className={`border-y py-5 transition-colors duration-500 ${isTaupe ? 'border-[rgba(17,17,17,0.12)]' : isBurgundy ? 'border-[rgba(245,245,240,0.14)]' : 'border-[#F5F5F0]/10'}`}>
                      <span className={`mb-4 block font-mono text-[10px] uppercase tracking-[0.28em] transition-colors duration-500 ${mutedClass}`}>
                        Nomor Rekening
                      </span>
                      <p
                        aria-label={selectedGift.accountNumber}
                        className={`font-mono text-[22px] leading-tight tracking-[0.16em] md:text-[26px] ${textClass}`}
                        style={{ fontVariantNumeric: 'tabular-nums' }}
                      >
                        <span aria-hidden="true">
                          {formatAccountNumber(selectedGift.accountNumber)
                            .split('')
                            .map((char, index) => (
                              <span
                                key={`${selectedGift.id}-${index}`}
                                data-account-char
                                className="inline-block"
                              >
                                {char === ' ' ? '\u00A0' : char}
                              </span>
                            ))}
                        </span>
                      </p>
                    </div>

                    <div className="mt-5 grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
                      <div data-gift-reveal className={`border p-4 transition-colors duration-500 ${isTaupe ? 'border-[rgba(17,17,17,0.08)] bg-[rgba(245,245,240,0.28)]' : isBurgundy ? 'border-[rgba(245,245,240,0.12)] bg-[rgba(43,16,24,0.42)]' : 'border-[#F5F5F0]/8 bg-[#050505]/18'}`}>
                        <span className={`mb-2 block font-mono text-[10px] uppercase tracking-[0.28em] transition-colors duration-500 ${mutedClass}`}>
                          Atas Nama
                        </span>
                        <p className={`text-[15px] leading-6 transition-colors duration-500 ${isTaupe ? 'text-[rgba(17,17,17,0.78)]' : isBurgundy ? 'text-[rgba(245,245,240,0.86)]' : 'text-[#F5F5F0]/[0.86]'}`}>
                          {selectedGift.accountName}
                        </p>
                      </div>

                      <button
                        ref={copyButtonRef}
                        type="button"
                        data-gift-reveal
                        onClick={() => handleCopy(selectedGift.id, selectedGift.accountNumber)}
                        aria-label={`Salin nomor rekening ${selectedGift.bank}`}
                        className={getCopyButtonClass()}
                      >
                        {copiedId === selectedGift.id && !copyError ? (
                          <>
                            <Check size={14} strokeWidth={1.5} aria-hidden="true" />
                            <span>Tersalin</span>
                          </>
                        ) : copiedId === selectedGift.id && copyError ? (
                          <>
                            <AlertCircle size={14} strokeWidth={1.5} aria-hidden="true" />
                            <span>Gagal</span>
                          </>
                        ) : (
                          <>
                            <Copy size={14} strokeWidth={1.5} aria-hidden="true" />
                            <span>Salin</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </motion.article>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`border p-10 text-center text-[14px] transition-colors duration-500 ${isTaupe ? 'border-[rgba(17,17,17,0.14)] bg-[rgba(245,245,240,0.30)] text-[rgba(17,17,17,0.58)]' : isBurgundy ? 'border-[rgba(245,245,240,0.16)] bg-[rgba(35,12,20,0.42)] text-[rgba(245,245,240,0.65)]' : 'border-[#F5F5F0]/10 bg-[#F5F5F0]/[0.025] text-[#A4A4A4]'}`}
                >
                  Hadiah belum tersedia.
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {copiedId && (
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
            transition={{ duration: shouldReduceMotion ? 0.1 : 0.28, ease: 'easeOut' }}
            className="pointer-events-none fixed bottom-[max(1.5rem,env(safe-area-inset-bottom,0px))] left-[max(1.5rem,env(safe-area-inset-left,0px))] z-[100]"
            role="status"
          >
            <div className={`flex items-center gap-3 border px-5 py-3 backdrop-blur-md transition-colors duration-500 ${getToastClass()}`}>
              {copyError ? (
                <AlertCircle size={15} strokeWidth={1.5} aria-hidden="true" />
              ) : (
                <Check size={15} strokeWidth={1.5} aria-hidden="true" />
              )}
              <span className="font-mono text-[10px] uppercase tracking-[0.2em]">
                {copyError ? 'Gagal' : 'Tersalin'}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className={`pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-44 bg-gradient-to-b md:h-56 transition-colors duration-500 ${isTaupe ? 'from-transparent via-[rgba(201,173,143,0.80)] to-[#C9AD8F]' : isBurgundy ? 'from-transparent via-[rgba(74,31,42,0.80)] to-[#4A1F2A]' : 'from-transparent via-[#050505]/80 to-[#050505]'}`}
        aria-hidden="true"
      />
    </section>
  )
}
