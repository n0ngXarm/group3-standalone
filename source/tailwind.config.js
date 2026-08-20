export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: ["selector", '[data-theme="dark"]'],
  theme: {
    extend: {
      fontFamily: {
        serif: ["var(--font-display)"],
        sans: ["var(--font-reading)"],
      },
      colors: {
        ink: "rgb(var(--color-ink) / <alpha-value>)",
        vermillion: "rgb(var(--color-vermillion) / <alpha-value>)",
        gold: "rgb(var(--color-gold) / <alpha-value>)",
        parchment: "rgb(var(--color-parchment) / <alpha-value>)",
        muted: "rgb(var(--color-muted) / <alpha-value>)",
        accent: {
          DEFAULT: "rgb(var(--color-vermillion) / <alpha-value>)",
          fill: "rgb(var(--color-accent-fill) / <alpha-value>)",
        },
      },
      animation: {
        float: "float 4s ease-in-out infinite",
      },
      boxShadow: {
        red: "0 8px 30px rgba(226, 61, 40, 0.35)",
      },
    },
  },
  plugins: [],
};
