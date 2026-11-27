
import Link from "next/link";
import {
  ArrowLeftRight,
  ArrowUpFromLine,
  Banknote,
  ChartBar,
  HandCoins,
  LayoutDashboard,
  Settings,
  ShieldAlert,
  UserCog,
  Users,
  Wallet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type AdminModule = {
  title: string;
  href: string;
  icon: LucideIcon;
  color: string;
  iconColor: string;
};

const modules: AdminModule[] = [
  {
    title: "Accounts",
    href: "/dashboard/admin/accounts",
    icon: Wallet,
    color: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    title: "Customers",
    href: "/dashboard/admin/customers",
    icon: Users,
    color: "bg-violet-50",
    iconColor: "text-violet-600",
  },
  {
    title: "Staff",
    href: "/dashboard/admin/staff",
    icon: UserCog,
    color: "bg-cyan-50",
    iconColor: "text-cyan-600",
  },
  {
    title: "Deposits",
    href: "/dashboard/admin/deposits",
    icon: Banknote,
    color: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
  {
    title: "Loans",
    href: "/dashboard/admin/loans",
    icon: HandCoins,
    color: "bg-orange-50",
    iconColor: "text-orange-600",
  },
  {
    title: "Withdrawals",
    href: "/dashboard/admin/withdrawals",
    icon: ArrowUpFromLine,
    color: "bg-rose-50",
    iconColor: "text-rose-600",
  },
  {
    title: "Transactions",
    href: "/dashboard/admin/transactions",
    icon: ArrowLeftRight,
    color: "bg-indigo-50",
    iconColor: "text-indigo-600",
  },
  {
    title: "Analytics",
    href: "/dashboard/admin/analytics",
    icon: ChartBar,
    color: "bg-sky-50",
    iconColor: "text-sky-600",
  },
  {
    title: "Suspicious Activities",
    href: "/dashboard/admin/suspicious-activities",
    icon: ShieldAlert,
    color: "bg-amber-50",
    iconColor: "text-amber-600",
  },
  {
    title: "Settings",
    href: "/dashboard/admin/settings",
    icon: Settings,
    color: "bg-slate-100",
    iconColor: "text-slate-600",
  },
];

export default function OverviewForAdmin() {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 p-4 pb-8 sm:p-6 lg:p-8">
      {/* Header */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#003566] to-[#07549a] px-5 py-6 text-white shadow-md sm:px-7">
        <div className="pointer-events-none absolute -right-12 -top-16 h-48 w-48 rounded-full border-[25px] border-white/[0.06]" />

        <div className="pointer-events-none absolute -bottom-24 right-36 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="relative">
          <div className="flex items-center gap-2 text-xs font-medium text-blue-100">
            <LayoutDashboard size={15} />
            Admin Workspace
          </div>

          <h1 className="mt-2 text-xl font-bold tracking-tight sm:text-2xl">
            Admin Overview
          </h1>

          <p className="mt-1 text-xs text-blue-100/80 sm:text-sm">
            Manage your banking workspace from one place.
          </p>
        </div>
      </section>

      {/* All Admin Modules */}
      <section>
        <div className="mb-5 flex items-center gap-3">
          <h2 className="whitespace-nowrap text-sm font-bold text-slate-800">
            All Modules
          </h2>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        {/* Responsive Centered Grid */}
        <div className="mx-auto grid max-w-5xl grid-cols-2 justify-items-center gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
          {modules.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                title={item.title}
                className="group flex min-h-[115px] w-full max-w-[190px] flex-col items-center justify-center gap-3 rounded-xl border border-slate-200/80 bg-white p-4 text-center shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-[#003566]/20 hover:shadow-lg hover:shadow-[#003566]/[0.07] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F26B21] focus-visible:ring-offset-2"
              >
                {/* Center Icon */}
                <span
                  className={`flex h - 12 w - 12 items - center justify - center rounded - 2xl ${ item.color } ${ item.iconColor } shadow - sm transition - all duration - 300 group - hover: scale - 110 group - hover: shadow - md`}
                >
                  <Icon size={23} strokeWidth={2} />
                </span>

                {/* Module Title */}
                <span className="w-full text-center text-xs font-semibold leading-4 text-slate-700 transition-colors group-hover:text-[#003566]">
                  {item.title}
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
