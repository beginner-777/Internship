export default function HeroOverlay() {
  return (
    <div className="relative z-10 flex h-full min-h-screen w-full flex-col items-center justify-center px-6 text-center">
      {/* Kicker — names the three disciplines the subheading promises,
          a small structural detail rather than decoration */}
      <div className="glass-panel mb-7 rounded-full px-4 py-1.5">
        <span className="font-body text-[11px] font-medium uppercase tracking-[0.22em] text-mist-300">
          Design <span className="text-aurora-cyan">·</span> AI{" "}
          <span className="text-aurora-cyan">·</span> Graphics
        </span>
      </div>

      <h1 className="font-display max-w-4xl text-balance text-5xl font-medium leading-[1.05] tracking-tightest text-mist-100 sm:text-6xl md:text-7xl">
        Frontend AI Engineer
      </h1>

      <p className="font-body mt-6 max-w-xl text-balance text-base text-mist-300 sm:text-lg">
        Building intelligent interfaces where design, AI, and immersive
        graphics converge.
      </p>

      <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
        <a
          href="#projects"
          className="group relative overflow-hidden rounded-full bg-mist-100 px-7 py-3 font-body text-sm font-semibold text-carbon-950 transition-transform duration-300 ease-out hover:scale-[1.03] active:scale-[0.98]"
        >
          View Projects
        </a>

        <a
          href="#contact"
          className="glass-panel rounded-full px-7 py-3 font-body text-sm font-semibold text-mist-100 transition-colors duration-300 ease-out hover:bg-white/10"
        >
          Contact Me
        </a>
      </div>
    </div>
  );
}
