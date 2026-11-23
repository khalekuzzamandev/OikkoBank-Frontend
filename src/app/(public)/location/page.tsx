"use client";

import React, { useMemo, useState } from "react";

type BranchType = "Head Office" | "Branch" | "Sub-Branch" | "ATM Booth";

type Branch = {
  id: number;
  name: string;
  type: BranchType;
  city: string;
  area: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
  services: string[];
  lat: number;
  lng: number;
};

const branches: Branch[] = [
  {
    id: 1,
    name: "Oikko Bank Head Office",
    type: "Head Office",
    city: "Dhaka",
    area: "Gulshan",
    address: "House 12, Road 5, Gulshan-1, Dhaka 1212",
    phone: "+880 2-5500-1000",
    email: "headoffice@oikkobank.com",
    hours: "Sun – Thu, 9:00 AM – 5:00 PM",
    services: ["Corporate Banking", "Loans", "Foreign Exchange"],
    lat: 23.7806,
    lng: 90.4167,
  },
  {
    id: 2,
    name: "Motijheel Branch",
    type: "Branch",
    city: "Dhaka",
    area: "Motijheel",
    address: "45 Motijheel C/A, Dhaka 1000",
    phone: "+880 2-5500-1001",
    email: "motijheel@oikkobank.com",
    hours: "Sun – Thu, 10:00 AM – 4:00 PM",
    services: ["Deposits", "Loans", "Locker"],
    lat: 23.733,
    lng: 90.4172,
  },
  {
    id: 3,
    name: "Dhanmondi Branch",
    type: "Branch",
    city: "Dhaka",
    area: "Dhanmondi",
    address: "Road 27, Dhanmondi, Dhaka 1209",
    phone: "+880 2-5500-1002",
    email: "dhanmondi@oikkobank.com",
    hours: "Sun – Thu, 10:00 AM – 4:00 PM",
    services: ["Deposits", "Cards", "SME Banking"],
    lat: 23.7461,
    lng: 90.3742,
  },
  {
    id: 4,
    name: "Agrabad Branch",
    type: "Branch",
    city: "Chattogram",
    area: "Agrabad",
    address: "Agrabad C/A, Chattogram 4100",
    phone: "+880 31-250-0000",
    email: "agrabad@oikkobank.com",
    hours: "Sun – Thu, 10:00 AM – 4:00 PM",
    services: ["Trade Finance", "Loans", "Locker"],
    lat: 22.3249,
    lng: 91.812,
  },
  {
    id: 5,
    name: "Zindabazar Sub-Branch",
    type: "Sub-Branch",
    city: "Sylhet",
    area: "Zindabazar",
    address: "Zindabazar, Sylhet 3100",
    phone: "+880 821-710-000",
    email: "sylhet@oikkobank.com",
    hours: "Sun – Thu, 10:00 AM – 4:00 PM",
    services: ["Deposits", "Remittance"],
    lat: 24.8949,
    lng: 91.8687,
  },
  {
    id: 6,
    name: "Oikko ATM – Uttara",
    type: "ATM Booth",
    city: "Dhaka",
    area: "Uttara",
    address: "Sector 7, Uttara, Dhaka 1230",
    phone: "+880 16-0000-0000",
    email: "support@oikkobank.com",
    hours: "24 / 7",
    services: ["Cash Withdrawal", "Balance Inquiry"],
    lat: 23.8759,
    lng: 90.3795,
  },
];

// Badges stay readable on a navy (#003366) card
const typeStyles: Record<BranchType, string> = {
  "Head Office": "bg-orange-500 text-white",
  Branch: "bg-sky-100 text-sky-800",
  "Sub-Branch": "bg-emerald-100 text-emerald-800",
  "ATM Booth": "bg-amber-100 text-amber-800",
};

// White input / select style
const controlClass =
  "rounded-lg border border-white bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-400/50";

const Location = () => {
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("All");
  const [type, setType] = useState<"All" | BranchType>("All");
  const [selectedId, setSelectedId] = useState<number>(branches[0].id);

  const cities = useMemo(
    () => ["All", ...Array.from(new Set(branches.map((b) => b.city)))],
    []
  );
  const types: ("All" | BranchType)[] = [
    "All",
    "Head Office",
    "Branch",
    "Sub-Branch",
    "ATM Booth",
  ];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return branches.filter(
      (b) =>
        (city === "All" || b.city === city) &&
        (type === "All" || b.type === type) &&
        (!q ||
          b.name.toLowerCase().includes(q) ||
          b.address.toLowerCase().includes(q) ||
          b.area.toLowerCase().includes(q))
    );
  }, [query, city, type]);

  const selected =
    filtered.find((b) => b.id === selectedId) ?? filtered[0] ?? null;

  const resetFilters = () => {
    setQuery("");
    setCity("All");
    setType("All");
  };

  return (
    <main className="min-h-screen bg-slate-100 dark:bg-slate-950">
      {/* Hero with search inside */}
      <section className="bg-[#003366]">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-white sm:text-3xl">
            Branch &amp; ATM Locator
          </h1>
          <p className="mt-1 text-sm text-sky-100">
            Find the nearest Oikko Bank location.
          </p>

          <div className="mt-5 grid gap-3 md:grid-cols-[1fr_200px_200px_auto]">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by branch name, area or address..."
              className={`w-full placeholder-slate-400 ${controlClass}`}
            />
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className={controlClass}
            >
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c === "All" ? "All Cities" : c}
                </option>
              ))}
            </select>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as "All" | BranchType)}
              className={controlClass}
            >
              {types.map((t) => (
                <option key={t} value={t}>
                  {t === "All" ? "All Types" : t}
                </option>
              ))}
            </select>
            <button
              onClick={resetFilters}
              className="rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-orange-600"
            >
              Reset
            </button>
          </div>
          <p className="mt-3 text-xs text-sky-100">
            Showing <span className="font-semibold">{filtered.length}</span> of{" "}
            {branches.length} locations
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* List + Map */}
        <div className="grid gap-6 py-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          {/* List */}
          <div className="space-y-4 lg:max-h-[720px] lg:overflow-y-auto lg:pr-2">
            {filtered.length === 0 && (
              <div className="rounded-xl border border-dashed border-white/30 bg-[#003366] p-10 text-center">
                <p className="font-semibold text-white">No locations found</p>
                <p className="mt-1 text-sm text-sky-100">
                  Try changing your search or filters.
                </p>
              </div>
            )}

            {filtered.map((b) => {
              const active = selected?.id === b.id;
              return (
                <article
                  key={b.id}
                  onClick={() => setSelectedId(b.id)}
                  className={`cursor-pointer rounded-xl border bg-[#003366] p-5 text-white transition hover:shadow-lg ${active
                      ? "border-orange-400 ring-2 ring-orange-400/40"
                      : "border-white/15"
                    }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-base font-semibold text-white">
                        {b.name}
                      </h2>
                      <p className="mt-0.5 text-xs text-sky-200">
                        {b.area}, {b.city}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${typeStyles[b.type]}`}
                    >
                      {b.type}
                    </span>
                  </div>

                  <p className="mt-3 text-sm text-sky-100">{b.address}</p>

                  <dl className="mt-3 grid gap-1.5 text-sm text-white">
                    <div className="flex gap-2">
                      <dt className="w-16 shrink-0 text-sky-300">Phone</dt>
                      <dd>{b.phone}</dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="w-16 shrink-0 text-sky-300">Email</dt>
                      <dd className="break-all">{b.email}</dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="w-16 shrink-0 text-sky-300">Hours</dt>
                      <dd>{b.hours}</dd>
                    </div>
                  </dl>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {b.services.map((s) => (
                      <span
                        key={s}
                        className="rounded-md bg-white/10 px-2 py-1 text-xs text-sky-100"
                      >
                        {s}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 flex gap-2">
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${b.lat},${b.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1 rounded-lg bg-orange-500 px-3 py-2 text-center text-sm font-medium text-white transition hover:bg-orange-600"
                    >
                      Get Directions
                    </a>
                    <a
                      href={`tel:${b.phone.replace(/\s|-/g, "")}`}
                      onClick={(e) => e.stopPropagation()}
                      className="rounded-lg border border-white/60 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
                    >
                      Call
                    </a>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Map */}
          <div className="lg:sticky lg:top-6 lg:self-start">
            <div className="overflow-hidden rounded-xl border border-white/15 bg-[#003366] shadow-lg">
              <div className="flex items-center justify-between border-b border-white/15 px-5 py-3">
                <div>
                  <p className="text-sm font-semibold text-white">
                    {selected ? selected.name : "Map"}
                  </p>
                  {selected && (
                    <p className="text-xs text-sky-200">{selected.address}</p>
                  )}
                </div>
                {selected && (
                  <a
                    href={`https://www.google.com/maps?q=${selected.lat},${selected.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium text-orange-400 hover:underline"
                  >
                    Open in Maps
                  </a>
                )}
              </div>

              {selected ? (
                <iframe
                  key={selected.id}
                  title={`Map of ${selected.name}`}
                  src={`https://www.google.com/maps?q=${selected.lat},${selected.lng}&z=15&output=embed`}
                  className="h-[420px] w-full border-0 lg:h-[620px]"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              ) : (
                <div className="flex h-[420px] items-center justify-center text-sm text-sky-100">
                  Select a location to preview the map.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Location;