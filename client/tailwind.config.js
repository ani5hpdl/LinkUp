/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Syne", "sans-serif"],
        body: ["DM Sans", "sans-serif"],
      },
      colors: {
        lu: {
          bg:       "#0A0A0F",
          surface:  "#111118",
          surface2: "#1A1A24",
          accent:   "#7B6EF6",
          accent2:  "#A594F9",
          teal:     "#2DD4BF",
          pink:     "#F472B6",
          text:     "#F0EFF8",
          muted:    "#7A798A",
          muted2:   "#9D9CAD",
        },
      },
    },
  },
  plugins: [],
};
