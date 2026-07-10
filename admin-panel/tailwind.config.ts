import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        console: {
          bg: "#0E0F12",
          panel: "#16181D",
          panelAlt: "#1D2027",
          line: "#2A2E37",
          text: "#EDEAE3",
          muted: "#8A8F9C",
          amber: "#F2A63A",
          teal: "#35C6C0",
          violet: "#8677C9",
          danger: "#E1523D",
        },
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
        mono: ["var(--font-mono)"],
      },
    },
  },
  plugins: [],
};
export default config;
