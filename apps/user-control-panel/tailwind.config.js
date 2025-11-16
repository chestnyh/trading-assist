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
      },
    },
  },
  plugins: [],
}