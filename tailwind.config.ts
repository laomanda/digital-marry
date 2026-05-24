import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        black: '#111111',
        burgundy: '#3D1E26',
        taupe: '#C2A990',
        terracotta: '#D8613C',
        sage: '#B1C5A4',
        white: '#FFFFFF',
        'light-gray': '#F9F9F9',
        'border-gray': '#BDB6AE',
      },
      fontFamily: {
        serif: ['"Instrument Serif"', '"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Montserrat"', 'system-ui', 'sans-serif'],
        mono: ['"DM Mono"', 'monospace'],
      },
      fontSize: {
        'hero-desktop': ['clamp(80px,9vw,140px)', { lineHeight: '0.9', letterSpacing: '-0.03em' }],
        'hero-tablet': ['clamp(56px,8vw,96px)', { lineHeight: '0.9', letterSpacing: '-0.03em' }],
        'hero-mobile': ['clamp(52px,12vw,72px)', { lineHeight: '0.92', letterSpacing: '-0.02em' }],
        'display': ['clamp(40px,5vw,72px)', { lineHeight: '1', letterSpacing: '-0.02em' }],
        'section-title': ['clamp(32px,4vw,56px)', { lineHeight: '1.1', letterSpacing: '-0.01em' }],
      },
      spacing: {
        'section': 'clamp(80px,10vw,160px)',
        'section-sm': 'clamp(48px,6vw,96px)',
      },
      maxWidth: {
        container: '1200px',
      },
      animation: {
        'fade-up': 'fadeUp 0.8s ease forwards',
        'fade-in': 'fadeIn 1s ease forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

export default config
