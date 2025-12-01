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

      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Inter', 'system-ui', 'sans-serif'],
      },

      fontWeight: {
        regular: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },

      fontSize: {
        // Headings
        h1: ['48px', { lineHeight: '130%' }],
        h2: ['40px', { lineHeight: '130%' }],
        h3: ['36px', { lineHeight: '130%' }],
        h4: ['32px', { lineHeight: '140%' }],
        h5: ['24px', { lineHeight: '140%' }],
        h6: ['20px', { lineHeight: '140%' }],

        // Body
        'body-2xl': ['20px', { lineHeight: '140%' }],
        'body-xl': ['18px', { lineHeight: '140%' }],
        'body-lg': ['16px', { lineHeight: '140%' }],
        'body-md': ['14px', { lineHeight: '140%' }],
        'body-sm': ['12px', { lineHeight: '140%' }],

        // Buttons
        'btn-xl': ['18px', { lineHeight: '140%' }],
        'btn-lg': ['16px', { lineHeight: '140%' }],
        'btn-md': ['14px', { lineHeight: '140%' }],
        'btn-sm': ['12px', { lineHeight: '140%' }],
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
