/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0F1115',
        sidebar: '#13161B',
        card: '#17191E',
        surface: '#17191E',
        'surface-secondary': '#1C2026',
        border: '#262B33',
        'text-primary': '#F8FAFC',
        'text-secondary': '#9AA4B2',
        'text-muted': '#6B7280',
        'accent-primary': '#1F6F5F',
        'accent-hover': '#19594D',
        'accent-pressed': '#15463D',
        'accent-light': 'rgba(31, 111, 95, 0.15)',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
      },
      borderRadius: {
        DEFAULT: '20px',
        '2xl': '20px',
        xl: '16px',
        lg: '12px',
      },
    },
  },
  plugins: [],
};
