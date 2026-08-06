/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Cosmic Carbon palette — deep carbon blacks + restrained aurora accents
        carbon: {
          950: "#04050a", // base background, near-black with a blue undertone
          900: "#080a12",
          800: "#0d0f1a",
          700: "#151827",
        },
        aurora: {
          cyan: "#5fd0c4", // muted teal-cyan, primary aurora hue
          indigo: "#6c7bf0", // mid transition hue
          violet: "#8f6cd9", // secondary aurora hue, kept desaturated
        },
        mist: {
          100: "#f4f6fa", // primary text on dark
          300: "#c4c9d6", // secondary text
          500: "#7d8394", // muted / captions
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "system-ui", "sans-serif"],
        body: ["'Inter'", "system-ui", "sans-serif"],
      },
      backdropBlur: {
        xs: "2px",
      },
      letterSpacing: {
        tightest: "-0.04em",
      },
    },
  },
  plugins: [],
};
