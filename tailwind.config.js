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
    logs: false,
    themes: [
      "light",
      {
        artify: {
          primary: "#2663eb",
          secondary: "#14b8a6",
          accent: "#2663eb",
          neutral: "#111827",

          /* Choose base-100 as white for default (light) surfaces.
             We'll use DaisyUI/dark to switch to dark surfaces when needed. */
          "base-100": "#ffffff",
          "base-200": "#f3f4f6",
          "base-content": "#111827"
        },
      },
      "dark"
    ],
  },
};