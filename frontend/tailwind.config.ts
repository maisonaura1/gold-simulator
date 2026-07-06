import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          50:  '#fdf9ee',
          100: '#f7edca',
          200: '#edd98a',
          300: '#e8c96d',
          400: '#d4a843',
          500: '#c9a84c',
          600: '#a8893c',
          700: '#8a6e30',
          800: '#5a4820',
          900: '#2a1f0a',
          950: '#130e03',
        },
        desk: {
          bg:     '#07080b',
          base:   '#0b0d11',
          panel:  '#0f1117',
          card:   '#141720',
          border: '#1d2029',
          'border-gold': '#2c2410',
          hover:  '#181c26',
        },
        mt: {
          bg:       '#1a1d23',
          panel:    '#22262e',
          toolbar:  '#1e2128',
          chart:    '#131722',
          tab:      '#2a2e38',
          border:   '#2e3340',
          sep:      '#3a3f4d',
          hover:    '#2d3240',
          text:     '#c8cdd8',
          dim:      '#6b7385',
          label:    '#8893a8',
          white:    '#e8ecf4',
          blue:     '#4a6cf7',
          buy:      '#1a6b3a',
          buyhover: '#1e7d44',
          buytext:  '#2dcc6f',
          sell:     '#7a1a1a',
          sellhvr:  '#8f1f1f',
          selltext: '#e84040',
          green:    '#2dcc6f',
          red:      '#e84040',
          yellow:   '#f0b429',
          cyan:     '#33c2ff',
        },
      },
      fontFamily: {
        sans: ['Roboto', 'Segoe UI', 'system-ui', 'sans-serif'],
        mono: ['Roboto Mono', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;
