"use client";

import Link from "next/link";
import {
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useSearchParams } from "next/navigation";

const ENGINE_SOUND_URL =
  "https://actions.google.com/sounds/v1/vehicles/car_accelerate.ogg";

type Tab = "overview" | "performance" | "powertrain";

type Vehicle = {
  slug: string;
  name: string;
  manufacturer: string;
  category: string;
  year: string;
  horsepower: string;
  topSpeed: string;
  acceleration: string;
  engine: string;
  torque: string;
  drivetrain: string;
  transmission: string;
  weight: string;
  description: string;
  accent: string;
};

const VEHICLES: Record<string, Vehicle> = {
  supra: {
    slug: "supra",
    name: "Toyota GR Supra",
    manufacturer: "Toyota",
    category: "Performance Coupe",
    year: "2025",
    horsepower: "382 hp",
    topSpeed: "155 mph",
    acceleration: "3.9 seconds",
    engine: "3.0L Turbocharged Inline-6",
    torque: "368 lb-ft",
    drivetrain: "Rear-wheel drive",
    transmission: "8-speed automatic",
    weight: "3,400 lb",
    description:
      "A focused rear-wheel-drive sports coupe combining turbocharged performance, precise handling and distinctive design.",
    accent: "#22d3ee",
  },

  gtr: {
    slug: "gtr",
    name: "Nissan GT-R",
    manufacturer: "Nissan",
    category: "Super Sports Coupe",
    year: "2024",
    horsepower: "565 hp",
    topSpeed: "196 mph",
    acceleration: "2.9 seconds",
    engine: "3.8L Twin-Turbocharged V6",
    torque: "467 lb-ft",
    drivetrain: "All-wheel drive",
    transmission: "6-speed dual-clutch",
    weight: "3,935 lb",
    description:
      "A technology-focused performance machine recognized for powerful acceleration, intelligent all-wheel drive and immense grip.",
    accent: "#38bdf8",
  },

  chiron: {
    slug: "chiron",
    name: "Bugatti Chiron",
    manufacturer: "Bugatti",
    category: "Hypercar",
    year: "2022",
    horsepower: "1,479 hp",
    topSpeed: "261 mph",
    acceleration: "2.4 seconds",
    engine: "8.0L Quad-Turbocharged W16",
    torque: "1,180 lb-ft",
    drivetrain: "All-wheel drive",
    transmission: "7-speed dual-clutch",
    weight: "4,400 lb",
    description:
      "A landmark hypercar combining extraordinary speed, advanced engineering and handcrafted grand-touring luxury.",
    accent: "#60a5fa",
  },

  m4: {
    slug: "m4",
    name: "BMW M4 Competition",
    manufacturer: "BMW",
    category: "Performance Coupe",
    year: "2025",
    horsepower: "523 hp",
    topSpeed: "180 mph",
    acceleration: "3.4 seconds",
    engine: "3.0L Twin-Turbocharged Inline-6",
    torque: "479 lb-ft",
    drivetrain: "All-wheel drive",
    transmission: "8-speed automatic",
    weight: "3,979 lb",
    description:
      "A high-performance coupe delivering aggressive power, advanced chassis technology and refined touring capability.",
    accent: "#3b82f6",
  },

  "911": {
    slug: "911",
    name: "Porsche 911 Carrera",
    manufacturer: "Porsche",
    category: "Sports Car",
    year: "2025",
    horsepower: "388 hp",
    topSpeed: "183 mph",
    acceleration: "3.7 seconds",
    engine: "3.0L Twin-Turbocharged Flat-6",
    torque: "331 lb-ft",
    drivetrain: "Rear-wheel drive",
    transmission: "8-speed PDK",
    weight: "3,342 lb",
    description:
      "An iconic rear-engine sports car engineered around precision, everyday usability and unmistakable driving character.",
    accent: "#06b6d4",
  },

  aventador: {
    slug: "aventador",
    name: "Lamborghini Aventador",
    manufacturer: "Lamborghini",
    category: "V12 Supercar",
    year: "2022",
    horsepower: "769 hp",
    topSpeed: "217 mph",
    acceleration: "2.8 seconds",
    engine: "6.5L Naturally Aspirated V12",
    torque: "531 lb-ft",
    drivetrain: "All-wheel drive",
    transmission: "7-speed automated manual",
    weight: "3,472 lb",
    description:
      "A dramatic V12 flagship defined by extreme proportions, explosive performance and unmistakable Italian theatre.",
    accent: "#a3e635",
  },
};

const ALIASES: Record<string, keyof typeof VEHICLES> = {
  supra: "supra",
  "gr supra": "supra",
  "toyota supra": "supra",
  "toyota gr supra": "supra",
  "mk5 supra": "supra",

  gtr: "gtr",
  "gt r": "gtr",
  "nissan gtr": "gtr",
  "nissan gt r": "gtr",
  godzilla: "gtr",

  bugatti: "chiron",
  chiron: "chiron",
  "bugatti chiron": "chiron",

  m4: "m4",
  "bmw m4": "m4",
  "m4 competition": "m4",
  "bmw m4 competition": "m4",

  "911": "911",
  "porsche 911": "911",
  "911 carrera": "911",
  "porsche 911 carrera": "911",

  aventador: "aventador",
  lamborghini: "aventador",
  "lamborghini aventador": "aventador",
};

function normalizeQuery(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[_/\\-]+/g, " ")
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ");
}

function formatName(value: string) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
    )
    .join(" ");
}

function findVehicle(query: string): Vehicle {
  const normalized = normalizeQuery(query);
  const directMatch = ALIASES[normalized];

  if (directMatch) {
    return VEHICLES[directMatch];
  }

  const partialMatch = Object.keys(ALIASES)
    .sort((a, b) => b.length - a.length)
    .find(
      (alias) =>
        normalized.includes(alias) || alias.includes(normalized),
    );

  if (partialMatch) {
    return VEHICLES[ALIASES[partialMatch]];
  }

  return {
    slug: normalized.replace(/\s+/g, "-") || "unknown",
    name: formatName(query),
    manufacturer: "Unknown",
    category: "Custom Vehicle Profile",
    year: "Latest",
    horsepower: "Data unavailable",
    topSpeed: "Data unavailable",
    acceleration: "Data unavailable",
    engine: "Data unavailable",
    torque: "Data unavailable",
    drivetrain: "Data unavailable",
    transmission: "Data unavailable",
    weight: "Data unavailable",
    description:
      "This vehicle is not currently included in the mock database. Add it to the VEHICLES and ALIASES objects or connect this page to an automotive API.",
    accent: "#22d3ee",
  };
}

export default function GaragePage() {
  return (
    <Suspense fallback={<GarageLoading />}>
      <GarageContent />
    </Suspense>
  );
}

function GarageContent() {
  const searchParams = useSearchParams();

  /*
   * This reads the same "car" parameter sent by the Home Page
   * and the native Garage search form.
   */
  const carQuery = searchParams.get("car")?.trim() ?? "";

  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [isFavorite, setIsFavorite] = useState(false);
  const [isRevving, setIsRevving] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const revTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const vehicle = useMemo(() => {
    if (!carQuery) return null;
    return findVehicle(carQuery);
  }, [carQuery]);

  useEffect(() => {
    setActiveTab("overview");

    if (!vehicle) {
      setIsFavorite(false);
      return;
    }

    setIsFavorite(
      window.localStorage.getItem(`favorite:${vehicle.slug}`) === "true",
    );
  }, [vehicle]);

  useEffect(() => {
    return () => {
      if (revTimerRef.current) {
        clearTimeout(revTimerRef.current);
      }

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  const toggleFavorite = () => {
    if (!vehicle) return;

    const nextValue = !isFavorite;
    setIsFavorite(nextValue);

    window.localStorage.setItem(
      `favorite:${vehicle.slug}`,
      String(nextValue),
    );
  };

  const handleRev = () => {
    if (isRevving) return;

    setIsRevving(true);

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    const engineAudio = new Audio(ENGINE_SOUND_URL);
    engineAudio.volume = 0.85;
    audioRef.current = engineAudio;

    void engineAudio.play().catch((error: unknown) => {
      console.warn("Engine sound could not be played:", error);
    });

    revTimerRef.current = setTimeout(() => {
      setIsRevving(false);
    }, 1800);
  };

  if (!vehicle) {
    return (
      <main className="relative flex min-h-[calc(100vh-88px)] items-center justify-center overflow-hidden bg-black px-6 text-white">
        <Background />

        <section className="relative z-10 w-full max-w-xl text-center">
          <p className="text-xs uppercase tracking-[0.32em] text-cyan-300">
            Digital Garage
          </p>

          <h1 className="mt-5 text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">
            No car selected
          </h1>

          <p className="mt-5 text-zinc-500">
            Search for a car to load its performance profile.
          </p>

          <GarageSearch />

          <Link
            href="/"
            className="mt-6 inline-flex text-sm text-zinc-500 transition hover:text-white"
          >
            ← Return home
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="relative min-h-[calc(100vh-88px)] overflow-hidden bg-black text-white">
      <Background />

      <div className="relative z-10 mx-auto max-w-7xl px-6 pb-20 pt-12 lg:px-8">
        <section className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">
              {vehicle.manufacturer} · {vehicle.category}
            </p>

            <h1 className="mt-5 text-5xl font-semibold tracking-[-0.055em] sm:text-7xl">
              {vehicle.name}
            </h1>

            <p className="mt-4 text-sm text-zinc-600">
              Model year {vehicle.year}
            </p>

            <p className="mt-7 max-w-xl leading-7 text-zinc-400">
              {vehicle.description}
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={toggleFavorite}
                aria-pressed={isFavorite}
                className={`h-12 rounded-xl border px-6 text-sm font-medium transition ${
                  isFavorite
                    ? "border-cyan-300 bg-cyan-300 text-black"
                    : "border-white/10 bg-white/[0.03] hover:border-cyan-300/40"
                }`}
              >
                {isFavorite ? "✓ Favorite" : "♡ Add to Favorites"}
              </button>

              <button
                type="button"
                onClick={handleRev}
                disabled={isRevving}
                className="h-12 rounded-xl border border-white/10 bg-white/[0.03] px-6 text-sm font-medium transition hover:border-cyan-300/40 hover:text-cyan-200 disabled:cursor-wait disabled:opacity-50"
              >
                {isRevving ? "Revving…" : "Start Engine"}
              </button>
            </div>
          </div>

          <VehicleArtwork
            name={vehicle.name}
            accent={vehicle.accent}
            isRevving={isRevving}
          />
        </section>

        <section className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.08] sm:grid-cols-2 lg:grid-cols-4">
          <SpecCard label="Horsepower" value={vehicle.horsepower} />
          <SpecCard label="Top speed" value={vehicle.topSpeed} />
          <SpecCard label="0–60 mph" value={vehicle.acceleration} />
          <SpecCard label="Engine" value={vehicle.engine} />
        </section>

        <section className="mt-10 overflow-hidden rounded-2xl border border-white/[0.08] bg-zinc-950/70">
          <div
            role="tablist"
            aria-label="Vehicle information"
            className="flex overflow-x-auto border-b border-white/[0.08] px-3"
          >
            {(["overview", "performance", "powertrain"] as Tab[]).map(
              (tab) => (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative px-5 py-5 text-sm capitalize transition ${
                    activeTab === tab
                      ? "text-white"
                      : "text-zinc-600 hover:text-zinc-300"
                  }`}
                >
                  {tab}

                  {activeTab === tab && (
                    <span className="absolute inset-x-5 bottom-0 h-px bg-cyan-300" />
                  )}
                </button>
              ),
            )}
          </div>

          <div className="p-6 sm:p-8">
            {activeTab === "overview" && (
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <Detail label="Manufacturer" value={vehicle.manufacturer} />
                <Detail label="Category" value={vehicle.category} />
                <Detail label="Model year" value={vehicle.year} />
                <Detail label="Curb weight" value={vehicle.weight} />
              </div>
            )}

            {activeTab === "performance" && (
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <Detail label="Horsepower" value={vehicle.horsepower} />
                <Detail label="Torque" value={vehicle.torque} />
                <Detail label="Top speed" value={vehicle.topSpeed} />
                <Detail label="0–60 mph" value={vehicle.acceleration} />
              </div>
            )}

            {activeTab === "powertrain" && (
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <Detail label="Engine" value={vehicle.engine} />
                <Detail
                  label="Transmission"
                  value={vehicle.transmission}
                />
                <Detail label="Drivetrain" value={vehicle.drivetrain} />
                <Detail label="Torque" value={vehicle.torque} />
              </div>
            )}
          </div>
        </section>

        <GarageSearch />
      </div>
    </main>
  );
}

/*
 * Native GET form:
 * This always creates /garage?car=[query] without depending on React state.
 */
function GarageSearch() {
  return (
    <form
      action="/garage"
      method="GET"
      className="mx-auto mt-12 w-full max-w-2xl"
    >
      <div className="flex items-center gap-2 rounded-2xl border border-cyan-400/25 bg-zinc-950/90 p-2 focus-within:border-cyan-300/50">
        <label htmlFor="garage-car-search" className="sr-only">
          Search for another car
        </label>

        <input
          id="garage-car-search"
          name="car"
          type="search"
          placeholder="Search Supra, GT-R, Bugatti..."
          autoComplete="off"
          required
          className="h-14 min-w-0 flex-1 bg-transparent px-5 text-white outline-none placeholder:text-zinc-600"
        />

        <button
          type="submit"
          className="h-14 rounded-xl bg-white px-8 font-semibold text-black transition hover:bg-cyan-100"
        >
          Search
        </button>
      </div>
    </form>
  );
}

function Background() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
    >
      <div className="absolute right-[-10rem] top-24 h-[32rem] w-[32rem] rounded-full bg-cyan-500/[0.06] blur-[150px]" />

      <div className="absolute bottom-[-14rem] left-[-10rem] h-[28rem] w-[28rem] rounded-full bg-blue-500/[0.05] blur-[140px]" />
    </div>
  );
}

function VehicleArtwork({
  name,
  accent,
  isRevving,
}: {
  name: string;
  accent: string;
  isRevving: boolean;
}) {
  return (
    <div className="relative flex min-h-96 items-center justify-center overflow-hidden rounded-3xl border border-white/[0.08] bg-zinc-950/70">
      <div
        className={`absolute h-64 w-64 rounded-full blur-[110px] transition duration-500 ${
          isRevving ? "scale-125 opacity-30" : "opacity-15"
        }`}
        style={{ backgroundColor: accent }}
      />

      <svg
        viewBox="0 0 800 380"
        role="img"
        aria-label={`${name} digital illustration`}
        className={`relative w-[92%] transition duration-500 ${
          isRevving ? "scale-[1.03]" : ""
        }`}
      >
        <defs>
          <linearGradient id="body" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4b5563" />
            <stop offset="25%" stopColor="#171b22" />
            <stop offset="75%" stopColor="#040506" />
            <stop offset="100%" stopColor="#000000" />
          </linearGradient>

          <filter
            id="glow"
            x="-100%"
            y="-100%"
            width="300%"
            height="300%"
          >
            <feGaussianBlur stdDeviation="7" result="blur" />

            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <ellipse
          cx="400"
          cy="326"
          rx="290"
          ry="28"
          fill="#000"
          opacity="0.9"
        />

        <path
          d="M100 294 Q113 224 188 190 L276 147 Q309 129 344 126 L456 126 Q491 129 524 147 L612 190 Q687 224 700 294 Q663 326 586 335 Q400 353 214 335 Q137 326 100 294Z"
          fill="url(#body)"
          stroke="#4b5563"
          strokeWidth="2"
        />

        <path
          d="M273 149 L330 91 Q346 75 376 73 L424 73 Q454 75 470 91 L527 149 Q400 130 273 149Z"
          fill="#04070c"
          stroke="#475569"
          strokeWidth="2"
        />

        <path
          d="M137 230 Q222 188 313 209 Q340 215 353 235 Q305 273 177 257Z"
          fill="#010204"
          stroke="#334155"
          strokeWidth="2"
        />

        <path
          d="M663 230 Q578 188 487 209 Q460 215 447 235 Q495 273 623 257Z"
          fill="#010204"
          stroke="#334155"
          strokeWidth="2"
        />

        <g
          fill="none"
          stroke={accent}
          strokeLinecap="round"
          filter="url(#glow)"
        >
          <path d="M169 226 Q237 198 319 220" strokeWidth="8" />
          <path d="M631 226 Q563 198 481 220" strokeWidth="8" />
        </g>
      </svg>

      <p className="absolute bottom-6 text-sm text-zinc-500">{name}</p>
    </div>
  );
}

function SpecCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-zinc-950/95 p-6">
      <p className="text-xs uppercase tracking-[0.2em] text-zinc-600">
        {label}
      </p>

      <p className="mt-3 text-xl font-medium text-white">{value}</p>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-white/[0.07] pb-5">
      <p className="text-xs uppercase tracking-[0.2em] text-zinc-600">
        {label}
      </p>

      <p className="mt-2 text-zinc-200">{value}</p>
    </div>
  );
}

function GarageLoading() {
  return (
    <main className="flex min-h-[calc(100vh-88px)] items-center justify-center bg-black text-white">
      <div className="flex items-center gap-3 text-sm text-zinc-500">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-800 border-t-cyan-300" />
        Loading garage
      </div>
    </main>
  );
}