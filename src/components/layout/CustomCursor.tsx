import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useReducedMotionSafe } from '../../hooks/useReducedMotionSafe'

const INTERACTIVE_SELECTOR =
  'a,button,input,textarea,select,[role="button"],[data-cursor="true"]'

export default function CustomCursor() {
  const { shouldReduceMotion } = useReducedMotionSafe()
  const [isHovering, setIsHovering] = useState(false)
  const [isTypingTarget, setIsTypingTarget] = useState(false)
  const [label, setLabel] = useState('')
  const [pressed, setPressed] = useState(false)
  const [isPointerSafe, setIsPointerSafe] = useState(false)

  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)
  const ringX = useSpring(cursorX, { stiffness: 180, damping: 24, mass: 0.35 })
  const ringY = useSpring(cursorY, { stiffness: 180, damping: 24, mass: 0.35 })

  useEffect(() => {
    if (typeof window === 'undefined') return

    const hoverNoneQuery = window.matchMedia('(hover: none)')
    const pointerCoarseQuery = window.matchMedia('(pointer: coarse)')

    const updatePointerSafety = () => {
      const hasTouch =
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        (navigator as Navigator & { msMaxTouchPoints?: number }).msMaxTouchPoints! > 0

      setIsPointerSafe(
        !shouldReduceMotion &&
          !hoverNoneQuery.matches &&
          !pointerCoarseQuery.matches &&
          !hasTouch,
      )
    }

    updatePointerSafety()

    hoverNoneQuery.addEventListener('change', updatePointerSafety)
    pointerCoarseQuery.addEventListener('change', updatePointerSafety)

    return () => {
      hoverNoneQuery.removeEventListener('change', updatePointerSafety)
      pointerCoarseQuery.removeEventListener('change', updatePointerSafety)
    }
  }, [shouldReduceMotion])

  useEffect(() => {
    if (!isPointerSafe) return

    const resetHover = () => {
      setIsHovering(false)
      setIsTypingTarget(false)
      setLabel('')
    }

    const syncHoverTarget = (target: EventTarget | null) => {
      const element =
        target instanceof HTMLElement
          ? target.closest<HTMLElement>(INTERACTIVE_SELECTOR)
          : null

      if (!element) {
        resetHover()
        return
      }

      const isFormField =
        element.matches('input,textarea,select') ||
        element.closest('input,textarea,select') !== null

      setIsHovering(true)
      setIsTypingTarget(isFormField)
      setLabel(element.getAttribute('data-cursor-label') || '')
    }

    const handleMouseMove = (event: MouseEvent) => {
      cursorX.set(event.clientX)
      cursorY.set(event.clientY)
    }

    const handleMouseOver = (event: MouseEvent) => {
      syncHoverTarget(event.target)
    }

    const handleMouseOut = (event: MouseEvent) => {
      const nextTarget = event.relatedTarget

      if (nextTarget instanceof HTMLElement) {
        syncHoverTarget(nextTarget)
        return
      }

      resetHover()
    }

    const handleMouseDown = () => setPressed(true)
    const handleMouseUp = () => setPressed(false)

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseover', handleMouseOver)
    window.addEventListener('mouseout', handleMouseOut)
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseover', handleMouseOver)
      window.removeEventListener('mouseout', handleMouseOut)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [cursorX, cursorY, isPointerSafe])

  if (!isPointerSafe) {
    return null
  }

  const ringSize = isTypingTarget ? 24 : isHovering ? 64 : 38
  const dotSize = isTypingTarget ? 4 : isHovering ? 3 : 7

  return (
    <>
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9000] rounded-full bg-[#F5F5F0]"
        style={{
          x: cursorX,
          y: cursorY,
          width: dotSize,
          height: dotSize,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          opacity: isTypingTarget ? 0.35 : isHovering ? 0.25 : 0.85,
          scale: pressed ? 0.7 : 1,
        }}
        transition={{ duration: 0.16, ease: 'easeOut' }}
      />

      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9000] flex items-center justify-center rounded-full border border-solid"
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: ringSize,
          height: ringSize,
          scale: pressed ? 0.92 : 1,
          borderColor: isHovering
            ? 'rgba(245,245,240,0.62)'
            : 'rgba(245,245,240,0.35)',
          backgroundColor:
            isHovering && !isTypingTarget
              ? 'rgba(245,245,240,0.035)'
              : 'rgba(245,245,240,0)',
        }}
        transition={{ type: 'spring', stiffness: 320, damping: 28, mass: 0.4 }}
      >
        <motion.span
          className="select-none font-mono text-[9px] font-medium uppercase leading-none tracking-[0.22em] text-[#F5F5F0]"
          animate={{
            opacity: label && !isTypingTarget ? 0.9 : 0,
            scale: label && !isTypingTarget ? 1 : 0.94,
          }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
        >
          {label}
        </motion.span>
      </motion.div>
    </>
  )
}
