/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#333d4b',
        gray: {
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#a0a0a0',
          400: '#909090',
        },
      },
    },
  },
  plugins: [],
};
