
"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  MessageCircle,
  Phone,
  Mail,
  ShieldCheck,
  CreditCard,
  ArrowLeftRight,
  Wallet,
  LockKeyhole,
  ChevronDown,
  Headphones,
  FileText,
  CircleHelp,
  Clock,
  ArrowRight,
  Send,
  HelpCircle,
} from "lucide-react";

const helpCategories = [
  {
    title: "Account Management",
    description: "Account opening, profile and account settings.",
    icon: Wallet,
    color: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
  },
  {
    title: "Payments & Transfers",
    description: "Learn about transfers, payments and transactions.",
    icon: ArrowLeftRight,
    color: "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400",
  },
  {
    title: "Cards & Banking",
    description: "Get help with your banking cards and services.",
    icon: CreditCard,
    color: "bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400",
  },
  {
    title: "Security & Privacy",
    description: "Password, account security and privacy settings.",
    icon: ShieldCheck,
    color: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
  },
];

const faqs = [
  {
    question: "How can I create an Oikko Bank account?",
    answer:
      "You can register through the Oikko Bank platform by providing your personal information and completing the required verification process. Once your application is reviewed and approved, your account can be activated.",
    category: "Account",
  },
  {
    question: "How can I check my account balance?",
    answer:
      "Log in to your Oikko Bank dashboard and navigate to the My Accounts section. Your available account balance and account information will be displayed there.",
    category: "Account",
  },
  {
    question: "How do I transfer money?",
    answer:
      "Go to the Transfer Money section from your customer dashboard. Enter the recipient details and transfer amount, review the information, and follow the confirmation steps.",
    category: "Transfers",
  },
  {
    question: "What should I do if I forget my password?",
    answer:
      "Use the Forgot Password option on the login page, if available. Follow the instructions to verify your identity and reset your password.",
    category: "Security",
  },
  {
    question: "How can I view my transaction history?",
    answer:
      "Open the Transactions section from your dashboard. You can review your available transaction records and their details.",
    category: "Transactions",
  },
  {
    question: "How can I apply for a loan?",
    answer:
      "Navigate to the Loans section from your customer dashboard. Review the available application options and submit the required information.",
    category: "Loans",
  },
  {
    question: "What should I do if I notice an unauthorized transaction?",
    answer:
      "Contact the bank support team immediately. Do not share your password, PIN, OTP or other confidential information with anyone.",
    category: "Security",
  },
  {
    question: "How can I update my personal information?",
    answer:
      "Visit your profile section to review your account information. If a particular field cannot be edited, contact the bank support team for assistance.",
    category: "Account",
  },
];

const HelpCenter = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      const matchesSearch =
        faq.question.toLowerCase().includes(search.toLowerCase()) ||
        faq.answer.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        activeCategory === "All" || faq.category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#003566] px-4 py-16 text-white sm:px-6 lg:py-20">
        <div className="absolute -right-20 -top-28 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="relative mx-auto max-w-5xl text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-white/10 shadow-xl">
            <Headphones size={32} />
          </div>

          <p className="mb-3 text-sm font-semibold uppercase tracking-[3px] text-blue-200">
            Oikko Bank Support
          </p>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            How can we help you?
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-blue-100 sm:text-base">
            Find answers, explore helpful resources and get the support you
            need for a smooth digital banking experience.
          </p>

          {/* Search */}
          <div className="mx-auto mt-9 flex max-w-2xl items-center gap-3 rounded-xl bg-white p-2 shadow-2xl">
            <Search className="ml-3 shrink-0 text-slate-400" size={22} />

            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setActiveCategory("All");
              }}
              placeholder="Search for help, questions or topics..."
              className="min-w-0 flex-1 bg-transparent py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 sm:text-base"
            />

            <button
              type="button"
              onClick={() =>
                document
                  .getElementById("faq-section")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="rounded-lg bg-[#003566] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#00264d]"
            >
              Search
            </button>
          </div>

          <div className="mt-5 flex flex-wrap justify-center gap-3 text-xs text-blue-100 sm:text-sm">
            <span>Popular:</span>
            {["Account", "Transfers", "Security", "Transactions"].map(
              (item) => (
                <button
                  key={item}
                  onClick={() => {
                    setSearch("");
                    setActiveCategory(item);
                    document
                      .getElementById("faq-section")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="underline decoration-blue-300 underline-offset-4 transition hover:text-white"
                >
                  {item}
                </button>
              )
            )}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Support Categories */}
        <section>
          <div className="mb-7">
            <p className="text-sm font-semibold uppercase tracking-wider text-[#003566] dark:text-blue-400">
              Browse Help Topics
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
              What do you need help with?
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Explore our support topics to find the right information.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {helpCategories.map((category) => {
              const Icon = category.icon;

              return (
                <button
                  key={category.title}
                  onClick={() => {
                    const categoryMap: Record<string, string> = {
                      "Account Management": "Account",
                      "Payments & Transfers": "Transfers",
                      "Cards & Banking": "All",
                      "Security & Privacy": "Security",
                    };

                    setSearch("");
                    setActiveCategory(categoryMap[category.title]);
                    document
                      .getElementById("faq-section")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="group rounded-2xl border border-slate-200 bg-white p-5 text-left transition duration-300 hover:-translate-y-1 hover:border-[#003566]/30 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
                >
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${category.color}`}
                  >
                    <Icon size={24} />
                  </div>

                  <h3 className="mt-5 font-bold">{category.title}</h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                    {category.description}
                  </p>

                  <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-[#003566] dark:text-blue-400">
                    Explore topics
                    <ArrowRight
                      size={16}
                      className="transition group-hover:translate-x-1"
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq-section" className="mt-16 scroll-mt-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.75fr_1.25fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-[#003566] dark:text-blue-400">
                Frequently Asked Questions
              </p>

              <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                Common questions,
                <br />
                clear answers.
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-500 dark:text-slate-400">
                Find quick answers to the most common questions about your
                Oikko Bank account and digital banking services.
              </p>

              <div className="mt-7 rounded-2xl border border-blue-100 bg-blue-50 p-5 dark:border-blue-900/50 dark:bg-blue-950/30">
                <div className="flex items-center gap-3">
                  <CircleHelp className="text-[#003566] dark:text-blue-400" />
                  <h3 className="font-bold">Still need help?</h3>
                </div>

                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                  Our support team is ready to help you with your banking
                  questions.
                </p>

                <a
                  href="mailto:support@oikkobank.com"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#003566] hover:underline dark:text-blue-400"
                >
                  Contact Support <ArrowRight size={16} />
                </a>
              </div>
            </div>

            <div>
              {/* FAQ Filters */}
              <div className="mb-5 flex flex-wrap gap-2">
                {[
                  "All",
                  "Account",
                  "Transfers",
                  "Security",
                  "Transactions",
                  "Loans",
                ].map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`rounded-full px-4 py-2 text-xs font-semibold transition sm:text-sm ${activeCategory === category
                        ? "bg-[#003566] text-white"
                        : "border border-slate-200 bg-white text-slate-600 hover:border-[#003566] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                      }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* FAQ List */}
              <div className="space-y-3">
                {filteredFaqs.length > 0 ? (
                  filteredFaqs.map((faq) => {
                    const originalIndex = faqs.indexOf(faq);
                    const isOpen = openFaq === originalIndex;

                    return (
                      <div
                        key={faq.question}
                        className={`overflow-hidden rounded-xl border bg-white transition dark:bg-slate-900 ${isOpen
                            ? "border-[#003566]/40 shadow-sm dark:border-blue-500/40"
                            : "border-slate-200 dark:border-slate-800"
                          }`}
                      >
                        <button
                          type="button"
                          onClick={() =>
                            setOpenFaq(isOpen ? null : originalIndex)
                          }
                          className="flex w-full items-center justify-between gap-4 p-5 text-left"
                        >
                          <span className="text-sm font-semibold leading-6 sm:text-base">
                            {faq.question}
                          </span>

                          <ChevronDown
                            size={19}
                            className={`shrink-0 text-[#003566] transition-transform dark:text-blue-400 ${isOpen ? "rotate-180" : ""
                              }`}
                          />
                        </button>

                        {isOpen && (
                          <div className="border-t border-slate-100 px-5 pb-5 pt-4 dark:border-slate-800">
                            <p className="text-sm leading-7 text-slate-500 dark:text-slate-400">
                              {faq.answer}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="rounded-xl border border-dashed border-slate-300 py-12 text-center dark:border-slate-700">
                    <Search
                      size={30}
                      className="mx-auto text-slate-400"
                    />
                    <h3 className="mt-3 font-semibold">
                      No results found
                    </h3>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                      Try another search term or category.
                    </p>

                    <button
                      onClick={() => {
                        setSearch("");
                        setActiveCategory("All");
                      }}
                      className="mt-4 text-sm font-semibold text-[#003566] hover:underline dark:text-blue-400"
                    >
                      Clear filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Contact Support */}
        <section className="mt-16">
          <div className="overflow-hidden rounded-3xl bg-[#003566] p-6 text-white sm:p-10 lg:p-12">
            <div className="grid items-center gap-10 lg:grid-cols-[1fr_0.9fr]">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
                  <Headphones size={25} />
                </div>

                <h2 className="mt-6 text-2xl font-bold sm:text-3xl">
                  Need personalized assistance?
                </h2>

                <p className="mt-4 max-w-xl text-sm leading-7 text-blue-100">
                  Can&apos;t find what you&apos;re looking for? Reach out to our
                  support team for help with your banking experience.
                </p>

                <a
                  href="mailto:support@oikkobank.com"
                  className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-[#003566] transition hover:bg-blue-50"
                >
                  <Send size={17} />
                  Email Support
                </a>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/15 bg-white/10 p-5">
                  <Mail size={23} className="text-blue-200" />
                  <h3 className="mt-4 font-bold">Email Support</h3>
                  <p className="mt-2 break-all text-sm text-blue-100">
                    support@oikkobank.com
                  </p>
                  <p className="mt-3 text-xs text-blue-200">
                    Send us your questions
                  </p>
                </div>

                <div className="rounded-2xl border border-white/15 bg-white/10 p-5">
                  <Clock size={23} className="text-blue-200" />
                  <h3 className="mt-4 font-bold">Support Hours</h3>
                  <p className="mt-2 text-sm text-blue-100">
                    Contact our support team
                  </p>
                  <p className="mt-3 text-xs text-blue-200">
                    Availability may vary
                  </p>
                </div>

                <div className="rounded-2xl border border-white/15 bg-white/10 p-5 sm:col-span-2">
                  <div className="flex items-center gap-3">
                    <MessageCircle
                      size={23}
                      className="text-blue-200"
                    />
                    <div>
                      <h3 className="font-bold">Help & Guidance</h3>
                      <p className="mt-1 text-sm text-blue-100">
                        Explore FAQs before contacting support.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom Help */}
        <section className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <LockKeyhole size={16} className="text-emerald-600" />
            Your security and privacy are our priority.
          </div>
        </section>
      </div>
    </div>
  );
};

export default HelpCenter;
