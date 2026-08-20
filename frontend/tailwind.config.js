/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Primary palette derived from the CONNECTA logo's navy blue
        // (car icon + wordmark). Used for buttons, links, and focus rings.
        brand: {
          50: "#eef3f8",
          100: "#d7e3ef",
          200: "#b0c7df",
          300: "#84a6ca",
          400: "#4d78a0",
          500: "#2c527a",
          600: "#1e3a5f",
          700: "#182f4d",
          800: "#13253d",
          900: "#0e1c2e",
        },
        // Secondary accents pulled straight from the other three colors in
        // the CONNECTA wheel (agrégats/orange, artisans/green, bétail/brown).
        // Used per-category so the site echoes the logo's four-color wheel.
        accentOrange: {
          50: "#fdf3ec",
          100: "#f9e0cc",
          500: "#d97b3d",
          600: "#c1682d",
          700: "#9c5324",
        },
        accentGreen: {
          50: "#eaf4ee",
          100: "#cce6d6",
          500: "#3d8259",
          600: "#316b48",
          700: "#27553a",
        },
        accentBrown: {
          50: "#f4ede6",
          100: "#e3cfbb",
          500: "#8b5e3c",
          600: "#744c30",
          700: "#5c3c26",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px 0 rgb(0 0 0 / 0.04), 0 1px 3px 0 rgb(0 0 0 / 0.06)",
        "card-hover": "0 4px 12px 0 rgb(0 0 0 / 0.08)",
      },
    },
  },
  plugins: [],
};
