"use client";

import { FormEvent, useMemo, useState } from "react";

type Mechanic = {
  id: number;
  name: string;
  business: string;
  location: string;
  rating: number;
  reviews: number;
  experience: number;
  specialties: string[];
  availability: string;
  accent: string;
};

const MECHANICS: Mechanic[] = [
  {
    id: 1,
    name: "Daniel Carter",
    business: "Apex Performance Lab",
    location: "Los Angeles, California",
    rating: 4.9,
    reviews: 184,
    experience: 14,
    specialties: ["Engine Tuning", "ECU Mapping", "Dyno Testing"],
    availability: "Available tomorrow",
    accent: "#22d3ee",
  },
  {
    id: 2,
    name: "Marcus Reed",
    business: "Velocity Customs",
    location: "Miami, Florida",
    rating: 4.8,
    reviews: 137,
    experience: 11,
    specialties: ["Custom Bodywork", "Carbon Fiber", "Paintwork"],
    availability: "Available Friday",
    accent: "#3b82f6",
  },
  {
    id: 3,
    name: "Elena Rossi",
    business: "Rossi Motorsport",
    location: "Austin, Texas",
    rating: 5,
    reviews: 211,
    experience: 16,
    specialties: ["Suspension", "Track Setup", "Wheel Alignment"],
    availability: "Available today",
    accent: "#06b6d4",
  },
  {
    id: 4,
    name: "James Walker",
    business: "Torque Engineering",
    location: "Chicago, Illinois",
    rating: 4.7,
    reviews: 96,
    experience: 9,
    specialties: ["Turbo Systems", "Exhaust", "Cooling Systems"],
    availability: "Available Monday",
    accent: "#60a5fa",
  },
  {
    id: 5,
    name: "Sophia Bennett",
    business: "Precision Auto Works",
    location: "Seattle, Washington",
    rating: 4.9,
    reviews: 158,
    experience: 12,
    specialties: ["European Cars", "Diagnostics", "Transmission"],
    availability: "Available tomorrow",
    accent: "#67e8f9",
  },
  {
    id: 6,
    name: "Alex Morgan",
    business: "Revline Garage",
    location: "New York, New York",
    rating: 4.8,
    reviews: 122,
    experience: 10,
    specialties: ["Performance Brakes", "Suspension", "Track Preparation"],
    availability: "Available Saturday",
    accent: "#2563eb",
  },
];

const SPECIALTIES = [
  "All",
  "Engine Tuning",
  "Custom Bodywork",
  "Suspension",
  "Turbo Systems",
  "Diagnostics",
];

export default function MechanicsPage() {
  const [search, setSearch] = useState("");
  const [specialty, setSpecialty] = useState("All");
  const [selectedMechanic, setSelectedMechanic] =
    useState<Mechanic | null>(null);
  const [bookingSent, setBookingSent] = useState(false);

  const filteredMechanics = useMemo(() => {
    const normalizedSearch = search.toLowerCase().trim();

    return MECHANICS.filter((mechanic) => {
      const matchesSpecialty =
        specialty === "All" ||
        mechanic.specialties.some((item) =>
          item.toLowerCase().includes(specialty.toLowerCase()),
        );

      const searchableText = [
        mechanic.name,
        mechanic.business,
        mechanic.location,
        ...mechanic.specialties,
      ]
        .join(" ")
        .toLowerCase();

      return (
        matchesSpecialty &&
        (!normalizedSearch || searchableText.includes(normalizedSearch))
      );
    });
  }, [search, specialty]);

  const handleBooking = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBookingSent(true);
  };

  const closeBooking = () => {
    setSelectedMechanic(null);
    setBookingSent(false);
  };

  return (
    <main className="relative min-h-[calc(100vh-88px)] overflow-hidden bg-black px-6 py-16 text-white lg:px-8">
      <Background />

      <div className="relative z-10 mx-auto max-w-7xl">
        <header className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.32em] text-cyan-300">
            Verified Specialists
          </p>

          <h1 className="mt-5 text-5xl font-semibold tracking-[-0.05em] sm:text-7xl">
            Expert mechanics.
            <span className="block text-zinc-600">Precision results.</span>
          </h1>

          <p className="mt-6 max-w-2xl leading-7 text-zinc-500">
            Find experienced automotive specialists for performance tuning,
            bodywork, suspension setup and advanced diagnostics.
          </p>
        </header>

        <section className="mt-12 rounded-2xl border border-white/[0.08] bg-zinc-950/70 p-4 backdrop-blur-xl">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_auto]">
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search mechanic, shop, location or specialty..."
              aria-label="Search mechanics"
              className="h-12 rounded-xl border border-white/[0.08] bg-black px-4 text-sm text-white outline-none placeholder:text-zinc-700 focus:border-cyan-300/40"
            />

            <div className="flex gap-2 overflow-x-auto">
              {SPECIALTIES.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setSpecialty(item)}
                  className={`h-12 shrink-0 rounded-xl border px-4 text-sm transition ${
                    specialty === item
                      ? "border-cyan-300 bg-cyan-300 text-black"
                      : "border-white/[0.08] bg-black text-zinc-500 hover:text-white"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredMechanics.map((mechanic) => (
            <article
              key={mechanic.id}
              className="group rounded-2xl border border-white/[0.08] bg-zinc-950/70 p-6 transition duration-300 hover:-translate-y-1 hover:border-cyan-300/25"
            >
              <div className="flex items-start justify-between">
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-2xl border text-lg font-semibold"
                  style={{
                    borderColor: `${mechanic.accent}40`,
                    backgroundColor: `${mechanic.accent}10`,
                    color: mechanic.accent,
                  }}
                >
                  {mechanic.name
                    .split(" ")
                    .map((word) => word[0])
                    .join("")}
                </div>

                <div className="text-right">
                  <p className="text-sm font-medium text-white">
                    ★ {mechanic.rating.toFixed(1)}
                  </p>
                  <p className="mt-1 text-xs text-zinc-600">
                    {mechanic.reviews} reviews
                  </p>
                </div>
              </div>

              <h2 className="mt-6 text-xl font-medium">{mechanic.name}</h2>
              <p className="mt-1 text-sm text-cyan-300">
                {mechanic.business}
              </p>
              <p className="mt-3 text-sm text-zinc-600">
                {mechanic.location}
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {mechanic.specialties.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/[0.08] bg-black px-3 py-1.5 text-xs text-zinc-400"
                  >
                    {item}
                  </span>
                ))}
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-white/[0.07] pt-5">
                <div>
                  <p className="text-xs text-zinc-600">
                    {mechanic.experience} years experience
                  </p>
                  <p className="mt-1 text-xs text-emerald-400">
                    {mechanic.availability}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedMechanic(mechanic)}
                  className="h-10 rounded-lg bg-white px-4 text-xs font-semibold text-black transition hover:bg-cyan-100"
                >
                  Book Consultation
                </button>
              </div>
            </article>
          ))}
        </section>

        {filteredMechanics.length === 0 && (
          <div className="mt-8 rounded-2xl border border-white/[0.08] bg-zinc-950/70 px-6 py-20 text-center">
            <h2 className="text-xl font-medium">No specialists found</h2>
            <p className="mt-2 text-sm text-zinc-600">
              Try changing your search or specialty filter.
            </p>
          </div>
        )}
      </div>

      {selectedMechanic && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="booking-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-6 backdrop-blur-md"
        >
          <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-zinc-950 p-6 shadow-2xl sm:p-8">
            {bookingSent ? (
              <div className="py-8 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-cyan-300 text-xl text-black">
                  ✓
                </div>

                <h2 className="mt-5 text-2xl font-semibold">
                  Request received
                </h2>

                <p className="mt-3 text-sm leading-6 text-zinc-500">
                  {selectedMechanic.business} will contact you to confirm the
                  consultation.
                </p>

                <button
                  type="button"
                  onClick={closeBooking}
                  className="mt-7 h-11 rounded-xl bg-white px-6 text-sm font-semibold text-black"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-cyan-300">
                      Consultation
                    </p>

                    <h2
                      id="booking-title"
                      className="mt-3 text-2xl font-semibold"
                    >
                      Book {selectedMechanic.name}
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={closeBooking}
                    aria-label="Close dialog"
                    className="text-xl text-zinc-600 hover:text-white"
                  >
                    ×
                  </button>
                </div>

                <form
                  onSubmit={handleBooking}
                  className="mt-7 grid grid-cols-1 gap-4"
                >
                  <input
                    name="name"
                    required
                    placeholder="Your name"
                    className="h-12 rounded-xl border border-white/10 bg-black px-4 text-sm outline-none focus:border-cyan-300/40"
                  />

                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="Email address"
                    className="h-12 rounded-xl border border-white/10 bg-black px-4 text-sm outline-none focus:border-cyan-300/40"
                  />

                  <select
                    name="service"
                    required
                    defaultValue=""
                    className="h-12 rounded-xl border border-white/10 bg-black px-4 text-sm text-zinc-400 outline-none focus:border-cyan-300/40"
                  >
                    <option value="" disabled>
                      Select a service
                    </option>

                    {selectedMechanic.specialties.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>

                  <textarea
                    name="message"
                    rows={4}
                    placeholder="Describe your vehicle and requirements..."
                    className="resize-none rounded-xl border border-white/10 bg-black p-4 text-sm outline-none focus:border-cyan-300/40"
                  />

                  <button
                    type="submit"
                    className="h-12 rounded-xl bg-gradient-to-r from-cyan-300 to-blue-500 font-semibold text-black"
                  >
                    Send Request
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

function Background() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
    >
      <div className="absolute right-[-12rem] top-10 h-[34rem] w-[34rem] rounded-full bg-cyan-500/[0.05] blur-[150px]" />
      <div className="absolute bottom-[-14rem] left-[-10rem] h-[30rem] w-[30rem] rounded-full bg-blue-500/[0.04] blur-[140px]" />
    </div>
  );
}