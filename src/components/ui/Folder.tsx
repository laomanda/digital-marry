import React, { useEffect, useState } from 'react'

interface FolderProps {
  color?: string
  size?: number
  items?: React.ReactNode[]
  className?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
  ariaLabel?: string
  icon?: React.ReactNode
}

const darkenColor = (hex: string, percent: number): string => {
  let color = hex.startsWith('#') ? hex.slice(1) : hex

  if (color.length === 3) {
    color = color
      .split('')
      .map((c) => c + c)
      .join('')
  }

  const num = parseInt(color, 16)
  let r = (num >> 16) & 0xff
  let g = (num >> 8) & 0xff
  let b = num & 0xff

  r = Math.max(0, Math.min(255, Math.floor(r * (1 - percent))))
  g = Math.max(0, Math.min(255, Math.floor(g * (1 - percent))))
  b = Math.max(0, Math.min(255, Math.floor(b * (1 - percent))))

  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`
}

const Folder: React.FC<FolderProps> = ({
  color = '#D8D4CA',
  size = 1,
  items = [],
  className = '',
  open,
  onOpenChange,
  ariaLabel,
  icon,
}) => {
  const maxItems = 3
  const papers = items.slice(0, maxItems)

  const [internalOpen, setInternalOpen] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [paperOffsets, setPaperOffsets] = useState<{ x: number; y: number }[]>(
    Array.from({ length: maxItems }, () => ({ x: 0, y: 0 }))
  )
  const isControlled = typeof open === 'boolean'
  const isOpen = isControlled ? open : internalOpen

  const folderBackColor = darkenColor(color, 0.08)
  const paper1 = darkenColor('#ffffff', 0.1)
  const paper2 = darkenColor('#ffffff', 0.05)
  const paper3 = '#ffffff'

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setPrefersReducedMotion(media.matches)

    update()
    media.addEventListener('change', update)

    return () => media.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (!isOpen) {
      setPaperOffsets(Array.from({ length: maxItems }, () => ({ x: 0, y: 0 })))
    }
  }, [isOpen])

  const toggleOpen = () => {
    const nextOpen = !isOpen

    if (!isControlled) {
      setInternalOpen(nextOpen)
    }

    onOpenChange?.(nextOpen)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Enter' && event.key !== ' ') return
    event.preventDefault()
    toggleOpen()
  }

  const handlePaperMouseMove = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, index: number) => {
    if (!isOpen || prefersReducedMotion) return

    const rect = event.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const offsetX = (event.clientX - centerX) * 0.15
    const offsetY = (event.clientY - centerY) * 0.15

    setPaperOffsets((prev) => {
      const newOffsets = [...prev]
      newOffsets[index] = { x: offsetX, y: offsetY }
      return newOffsets
    })
  }

  const handlePaperMouseLeave = (_event: React.MouseEvent<HTMLDivElement, MouseEvent>, index: number) => {
    setPaperOffsets((prev) => {
      const newOffsets = [...prev]
      newOffsets[index] = { x: 0, y: 0 }
      return newOffsets
    })
  }

  const folderStyle = {
    '--folder-color': color,
    '--folder-back-color': folderBackColor,
    '--paper-1': paper1,
    '--paper-2': paper2,
    '--paper-3': paper3,
  } as React.CSSProperties

  const scaleStyle = {
    transform: `scale(${size})`,
    transformOrigin: 'center',
  }

  const getOpenTransform = (index: number) => {
    if (papers.length === 1) return 'translate(-50%, -95%) rotate(0deg)'
    if (papers.length === 2) {
      if (index === 0) return 'translate(-118%, -76%) rotate(-6deg)'
      if (index === 1) return 'translate(18%, -76%) rotate(6deg)'
    }
    if (index === 0) return 'translate(-120%, -70%) rotate(-15deg)'
    if (index === 1) return 'translate(10%, -70%) rotate(15deg)'
    if (index === 2) return 'translate(-50%, -100%) rotate(5deg)'
    return ''
  }

  return (
    <div style={scaleStyle} className={className}>
      <div
        className={`group relative cursor-pointer transition-all duration-200 ease-in motion-reduce:transition-none ${
          !isOpen ? 'hover:-translate-y-2' : ''
        }`}
        style={{
          ...folderStyle,
          transform: isOpen ? 'translateY(-8px)' : undefined,
        }}
      >
        <div
          className="relative h-[80px] w-[100px] rounded-bl-[10px] rounded-br-[10px] rounded-tl-0 rounded-tr-[10px]"
          style={{ backgroundColor: folderBackColor }}
        >
          <div
            className="absolute inset-0 z-10 rounded-[10px] focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-3 focus-visible:outline-[#F5F5F0]"
            onClick={toggleOpen}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={0}
            aria-expanded={isOpen}
            aria-label={ariaLabel || (isOpen ? 'Tutup amplop digital' : 'Buka amplop digital')}
          />
          <span
            className="absolute bottom-[98%] left-0 z-0 h-[10px] w-[30px] rounded-bl-0 rounded-br-0 rounded-tl-[5px] rounded-tr-[5px]"
            style={{ backgroundColor: folderBackColor }}
            aria-hidden="true"
          />

          {papers.map((item, i) => {
            let sizeClasses = ''
            if (papers.length === 1) {
              sizeClasses = 'h-[80%] w-[78%]'
            } else if (papers.length === 2) {
              sizeClasses = isOpen ? 'h-[80%] w-[78%]' : 'h-[70%] w-[78%]'
            } else {
              if (i === 0) sizeClasses = 'h-[80%] w-[70%]'
              if (i === 1) sizeClasses = isOpen ? 'h-[80%] w-[80%]' : 'h-[70%] w-[80%]'
              if (i === 2) sizeClasses = isOpen ? 'h-[80%] w-[90%]' : 'h-[60%] w-[90%]'
            }

            const transformStyle = isOpen
              ? `${getOpenTransform(i)} translate(${prefersReducedMotion ? 0 : paperOffsets[i].x}px, ${
                  prefersReducedMotion ? 0 : paperOffsets[i].y
                }px)`
              : undefined

            return (
              <div
                key={i}
                onClick={(event) => {
                  if (isOpen) event.stopPropagation()
                }}
                onMouseMove={(event) => handlePaperMouseMove(event, i)}
                onMouseLeave={(event) => handlePaperMouseLeave(event, i)}
                aria-hidden={!isOpen}
                className={`absolute bottom-[10%] left-1/2 z-20 transition-all duration-300 ease-in-out motion-reduce:transition-none ${
                  !isOpen
                    ? 'pointer-events-none transform -translate-x-1/2 translate-y-[10%] group-hover:translate-y-0'
                    : 'pointer-events-auto hover:scale-[1.015] motion-reduce:hover:scale-100'
                } ${sizeClasses}`}
                style={{
                  ...(!isOpen ? {} : { transform: transformStyle }),
                  backgroundColor: i === 0 ? paper1 : i === 1 ? paper2 : paper3,
                  borderRadius: '5px',
                }}
              >
                {item}
              </div>
            )
          })}

          <div
            className={`pointer-events-none absolute z-30 h-full w-full origin-bottom transition-all duration-300 ease-in-out motion-reduce:transition-none ${
              !isOpen ? 'group-hover:[transform:skew(15deg)_scaleY(0.6)]' : ''
            }`}
            style={{
              backgroundColor: color,
              borderRadius: '5px 10px 10px 10px',
              ...(isOpen && { transform: 'skew(15deg) scaleY(0.6)' }),
            }}
            aria-hidden="true"
          />
          <div
            className={`pointer-events-none absolute z-30 h-full w-full origin-bottom transition-all duration-300 ease-in-out motion-reduce:transition-none ${
              !isOpen ? 'group-hover:[transform:skew(-15deg)_scaleY(0.6)]' : ''
            }`}
            style={{
              backgroundColor: color,
              borderRadius: '5px 10px 10px 10px',
              ...(isOpen && { transform: 'skew(-15deg) scaleY(0.6)' }),
            }}
            aria-hidden="true"
          />

          {icon && (
            <div
              className={`pointer-events-none absolute left-1/2 top-1/2 z-40 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 group-hover:scale-[1.04] ${
                isOpen ? 'opacity-35' : 'opacity-55'
              }`}
              aria-hidden="true"
            >
              {icon}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Folder
