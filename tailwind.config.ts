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
        bg: "var(--bg)",
        ink: "var(--ink)",
        muted: "var(--muted)",
        accent: "var(--accent)",
        "accent-soft": "var(--accent-soft)",
        line: "var(--line)",
        gold: "var(--gold)",
        rest: "var(--rest)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        serif: ["var(--font-fraunces)", "serif"],
      },
    },
  },
  plugins: [],
};
export default config;
