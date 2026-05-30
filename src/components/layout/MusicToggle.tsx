import { useRef, useState, useEffect, useCallback } from 'react'
import { usePalette } from '../../hooks/usePalette'
import { gsap } from '../../lib/gsap'
import { Volume2, VolumeX } from 'lucide-react'
import soundUrl from '../../assets/audio/sound.mpeg'

interface MusicToggleProps {
  visible: boolean
}

export default function MusicToggle({ visible }: MusicToggleProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasError, setHasError] = useState(false)
  const { palette } = usePalette()

  const isBurgundy = palette === 'burgundy';
  const isTaupe = palette === 'taupe';

  const paletteClasses = isTaupe
    ? 'border-[rgba(17,17,17,0.18)] bg-[rgba(245,245,240,0.46)] text-[rgba(17,17,17,0.58)] hover:text-[#111111] hover:border-[rgba(17,17,17,0.34)] focus-visible:outline-[rgba(17,17,17,0.5)] disabled:hover:text-[rgba(17,17,17,0.58)] disabled:hover:border-[rgba(17,17,17,0.18)]'
    : isBurgundy
      ? 'border-[rgba(245,245,240,0.18)] bg-[rgba(43,16,24,0.72)] text-[rgba(245,245,240,0.65)] hover:text-[#F5F5F0] hover:border-[rgba(245,245,240,0.34)] focus-visible:outline-[rgba(245,245,240,0.65)] disabled:hover:text-[rgba(245,245,240,0.65)] disabled:hover:border-[rgba(245,245,240,0.18)]'
      : 'border-[rgba(245,242,236,0.15)] bg-[rgba(5,5,5,0.7)] text-[rgba(245,242,236,0.6)] hover:text-[#F5F2EC] hover:border-[rgba(245,242,236,0.3)] focus-visible:outline-[rgba(245,242,236,0.5)] disabled:hover:text-[rgba(245,242,236,0.6)] disabled:hover:border-[rgba(245,242,236,0.15)]';

  // Initialize audio element
  useEffect(() => {
    const audio = new Audio(soundUrl)
    audio.loop = true
    audio.volume = 0.3
    audio.preload = 'none'
    audioRef.current = audio

    const onError = () => setHasError(true)
    audio.addEventListener('error', onError)

    return () => {
      audio.removeEventListener('error', onError)
      audio.pause()
      audio.src = ''
      if (audioRef.current === audio) {
        audioRef.current = null
      }
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
      title={hasError ? 'Berkas audio tidak ditemukan' : ''}
      aria-label={isPlaying ? 'Matikan musik latar' : 'Putar musik latar'}
      className={`fixed bottom-[max(1.5rem,env(safe-area-inset-bottom,0px))] right-[max(1.5rem,env(safe-area-inset-right,0px))] z-40 flex items-center justify-center w-11 h-11 rounded-full border backdrop-blur-sm transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${paletteClasses}`}
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
