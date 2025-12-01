/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        text: 'var(--text)',
        background: 'var(--background)',
        bgSecondary: 'var(--background-secondary)',
        primary: 'var(--primary)',
        accent: 'var(--accent)',
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
