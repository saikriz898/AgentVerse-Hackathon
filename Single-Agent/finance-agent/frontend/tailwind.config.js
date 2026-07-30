/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#0a0d14',
        surface: '#111622',
        'surface-hover': '#1a2234',
        card: '#151c2c',
        border: '#232e42',
        emerald: {
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
        },
        indigo: {
          500: '#6366f1',
          600: '#4f46e5',
        },
        violet: {
          500: '#8b5cf6',
          600: '#7c3aed',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
