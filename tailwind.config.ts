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
        cream: "#09090B",
        ink: "#F4F4F5",
        charcoal: "#18181B",
        muted: "#C4C4CC",
        primary: "#0A0A0B",
        accent: "#A855F7",
        pink: "#EC4899",
        lime: "#A3E635",
        surface: "#111113",
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
