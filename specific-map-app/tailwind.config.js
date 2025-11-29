/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Make sure to use a clean font
      },
      colors: {
        brand: {
          primary: '#C0773E', // The Burnt Orange from screenshots
          hover: '#A66330',
          bg: '#FAF9F6',      // Off-white background
          text: '#4A4A4A'     // Dark Grey text
        }
      }
    },
  },
  plugins: [],
}