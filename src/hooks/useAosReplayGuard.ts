import { useEffect } from 'react'

const AOS_SECTION_IDS = new Set([
  'couple',
  'quote',
  'countdown',
  'event',
  'rsvp',
  'live-stream',
  'wishes',
  'gift',
  'closing',
])

const AOS_SELECTOR = Array.from(AOS_SECTION_IDS)
  .map((id) => `#${id} [data-aos]`)
  .join(', ')

export function useAosReplayGuard(deps: React.DependencyList = []) {
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!('IntersectionObserver' in window)) return

    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (reducedMotionQuery.matches) return

    let isDisposed = false
    let observer: IntersectionObserver | null = null
    let mutationObserver: MutationObserver | null = null
    const visibleState = new WeakMap<HTMLElement, boolean>()
    const timeoutIds: number[] = []

    const getAosElements = () =>
      Array.from(document.querySelectorAll<HTMLElement>(AOS_SELECTOR)).filter((element) => {
        const section = element.closest<HTMLElement>('[data-section]')
        return Boolean(section?.id && AOS_SECTION_IDS.has(section.id))
      })

    const syncAnimationClass = (element: HTMLElement) => {
      const isVisible = visibleState.get(element) === true

      if (isVisible && !element.classList.contains('aos-animate')) {
        element.classList.add('aos-animate')
      }

      if (!isVisible && element.classList.contains('aos-animate')) {
        element.classList.remove('aos-animate')
      }
    }

    const observeElements = () => {
      if (isDisposed) return

      observer?.disconnect()
      mutationObserver?.disconnect()

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const element = entry.target as HTMLElement

            visibleState.set(element, entry.isIntersecting)
            syncAnimationClass(element)
          })
        },
        {
          root: null,
          rootMargin: '0px 0px -80px 0px',
          threshold: 0.01,
        }
      )

      mutationObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type !== 'attributes') return

          const element = mutation.target as HTMLElement
          if (!element.matches('[data-aos]')) return

          syncAnimationClass(element)
        })
      })

      getAosElements().forEach((element) => {
        visibleState.set(element, false)
        observer?.observe(element)
        mutationObserver?.observe(element, {
          attributes: true,
          attributeFilter: ['class'],
        })
      })
    }

    const scheduleObserve = (delay: number) => {
      const id = window.setTimeout(observeElements, delay)
      timeoutIds.push(id)
    }

    scheduleObserve(100)
    scheduleObserve(450)

    return () => {
      isDisposed = true
      timeoutIds.forEach((id) => window.clearTimeout(id))
      observer?.disconnect()
      mutationObserver?.disconnect()
    }
  }, deps)
}
