import type { Config } from 'tailwindcss'

const config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: '#2d2d3b',
        input: '#2d2d3b',
        ring: '#a855f7',
        background: '#0f0f14',
        foreground: '#ffffff',
        card: {
          DEFAULT: '#18181f',
          foreground: '#ffffff',
        },
        popover: {
          DEFAULT: '#18181f',
          foreground: '#ffffff',
        },
        primary: {
          DEFAULT: '#a855f7',
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#1c1c24',
          foreground: '#ffffff',
        },
        muted: {
          DEFAULT: '#1c1c24',
          foreground: '#6c6c87',
        },
        accent: {
          DEFAULT: '#c084fc',
          foreground: '#0f0f14',
        },
        destructive: {
          DEFAULT: '#ef4444',
          foreground: '#ffffff',
        },
        success: {
          DEFAULT: '#22c55e',
          foreground: '#0f0f14',
        },
        warning: {
          DEFAULT: '#f59e0b',
          foreground: '#0f0f14',
        },
        yvora: {
          body: '#0f0f14',
          card: '#18181f',
          accent: '#a855f7',
          glow: '#c084fc',
          border: '#2d2d3b',
          muted: '#6c6c87',
        },
      },
      borderRadius: {
        lg: '0.75rem',
        md: '0.5rem',
        sm: '0.25rem',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 5px #a855f7, 0 0 10px #a855f7' },
          '50%': { boxShadow: '0 0 20px #a855f7, 0 0 30px #a855f7' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config

export default config
