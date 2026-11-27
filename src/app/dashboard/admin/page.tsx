import Link from "next/link";
import {
  ArrowLeftRight,
  ArrowUpFromLine,
  Banknote,
  ChartBar,
  ChevronRight,
  HandCoins,
  LayoutDashboard,
  Landmark,
  Settings,
  ShieldAlert,
  UserCog,
  Users,
  Wallet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type AdminModule = {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
};

const moduleGroups: { title: string; modules: AdminModule[] }[] = [
  {
    title: "People & accounts",
    modules: [
      {
        title: "Accounts",
        description: "Review and manage bank accounts.",
        href: "/dashboard/admin/accounts",
        icon: Wallet,
      },
      {
        title: "Customers",
        description: "View customer information and profiles.",
        href: "/dashboard/admin/customers",
        icon: Users,
      },
      {
        title: "Staff",
        description: "Manage your banking team.",
        href: "/dashboard/admin/staff",
        icon: UserCog,
      },
    ],
  },
  {
    title: "Banking operations",
    modules: [
      {
        title: "Deposits",
        description: "View and manage deposit activity.",
        href: "/dashboard/admin/deposits",
        icon: Banknote,
      },
      {
        title: "Loans",
        description: "Review loan activity and applications.",
        href: "/dashboard/admin/loans",
        icon: HandCoins,
      },
      {
        title: "Withdrawals",
        description: "Review and manage withdrawal activity.",
        href: "/dashboard/admin/withdrawals",
        icon: ArrowUpFromLine,
      },
      {
        title: "Transactions",
        description: "Browse banking transaction records.",
        href: "/dashboard/admin/transactions",
        icon: ArrowLeftRight,
      },
    ],
  },
  {
    title: "Oversight & settings",
    modules: [
      {
        title: "Analytics",
        description: "Explore reports and banking insights.",
        href: "/dashboard/admin/analytics",
        icon: ChartBar,
      },
      {
        title: "Suspicious activities",
        description: "Review activity flagged for attention.",
        href: "/dashboard/admin/suspicious-activities",
        icon: ShieldAlert,
      },
      {
        title: "Settings",
        description: "Configure your administration preferences.",
        href: "/dashboard/admin/settings",
        icon: Settings,
      },
    ],
  },
];

export default function OverviewForAdmin() {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 pb-10">
      <section className="relative overflow-hidden rounded-2xl bg-[#003566] px-6 py-8 text-white shadow-lg shadow-[#003566]/10 sm:px-8 sm:py-10">
        <div className="pointer-events-none absolute -right-12 -top-20 h-64 w-64 rounded-full border-[32px] border-white/[0.06]" />
        <div className="pointer-events-none absolute -bottom-28 right-36 h-56 w-56 rounded-full bg-[#F26B21]/15 blur-3xl" />

        <div className="relative max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-blue-100">
            <LayoutDashboard size={14} />
            Admin workspace
          </div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Admin overview
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-blue-100/80 sm:text-base">
            Manage people, accounts, and banking operations from one place.
            Choose a section below to get started.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/dashboard/admin/analytics"
              className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-[#003566] transition hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#003566]"
            >
              <ChartBar size={17} />
              View analytics
              <ChevronRight size={16} />
            </Link>
            <Link
              href="/dashboard/admin/suspicious-activities"
              className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-white/20 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <ShieldAlert size={17} />
              Suspicious activities
            </Link>
          </div>
        </div>
      </section>

      {moduleGroups.map((group) => (
        <section key={group.title} aria-labelledby={`group-${group.title}`}>
          <div className="mb-4 flex items-center gap-3">
            <h2
              id={`group-${group.title}`}
              className="text-base font-bold text-slate-900 sm:text-lg"
            >
              {group.title}
            </h2>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {group.modules.map((module) => {
              const Icon = module.icon;

              return (
                <Link
                  key={module.href}
                  href={module.href}
                  className="group flex min-h-36 items-start gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#003566]/25 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F26B21] focus-visible:ring-offset-2"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#003566]/[0.07] text-[#003566] transition group-hover:bg-[#003566] group-hover:text-white">
                    <Icon size={21} strokeWidth={1.9} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-slate-900">
                        {module.title}
                      </span>
                      <ChevronRight
                        size={17}
                        className="shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-[#003566]"
                      />
                    </span>
                    <span className="mt-2 block text-sm leading-5 text-slate-500">
                      {module.description}
                    </span>
                    <span className="mt-4 block text-xs font-semibold text-[#003566]">
                      Open section
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      ))}

      <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
        <Landmark size={18} className="shrink-0 text-[#003566]" />
        <p>Use the sidebar or these shortcuts to navigate the admin workspace.</p>
      </div>
    </div>
  );
}
