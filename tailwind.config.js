/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        montserrat: ["Montserrat", "sans-serif"],
      },
      colors: {
        primary: "#2663eb",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
         "light",
      {
        artify: {
          "primary": "#2663eb",
          "secondary": "#14b8a6",
          "accent": "#2663eb",
          "neutral": "#111827",

          /* Your requirement */
          "base-100": "#000000",   // main surface (black)
          "base-200": "#000000",   // lighter surface (white)
          "base-content": "#000000", // default text on base-100 (white text on black)
        },
      },
      "light",
      "dark",
    ],
  },
};
