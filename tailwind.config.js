/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f4f0ff',
          100: '#d4c7fc',
          200: '#ab8df0',
          300: '#8059e0',
          400: '#5e32c7',
          500: '#3c0ca0',
          600: '#391c7a',
          700: '#2b1461',
          800: '#1c0d45',
          900: '#0f052b',
          950: '#070214',
        },
        teal: {
          50: '#fffef2',
          100: '#faf6d9',
          200: '#f0e9b6',
          300: '#ded496',
          400: '#c5ba7c',
          500: '#aca064',
          600: '#93874f',
          700: '#7a6e3c',
          800: '#615629',
          900: '#473e1b',
        },
        gold: {
          50: '#fffef2',
          100: '#faf6d9',
          200: '#f0e9b6',
          300: '#ded496',
          400: '#c5ba7c',
          500: '#aca064',
          600: '#93874f',
          700: '#7a6e3c',
          800: '#615629',
          900: '#473e1b',
        }
      }
    },
  },
  plugins: [],
}
