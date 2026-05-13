import { useState, useEffect } from 'react'

interface CountdownValues {
  days: number
  hours: number
  minutes: number
  seconds: number
  isPast: boolean
}

export function useCountdown(targetDate: Date): CountdownValues {
  const calculate = (): CountdownValues => {
    const now = new Date().getTime()
    const target = targetDate.getTime()
    const diff = target - now

    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true }
    }

    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((diff % (1000 * 60)) / 1000),
      isPast: false,
    }
  }

  const [values, setValues] = useState<CountdownValues>(calculate)

  useEffect(() => {
    const timer = setInterval(() => setValues(calculate()), 1000)
    return () => clearInterval(timer)
  }, [targetDate])

  return values
}
