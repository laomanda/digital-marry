import { useEffect } from 'react'
import { gsap } from '../lib/gsap'
import { motionPresets } from '../lib/motionPresets'
import { useReducedMotionSafe } from './useReducedMotionSafe'

export function useGlobalReveal() {
  const { shouldReduceMotion } = useReducedMotionSafe()

  useEffect(() => {
    if (typeof window === 'undefined') return

    const ctx = gsap.context(() => {
      const roots = document.querySelectorAll<HTMLElement>('[data-global-reveal="true"]')

      roots.forEach((root) => {
        const targets = root.querySelectorAll<HTMLElement>('[data-animate]')
        if (targets.length === 0) return

        if (shouldReduceMotion) {
          targets.forEach((el) => {
            if (el.getAttribute('data-no-global-reveal') === 'true') return
            gsap.set(el, { opacity: 1, clearProps: 'transform' })
          })
          return
        }

        const elementsToAnimate = Array.from(targets).filter(
          (el) => el.getAttribute('data-no-global-reveal') !== 'true'
        )

        if (elementsToAnimate.length === 0) return

        // Set initial state
        gsap.set(elementsToAnimate, {
          opacity: 0,
          y: (_i, target) => {
            const type = target.getAttribute('data-animate')
            if (type === 'title') return motionPresets.titleBreath.from.y
            if (type === 'image') return 0
            if (type === 'line') return 0
            if (type === 'number') return motionPresets.numberReveal.from.y
            if (type === 'card') return motionPresets.cardStagger.from.y
            return motionPresets.fadeUp.from.y
          },
          scale: (_i, target) => {
            const type = target.getAttribute('data-animate')
            if (type === 'image') return motionPresets.imageReveal.from.scale
            if (type === 'number') return motionPresets.numberReveal.from.scale
            return 1
          },
          scaleX: (_i, target) => {
            const type = target.getAttribute('data-animate')
            if (type === 'line') return motionPresets.lineDraw.from.scaleX
            return 1
          },
          letterSpacing: (_i, target) => {
            const type = target.getAttribute('data-animate')
            if (type === 'title') return motionPresets.titleBreath.from.letterSpacing
            return 'normal'
          },
        })

        // Group by type for standard stagger logic, or just animate all together
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: 'top 82%',
            once: true,
            toggleActions: 'play none none none',
          },
        })

        elementsToAnimate.forEach((el, index) => {
          const type = el.getAttribute('data-animate')
          
          if (type === 'title') {
            tl.to(el, { ...motionPresets.titleBreath.to }, index * 0.1)
          } else if (type === 'image') {
            tl.to(el, { ...motionPresets.imageReveal.to }, index * 0.1)
          } else if (type === 'line') {
            tl.to(el, { ...motionPresets.lineDraw.to }, index * 0.1)
          } else if (type === 'number') {
            tl.to(el, { ...motionPresets.numberReveal.to }, index * 0.1)
          } else if (type === 'card') {
            tl.to(el, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, index * 0.1)
          } else {
            tl.to(el, { ...motionPresets.fadeUp.to }, index * 0.1)
          }
        })
      })
    })

    return () => ctx.revert()
  }, [shouldReduceMotion])
}
