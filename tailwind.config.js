/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#000000",
        secondary: "#ffffff",
        accent: "#f0f0f0",
        "text-main": "#1a1a1a",
        "text-muted": "#666666",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        outfit: ['Outfit', 'sans-serif'],
        hanken: ['"Hanken Grotesk"', 'sans-serif'],
        space: ['"Space Grotesk"', 'sans-serif'],
      },
      maxWidth: {
        'max-width': '1440px',
      },
      transitionTimingFunction: {
        'custom': 'cubic-bezier(0.4, 0, 0.2, 1)',
      }
    },
  },
  plugins: [],
}


