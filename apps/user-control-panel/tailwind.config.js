/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Light theme colors
        text: 'var(--color-text)',
        background: 'var(--color-background)',
        bgSecondary: 'var(--color-bg-secondary)',
        primary: 'var(--color-primary)',
        accent: 'var(--color-accent)',
        error: 'var(--color-error)',
        success: 'var(--color-success)',
        textSecondary: 'var(--color-text-secondary)',
        surface: 'var(--color-surface)',
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
