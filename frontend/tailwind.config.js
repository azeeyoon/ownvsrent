/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Light minimal theme
        primary: '#ffffff',
        'accent-buy': '#059669',   // Emerald green
        'accent-rent': '#0284c7',  // Sky blue
        warning: '#dc2626',
      },
    },
  },
  plugins: [],
}
