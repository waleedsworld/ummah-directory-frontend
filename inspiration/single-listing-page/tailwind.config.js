/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'serif-custom': ['Playfair Display', 'serif'],
        'sans-custom': ['Inter', 'sans-serif'],
      },
      colors: {
        vanguardis: {
          bg: '#E3E7E0',
          text: '#2A3324',
          border: '#C4CFC0',
          accent: '#5C715E',
          card: '#D5DBD1'
        }
      }
    },
  },
  plugins: [],
}