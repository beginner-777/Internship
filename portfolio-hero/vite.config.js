import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import glsl from "vite-plugin-glsl";

// Vite config
// - react(): standard JSX/Fast Refresh support
// - glsl(): lets us `import` .glsl files as raw strings directly into JS,
//   so shader code can live in its own modular files instead of being
//   inlined as JS template strings.
export default defineConfig({
  plugins: [
    react(),
    glsl({
      include: ["**/*.glsl", "**/*.vert", "**/*.frag"],
      compress: false,
    }),
  ],
  build: {
    target: "es2020",
    sourcemap: false,
  },
});
