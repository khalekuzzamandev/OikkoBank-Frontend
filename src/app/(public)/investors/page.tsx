
"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  ChartNoAxesCombined,
  ShieldCheck,
  FileText,
  Download,
  CalendarDays,
  Mail,
  Phone,
  Globe,
  Landmark,
  TrendingUp,
  Users,
  BriefcaseBusiness,
  CircleDollarSign,
  Handshake,
  Scale,
  Target,
  Eye,
  Award,
  Wallet2Icon,
} from "lucide-react";

const financialHighlights = [
  {
    title: "Total Assets",
    value: "—",
    description: "Financial information not published",
    icon: Building2,
  },
  {
    title: "Customer Deposits",
    value: "—",
    description: "Financial information not published",
    icon: Wallet2Icon,
  },
  {
    title: "Active Customers",
    value: "—",
    description: "Operational information not published",
    icon: Users,
  },
  {
    title: "Net Profit",
    value: "—",
    description: "Financial information not published",
    icon: TrendingUp,
  },
];

const investorResources = [
  {
    title: "Annual Reports",
    description:
      "Access annual financial statements and organizational performance reports.",
    icon: FileText,
    type: "Financial Reports",
  },
  {
    title: "Corporate Governance",
    description:
      "Learn about organizational leadership, policies and governance practices.",
    icon: ShieldCheck,
    type: "Governance",
  },
  {
    title: "Financial Statements",
    description:
      "Explore financial statements and other published financial information.",
    icon: ChartNoAxesCombined,
    type: "Financial Information",
  },
  {
    title: "Investor Presentations",
    description:
      "Review presentations and relevant organizational information for investors.",
    icon: BriefcaseBusiness,
    type: "Presentations",
  },
];

const corporateValues = [
  {
    title: "Transparency",
    description:
      "We believe in clear communication and responsible disclosure of relevant information.",
    icon: Eye,
  },
  {
    title: "Accountability",
    description:
      "We emphasize responsible management and accountability across our organization.",
    icon: Scale,
  },
  {
    title: "Long-Term Vision",
    description:
      "We aim to build sustainable digital banking services and long-term value.",
    icon: Target,
  },
  {
    title: "Partnership",
    description:
      "We value meaningful relationships with customers, stakeholders and partners.",
    icon: Handshake,
  },
];

const WalletIcon = CircleDollarSign;

const InvestorsRelations = () => {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#003566] px-4 py-16 text-white sm:px-6 lg:py-24">
        <div className="absolute -right-20 -top-24 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-blue-100">
              <Landmark size={15} />
              OIKKO BANK
              <span className="h-1 w-1 rounded-full bg-cyan-300" />
              INVESTOR RELATIONS
            </div>

            <h1 className="mt-7 max-w-2xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Building Trust.
              <br />
              Creating Value.
            </h1>

            <p className="mt-6 max-w-xl text-sm leading-8 text-blue-100 sm:text-base">
              Welcome to Oikko Bank Investor Relations. Explore our
              organizational vision, governance principles and available
              information for stakeholders and prospective investors.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href="#investor-resources"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-[#003566] transition hover:bg-blue-50"
              >
                Explore Resources
                <ArrowRight size={17} />
              </a>

              <a
                href="#contact-investors"
                className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Contact Investor Relations
              </a>
            </div>
          </div>

          {/* Hero Information Card */}
          <div className="relative">
            <div className="rounded-3xl border border-white/15 bg-white/10 p-6 shadow-2xl backdrop-blur-sm sm:p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-200">
                    Our Commitment
                  </p>
                  <h2 className="mt-2 text-2xl font-bold">
                    Responsible Banking
                  </h2>
                </div>

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
                  <ShieldCheck size={29} />
                </div>
              </div>

              <div className="my-7 h-px bg-white/15" />

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10">
                    <Eye size={21} />
                  </div>
                  <div>
                    <h3 className="font-semibold">Transparency</h3>
                    <p className="mt-1 text-sm leading-6 text-blue-100">
                      Clear and responsible communication with stakeholders.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10">
                    <Scale size={21} />
                  </div>
                  <div>
                    <h3 className="font-semibold">Strong Governance</h3>
                    <p className="mt-1 text-sm leading-6 text-blue-100">
                      A commitment to responsible organizational practices.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10">
                    <TrendingUp size={21} />
                  </div>
                  <div>
                    <h3 className="font-semibold">Sustainable Growth</h3>
                    <p className="mt-1 text-sm leading-6 text-blue-100">
                      Focused on building long-term organizational value.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-5 -right-4 -z-0 h-28 w-28 rounded-3xl border border-white/10 bg-white/5" />
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="text-sm font-bold uppercase tracking-[2px] text-[#003566] dark:text-blue-400">
              About Investor Relations
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Connecting our vision with stakeholders
            </h2>

            <p className="mt-5 text-sm leading-8 text-slate-600 dark:text-slate-400">
              Oikko Bank Investor Relations is designed to provide a central
              destination for stakeholders seeking information about our
              organization, strategic direction, corporate governance and
              available financial disclosures.
            </p>

            <p className="mt-4 text-sm leading-8 text-slate-600 dark:text-slate-400">
              We aim to maintain transparent communication and build
              long-term relationships through responsible business practices
              and a customer-focused digital banking experience.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[#003566] dark:bg-blue-500/10 dark:text-blue-400">
                <Globe size={24} />
              </div>
              <h3 className="mt-5 font-bold">Digital First</h3>
              <p className="mt-2 text-xs leading-6 text-slate-500 dark:text-slate-400">
                Modern digital banking experience.
              </p>
            </div>

            <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                <ShieldCheck size={24} />
              </div>
              <h3 className="mt-5 font-bold">Security Focus</h3>
              <p className="mt-2 text-xs leading-6 text-slate-500 dark:text-slate-400">
                Security-conscious banking services.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400">
                <Users size={24} />
              </div>
              <h3 className="mt-5 font-bold">Customer Focus</h3>
              <p className="mt-2 text-xs leading-6 text-slate-500 dark:text-slate-400">
                Designed around customer needs.
              </p>
            </div>

            <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
                <Award size={24} />
              </div>
              <h3 className="mt-5 font-bold">Quality Driven</h3>
              <p className="mt-2 text-xs leading-6 text-slate-500 dark:text-slate-400">
                Focused on service quality.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Financial Highlights */}
      <section className="border-y border-slate-200 bg-white py-16 dark:border-slate-800 dark:bg-slate-900/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-9 text-center">
            <p className="text-sm font-bold uppercase tracking-[2px] text-[#003566] dark:text-blue-400">
              Financial Overview
            </p>
            <h2 className="mt-3 text-3xl font-bold">
              Financial Highlights
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-500 dark:text-slate-400">
              Key financial and operational indicators will be published here
              when verified organizational data becomes available.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {financialHighlights.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-[#003566] dark:bg-blue-500/10 dark:text-blue-400">
                    <Icon size={23} />
                  </div>

                  <p className="mt-5 text-sm font-medium text-slate-500 dark:text-slate-400">
                    {item.title}
                  </p>

                  <h3 className="mt-2 text-3xl font-bold tracking-tight">
                    {item.value}
                  </h3>

                  <p className="mt-2 text-xs leading-5 text-slate-400">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>

          <p className="mt-6 text-center text-xs text-slate-400">
            Note: No audited financial figures or verified operating metrics
            are currently provided on this page.
          </p>
        </div>
      </section>

      {/* Corporate Governance */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-[2px] text-[#003566] dark:text-blue-400">
            Corporate Governance
          </p>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
            Principles that guide us
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-500 dark:text-slate-400">
            Our organizational principles emphasize responsible management,
            transparency and sustainable relationships.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {corporateValues.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
              >
                <Icon size={27} className="text-[#003566] dark:text-blue-400" />
                <h3 className="mt-5 font-bold">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-500 dark:text-slate-400">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Investor Resources */}
      <section
        id="investor-resources"
        className="border-y border-slate-200 bg-white py-16 dark:border-slate-800 dark:bg-slate-900/50"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-9 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[2px] text-[#003566] dark:text-blue-400">
                Investor Resources
              </p>
              <h2 className="mt-3 text-3xl font-bold">
                Information & Documents
              </h2>
              <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                Access investor-related information and organizational
                documents.
              </p>
            </div>

            <span className="inline-flex w-fit items-center gap-2 rounded-lg bg-amber-50 px-4 py-2 text-xs font-semibold text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
              <FileText size={15} />
              Resources coming soon
            </span>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {investorResources.map((resource) => {
              const Icon = resource.icon;

              return (
                <div
                  key={resource.title}
                  className="flex flex-col justify-between gap-5 rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:flex-row sm:items-center dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="flex gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-[#003566] dark:bg-blue-500/10 dark:text-blue-400">
                      <Icon size={23} />
                    </div>

                    <div>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                        {resource.type}
                      </span>
                      <h3 className="mt-1 font-bold">{resource.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                        {resource.description}
                      </p>
                    </div>
                  </div>

                  <span className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-400 dark:border-slate-700">
                    <Download size={15} />
                    Coming Soon
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section
        id="contact-investors"
        className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="relative overflow-hidden rounded-3xl bg-[#003566] p-7 text-white sm:p-10 lg:p-12">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/5 blur-2xl" />

          <div className="relative grid items-center gap-10 lg:grid-cols-2">
            <div>
              <p className="text-sm font-bold uppercase tracking-[2px] text-blue-200">
                Get In Touch
              </p>

              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
                Connect with our team
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-7 text-blue-100">
                For investor-related questions, organizational information
                or stakeholder inquiries, please contact our team.
              </p>
            </div>

            <div className="space-y-4">
              <a
                href="mailto:investors@oikkobank.com"
                className="flex items-center gap-4 rounded-xl border border-white/15 bg-white/10 p-5 transition hover:bg-white/15"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
                  <Mail size={21} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs text-blue-200">
                    Investor Relations Email
                  </p>
                  <p className="mt-1 break-all text-sm font-semibold">
                    investors@oikkobank.com
                  </p>
                </div>

                <ArrowUpRight size={19} />
              </a>

              <div className="flex items-center gap-4 rounded-xl border border-white/15 bg-white/10 p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
                  <CalendarDays size={21} />
                </div>

                <div>
                  <p className="text-xs text-blue-200">
                    Investor Inquiries
                  </p>
                  <p className="mt-1 text-sm font-semibold">
                    Contact us by email
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="border-t border-slate-200 bg-white px-4 py-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 text-xs leading-6 text-slate-400 sm:flex-row sm:items-start">
          <ShieldCheck
            size={17}
            className="mt-1 shrink-0 text-[#003566] dark:text-blue-400"
          />
          <p>
            <strong>Disclaimer:</strong> This Investor Relations page is
            intended for general informational purposes. Financial
            information, reports, investor documents and contact details
            should be published only after official verification and
            authorization. Nothing on this page constitutes an investment
            offer or financial advice.
          </p>
        </div>
      </section>
    </main>
  );
};

export default InvestorsRelations;
