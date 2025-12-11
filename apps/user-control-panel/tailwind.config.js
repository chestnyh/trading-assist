/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Light theme colors
        primary: 'var(--color-primary)',
        primaryHover: 'var(--color-primary-hover)',
        primaryActive: 'var(--color-primary-active)',

        accent: 'var(--color-accent)',

        background: 'var(--color-background)',
        bgSecondary: 'var(--color-bg-secondary)',
        border: 'var(--color-border)',

        text: 'var(--color-text)',
        textSecondary: 'var(--color-text-secondary)',

        error: 'var(--color-error)',
        success: 'var(--color-success)',
      },

      screens: {
        md: '768px',
        lg: '1024px',
        xl: '1440px',
        '3xl': '1920px',
      },
    },
  },
  plugins: [],
};
