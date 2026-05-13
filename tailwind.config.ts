import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        black: '#050505',
        charcoal: '#111111',
        'soft-black': '#1A1A1A',
        white: '#FFFFFF',
        'off-white': '#F5F2EC',
        'muted-gray': '#8A8A8A',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
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
