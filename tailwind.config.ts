import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#F5F3EE",
        ink: "#111111",
        charcoal: "#242424",
        muted: "#6B6B6B",
        primary: "#111111",
        accent: "#A67C52",
        surface: "#FFFFFF",
      },
      boxShadow: {
        soft: "0 12px 40px rgba(0,0,0,0.08)",
      },
      letterSpacing: {
        luxury: "0.22em",
      },
    },
  },
  plugins: [],
};

export default config;
