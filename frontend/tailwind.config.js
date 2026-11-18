/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        naqi: {
          good: "#00B050",
          satisfactory: "#92D050",
          moderate: "#E5B800",
          poor: "#FF9900",
          verypoor: "#E60000",
          severe: "#8B0000"
        }
      }
    },
  },
  plugins: [],
}

