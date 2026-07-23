"use client";

import { useMemo, useState } from "react";

type Car = {
  id: number;
  name: string;
  manufacturer: string;
  category: "Sports Car" | "Supercar" | "Hypercar";
  horsepower: number;
  topSpeed: number;
  acceleration: string;
  engine: string;
  price: number;
  drivetrain: string;
  accent: string;
};

const CARS: Car[] = [
  {
    id: 1,
    name: "GR Supra",
    manufacturer: "Toyota",
    category: "Sports Car",
    horsepower: 382,
    topSpeed: 155,
    acceleration: "3.9 sec",
    engine: "3.0L Turbo I6",
    price: 56350,
    drivetrain: "RWD",
    accent: "#22d3ee",
  },
  {
    id: 2,
    name: "911 Carrera",
    manufacturer: "Porsche",
    category: "Sports Car",
    horsepower: 388,
    topSpeed: 183,
    acceleration: "3.7 sec",
    engine: "3.0L Twin-Turbo Flat-6",
    price: 120100,
    drivetrain: "RWD",
    accent: "#38bdf8",
  },
  {
    id: 3,
    name: "M4 Competition",
    manufacturer: "BMW",
    category: "Sports Car",
    horsepower: 523,
    topSpeed: 180,
    acceleration: "3.4 sec",
    engine: "3.0L Twin-Turbo I6",
    price: 82700,
    drivetrain: "AWD",
    accent: "#60a5fa",
  },
  {
    id: 4,
    name: "GT-R",
    manufacturer: "Nissan",
    category: "Supercar",
    horsepower: 565,
    topSpeed: 196,
    acceleration: "2.9 sec",
    engine: "3.8L Twin-Turbo V6",
    price: 121090,
    drivetrain: "AWD",
    accent: "#06b6d4",
  },
  {
    id: 5,
    name: "Huracán Tecnica",
    manufacturer: "Lamborghini",
    category: "Supercar",
    horsepower: 631,
    topSpeed: 202,
    acceleration: "3.2 sec",
    engine: "5.2L Naturally Aspirated V10",
    price: 244795,
    drivetrain: "RWD",
    accent: "#a3e635",
  },
  {
    id: 6,
    name: "296 GTB",
    manufacturer: "Ferrari",
    category: "Supercar",
    horsepower: 819,
    topSpeed: 205,
    acceleration: "2.9 sec",
    engine: "3.0L Twin-Turbo Hybrid V6",
    price: 342205,
    drivetrain: "RWD",
    accent: "#ef4444",
  },
  {
    id: 7,
    name: "720S",
    manufacturer: "McLaren",
    category: "Supercar",
    horsepower: 710,
    topSpeed: 212,
    acceleration: "2.8 sec",
    engine: "4.0L Twin-Turbo V8",
    price: 310500,
    drivetrain: "RWD",
    accent: "#f97316",
  },
  {
    id: 8,
    name: "Chiron",
    manufacturer: "Bugatti",
    category: "Hypercar",
    horsepower: 1479,
    topSpeed: 261,
    acceleration: "2.4 sec",
    engine: "8.0L Quad-Turbo W16",
    price: 3000000,
    drivetrain: "AWD",
    accent: "#3b82f6",
  },
  {
    id: 9,
    name: "Nevera",
    manufacturer: "Rimac",
    category: "Hypercar",
    horsepower: 1914,
    topSpeed: 258,
    acceleration: "1.74 sec",
    engine: "Quad Electric Motors",
    price: 2200000,
    drivetrain: "AWD",
    accent: "#8b5cf6",
  },
];

type SortOption =
  | "horsepower-desc"
  | "speed-desc"
  | "price-asc"
  | "price-desc";

export default function SpecsDexPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState<SortOption>("horsepower-desc");

  const filteredCars = useMemo(() => {
    const normalizedSearch = search.toLowerCase().trim();

    return CARS.filter((car) => {
      const matchesCategory =
        category === "All" || car.category === category;

      const matchesSearch =
        !normalizedSearch ||
        `${car.manufacturer} ${car.name} ${car.engine}`
          .toLowerCase()
          .includes(normalizedSearch);

      return matchesCategory && matchesSearch;
    }).sort((a, b) => {
      switch (sort) {
        case "speed-desc":
          return b.topSpeed - a.topSpeed;
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        default:
          return b.horsepower - a.horsepower;
      }
    });
  }, [search, category, sort]);

  return (
    <main className="relative min-h-[calc(100vh-88px)] overflow-hidden bg-black px-6 py-16 text-white lg:px-8">
      <div
        aria-hidden="true"
        className="absolute right-[-12rem] top-0 h-[34rem] w-[34rem] rounded-full bg-cyan-500/[0.05] blur-[150px]"
      />

      <div className="relative z-10 mx-auto max-w-7xl">
        <header className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.32em] text-cyan-300">
            Performance Database
          </p>

          <h1 className="mt-5 text-5xl font-semibold tracking-[-0.05em] sm:text-7xl">
            Specs-Dex
          </h1>

          <p className="mt-6 max-w-2xl leading-7 text-zinc-500">
            Explore and compare performance specifications from modern sports
            cars, supercars and hypercars.
          </p>
        </header>

        <section className="mt-12 rounded-2xl border border-white/[0.08] bg-zinc-950/70 p-4">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_auto_auto]">
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search manufacturer, model or engine..."
              aria-label="Search cars"
              className="h-12 rounded-xl border border-white/[0.08] bg-black px-4 text-sm outline-none placeholder:text-zinc-700 focus:border-cyan-300/40"
            />

            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              aria-label="Filter by category"
              className="h-12 rounded-xl border border-white/[0.08] bg-black px-4 text-sm text-zinc-400 outline-none"
            >
              <option value="All">All categories</option>
              <option value="Sports Car">Sports cars</option>
              <option value="Supercar">Supercars</option>
              <option value="Hypercar">Hypercars</option>
            </select>

            <select
              value={sort}
              onChange={(event) =>
                setSort(event.target.value as SortOption)
              }
              aria-label="Sort cars"
              className="h-12 rounded-xl border border-white/[0.08] bg-black px-4 text-sm text-zinc-400 outline-none"
            >
              <option value="horsepower-desc">Highest horsepower</option>
              <option value="speed-desc">Highest top speed</option>
              <option value="price-asc">Lowest price</option>
              <option value="price-desc">Highest price</option>
            </select>
          </div>
        </section>

        <div className="mt-8 flex items-center justify-between">
          <p className="text-sm text-zinc-600">
            {filteredCars.length} vehicles
          </p>

          {(search || category !== "All") && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setCategory("All");
              }}
              className="text-sm text-cyan-300 hover:text-cyan-200"
            >
              Clear filters
            </button>
          )}
        </div>

        <section className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredCars.map((car) => (
            <article
              key={car.id}
              className="group overflow-hidden rounded-2xl border border-white/[0.08] bg-zinc-950/70 transition duration-300 hover:-translate-y-1 hover:border-cyan-300/25"
            >
              <div className="relative h-44 overflow-hidden border-b border-white/[0.07] bg-black">
                <div
                  className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-15 blur-[70px]"
                  style={{ backgroundColor: car.accent }}
                />

                <CarSilhouette accent={car.accent} />

                <span className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/70 px-3 py-1.5 text-xs text-zinc-400">
                  {car.category}
                </span>
              </div>

              <div className="p-6">
                <p className="text-xs uppercase tracking-[0.24em] text-zinc-600">
                  {car.manufacturer}
                </p>

                <h2 className="mt-2 text-2xl font-medium">{car.name}</h2>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <CarSpec label="Power" value={`${car.horsepower} hp`} />
                  <CarSpec
                    label="Top speed"
                    value={`${car.topSpeed} mph`}
                  />
                  <CarSpec label="0–60 mph" value={car.acceleration} />
                  <CarSpec label="Drive" value={car.drivetrain} />
                </div>

                <div className="mt-6 border-t border-white/[0.07] pt-5">
                  <p className="text-xs text-zinc-600">Engine</p>
                  <p className="mt-1 text-sm text-zinc-300">{car.engine}</p>
                </div>

                <div className="mt-5 flex items-end justify-between">
                  <div>
                    <p className="text-xs text-zinc-600">
                      Estimated base price
                    </p>
                    <p className="mt-1 font-medium">
                      ${car.price.toLocaleString()}
                    </p>
                  </div>

                  <a
                    href={`/garage?car=${encodeURIComponent(
                      `${car.manufacturer} ${car.name}`,
                    )}`}
                    className="rounded-lg border border-white/10 px-4 py-2 text-xs transition hover:border-cyan-300/40 hover:text-cyan-300"
                  >
                    View profile
                  </a>
                </div>
              </div>
            </article>
          ))}
        </section>

        {filteredCars.length === 0 && (
          <div className="mt-6 rounded-2xl border border-white/[0.08] bg-zinc-950/70 py-20 text-center">
            <h2 className="text-xl font-medium">No vehicles found</h2>
            <p className="mt-2 text-sm text-zinc-600">
              Try adjusting your search or category.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

function CarSpec({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-zinc-600">{label}</p>
      <p className="mt-1 text-sm text-zinc-200">{value}</p>
    </div>
  );
}

function CarSilhouette({ accent }: { accent: string }) {
  return (
    <svg
      viewBox="0 0 600 220"
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
    >
      <path
        d="M78 162 Q89 118 143 100 L218 70 Q247 58 278 58 L337 58 Q365 60 393 73 L459 103 Q504 122 521 162 Q486 182 434 188 Q300 200 166 188 Q112 182 78 162Z"
        fill="#090b0f"
        stroke="#3f4651"
        strokeWidth="2"
      />

      <path
        d="M215 71 L250 39 Q263 27 286 26 L323 26 Q347 28 359 40 L394 74 Q302 62 215 71Z"
        fill="#05080d"
        stroke="#334155"
        strokeWidth="2"
      />

      <g fill="none" stroke={accent} strokeLinecap="round">
        <path d="M115 132 Q175 107 234 125" strokeWidth="7" />
        <path d="M485 132 Q425 107 366 125" strokeWidth="7" />
      </g>
    </svg>
  );
}