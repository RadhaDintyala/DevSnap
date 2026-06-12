/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx,css}',
    './public/**/*.{html,js}',
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#000000',
        surface: '#0a0a0a',
        border: '#1a1a1a',
        muted: '#71717a',
        accent: {
          cyan: '#22d3ee',
          yellow: '#facc15',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'Consolas', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 40px rgba(34, 211, 238, 0.12)',
        modal: '0 25px 50px -12px rgba(0, 0, 0, 0.85)',
      },
    },
  },
  plugins: [],
}
