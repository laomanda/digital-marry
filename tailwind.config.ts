import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '1.5rem',
        lg: '2.5rem',
      },
      screens: {
        xl: '1200px',
      },
    },
    extend: {
      colors: {
        'near-black': '#050505',
        'deep-black': '#111111',
        charcoal: '#1A1A1A',
        'soft-charcoal': '#2A2A2A',
        'warm-offwhite': '#F5F5F0',
        'light-gray': '#E8E8E8',
        'muted-gray': '#A4A4A4',
        'dark-gray': '#555555',
        'border-light': 'rgba(255,255,255,0.12)',
        'border-medium': 'rgba(255,255,255,0.28)',
        'border-dark': 'rgba(17,17,17,0.16)',
        // Keeping fallback colors for stability with pre-existing styling classes
        black: '#111111',
        white: '#FFFFFF',
      },
      fontFamily: {
        serif: ['"Instrument Serif"', '"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Inter"', '"DM Sans"', 'system-ui', 'sans-serif'],
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
        'section-sm': '4rem',
        'section-md': '5rem',
        'section-lg': '7rem',
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
