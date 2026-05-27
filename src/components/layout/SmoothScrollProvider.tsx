import { useEffect, ReactNode } from 'react'
import Lenis from 'lenis'
import { ScrollTrigger } from '../../lib/gsap'

interface Props {
  children: ReactNode
}

export default function SmoothScrollProvider({ children }: Props) {
  useEffect(() => {
    // Disable Lenis on mobile devices to preserve native iOS/Android scroll momentum
    if (window.matchMedia('(max-width: 1023px)').matches) return

    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    lenis.on('scroll', ScrollTrigger.update)

    const raf = (time: number) => {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    const rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}
