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
        surface: 'hsl(var(--surface-1) / <alpha-value>)',
        'surface-1': 'hsl(var(--surface-1) / <alpha-value>)',
        'surface-2': 'hsl(var(--surface-2) / <alpha-value>)',
        'surface-3': 'hsl(var(--surface-3) / <alpha-value>)',
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
        info: 'hsl(var(--info) / <alpha-value>)',
      },
      borderRadius: {
        DEFAULT: '16px',
        '2xl': '16px',
        xl: '12px',
        lg: '8px',
      },
    },
  },
  plugins: [],
};
