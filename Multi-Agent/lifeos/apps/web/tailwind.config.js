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
        background: 'hsl(var(--background) / <alpha-value>)',
        sidebar: 'hsl(var(--sidebar) / <alpha-value>)',
        surface: 'hsl(var(--surface) / <alpha-value>)',
        'surface-secondary': 'hsl(var(--surface-secondary) / <alpha-value>)',
        border: 'hsl(var(--border) / <alpha-value>)',
        'text-primary': 'hsl(var(--text-primary) / <alpha-value>)',
        'text-secondary': 'hsl(var(--text-secondary) / <alpha-value>)',
        'text-muted': 'hsl(var(--text-muted) / <alpha-value>)',
        'accent-primary': 'hsl(var(--accent-primary) / <alpha-value>)',
        'accent-hover': 'hsl(var(--accent-hover) / <alpha-value>)',
        'accent-pressed': 'hsl(var(--accent-pressed) / <alpha-value>)',
        'accent-light': 'hsl(var(--accent-light) / <alpha-value>)',
        success: 'hsl(var(--success) / <alpha-value>)',
        warning: 'hsl(var(--warning) / <alpha-value>)',
        error: 'hsl(var(--error) / <alpha-value>)',
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
