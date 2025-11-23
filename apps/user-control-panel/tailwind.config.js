/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./srcindex.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkbg: "#0D1117",
        lightbg: "#FFFFFF",
        brand: "#4D9EFF",
        formHeader: "#747474",
        formLabel: "#1161B22",
        formInputBg: "#F4F6F8",
        formInputBorder: "#C1C7CD"
      },
      screens: {
        'xl1440': '1440px',
        '3xl': '1920px'
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}