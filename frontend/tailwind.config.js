/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: "#C8A96A",
          light: "#E4D3AC",
          dark: "#A9814A",
        },
        cream: "#F8F5F2",
        charcoal: "#1A1A1A",
        graphite: "#4A4A4A",
      },
      fontFamily: {
        display: ["'Playfair Display'", "serif"],
        body: ["'Poppins'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
