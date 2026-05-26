import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          deep: "#1E1B4B",
          purple: "#7C3AED",
          "purple-light": "#EDE9FE",
          orange: "#F97316",
          "orange-light": "#FFF7ED",
          surface: "#F9FAFB",
        },
        success: "#10B981",
        warning: "#F59E0B",
        danger: "#EF4444",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "1rem",
        button: "0.75rem",
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
        elevated: "0 4px 14px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.04)",
        glow: "0 0 15px rgba(124, 58, 237, 0.4)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
