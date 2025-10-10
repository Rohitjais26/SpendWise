// frontend-vite/tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html", // Include the main HTML file
    "./src/**/*.{js,jsx,ts,tsx}", // Scan all component files
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}