import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--color-background)",
        text: "var(--color-text)",
        muted: "var(--color-muted)",
        accent: "var(--color-accent)",
        border: "var(--color-border)",
        card: "var(--color-card)",
        grid: "var(--color-grid)",
        primary: "var(--color-primary)",
        highlight: "var(--color-highlight)",
        tape: "var(--color-tape)",
        softBlue: "var(--color-soft-blue)",
        button: {
          background: "var(--color-button-background)",
          text: "var(--color-button-text)",
          hover: "var(--color-button-hover)",
        },
      },
      fontFamily: {
        sans: ["var(--font-body)"],
        body: ["var(--font-body)"],
        heading: ["var(--font-heading)"],
        zh: ["var(--font-zh)"],
        en: ["var(--font-en)"],
      },
      maxWidth: {
        content: "1180px",
      },
      boxShadow: {
        soft: "0 20px 70px color-mix(in srgb, var(--color-primary) 8%, transparent)",
      },
    },
  },
  plugins: [],
};

export default config;
