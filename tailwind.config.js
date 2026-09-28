/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        night: {
          DEFAULT: '#14213D',
          light: '#1E2E52',
          dark: '#0D1730'
        },
        paper: '#FDF7E3',
        marigold: {
          DEFAULT: '#F4A100',
          dark: '#C97D00'
        },
        vermillion: '#C1121F',
        teal: {
          DEFAULT: '#2A9D8F',
          dark: '#1F7A6F'
        },
        ink: '#1B1B1B'
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Work Sans"', 'sans-serif']
      }
    },
  },
  plugins: [],
}
