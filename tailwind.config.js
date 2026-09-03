/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        soil: {
          50: '#f7f5f2',
          100: '#ebe6df',
          200: '#d6cdc0',
          300: '#b8a995',
          400: '#9a8670',
          500: '#7d6b57',
          600: '#655647',
          700: '#52463b',
          800: '#453c34',
          900: '#3c342e',
        },
        plant: {
          50: '#e8f5e9',
          100: '#c8e6c9',
          500: '#2e7d32',
          600: '#1b5e20',
          700: '#145a1a',
        },
      },
    },
  },
  plugins: [],
}
