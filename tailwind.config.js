/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#48a0f8',
        secondary: '#e5e7eb',
        tertiary: '#909090',
      },
    },
  },
  plugins: [],
};
