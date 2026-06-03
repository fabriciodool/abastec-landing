import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  "#eef4ff",
          100: "#dce9ff",
          200: "#b3d0ff",
          300: "#7faefc",
          400: "#4a87f8",
          500: "#2563eb",
          600: "#1b50d0",
          700: "#1a4fb0",  // main Abastec blue
          800: "#163f8a",
          900: "#0e2f65",
          950: "#091e44",
        },
        brand: {
          blue:  "#1a4fb0",
          dark:  "#0e2f65",
          light: "#eef4ff",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(0,0,0,0.08), 0 1px 2px -1px rgba(0,0,0,0.06)",
        "card-hover": "0 4px 12px 0 rgba(26,79,176,0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
