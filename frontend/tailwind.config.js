/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#f4f1eb",
        ink: "#1e1e1a",
        muted: "#6f6a5f",
        panel: "#fffdf8",
        line: "#ded7cb",
        accent: "#1d4ed8",
        accentSoft: "#dbe7ff"
      },
      boxShadow: {
        card: "0 18px 45px rgba(32, 28, 20, 0.08)"
      },
      fontFamily: {
        sans: ["'Satoshi'", "ui-sans-serif", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};

