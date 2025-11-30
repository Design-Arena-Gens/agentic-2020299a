import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef6ff',
          100: '#d9ecff',
          200: '#bfe0ff',
          300: '#94cdff',
          400: '#5fb2ff',
          500: '#2b94ff',
          600: '#1176eb',
          700: '#0b5dc2',
          800: '#0f4c97',
          900: '#123f79'
        }
      }
    }
  },
  plugins: []
} satisfies Config
