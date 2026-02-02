/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        tmblue: "#2563EB",
        tmindigo: "#4F46E5"
      }
    },
  },
  plugins: [],
}
