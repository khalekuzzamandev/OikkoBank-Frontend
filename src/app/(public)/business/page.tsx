import {
  ArrowRight,
  ArrowUpRight,
  BriefcaseBusiness,
  Building2,
  Check,
  CreditCard,
  FileText,
  Globe2,
  HandCoins,
  Landmark,
  ShieldCheck,
  Wallet,
} from "lucide-react";

const businessSolutions = [
  {
    icon: Wallet,
    eyebrow: "EVERYDAY BANKING",
    title: "Business Current Account",
    description:
      "Keep your business money moving with flexible access, easy transfers, and clear account visibility.",
    features: ["Manage day-to-day cash flow", "Convenient local transfers"],
  },
  {
    icon: HandCoins,
    eyebrow: "GROW WITH CONFIDENCE",
    title: "SME Financing",
    description:
      "Explore financing options designed to help manage working capital and support your next step.",
    features: ["Flexible financing options", "A team ready to guide you"],
  },
  {
    icon: Globe2,
    eyebrow: "PAYMENTS & TRADE",
    title: "Business Payments",
    description:
      "Simplify supplier payments and manage local and international business transactions in one place.",
    features: ["Supplier payment support", "International trade services"],
  },
];

const activity = [
  { label: "Supplier payment", date: "Today, 10:42 AM", amount: "− ৳28,500", type: "out" },
  { label: "Client payment", date: "Today, 9:18 AM", amount: "+ ৳64,000", type: "in" },
  { label: "Office supplies", date: "Yesterday", amount: "− ৳8,750", type: "out" },
];

const cashFlowBars = [38, 52, 45, 70, 56, 83, 68, 92, 63, 77, 58, 88];

export default function Business() {
  return (
    <main className="min-h-screen bg-white">
      <section className="relative overflow-hidden bg-[#003566] px-5 py-16 text-white sm:px-8 lg:py-24">
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-cyan-300/10 blur-3xl" />
        <div className="absolute -bottom-40 left-1/4 h-96 w-96 rounded-full bg-blue-400/15 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1fr_0.95fr]">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold tracking-[0.14em] text-blue-100">
              <Building2 size={15} />
              BUSINESS BANKING
            </div>
            <h1 className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Your business has big plans.
              <span className="mt-2 block text-cyan-200">
                Let’s move them forward.
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-sm leading-7 text-blue-100/80 sm:text-base">
              Banking support for the everyday work and ambitious next steps
              of your business. Manage payments, explore financing, and keep
              your finances moving with Oikko Bank.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#solutions"
                className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3.5 text-sm font-bold text-[#003566] transition hover:bg-blue-50"
              >
                Explore business solutions
                <ArrowRight size={17} />
              </a>
              <a
                href="#business-support"
                className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Talk to our team
              </a>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-xs font-medium text-blue-100/80">
              <span className="inline-flex items-center gap-2">
                <Check size={15} className="text-cyan-200" />
                Banking built around your business
              </span>
              <span className="inline-flex items-center gap-2">
                <Check size={15} className="text-cyan-200" />
                Support when you need it
              </span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl">
            <div className="absolute -inset-5 rounded-[2rem] bg-cyan-300/10 blur-2xl" />
            <div className="relative rounded-3xl border border-white/15 bg-white p-5 text-slate-900 shadow-2xl sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-[#1762AE]">
                      <BriefcaseBusiness size={18} />
                    </span>
                    Business overview
                  </div>
                  <p className="mt-2 pl-11 text-xs text-slate-400">
                    Sample account · Oikko Business
                  </p>
                </div>
                <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-700">
                  Demo
                </span>
              </div>

              <div className="mt-7 rounded-2xl bg-gradient-to-br from-[#064b86] to-[#003566] p-5 text-white sm:p-6">
                <div className="flex items-center justify-between text-xs text-blue-100">
                  <span>Available balance</span>
                  <Landmark size={17} />
                </div>
                <p className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
                  ৳ 12,48,650
                </p>
                <div className="mt-5 flex items-center justify-between border-t border-white/15 pt-4 text-xs">
                  <span className="text-blue-100">Business Current · •• 2841</span>
                  <span className="inline-flex items-center gap-1 font-semibold text-emerald-200">
                    <ArrowUpRight size={14} />
                    8.4%
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">Money in</p>
                  <p className="mt-2 text-lg font-bold text-slate-900">৳ 4,82,000</p>
                  <p className="mt-1 text-[11px] text-emerald-600">This month</p>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">Money out</p>
                  <p className="mt-2 text-lg font-bold text-slate-900">৳ 2,16,450</p>
                  <p className="mt-1 text-[11px] text-slate-400">This month</p>
                </div>
              </div>

              <div className="mt-6">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-bold text-slate-800">Cash flow</p>
                  <span className="text-xs text-slate-400">Last 12 months</span>
                </div>
                <div
                  className="flex h-16 items-end gap-1.5"
                  role="img"
                  aria-label="Sample cash flow chart"
                >
                  {cashFlowBars.map((height, index) => (
                    <div
                      key={index}
                      className={`flex-1 rounded-t-sm ${
                        index === cashFlowBars.length - 1
                          ? "bg-[#1762AE]"
                          : "bg-blue-100"
                      }`}
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>
                <div className="mt-2 flex justify-between text-[10px] text-slate-400">
                  <span>Dec</span>
                  <span>Mar</span>
                  <span>Jun</span>
                  <span>Sep</span>
                  <span>Nov</span>
                </div>
              </div>

              <div className="mt-6 border-t border-slate-100 pt-5">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-bold text-slate-800">Recent activity</p>
                  <span className="text-xs font-semibold text-[#1762AE]">View all</span>
                </div>
                <div className="space-y-3">
                  {activity.map((item) => (
                    <div key={item.label} className="flex items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <span
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                            item.type === "in"
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {item.type === "in" ? (
                            <ArrowUpRight size={15} />
                          ) : (
                            <CreditCard size={14} />
                          )}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-xs font-semibold text-slate-700">
                            {item.label}
                          </p>
                          <p className="mt-0.5 text-[10px] text-slate-400">{item.date}</p>
                        </div>
                      </div>
                      <span
                        className={`shrink-0 text-xs font-bold ${
                          item.type === "in" ? "text-emerald-600" : "text-slate-700"
                        }`}
                      >
                        {item.amount}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <p className="mt-5 text-center text-[10px] text-slate-400">
                Illustrative preview · Not a live account
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-20" id="solutions">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#1762AE]">
            Solutions for every stage
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#003566] sm:text-4xl">
            Built for the way you do business
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-500">
            From opening your doors to planning your next expansion, find
            practical banking services for your business.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {businessSolutions.map((solution) => {
            const Icon = solution.icon;
            return (
              <article
                key={solution.title}
                className="group rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/5 sm:p-7"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[#1762AE] transition group-hover:bg-[#003566] group-hover:text-white">
                  <Icon size={23} />
                </div>
                <p className="mt-6 text-[10px] font-bold tracking-[0.16em] text-[#1762AE]">
                  {solution.eyebrow}
                </p>
                <h3 className="mt-2 text-xl font-bold text-[#003566]">
                  {solution.title}
                </h3>
                <p className="mt-3 min-h-[72px] text-sm leading-6 text-slate-500">
                  {solution.description}
                </p>
                <ul className="mt-5 space-y-3">
                  {solution.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-2 text-xs font-medium text-slate-600"
                    >
                      <Check size={15} className="shrink-0 text-emerald-600" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <a
                  href="#business-support"
                  className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-[#1762AE] transition group-hover:gap-3"
                >
                  Learn more <ArrowRight size={16} />
                </a>
              </article>
            );
          })}
        </div>
      </section>

      <section className="bg-slate-50 px-5 py-16 sm:px-8 lg:py-20" id="tools">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#1762AE]">
              A clearer view of your finances
            </p>
            <h2 className="mt-3 max-w-xl text-3xl font-extrabold leading-tight text-[#003566] sm:text-4xl">
              Spend less time on banking. More time on what’s next.
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-7 text-slate-500">
              Bring everyday business banking tasks together with tools designed
              to make payments and account activity easier to manage.
            </p>
            <div className="mt-8 space-y-5">
              <div className="flex gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#1762AE] shadow-sm">
                  <CreditCard size={19} />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">
                    Payments, made simpler
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Keep track of supplier payments and incoming funds in one view.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#1762AE] shadow-sm">
                  <FileText size={19} />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">
                    Account information, close at hand
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Review balances, recent activity, and statements when you need them.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#1762AE] shadow-sm">
                  <ShieldCheck size={19} />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">
                    Support for confident decisions
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Connect with a banking team to discuss your business needs.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl bg-[#003566] p-7 text-white sm:p-10">
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
            <div className="relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                <Landmark size={24} />
              </div>
              <p className="mt-8 text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">
                Oikko Business
              </p>
              <h3 className="mt-3 max-w-md text-2xl font-extrabold leading-snug sm:text-3xl">
                Your business banking, with a real team behind it.
              </h3>
              <p className="mt-4 max-w-md text-sm leading-7 text-blue-100/75">
                Tell us about your business and we’ll help you explore the
                services that fit your goals.
              </p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm font-bold">Start a conversation</p>
                  <p className="mt-1 text-xs leading-5 text-blue-100/60">
                    Get help finding the right account.
                  </p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm font-bold">Plan your next step</p>
                  <p className="mt-1 text-xs leading-5 text-blue-100/60">
                    Explore business financing options.
                  </p>
                </div>
              </div>
              <a
                href="#business-support"
                className="mt-8 inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-bold text-[#003566] transition hover:bg-blue-50"
              >
                Get in touch <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 lg:py-20" id="business-support">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-10">
          <div className="grid items-center gap-8 md:grid-cols-[1fr_auto]">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#1762AE]">
                <ShieldCheck size={16} />
                Here for your business
              </div>
              <h2 className="mt-3 text-2xl font-extrabold text-[#003566] sm:text-3xl">
                Let’s build what’s next, together.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
                Speak with Oikko Bank about business accounts, payment services,
                and financing for your next opportunity.
              </p>
            </div>
            <a
              href="mailto:business@oikkobank.com"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#003566] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#064b86]"
            >
              Contact business banking <ArrowRight size={16} />
            </a>
          </div>
        </div>
        <p className="mx-auto mt-5 max-w-5xl text-center text-xs text-slate-400">
          Account balances, transactions, and performance figures shown above
          are illustrative demo content, not live financial information.
        </p>
      </section>
    </main>
  );
}
