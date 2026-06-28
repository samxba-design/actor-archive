/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        gigl: {
          gold: "#F5C518",
          purple: "#6B21A8",
          dark: "#0F0A1A",
          card: "#1A1228",
        },
      },
      fontFamily: {
        display: ["Georgia", "Cambria", "Times New Roman", "serif"],
      },
    },
  },
  plugins: [],
};
