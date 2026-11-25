
import React from "react";
import {
  Landmark,
  ShieldCheck,
  Users,
  Wallet,
  Globe,
  TrendingUp,
  ArrowRight,
  Building2,
  HandCoins,
  LockKeyhole,
} from "lucide-react";

const AboutPage = () => {
  const services = [
    {
      icon: Wallet,
      title: "Personal Banking",
      description: "Smart accounts and convenient everyday banking solutions.",
    },
    {
      icon: HandCoins,
      title: "Loans & Financing",
      description: "Flexible financing solutions for personal and business needs.",
    },
    {
      icon: Globe,
      title: "International Remittance",
      description: "Convenient international money transfer services.",
    },
    {
      icon: LockKeyhole,
      title: "Secure Transactions",
      description: "Protected digital banking with a focus on account security.",
    },
  ];

  const stats = [
    { value: "50K+", label: "Happy Customers" },
    { value: "25+", label: "Banking Branches" },
    { value: "100+", label: "Dedicated Employees" },
    { value: "24/7", label: "Digital Banking" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-12">

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#003566] px-5 py-16 text-white sm:px-8 lg:py-24">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-blue-400/10 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold tracking-wider text-blue-100">
              <Landmark size={15} className="text-white" />
              ABOUT OIKKO BANK
            </div>

            <h1 className="max-w-xl text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
              Banking Together,
              <span className="block text-white">
                Growing Together.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-sm leading-7 text-blue-100/80 sm:text-base">
              At Oikko Bank, we believe banking should be simple, secure,
              and accessible to everyone. We are committed to building
              stronger financial relationships and helping individuals
              and businesses achieve their goals.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#our-story"
                className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-bold text-[#003566] transition hover:bg-slate-200"
              >
                Discover Our Story
                <ArrowRight size={17} />
              </a>

              <a
                href="#banking-services"
                className="rounded-lg border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Our Services
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-white/10 blur-2xl" />

            <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-white/10 p-3 shadow-2xl backdrop-blur">
              <div className="flex aspect-[5/4] items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-[#0a548f] to-[#001e40]">
                <div className="relative text-center">
                  <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-3xl border border-white/20 bg-white/10 shadow-2xl">
                    <Landmark size={64} className="text-white" />
                  </div>

                  <h2 className="mt-6 text-3xl font-black tracking-widest">
                    OIKKO BANK
                  </h2>

                  <p className="mt-2 text-sm tracking-[0.3em] text-blue-100/70">
                    YOUR TRUSTED PARTNER
                  </p>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-5 -left-5 hidden rounded-xl border border-white/10 bg-white p-4 text-[#003566] shadow-xl sm:block">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-slate-100 p-2">
                  <ShieldCheck className="text-[#003566]" size={24} />
                </div>

                <div>
                  <p className="text-sm font-bold">Banking with Trust</p>
                  <p className="text-xs text-slate-500">
                    Security is our priority
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="relative z-10 mx-auto -mt-1 max-w-7xl px-4 sm:px-8">
        <div className="grid grid-cols-2 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-lg md:grid-cols-4">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`px-4 py-7 text-center ${index !== 3 ? "border-r border-slate-100" : ""
                }`}
            >
              <h3 className="text-2xl font-extrabold text-[#003566] sm:text-3xl">
                {stat.value}
              </h3>

              <p className="mt-2 text-xs font-medium text-slate-500 sm:text-sm">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Our Story */}
      <section
        id="our-story"
        className="mx-auto max-w-7xl px-5 py-20 sm:px-8"
      >
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="relative">
            <div className="rounded-3xl bg-[#003566] p-8 text-white sm:p-12">
              <Building2 size={45} className="text-white" />

              <h3 className="mt-6 text-3xl font-bold">
                Building a Better Financial Future
              </h3>

              <p className="mt-5 text-sm leading-7 text-blue-100/80">
                We aim to connect people, empower businesses, and create
                financial opportunities through accessible and dependable
                banking services.
              </p>

              <div className="mt-8 h-1.5 w-20 rounded-full bg-white" />
            </div>
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#003566]">
              Who We Are
            </span>

            <h2 className="mt-4 text-3xl font-extrabold leading-tight text-[#003566] sm:text-4xl">
              Your Financial Partner for Every Step of Life
            </h2>

            <p className="mt-6 text-sm leading-7 text-slate-600">
              Oikko Bank is built around the idea that everyone deserves
              access to dependable financial services. We focus on
              delivering convenient banking experiences that support
              individuals, families, entrepreneurs, and businesses.
            </p>

            <p className="mt-4 text-sm leading-7 text-slate-600">
              From everyday savings and money transfers to business
              financing and digital banking, our goal is to make every
              financial journey easier and more rewarding.
            </p>

            <div className="mt-8 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
                <Users size={24} className="text-[#003566]" />
              </div>

              <div>
                <h4 className="font-bold text-[#003566]">
                  People-Centered Banking
                </h4>

                <p className="mt-1 text-xs text-slate-500">
                  Banking designed around your needs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Banking Services */}
      <section
        id="banking-services"
        className="bg-slate-100 py-20"
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mb-12">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#003566]">
              What We Offer
            </span>

            <h2 className="mt-3 text-3xl font-extrabold text-[#003566] sm:text-4xl">
              Banking Made for You
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-500">
              Explore a range of financial solutions designed to
              support your personal and business goals.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => {
              const Icon = service.icon;

              return (
                <div
                  key={service.title}
                  className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#003566] text-white">
                    <Icon size={24} />
                  </div>

                  <h3 className="mt-5 font-bold text-[#003566]">
                    {service.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    {service.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-5 py-16 sm:px-8">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-[#003566] px-6 py-14 text-center text-white sm:px-12">
          <div className="absolute -right-16 -top-20 h-60 w-60 rounded-full bg-white/10 blur-3xl" />

          <div className="relative">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-white">
              <Landmark size={30} />
            </div>

            <h2 className="mt-6 text-3xl font-extrabold sm:text-4xl">
              Together, We Build a Better Tomorrow
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-blue-100/70">
              Experience banking that puts your financial goals first.
              Let Oikko Bank be a part of your journey toward a brighter
              financial future.
            </p>

            <a
              href="/dashboard"
              className="mt-8 inline-flex items-center gap-2 rounded-lg bg-white px-7 py-3.5 text-sm font-bold text-[#003566] transition hover:bg-slate-200"
            >
              Explore Banking
              <ArrowRight size={17} />
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};

export default AboutPage;
