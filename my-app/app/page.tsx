"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const ENGINE_SOUND_URL =
  "https://actions.google.com/sounds/v1/vehicles/car_accelerate.ogg";

export default function HomePage() {
  const router = useRouter();

  const [isIgniting, setIsIgniting] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    /*
     * Reading FormData directly prevents the input and React state
     * from becoming out of sync.
     */
    const formData = new FormData(event.currentTarget);
    const carName = String(formData.get("car") ?? "").trim();

    if (!carName || isIgniting) return;

    setIsIgniting(true);

    const engineAudio = new Audio(ENGINE_SOUND_URL);
    engineAudio.volume = 0.85;
    engineAudio.preload = "auto";
    audioRef.current = engineAudio;

    void engineAudio.play().catch((error: unknown) => {
      console.warn("Engine sound could not be played:", error);
    });

    timerRef.current = setTimeout(() => {
      router.push(`/garage?car=${encodeURIComponent(carName)}`);
    }, 1500);
  };

  return (
    <main className="relative flex min-h-[calc(100vh-88px)] items-center justify-center overflow-hidden bg-black px-6 text-white">
      {/* Background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute left-1/2 top-1/3 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-cyan-500/[0.07] blur-[150px]" />

        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:72px_72px]" />

        <div className="absolute bottom-[-16rem] left-1/2 h-[28rem] w-[65rem] -translate-x-1/2 rounded-[100%] border border-cyan-400/10 bg-cyan-400/[0.025] blur-2xl" />
      </div>

      <section className="relative z-10 w-full max-w-5xl text-center">
        <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.025] px-4 py-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute h-full w-full animate-ping rounded-full bg-cyan-300 opacity-50" />
            <span className="relative h-2 w-2 rounded-full bg-cyan-300" />
          </span>

          <span className="text-xs uppercase tracking-[0.3em] text-zinc-400">
            Automotive Intelligence
          </span>
        </div>

        {/* Abstract headlights */}
        <div
          aria-hidden="true"
          className="relative mx-auto mb-10 h-20 max-w-3xl"
        >
          <div className="absolute left-0 top-1/2 h-px w-[38%] bg-gradient-to-r from-transparent to-cyan-200/60" />
          <div className="absolute right-0 top-1/2 h-px w-[38%] bg-gradient-to-l from-transparent to-cyan-200/60" />

          <div className="absolute left-[41%] top-1/2 h-3 w-[8%] -translate-y-1/2 -skew-x-[22deg] rounded-full bg-white shadow-[0_0_10px_2px_rgba(255,255,255,0.8),0_0_35px_8px_rgba(34,211,238,0.35)]" />

          <div className="absolute right-[41%] top-1/2 h-3 w-[8%] -translate-y-1/2 skew-x-[22deg] rounded-full bg-white shadow-[0_0_10px_2px_rgba(255,255,255,0.8),0_0_35px_8px_rgba(34,211,238,0.35)]" />
        </div>

        <h1 className="text-5xl font-semibold tracking-[-0.055em] sm:text-7xl lg:text-8xl">
          Discover your next
          <span className="block bg-gradient-to-r from-zinc-500 via-white to-zinc-500 bg-clip-text text-transparent">
            automotive obsession.
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-zinc-500 sm:text-lg">
          Search for any car to explore its performance, powertrain and
          technical specifications.
        </p>

        <form onSubmit={handleSearch} className="mx-auto mt-12 max-w-3xl">
          <div className="rounded-2xl bg-gradient-to-r from-zinc-800 via-cyan-400/40 to-blue-500/40 p-px">
            <div className="flex flex-col gap-2 rounded-[15px] bg-zinc-950/95 p-2 sm:flex-row">
              <label htmlFor="home-car-search" className="sr-only">
                Search for a car
              </label>

              <input
                id="home-car-search"
                name="car"
                type="search"
                placeholder="Search Supra, GT-R, Bugatti..."
                autoComplete="off"
                required
                disabled={isIgniting}
                className="h-14 min-w-0 flex-1 bg-transparent px-5 text-base text-white outline-none placeholder:text-zinc-600 disabled:cursor-wait"
              />

              <button
                type="submit"
                disabled={isIgniting}
                className="h-14 rounded-xl bg-gradient-to-r from-cyan-300 to-blue-500 px-8 text-sm font-semibold text-black transition hover:brightness-110 disabled:cursor-wait disabled:opacity-50"
              >
                {isIgniting ? "Igniting…" : "Explore"}
              </button>
            </div>
          </div>

          <p aria-live="polite" className="mt-4 text-xs text-zinc-700">
            {isIgniting
              ? "Engine started — opening garage..."
              : "Type a car name and press Enter"}
          </p>
        </form>
      </section>
    </main>
  );
}