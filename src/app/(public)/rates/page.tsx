"use client";

import { useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  CalendarDays,
  CircleHelp,
  Landmark,
  TrendingUp,
} from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const rateHistory = [
  { date: "Jan 2015", deposit: 5.2, lending: 10.8 },
  { date: "Jan 2016", deposit: 5.4, lending: 10.6 },
  { date: "Jan 2017", deposit: 5.1, lending: 10.2 },
  { date: "Jan 2018", deposit: 5.6, lending: 10.1 },
  { date: "Jan 2019", deposit: 5.8, lending: 9.8 },
  { date: "Jan 2020", deposit: 5.5, lending: 9.4 },
  { date: "Jan 2021", deposit: 4.8, lending: 8.9 },
  { date: "Jan 2022", deposit: 5.1, lending: 9.1 },
  { date: "Jan 2023", deposit: 5.7, lending: 9.5 },
  { date: "Jan 2024", deposit: 6.1, lending: 10.1 },
  { date: "Jan 2025", deposit: 6.4, lending: 10.4 },
  { date: "Jan 2026", deposit: 6.8, lending: 10.6 },
];

const recentRateHistory = [
  { date: "Nov 2025", deposit: 6.5, lending: 10.5 },
  { date: "Dec 2025", deposit: 6.5, lending: 10.5 },
  { date: "Jan 2026", deposit: 6.6, lending: 10.5 },
  { date: "Feb 2026", deposit: 6.6, lending: 10.6 },
  { date: "Mar 2026", deposit: 6.7, lending: 10.6 },
  { date: "Apr 2026", deposit: 6.7, lending: 10.6 },
  { date: "May 2026", deposit: 6.7, lending: 10.6 },
  { date: "Jun 2026", deposit: 6.8, lending: 10.6 },
  { date: "Jul 2026", deposit: 6.8, lending: 10.6 },
  { date: "Aug 2026", deposit: 6.8, lending: 10.6 },
  { date: "Sep 2026", deposit: 6.8, lending: 10.6 },
  { date: "Oct 2026", deposit: 6.8, lending: 10.6 },
];

const rateRanges = [
  { label: "6 months", value: "6M" },
  { label: "1 year", value: "1Y" },
  { label: "10 years", value: "10Y" },
  { label: "12 years", value: "12Y" },
] as const;

const rateDetails = [
  {
    name: "Regular Savings",
    category: "Savings account",
    term: "Anytime access",
    rate: "3.50%",
    movement: "0.25%",
    direction: "up",
  },
  {
    name: "Oikko Fixed Deposit",
    category: "Fixed deposit",
    term: "6 months",
    rate: "6.25%",
    movement: "0.15%",
    direction: "up",
  },
  {
    name: "Oikko Fixed Deposit",
    category: "Fixed deposit",
    term: "1 year",
    rate: "7.00%",
    movement: "0.10%",
    direction: "up",
  },
  {
    name: "Long-term Deposit",
    category: "Fixed deposit",
    term: "10 years",
    rate: "8.10%",
    movement: "0.20%",
    direction: "down",
  },
  {
    name: "Long-term Deposit",
    category: "Fixed deposit",
    term: "12 years",
    rate: "8.35%",
    movement: "0.10%",
    direction: "up",
  },
];

const formatPercent = (value: number) => `${value.toFixed(1)}%`;

export default function OikkoBankRates() {
  const [selectedRange, setSelectedRange] = useState<(typeof rateRanges)[number]["value"]>("1Y");
  const range = rateRanges.find((item) => item.value === selectedRange)!;
  const chartData =
    selectedRange === "6M"
      ? recentRateHistory.slice(-6)
      : selectedRange === "1Y"
        ? recentRateHistory
        : selectedRange === "10Y"
          ? rateHistory.slice(-10)
          : rateHistory;

  return (
    <main className="min-h-screen bg-slate-50 pb-16">
      <section className="relative overflow-hidden bg-[#003566] px-5 py-14 text-white sm:px-8 lg:py-20">
        <div className="absolute -right-24 -top-28 h-80 w-80 rounded-full bg-blue-400/20 blur-3xl" />
        <div className="absolute -bottom-36 left-1/3 h-72 w-72 rounded-full bg-cyan-300/10 blur-3xl" />
        <div className="relative mx-auto max-w-7xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold tracking-wide text-blue-100">
            <Landmark size={14} />
            OIKKO BANK RATES
            <span className="rounded-full bg-amber-300/20 px-2 py-0.5 text-[10px] font-bold text-amber-100">
              DEMO
            </span>
          </div>
          <div className="mt-6 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl">
                Rates that work for you.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-blue-100/80 sm:text-base">
                Explore sample deposit and lending rates, compare terms, and
                see how rates have changed over time.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-blue-100/75">
              <CalendarDays size={15} />
              Sample data · Updated 28 Nov 2026
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <section
          aria-label="Rate overview"
          className="relative -mt-7 grid gap-4 sm:grid-cols-3"
        >
          <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500">
                Savings rate
              </span>
              <span className="rounded-xl bg-blue-50 p-2.5 text-[#1762AE]">
                <Landmark size={19} />
              </span>
            </div>
            <div className="mt-4 flex items-end justify-between">
              <p className="text-3xl font-extrabold text-slate-900">3.50%</p>
              <span className="mb-1 inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
                <ArrowUpRight size={14} />
                0.25%
              </span>
            </div>
            <p className="mt-2 text-xs text-slate-400">Regular savings account</p>
          </article>

          <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500">
                1-year fixed deposit
              </span>
              <span className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600">
                <TrendingUp size={19} />
              </span>
            </div>
            <div className="mt-4 flex items-end justify-between">
              <p className="text-3xl font-extrabold text-slate-900">7.00%</p>
              <span className="mb-1 inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
                <ArrowUpRight size={14} />
                0.10%
              </span>
            </div>
            <p className="mt-2 text-xs text-slate-400">Interest paid at maturity</p>
          </article>

          <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500">
                Personal loan
              </span>
              <span className="rounded-xl bg-violet-50 p-2.5 text-violet-600">
                <CircleHelp size={19} />
              </span>
            </div>
            <div className="mt-4 flex items-end justify-between">
              <p className="text-3xl font-extrabold text-slate-900">10.60%</p>
              <span className="mb-1 inline-flex items-center gap-1 text-xs font-semibold text-rose-500">
                <ArrowDownRight size={14} />
                0.15%
              </span>
            </div>
            <p className="mt-2 text-xs text-slate-400">Indicative annual rate</p>
          </article>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.8fr)_minmax(280px,0.8fr)]">
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Rate history
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Sample deposit and lending rates over time
                </p>
              </div>
              <div className="flex rounded-lg bg-slate-100 p-1" aria-label="Chart range">
                {rateRanges.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    aria-label={item.label}
                    aria-pressed={selectedRange === item.value}
                    onClick={() => setSelectedRange(item.value)}
                    className={`rounded-md px-2.5 py-1.5 text-xs font-semibold transition sm:px-3 ${
                      selectedRange === item.value
                        ? "bg-white text-[#003566] shadow-sm"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {item.value}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-7 grid grid-cols-2 gap-4 sm:flex sm:gap-7">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                <span className="h-2.5 w-2.5 rounded-full bg-[#1762AE]" />
                Deposit rates
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                <span className="h-2.5 w-2.5 rounded-full bg-[#19a77a]" />
                Lending rates
              </div>
            </div>

            <div className="mt-3 h-72 w-full" role="img" aria-label={`${range.label} deposit and lending rate history chart`}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 12, right: 4, left: -18, bottom: 0 }}>
                  <CartesianGrid stroke="#eef2f6" vertical={false} />
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 11 }}
                    minTickGap={22}
                  />
                  <YAxis
                    domain={[0, 12]}
                    ticks={[0, 3, 6, 9, 12]}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 11 }}
                    tickFormatter={formatPercent}
                  />
                  <Tooltip
                    contentStyle={{
                      border: "1px solid #e2e8f0",
                      borderRadius: 12,
                      boxShadow: "0 8px 24px rgba(15, 23, 42, .08)",
                    }}
                    formatter={(value, name) => [
                      `${Number(value).toFixed(2)}%`,
                      name === "deposit" ? "Deposit rate" : "Lending rate",
                    ]}
                  />
                  <Line
                    type="monotone"
                    dataKey="deposit"
                    stroke="#1762AE"
                    strokeWidth={3}
                    dot={false}
                    activeDot={{ r: 5, strokeWidth: 0 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="lending"
                    stroke="#19a77a"
                    strokeWidth={3}
                    dot={false}
                    activeDot={{ r: 5, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-xs text-slate-400">
              Selected period: {range.label}
            </p>
          </article>

          <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-lg font-bold text-slate-900">Rate details</h2>
            <p className="mt-1 text-sm text-slate-500">
              Example annual rates by product
            </p>
            <div className="mt-6 space-y-0">
              {rateDetails.map((item, index) => (
                <div
                  key={`${item.category}-${item.term}`}
                  className={`py-4 ${index !== rateDetails.length - 1 ? "border-b border-slate-100" : ""}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        {item.name}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        {item.category} · {item.term}
                      </p>
                    </div>
                    <p className="shrink-0 text-base font-bold text-[#003566]">
                      {item.rate}
                    </p>
                  </div>
                  <p
                    className={`mt-2 text-[11px] font-medium ${
                      item.direction === "up" ? "text-emerald-600" : "text-rose-500"
                    }`}
                  >
                    {item.direction === "up" ? "↑" : "↓"} {item.movement} vs. previous period
                  </p>
                </div>
              ))}
            </div>
          </aside>
        </section>

        <p className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-900">
          Demo only: all rates and historical figures on this page are illustrative
          and do not represent actual Oikko Bank offers.
        </p>
      </div>
    </main>
  );
}
