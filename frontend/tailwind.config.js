/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // From PRD color palette
        primary: '#1a2332',      // Deep navy
        'accent-buy': '#d4a843', // Warm amber/gold
        'accent-rent': '#2da88e', // Cool teal
        warning: '#c0392b',      // Muted red
      },
    },
  },
  plugins: [],
}
