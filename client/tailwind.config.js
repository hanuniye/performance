/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens:{
      sm: "480px",
      md: "768px",
      lg: "976px",
      xl: "1440px"
    },
    extend: {
      colors:{
        'blackLight': 'rgb(184, 182, 182)',
        'likHover':'#ece8ff',
        'userColor': 'crimson',
        'userBg':'rgba(255, 0, 0, 0.2)',
        'orderColor': 'goldenrod',
        'orderBg':'rgba(218, 165, 32, .2)',
        'earningColor': 'green',
        'earningBg':'rgba(0, 128, 0, .2)',
        'balanceColor': 'purple',
        'balanceBg':'rgba(128, 0, 128, .2)',
        'crimson': 'crimson'
      },
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif']
      }
    },
  },
  plugins: [],
}

