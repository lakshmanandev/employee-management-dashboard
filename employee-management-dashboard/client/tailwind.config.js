/** @type {import('tailwindcss').Config} */
export default {
  // Files Tailwind scans for class names to generate the final CSS.
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // A single brand color referenced across buttons/badges.
        brand: {
          DEFAULT: '#4f46e5', // indigo-600
          dark: '#4338ca',
        },
      },
    },
  },
  plugins: [],
};
