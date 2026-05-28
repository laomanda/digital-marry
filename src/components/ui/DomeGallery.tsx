import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { useGesture } from '@use-gesture/react'
import { X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

type ImageItem = string | { src: string; alt?: string }

type DomeGalleryProps = {
  images?: ImageItem[]
  fit?: number
  fitBasis?: 'auto' | 'min' | 'max' | 'width' | 'height'
  minRadius?: number
  maxRadius?: number
  padFactor?: number
  overlayBlurColor?: string
  maxVerticalRotationDeg?: number
  dragSensitivity?: number
  enlargeTransitionMs?: number
  segments?: number
  dragDampening?: number
  openedImageWidth?: string
  openedImageHeight?: string
  imageBorderRadius?: string
  openedImageBorderRadius?: string
  grayscale?: boolean
  shouldReduceMotion?: boolean
  onRequestClose?: () => void
}

type ItemDef = {
  src: string
  alt: string
  x: number
  y: number
  sizeX: number
  sizeY: number
}

const DEFAULT_IMAGES: ImageItem[] = []

const DEFAULTS = {
  maxVerticalRotationDeg: 5,
  dragSensitivity: 20,
  enlargeTransitionMs: 300,
  segments: 35,
}

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max)
const normalizeAngle = (d: number) => ((d % 360) + 360) % 360
const wrapAngleSigned = (deg: number) => {
  const a = (((deg + 180) % 360) + 360) % 360
  return a - 180
}

const getDataNumber = (el: HTMLElement, name: string, fallback: number) => {
  const attr = el.dataset[name] ?? el.getAttribute(`data-${name}`)
  const n = attr == null ? NaN : parseFloat(attr)
  return Number.isFinite(n) ? n : fallback
}

function normalizeImages(pool: ImageItem[]) {
  return pool
    .map((image) => {
      if (typeof image === 'string') {
        return { src: image, alt: 'Wedding gallery photo' }
      }

      return { src: image.src || '', alt: image.alt || 'Wedding gallery photo' }
    })
    .filter((image) => image.src)
}

function buildItems(pool: ImageItem[], seg: number): ItemDef[] {
  const xCols = Array.from({ length: seg }, (_, i) => -37 + i * 2)
  const evenYs = [-4, -2, 0, 2, 4]
  const oddYs = [-3, -1, 1, 3, 5]
  const coords = xCols.flatMap((x, c) => {
    const ys = c % 2 === 0 ? evenYs : oddYs
    return ys.map((y) => ({ x, y, sizeX: 2, sizeY: 2 }))
  })

  const totalSlots = coords.length
  const normalizedImages = normalizeImages(pool)

  if (normalizedImages.length === 0) {
    return []
  }

  if (normalizedImages.length > totalSlots) {
    console.warn(
      `[DomeGallery] Provided image count (${normalizedImages.length}) exceeds available tiles (${totalSlots}). Some images will not be shown.`
    )
  }

  const usedImages = Array.from({ length: totalSlots }, (_, i) => normalizedImages[i % normalizedImages.length])

  for (let i = 1; i < usedImages.length; i++) {
    if (usedImages[i].src === usedImages[i - 1].src) {
      for (let j = i + 1; j < usedImages.length; j++) {
        if (usedImages[j].src !== usedImages[i].src) {
          const tmp = usedImages[i]
          usedImages[i] = usedImages[j]
          usedImages[j] = tmp
          break
        }
      }
    }
  }

  return coords.map((c, i) => ({ ...c, src: usedImages[i].src, alt: usedImages[i].alt }))
}

function computeItemBaseRotation(
  offsetX: number,
  offsetY: number,
  sizeX: number,
  sizeY: number,
  segments: number
) {
  const unit = 360 / segments / 2
  const rotateY = unit * (offsetX + (sizeX - 1) / 2)
  const rotateX = unit * (offsetY - (sizeY - 1) / 2)
  return { rotateX, rotateY }
}

function useCompactViewport() {
  const [isCompact, setIsCompact] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(max-width: 767px)')
    const update = () => setIsCompact(media.matches)

    update()
    media.addEventListener('change', update)

    return () => media.removeEventListener('change', update)
  }, [])

  return isCompact
}

export default function DomeGallery({
  images = DEFAULT_IMAGES,
  fit = 0.5,
  fitBasis = 'auto',
  minRadius = 600,
  maxRadius = Infinity,
  padFactor = 0.25,
  overlayBlurColor = '#050505',
  maxVerticalRotationDeg = DEFAULTS.maxVerticalRotationDeg,
  dragSensitivity = DEFAULTS.dragSensitivity,
  enlargeTransitionMs = DEFAULTS.enlargeTransitionMs,
  segments = DEFAULTS.segments,
  dragDampening = 0.75,
  openedImageWidth = '400px',
  openedImageHeight = '400px',
  imageBorderRadius = '30px',
  openedImageBorderRadius = '30px',
  grayscale = true,
  shouldReduceMotion = false,
  onRequestClose,
}: DomeGalleryProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const mainRef = useRef<HTMLDivElement>(null)
  const sphereRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const viewerRef = useRef<HTMLDivElement>(null)
  const scrimRef = useRef<HTMLDivElement>(null)
  const focusedElRef = useRef<HTMLElement | null>(null)
  const originalTilePositionRef = useRef<{ left: number; top: number; width: number; height: number } | null>(null)
  const rotationRef = useRef({ x: 0, y: 0 })
  const startRotRef = useRef({ x: 0, y: 0 })
  const startPosRef = useRef<{ x: number; y: number } | null>(null)
  const draggingRef = useRef(false)
  const cancelTapRef = useRef(false)
  const movedRef = useRef(false)
  const inertiaRAF = useRef<number | null>(null)
  const pointerTypeRef = useRef<'mouse' | 'pen' | 'touch'>('mouse')
  const tapTargetRef = useRef<HTMLElement | null>(null)
  const openingRef = useRef(false)
  const openStartedAtRef = useRef(0)
  const lastDragEndAt = useRef(0)
  const scrollLockedRef = useRef(false)
  const lockedRadiusRef = useRef<number | null>(null)
  const isCompact = useCompactViewport()
  const isStatic = shouldReduceMotion || isCompact
  const staticImages = useMemo(() => normalizeImages(images), [images])
  const [staticOpenedImage, setStaticOpenedImage] = useState<{ src: string; alt: string } | null>(null)

  const lockScroll = useCallback(() => {
    if (scrollLockedRef.current) return
    scrollLockedRef.current = true
    document.body.classList.add('dg-scroll-lock')
  }, [])

  const unlockScroll = useCallback(() => {
    if (!scrollLockedRef.current) return
    if (rootRef.current?.getAttribute('data-enlarging') === 'true') return
    scrollLockedRef.current = false
    document.body.classList.remove('dg-scroll-lock')
  }, [])

  const items = useMemo(() => buildItems(images, segments), [images, segments])

  const applyTransform = useCallback((xDeg: number, yDeg: number) => {
    const el = sphereRef.current
    if (el) {
      el.style.transform = `translateZ(calc(var(--radius) * -1)) rotateX(${xDeg}deg) rotateY(${yDeg}deg)`
    }
  }, [])

  useEffect(() => {
    if (isStatic) return undefined

    const root = rootRef.current
    if (!root) return undefined

    const ro = new ResizeObserver((entries) => {
      const cr = entries[0].contentRect
      const w = Math.max(1, cr.width)
      const h = Math.max(1, cr.height)
      const minDim = Math.min(w, h)
      const maxDim = Math.max(w, h)
      const aspect = w / h

      let basis: number
      switch (fitBasis) {
        case 'min':
          basis = minDim
          break
        case 'max':
          basis = maxDim
          break
        case 'width':
          basis = w
          break
        case 'height':
          basis = h
          break
        default:
          basis = aspect >= 1.3 ? w : minDim
      }

      let radius = basis * fit
      const heightGuard = h * 1.35
      radius = Math.min(radius, heightGuard)
      radius = clamp(radius, minRadius, maxRadius)
      lockedRadiusRef.current = Math.round(radius)

      const viewerPad = Math.max(8, Math.round(minDim * padFactor))
      root.style.setProperty('--radius', `${lockedRadiusRef.current}px`)
      root.style.setProperty('--viewer-pad', `${viewerPad}px`)
      root.style.setProperty('--overlay-blur-color', overlayBlurColor)
      root.style.setProperty('--tile-radius', imageBorderRadius)
      root.style.setProperty('--enlarge-radius', openedImageBorderRadius)
      root.style.setProperty('--image-filter', grayscale ? 'grayscale(1)' : 'none')
      applyTransform(rotationRef.current.x, rotationRef.current.y)

      const enlargedOverlay = viewerRef.current?.querySelector('.enlarge') as HTMLElement | null
      if (enlargedOverlay && root.getAttribute('data-enlarging') === 'true' && frameRef.current && mainRef.current) {
        const frameR = frameRef.current.getBoundingClientRect()
        const mainR = mainRef.current.getBoundingClientRect()

        if (openedImageWidth && openedImageHeight) {
          const tempDiv = document.createElement('div')
          tempDiv.style.cssText = `position: absolute; width: ${openedImageWidth}; height: ${openedImageHeight}; visibility: hidden;`
          document.body.appendChild(tempDiv)
          const tempRect = tempDiv.getBoundingClientRect()
          document.body.removeChild(tempDiv)

          const centeredLeft = frameR.left - mainR.left + (frameR.width - tempRect.width) / 2
          const centeredTop = frameR.top - mainR.top + (frameR.height - tempRect.height) / 2
          enlargedOverlay.style.left = `${centeredLeft}px`
          enlargedOverlay.style.top = `${centeredTop}px`
        } else {
          enlargedOverlay.style.left = `${frameR.left - mainR.left}px`
          enlargedOverlay.style.top = `${frameR.top - mainR.top}px`
          enlargedOverlay.style.width = `${frameR.width}px`
          enlargedOverlay.style.height = `${frameR.height}px`
        }
      }
    })

    ro.observe(root)
    return () => ro.disconnect()
  }, [
    applyTransform,
    fit,
    fitBasis,
    grayscale,
    imageBorderRadius,
    isStatic,
    maxRadius,
    minRadius,
    openedImageBorderRadius,
    openedImageHeight,
    openedImageWidth,
    overlayBlurColor,
    padFactor,
  ])

  useEffect(() => {
    if (isStatic) return
    applyTransform(rotationRef.current.x, rotationRef.current.y)
  }, [applyTransform, isStatic])

  const stopInertia = useCallback(() => {
    if (inertiaRAF.current) {
      cancelAnimationFrame(inertiaRAF.current)
      inertiaRAF.current = null
    }
  }, [])

  const startInertia = useCallback(
    (vx: number, vy: number) => {
      const MAX_V = 1.4
      let vX = clamp(vx, -MAX_V, MAX_V) * 80
      let vY = clamp(vy, -MAX_V, MAX_V) * 80
      let frames = 0
      const d = clamp(dragDampening ?? 0.6, 0, 1)
      const frictionMul = 0.94 + 0.055 * d
      const stopThreshold = 0.015 - 0.01 * d
      const maxFrames = Math.round(90 + 270 * d)

      const step = () => {
        vX *= frictionMul
        vY *= frictionMul

        if (Math.abs(vX) < stopThreshold && Math.abs(vY) < stopThreshold) {
          inertiaRAF.current = null
          return
        }

        if (++frames > maxFrames) {
          inertiaRAF.current = null
          return
        }

        const nextX = clamp(rotationRef.current.x - vY / 200, -maxVerticalRotationDeg, maxVerticalRotationDeg)
        const nextY = wrapAngleSigned(rotationRef.current.y + vX / 200)
        rotationRef.current = { x: nextX, y: nextY }
        applyTransform(nextX, nextY)
        inertiaRAF.current = requestAnimationFrame(step)
      }

      stopInertia()
      inertiaRAF.current = requestAnimationFrame(step)
    },
    [applyTransform, dragDampening, maxVerticalRotationDeg, stopInertia]
  )

  const openItemFromElement = useCallback(
    (el: HTMLElement) => {
      if (openingRef.current) return

      openingRef.current = true
      openStartedAtRef.current = performance.now()
      lockScroll()

      const parent = el.parentElement as HTMLElement
      focusedElRef.current = el
      el.setAttribute('data-focused', 'true')

      const offsetX = getDataNumber(parent, 'offsetX', 0)
      const offsetY = getDataNumber(parent, 'offsetY', 0)
      const sizeX = getDataNumber(parent, 'sizeX', 2)
      const sizeY = getDataNumber(parent, 'sizeY', 2)
      const parentRot = computeItemBaseRotation(offsetX, offsetY, sizeX, sizeY, segments)
      const parentY = normalizeAngle(parentRot.rotateY)
      const globalY = normalizeAngle(rotationRef.current.y)
      let rotY = -(parentY + globalY) % 360
      if (rotY < -180) rotY += 360

      const rotX = -parentRot.rotateX - rotationRef.current.x
      parent.style.setProperty('--rot-y-delta', `${rotY}deg`)
      parent.style.setProperty('--rot-x-delta', `${rotX}deg`)

      const refDiv = document.createElement('div')
      refDiv.className = 'item__image item__image--reference opacity-0'
      refDiv.style.transform = `rotateX(${-parentRot.rotateX}deg) rotateY(${-parentRot.rotateY}deg)`
      parent.appendChild(refDiv)
      void refDiv.offsetHeight

      const tileR = refDiv.getBoundingClientRect()
      const mainR = mainRef.current?.getBoundingClientRect()
      const frameR = frameRef.current?.getBoundingClientRect()

      if (!mainR || !frameR || tileR.width <= 0 || tileR.height <= 0) {
        openingRef.current = false
        focusedElRef.current = null
        parent.removeChild(refDiv)
        unlockScroll()
        return
      }

      originalTilePositionRef.current = { left: tileR.left, top: tileR.top, width: tileR.width, height: tileR.height }
      el.style.visibility = 'hidden'
      el.style.zIndex = '0'

      const overlay = document.createElement('div')
      overlay.className = 'enlarge'
      overlay.style.cssText = `position:absolute; left:${frameR.left - mainR.left}px; top:${frameR.top - mainR.top}px; width:${frameR.width}px; height:${frameR.height}px; opacity:0; z-index:30; will-change:transform,opacity; transform-origin:top left; transition:transform ${enlargeTransitionMs}ms ease, opacity ${enlargeTransitionMs}ms ease; border-radius:${openedImageBorderRadius}; overflow:hidden; box-shadow:0 10px 30px rgba(0,0,0,.35);`

      const rawSrc = parent.dataset.src || (el.querySelector('img') as HTMLImageElement | null)?.src || ''
      const rawAlt = parent.dataset.alt || (el.querySelector('img') as HTMLImageElement | null)?.alt || ''
      const img = document.createElement('img')
      img.src = rawSrc
      img.alt = rawAlt
      img.style.cssText = `width:100%; height:100%; object-fit:cover; filter:${grayscale ? 'grayscale(1)' : 'none'};`
      overlay.appendChild(img)
      viewerRef.current?.appendChild(overlay)

      const tx0 = tileR.left - frameR.left
      const ty0 = tileR.top - frameR.top
      const sx0 = tileR.width / frameR.width
      const sy0 = tileR.height / frameR.height
      const validSx0 = Number.isFinite(sx0) && sx0 > 0 ? sx0 : 1
      const validSy0 = Number.isFinite(sy0) && sy0 > 0 ? sy0 : 1
      overlay.style.transform = `translate(${tx0}px, ${ty0}px) scale(${validSx0}, ${validSy0})`

      window.setTimeout(() => {
        if (!overlay.parentElement) return
        overlay.style.opacity = '1'
        overlay.style.transform = 'translate(0px, 0px) scale(1, 1)'
        rootRef.current?.setAttribute('data-enlarging', 'true')
      }, 16)

      if (openedImageWidth || openedImageHeight) {
        const onFirstEnd = (ev: TransitionEvent) => {
          if (ev.propertyName !== 'transform') return
          overlay.removeEventListener('transitionend', onFirstEnd)

          const prevTransition = overlay.style.transition
          overlay.style.transition = 'none'
          const tempWidth = openedImageWidth || `${frameR.width}px`
          const tempHeight = openedImageHeight || `${frameR.height}px`
          overlay.style.width = tempWidth
          overlay.style.height = tempHeight
          const newRect = overlay.getBoundingClientRect()
          overlay.style.width = `${frameR.width}px`
          overlay.style.height = `${frameR.height}px`
          void overlay.offsetWidth
          overlay.style.transition = `left ${enlargeTransitionMs}ms ease, top ${enlargeTransitionMs}ms ease, width ${enlargeTransitionMs}ms ease, height ${enlargeTransitionMs}ms ease`

          const centeredLeft = frameR.left - mainR.left + (frameR.width - newRect.width) / 2
          const centeredTop = frameR.top - mainR.top + (frameR.height - newRect.height) / 2

          requestAnimationFrame(() => {
            overlay.style.left = `${centeredLeft}px`
            overlay.style.top = `${centeredTop}px`
            overlay.style.width = tempWidth
            overlay.style.height = tempHeight
          })

          const cleanupSecond = () => {
            overlay.removeEventListener('transitionend', cleanupSecond)
            overlay.style.transition = prevTransition
          }
          overlay.addEventListener('transitionend', cleanupSecond, { once: true })
        }

        overlay.addEventListener('transitionend', onFirstEnd)
      }
    },
    [
      enlargeTransitionMs,
      grayscale,
      lockScroll,
      openedImageBorderRadius,
      openedImageHeight,
      openedImageWidth,
      segments,
      unlockScroll,
    ]
  )

  const closeEnlargedImage = useCallback(() => {
    if (performance.now() - openStartedAtRef.current < 250) return

    const el = focusedElRef.current
    if (!el) return

    const parent = el.parentElement as HTMLElement
    const overlay = viewerRef.current?.querySelector('.enlarge') as HTMLElement | null
    if (!overlay) return

    const refDiv = parent.querySelector('.item__image--reference') as HTMLElement | null
    const originalPos = originalTilePositionRef.current

    if (!originalPos) {
      overlay.remove()
      if (refDiv) refDiv.remove()
      parent.style.setProperty('--rot-y-delta', '0deg')
      parent.style.setProperty('--rot-x-delta', '0deg')
      el.style.visibility = ''
      el.style.zIndex = '0'
      focusedElRef.current = null
      rootRef.current?.removeAttribute('data-enlarging')
      openingRef.current = false
      unlockScroll()
      return
    }

    const currentRect = overlay.getBoundingClientRect()
    const rootRect = rootRef.current?.getBoundingClientRect()
    if (!rootRect) return

    const originalPosRelativeToRoot = {
      left: originalPos.left - rootRect.left,
      top: originalPos.top - rootRect.top,
      width: originalPos.width,
      height: originalPos.height,
    }

    const overlayRelativeToRoot = {
      left: currentRect.left - rootRect.left,
      top: currentRect.top - rootRect.top,
      width: currentRect.width,
      height: currentRect.height,
    }

    const animatingOverlay = document.createElement('div')
    animatingOverlay.className = 'enlarge-closing'
    animatingOverlay.style.cssText = `position:absolute; left:${overlayRelativeToRoot.left}px; top:${overlayRelativeToRoot.top}px; width:${overlayRelativeToRoot.width}px; height:${overlayRelativeToRoot.height}px; z-index:9999; border-radius:${openedImageBorderRadius}; overflow:hidden; box-shadow:0 10px 30px rgba(0,0,0,.35); transition:all ${enlargeTransitionMs}ms ease-out; pointer-events:none; margin:0; transform:none; filter:${grayscale ? 'grayscale(1)' : 'none'};`

    const originalImg = overlay.querySelector('img')
    if (originalImg) {
      const img = originalImg.cloneNode() as HTMLImageElement
      img.style.cssText = 'width:100%; height:100%; object-fit:cover;'
      animatingOverlay.appendChild(img)
    }

    overlay.remove()
    rootRef.current?.appendChild(animatingOverlay)
    void animatingOverlay.getBoundingClientRect()

    requestAnimationFrame(() => {
      animatingOverlay.style.left = `${originalPosRelativeToRoot.left}px`
      animatingOverlay.style.top = `${originalPosRelativeToRoot.top}px`
      animatingOverlay.style.width = `${originalPosRelativeToRoot.width}px`
      animatingOverlay.style.height = `${originalPosRelativeToRoot.height}px`
      animatingOverlay.style.opacity = '0'
    })

    const cleanup = () => {
      animatingOverlay.remove()
      originalTilePositionRef.current = null
      if (refDiv) refDiv.remove()
      parent.style.transition = 'none'
      el.style.transition = 'none'
      parent.style.setProperty('--rot-y-delta', '0deg')
      parent.style.setProperty('--rot-x-delta', '0deg')

      requestAnimationFrame(() => {
        el.style.visibility = ''
        el.style.opacity = '0'
        el.style.zIndex = '0'
        focusedElRef.current = null
        rootRef.current?.removeAttribute('data-enlarging')

        requestAnimationFrame(() => {
          parent.style.transition = ''
          el.style.transition = 'opacity 300ms ease-out'

          requestAnimationFrame(() => {
            el.style.opacity = '1'
            window.setTimeout(() => {
              el.style.transition = ''
              el.style.opacity = ''
              openingRef.current = false
              unlockScroll()
            }, 300)
          })
        })
      })
    }

    animatingOverlay.addEventListener('transitionend', cleanup, { once: true })
  }, [enlargeTransitionMs, grayscale, openedImageBorderRadius, unlockScroll])

  useGesture(
    {
      onDragStart: ({ event }) => {
        if (focusedElRef.current || isStatic) return

        stopInertia()
        const evt = event as PointerEvent
        pointerTypeRef.current = (evt.pointerType as 'mouse' | 'pen' | 'touch') || 'mouse'
        if (pointerTypeRef.current === 'touch') evt.preventDefault()
        if (pointerTypeRef.current === 'touch') lockScroll()

        draggingRef.current = true
        cancelTapRef.current = false
        movedRef.current = false
        startRotRef.current = { ...rotationRef.current }
        startPosRef.current = { x: evt.clientX, y: evt.clientY }

        const potential = (evt.target as Element).closest?.('.item__image') as HTMLElement | null
        tapTargetRef.current = potential || null
      },
      onDrag: ({ event, last, velocity: velArr = [0, 0], direction: dirArr = [0, 0], movement }) => {
        if (focusedElRef.current || !draggingRef.current || !startPosRef.current || isStatic) return

        const evt = event as PointerEvent
        if (pointerTypeRef.current === 'touch') evt.preventDefault()

        const dxTotal = evt.clientX - startPosRef.current.x
        const dyTotal = evt.clientY - startPosRef.current.y

        if (!movedRef.current) {
          const dist2 = dxTotal * dxTotal + dyTotal * dyTotal
          if (dist2 > 16) movedRef.current = true
        }

        const nextX = clamp(startRotRef.current.x - dyTotal / dragSensitivity, -maxVerticalRotationDeg, maxVerticalRotationDeg)
        const nextY = startRotRef.current.y + dxTotal / dragSensitivity
        const cur = rotationRef.current

        if (cur.x !== nextX || cur.y !== nextY) {
          rotationRef.current = { x: nextX, y: nextY }
          applyTransform(nextX, nextY)
        }

        if (last) {
          draggingRef.current = false

          let isTap = false
          if (startPosRef.current) {
            const dx = evt.clientX - startPosRef.current.x
            const dy = evt.clientY - startPosRef.current.y
            const dist2 = dx * dx + dy * dy
            const tapThreshPx = pointerTypeRef.current === 'touch' ? 10 : 6
            if (dist2 <= tapThreshPx * tapThreshPx) isTap = true
          }

          let [vMagX, vMagY] = velArr
          const [dirX, dirY] = dirArr
          let vx = vMagX * dirX
          let vy = vMagY * dirY

          if (!isTap && Math.abs(vx) < 0.001 && Math.abs(vy) < 0.001 && Array.isArray(movement)) {
            const [mx, my] = movement
            vx = (mx / dragSensitivity) * 0.02
            vy = (my / dragSensitivity) * 0.02
          }

          if (!isTap && (Math.abs(vx) > 0.005 || Math.abs(vy) > 0.005)) {
            startInertia(vx, vy)
          }

          startPosRef.current = null
          cancelTapRef.current = !isTap

          if (isTap && tapTargetRef.current && !focusedElRef.current) {
            openItemFromElement(tapTargetRef.current)
          }

          tapTargetRef.current = null
          if (cancelTapRef.current) window.setTimeout(() => (cancelTapRef.current = false), 120)
          if (pointerTypeRef.current === 'touch') unlockScroll()
          if (movedRef.current) lastDragEndAt.current = performance.now()
          movedRef.current = false
        }
      },
    },
    { target: mainRef, eventOptions: { passive: false } }
  )

  useEffect(() => {
    const scrim = scrimRef.current
    if (!scrim || isStatic) return undefined

    scrim.addEventListener('click', closeEnlargedImage)

    return () => {
      scrim.removeEventListener('click', closeEnlargedImage)
    }
  }, [closeEnlargedImage, isStatic])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return

      if (staticOpenedImage) {
        setStaticOpenedImage(null)
        return
      }

      if (focusedElRef.current) {
        closeEnlargedImage()
        return
      }

      onRequestClose?.()
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [closeEnlargedImage, onRequestClose, staticOpenedImage])

  useEffect(() => {
    return () => {
      stopInertia()
      document.body.classList.remove('dg-scroll-lock')
    }
  }, [stopInertia])

  const cssStyles = `
    .sphere-root {
      --radius: 520px;
      --viewer-pad: 72px;
      --circ: calc(var(--radius) * 3.14);
      --rot-y: calc((360deg / var(--segments-x)) / 2);
      --rot-x: calc((360deg / var(--segments-y)) / 2);
      --item-width: calc(var(--circ) / var(--segments-x));
      --item-height: calc(var(--circ) / var(--segments-y));
    }
    .sphere-root * {
      box-sizing: border-box;
    }
    .sphere,
    .sphere-item,
    .item__image {
      transform-style: preserve-3d;
    }
    .stage {
      width: 100%;
      height: 100%;
      display: grid;
      place-items: center;
      position: absolute;
      inset: 0;
      margin: auto;
      perspective: calc(var(--radius) * 2);
      perspective-origin: 50% 50%;
    }
    .sphere {
      transform: translateZ(calc(var(--radius) * -1));
      will-change: transform;
      position: absolute;
    }
    .sphere-item {
      width: calc(var(--item-width) * var(--item-size-x));
      height: calc(var(--item-height) * var(--item-size-y));
      position: absolute;
      top: -999px;
      bottom: -999px;
      left: -999px;
      right: -999px;
      margin: auto;
      transform-origin: 50% 50%;
      backface-visibility: hidden;
      transition: transform 300ms;
      transform:
        rotateY(calc(var(--rot-y) * (var(--offset-x) + ((var(--item-size-x) - 1) / 2)) + var(--rot-y-delta, 0deg)))
        rotateX(calc(var(--rot-x) * (var(--offset-y) - ((var(--item-size-y) - 1) / 2)) + var(--rot-x-delta, 0deg)))
        translateZ(var(--radius));
    }
    .sphere-root[data-enlarging="true"] .scrim {
      opacity: 1 !important;
      pointer-events: all !important;
    }
    .sphere-root[data-enlarging="true"] #desktop-gallery-close {
      opacity: 1 !important;
      pointer-events: auto !important;
    }
    body.dg-scroll-lock {
      overflow: hidden !important;
      touch-action: none !important;
      overscroll-behavior: contain !important;
    }
    .item__image {
      position: absolute;
      inset: 10px;
      border-radius: var(--tile-radius, 18px);
      overflow: hidden;
      cursor: pointer;
      backface-visibility: hidden;
      -webkit-backface-visibility: hidden;
      transition: transform 300ms, border-color 300ms;
      pointer-events: auto;
      -webkit-transform: translateZ(0);
      transform: translateZ(0);
    }
    .item__image--reference {
      position: absolute;
      inset: 10px;
      pointer-events: none;
    }
  `

  if (isStatic) {
    return (
      <div className="relative h-full w-full overflow-hidden">
        <div className="h-full overflow-y-auto px-5 pb-10 pt-24 md:px-10">
          <div className="mx-auto grid max-w-5xl grid-cols-2 gap-3 md:grid-cols-3">
            {staticImages.map((image, index) => (
              <button
                key={`${image.src}-${index}`}
                type="button"
                onClick={() => setStaticOpenedImage(image)}
                aria-label={image.alt}
                className="group relative aspect-[4/5] overflow-hidden border border-[#F5F5F0]/12 bg-[#F5F5F0]/[0.035] transition-colors duration-300 hover:border-[#F5F5F0]/32 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-[#F5F5F0]"
                style={{ borderRadius: imageBorderRadius }}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  loading="lazy"
                  className={`h-full w-full object-cover transition duration-500 group-hover:scale-[1.03] ${
                    grayscale ? 'grayscale' : ''
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence>
          {staticOpenedImage && (
            <motion.div
              key="static-lightbox"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-[150] flex items-center justify-center p-5 backdrop-blur-sm"
              role="dialog"
              aria-modal="true"
              aria-label={staticOpenedImage.alt}
              onClick={() => setStaticOpenedImage(null)}
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 cursor-default"
                style={{ backgroundColor: `${overlayBlurColor}E6` }}
              />
              <motion.button
                initial={{ opacity: 0, scale: 0.8, rotate: -90 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.8, rotate: 45 }}
                transition={{ type: 'spring', damping: 20, stiffness: 300, delay: 0.05 }}
                type="button"
                className="absolute right-6 top-6 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-[#F5F5F0]/16 bg-[#050505]/60 text-[#F5F5F0] transition-all duration-300 hover:bg-[#F5F5F0] hover:text-[#050505] hover:border-transparent active:scale-95 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-[#F5F5F0]"
                onClick={(e) => {
                  e.stopPropagation()
                  setStaticOpenedImage(null)
                }}
                aria-label="Tutup foto"
              >
                <X size={18} strokeWidth={1.5} />
              </motion.button>
              <motion.div 
                initial={{ opacity: 0, scale: 0.92, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                className="relative z-10 overflow-hidden shadow-[0_24px_50px_rgba(0,0,0,0.6)]"
                style={{ borderRadius: openedImageBorderRadius }}
              >
                <img
                  src={staticOpenedImage.src}
                  alt={staticOpenedImage.alt}
                  className={`max-h-[80vh] max-w-[90vw] object-contain ${grayscale ? 'grayscale' : ''}`}
                  style={{
                    width: openedImageWidth,
                    height: openedImageHeight,
                  }}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: cssStyles }} />
      <div
        ref={rootRef}
        className="sphere-root relative h-full w-full"
        style={
          {
            '--segments-x': segments,
            '--segments-y': segments,
            '--overlay-blur-color': overlayBlurColor,
            '--tile-radius': imageBorderRadius,
            '--enlarge-radius': openedImageBorderRadius,
            '--image-filter': grayscale ? 'grayscale(1)' : 'none',
          } as CSSProperties
        }
      >
        <main
          ref={mainRef}
          className="absolute inset-0 grid select-none place-items-center overflow-hidden bg-transparent"
          style={{ touchAction: 'none', WebkitUserSelect: 'none' }}
        >
          <div className="stage">
            <div ref={sphereRef} className="sphere">
              {items.map((it, i) => (
                <div
                  key={`${it.x},${it.y},${i}`}
                  className="sphere-item absolute m-auto"
                  data-src={it.src}
                  data-alt={it.alt}
                  data-offset-x={it.x}
                  data-offset-y={it.y}
                  data-size-x={it.sizeX}
                  data-size-y={it.sizeY}
                  style={
                    {
                      '--offset-x': it.x,
                      '--offset-y': it.y,
                      '--item-size-x': it.sizeX,
                      '--item-size-y': it.sizeY,
                      top: '-999px',
                      bottom: '-999px',
                      left: '-999px',
                      right: '-999px',
                    } as CSSProperties
                  }
                >
                  <div
                    className="item__image absolute block cursor-pointer overflow-hidden border border-[#F5F5F0]/12 bg-[#F5F5F0]/[0.035] transition-colors duration-300 hover:border-[#F5F5F0]/35 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-[#F5F5F0]"
                    role="button"
                    tabIndex={0}
                    aria-label={it.alt || 'Buka foto galeri'}
                    onClick={(event) => {
                      if (draggingRef.current) return
                      if (movedRef.current) return
                      if (performance.now() - lastDragEndAt.current < 80) return
                      if (openingRef.current) return
                      openItemFromElement(event.currentTarget as HTMLElement)
                    }}
                    onKeyDown={(event) => {
                      if (event.key !== 'Enter' && event.key !== ' ') return
                      event.preventDefault()
                      if (openingRef.current) return
                      openItemFromElement(event.currentTarget as HTMLElement)
                    }}
                    onPointerUp={(event) => {
                      if ((event.nativeEvent as PointerEvent).pointerType !== 'touch') return
                      if (draggingRef.current) return
                      if (movedRef.current) return
                      if (performance.now() - lastDragEndAt.current < 80) return
                      if (openingRef.current) return
                      openItemFromElement(event.currentTarget as HTMLElement)
                    }}
                    style={{
                      inset: '10px',
                      borderRadius: `var(--tile-radius, ${imageBorderRadius})`,
                      backfaceVisibility: 'hidden',
                    }}
                  >
                    <img
                      src={it.src}
                      draggable={false}
                      alt={it.alt}
                      loading="lazy"
                      className="pointer-events-none h-full w-full object-cover"
                      style={{
                        backfaceVisibility: 'hidden',
                        filter: `var(--image-filter, ${grayscale ? 'grayscale(1)' : 'none'})`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            className="pointer-events-none absolute inset-0 z-[3] m-auto"
            style={{
              backgroundImage: `radial-gradient(rgba(235, 235, 235, 0) 65%, var(--overlay-blur-color, ${overlayBlurColor}) 100%)`,
            }}
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-0 z-[3] m-auto"
            style={{
              WebkitMaskImage: `radial-gradient(rgba(235, 235, 235, 0) 70%, var(--overlay-blur-color, ${overlayBlurColor}) 90%)`,
              maskImage: `radial-gradient(rgba(235, 235, 235, 0) 70%, var(--overlay-blur-color, ${overlayBlurColor}) 90%)`,
              backdropFilter: 'blur(3px)',
            }}
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute left-0 right-0 top-0 z-[5] h-[120px] rotate-180"
            style={{ background: `linear-gradient(to bottom, transparent, var(--overlay-blur-color, ${overlayBlurColor}))` }}
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute bottom-0 left-0 right-0 z-[5] h-[120px]"
            style={{ background: `linear-gradient(to bottom, transparent, var(--overlay-blur-color, ${overlayBlurColor}))` }}
            aria-hidden="true"
          />

          <div
            ref={viewerRef}
            className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center"
            style={{ padding: 'var(--viewer-pad)' }}
          >
            <div
              ref={scrimRef}
              className="scrim pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-500"
              style={{ background: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(3px)' }}
              aria-hidden="true"
            />
            <button
              type="button"
              className="absolute right-8 top-8 z-30 flex h-10 w-10 items-center justify-center rounded-full border border-[#F5F5F0]/16 bg-[#050505]/60 text-[#F5F5F0] opacity-0 transition-all duration-500 hover:bg-[#F5F5F0] hover:text-[#050505] hover:border-transparent active:scale-95 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-[#F5F5F0] pointer-events-none"
              style={{
                transitionProperty: 'opacity, transform, background-color, color, border-color'
              }}
              onClick={(e) => {
                e.stopPropagation()
                closeEnlargedImage()
              }}
              id="desktop-gallery-close"
              aria-label="Tutup foto"
            >
              <X size={18} strokeWidth={1.5} />
            </button>
            <div
              ref={frameRef}
              className="viewer-frame flex aspect-square h-full"
              style={{ borderRadius: `var(--enlarge-radius, ${openedImageBorderRadius})` }}
              aria-hidden="true"
            />
          </div>
        </main>
      </div>
    </>
  )
}
