import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Superficies (oscuro, de más profundo a más elevado)
        ink: {
          950: '#08090c',
          900: '#0d0f13',
          850: '#12141a',
          800: '#171a21',
          750: '#1d2029',
          700: '#262a35',
          600: '#343946',
        },
        // Texto
        fg: {
          DEFAULT: '#eceef3',
          muted: '#a3a9b8',
          dim: '#6f7687',
        },
        // Marca
        gold: {
          50: '#fdf8ea',
          100: '#f8ecc7',
          200: '#f0d88c',
          300: '#e8c765',
          400: '#ddb54a',
          500: '#c9a13b',
          600: '#a8842d',
          700: '#836625',
          800: '#4f3e1a',
          900: '#2a210e',
        },
        // Semánticos
        up: { DEFAULT: '#22c55e', soft: '#22c55e1f' },
        down: { DEFAULT: '#ef4444', soft: '#ef44441f' },
        warn: { DEFAULT: '#f59e0b', soft: '#f59e0b1f' },
        info: { DEFAULT: '#60a5fa', soft: '#60a5fa1f' },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 0 0 rgba(255,255,255,0.03) inset, 0 8px 24px -12px rgba(0,0,0,0.6)',
        glow: '0 0 0 1px rgba(221,181,74,0.35), 0 8px 30px -8px rgba(221,181,74,0.35)',
      },
      borderRadius: {
        xl: '14px',
        '2xl': '18px',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.35s ease-out both',
      },
    },
  },
  plugins: [],
};

export default config;
