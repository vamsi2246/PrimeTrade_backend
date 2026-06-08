/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#f5f7fa',
          100: '#eaeef4',
          200: '#d0dae6',
          300: '#a7bbd0',
          400: '#7798b5',
          500: '#557a95', // Muted slate blue/indigo
          600: '#436179',
          700: '#364d60',
          800: '#2f404f',
          900: '#2a3642',
        },
      },
    },
  },
  plugins: [],
}
