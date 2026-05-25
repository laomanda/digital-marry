import { useRef, useState, useEffect, useCallback } from 'react'
import { gsap } from '../../lib/gsap'
import { Volume2, VolumeX } from 'lucide-react'

interface MusicToggleProps {
  visible: boolean
}

export default function MusicToggle({ visible }: MusicToggleProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasError, setHasError] = useState(false)
  const hasInitialized = useRef(false)

  // Initialize audio element once
  useEffect(() => {
    if (hasInitialized.current) return
    hasInitialized.current = true

    const audio = new Audio('/audio/bgm.mp3')
    audio.loop = true
    audio.volume = 0.3
    audio.preload = 'none'
    audioRef.current = audio

    audio.addEventListener('error', () => {
      setHasError(true)
    })

    return () => {
      audio.pause()
      audio.src = ''
      audioRef.current = null
    }
  }, [])

  // Fade in the button when visible becomes true
  useEffect(() => {
    if (!buttonRef.current) return

    if (visible) {
      gsap.fromTo(
        buttonRef.current,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.6, ease: 'power3.out', delay: 0.5 }
      )

      // Try autoplay on first visibility (user gesture already happened via Open Invitation)
      const audio = audioRef.current
      if (audio && !isPlaying && !hasError) {
        audio.play()
          .then(() => setIsPlaying(true))
          .catch(() => {
            // Browser blocked autoplay — user can manually toggle
            setIsPlaying(false)
          })
      }
    }
  }, [visible, hasError]) // eslint-disable-line react-hooks/exhaustive-deps

  const togglePlay = useCallback(() => {
    const audio = audioRef.current
    if (!audio || hasError) return

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      audio.play()
        .then(() => setIsPlaying(true))
        .catch(() => setHasError(true))
    }
  }, [isPlaying, hasError])

  // We no longer return null on error, so the user knows the button exists but is disabled
  // if (hasError) return null

  return (
    <button
      ref={buttonRef}
      onClick={togglePlay}
      disabled={hasError}
      title={hasError ? 'Berkas audio (/audio/bgm.mp3) tidak ditemukan' : ''}
      aria-label={isPlaying ? 'Matikan musik latar' : 'Putar musik latar'}
      className="fixed bottom-6 right-6 z-40 flex items-center justify-center w-11 h-11 rounded-full border border-[rgba(245,242,236,0.15)] bg-[rgba(5,5,5,0.7)] backdrop-blur-sm text-[rgba(245,242,236,0.6)] hover:text-[#F5F2EC] hover:border-[rgba(245,242,236,0.3)] transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(245,242,236,0.5)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:text-[rgba(245,242,236,0.6)] disabled:hover:border-[rgba(245,242,236,0.15)]"
      style={{ opacity: 0, pointerEvents: visible ? 'auto' : 'none' }}
    >
      {isPlaying ? (
        <Volume2 size={16} strokeWidth={1.5} />
      ) : (
        <VolumeX size={16} strokeWidth={1.5} />
      )}
    </button>
  )
}
