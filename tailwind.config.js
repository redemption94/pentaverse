/** @type {import('tailwindcss').Config} */
module.exports = {
  // 1. Spunem Tailwind unde să caute clasele de design
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // 2. Definim culorile oficiale pentru a le folosi ușor în cod
      colors: {
        penta: {
          yellow: "#ffeb00", // Galbenul ESL
          black: "#080808",
          dark: "#111111",
          border: "#1a1a1a",
          gray: "#666666",
        },
      },
      // 3. Adăugăm fontul pentru un aspect mai profesional
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
