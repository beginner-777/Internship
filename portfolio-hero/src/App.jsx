import ShaderHero from "./components/ShaderHero/ShaderHero.jsx";

export default function App() {
  return (
    <main className="relative min-h-screen w-full bg-carbon-950">
      <ShaderHero />

      {/* Rest of the portfolio page would continue below the fold. Kept
          minimal here since the brief is scoped to the hero section. */}
      <section
        id="content-below-fold"
        className="relative z-10 bg-carbon-950 px-6 py-24 text-mist-300"
        aria-hidden="true"
      />
    </main>
  );
}
