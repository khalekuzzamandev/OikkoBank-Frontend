"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  Wallet,
  Users,
  ArrowDownToLine,
  ArrowUpFromLine,
  HandCoins,
  ArrowLeftRight,
  Clock,
  CheckCircle2,
  UserCheck,
  ClipboardList,
  CreditCard,
} from "lucide-react";

import { selectUser } from "@/Redux/features/UserSlice";
import { useAppSelector } from "@/Redux/hooks";

type Stat = { title: string; value: string; note: string; icon: LucideIcon };
type Action = { title: string; desc: string; href: string; icon: LucideIcon };
type Row = { label: string; meta: string; value: string; status: string };
type RoleConfig = {
  title: string;
  description: string;
  stats: Stat[];
  actions: Action[];
  panelTitle: string;
  rows: Row[];
};

const statusStyle: Record<string, string> = {
  Completed: "bg-green-50 text-green-700",
  Pending: "bg-amber-50 text-amber-700",
  Review: "bg-blue-50 text-blue-700",
};

const roleData: Record<string, RoleConfig> = {
  admin: {
    title: "Admin overview",
    description: "Bank-wide customers, deposits, withdrawals and loans.",
    stats: [
      { title: "Total customers", value: "12,450", note: "Across all branches", icon: Users },
      { title: "Total deposits", value: "৳ 24,50,000", note: "All accounts", icon: ArrowDownToLine },
      { title: "Total withdrawals", value: "৳ 8,75,000", note: "All accounts", icon: ArrowUpFromLine },
      { title: "Total loans", value: "৳ 15,20,000", note: "Outstanding amount", icon: HandCoins },
    ],
    actions: [
      { title: "Customers", desc: "View and manage customer records", href: "/dashboard/admin/customers", icon: Users },
      { title: "Deposits", desc: "Review all deposit entries", href: "/dashboard/admin/deposits", icon: ArrowDownToLine },
      { title: "Loans", desc: "Track and approve loans", href: "/dashboard/admin/loans", icon: HandCoins },
      { title: "Transactions", desc: "Full transaction history", href: "/dashboard/admin/transactions", icon: ArrowLeftRight },
    ],
    panelTitle: "Recent transactions",
    rows: [
      { label: "Deposit — Rahim Uddin", meta: "Dhaka Main Branch", value: "৳ 50,000", status: "Completed" },
      { label: "Loan request — Nusrat Jahan", meta: "Chattogram Branch", value: "৳ 3,00,000", status: "Review" },
      { label: "Withdrawal — Karim Hossain", meta: "Sylhet Branch", value: "৳ 12,000", status: "Completed" },
    ],
  },

 staff: {
    title: "Branch overview",
    description: "Branch performance, staff and items waiting for your approval.",
    stats: [
      { title: "Branch customers", value: "2,450", note: "Active accounts", icon: Users },
      { title: "Branch deposits", value: "৳ 8,50,000", note: "This month", icon: ArrowDownToLine },
      { title: "Total staff", value: "28", note: "On this branch", icon: UserCheck },
      { title: "Pending approvals", value: "18", note: "Need your action", icon: Clock },
    ],
    actions: [
      { title: "Branch customers", desc: "Customers under this branch", href: "/dashboard/manager/customers", icon: Users },
      { title: "Staff", desc: "Manage employees and roles", href: "/dashboard/manager/staff", icon: UserCheck },
      { title: "Approvals", desc: "Approve or reject requests", href: "/dashboard/manager/approvals", icon: CheckCircle2 },
      { title: "Transactions", desc: "Branch transaction history", href: "/dashboard/manager/transactions", icon: ArrowLeftRight },
    ],
    panelTitle: "Pending approvals",
    rows: [
      { label: "Withdrawal above limit", meta: "Requested by Employee #104", value: "৳ 2,00,000", status: "Pending" },
      { label: "New account opening", meta: "Requested by Employee #087", value: "—", status: "Pending" },
      { label: "Loan application", meta: "Requested by Employee #112", value: "৳ 1,50,000", status: "Review" },
    ],
  },

  customer: {
    title: "My banking overview",
    description: "Your balance, deposits, withdrawals and loans at a glance.",
    stats: [
      { title: "Available balance", value: "৳ 85,000", note: "Savings account", icon: Wallet },
      { title: "Total deposits", value: "৳ 1,50,000", note: "Lifetime", icon: ArrowDownToLine },
      { title: "Total withdrawals", value: "৳ 65,000", note: "Lifetime", icon: ArrowUpFromLine },
      { title: "Active loans", value: "৳ 25,000", note: "Remaining balance", icon: HandCoins },
    ],
    actions: [
      { title: "My accounts", desc: "Account details and statements", href: "/dashboard/customer/accounts", icon: CreditCard },
      { title: "Deposit money", desc: "Add funds to your account", href: "/dashboard/customer/deposits", icon: ArrowDownToLine },
      { title: "Transfer money", desc: "Send money to another account", href: "/dashboard/customer/transfers", icon: ArrowLeftRight },
      { title: "My loans", desc: "Loan status and repayments", href: "/dashboard/customer/loans", icon: HandCoins },
    ],
    panelTitle: "Recent activity",
    rows: [
      { label: "Deposit", meta: "Cash deposit at branch", value: "+ ৳ 20,000", status: "Completed" },
      { label: "Transfer to Rahim Uddin", meta: "Mobile app", value: "- ৳ 5,000", status: "Completed" },
      { label: "Loan installment", meta: "Due this week", value: "৳ 2,500", status: "Pending" },
    ],
  },
};

export default function DashboardOverview() {
  const user = useAppSelector(selectUser);
  const role = user?.role?.toLowerCase() ?? "";
  const dashboard = roleData[role];

  if (!user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-gray-500">Loading dashboard...</p>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold text-[#003566]">Dashboard not available</h2>
        <p className="mt-2 text-sm text-gray-500">
          Your account has no dashboard role assigned. Contact your administrator.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F7FB] p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <header className="mb-8 flex flex-col gap-4 border-b border-gray-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#003566] sm:text-3xl">
            Welcome back, {user.name || "User"}
          </h1>
          <p className="mt-1 text-sm text-gray-500">{dashboard.description}</p>
        </div>
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#1762AE]/20 bg-white px-4 py-1.5 text-sm font-medium capitalize text-[#1762AE]">
          <UserCheck size={16} />
          {role}
        </span>
      </header>

      {/* Stats */}
      <section className="mb-8" aria-labelledby="overview-heading">
        <h2 id="overview-heading" className="mb-4 text-lg font-semibold text-[#003566]">
          {dashboard.title}
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {dashboard.stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.title} className="rounded-xl border border-gray-200 bg-white p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                  <Icon size={20} className="text-[#1762AE]" />
                </div>
                <p className="mt-3 text-2xl font-bold text-[#003566]">{stat.value}</p>
                <p className="mt-1 text-xs text-gray-400">{stat.note}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Actions + role panel */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <section className="lg:col-span-2" aria-labelledby="actions-heading">
          <h2 id="actions-heading" className="mb-4 text-lg font-semibold text-[#003566]">
            Quick actions
          </h2>

          <div className="divide-y divide-gray-100 overflow-hidden rounded-xl border border-gray-200 bg-white">
            {dashboard.actions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.title}
                  href={action.href}
                  className="group flex items-center gap-4 p-4 outline-none transition hover:bg-[#F4F7FB] focus-visible:bg-[#F4F7FB] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#1762AE]"
                >
                  <div className="rounded-lg bg-[#EAF2FA] p-2.5 text-[#003566] transition group-hover:bg-[#003566] group-hover:text-white">
                    <Icon size={20} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#003566]">{action.title}</p>
                    <p className="truncate text-xs text-gray-500">{action.desc}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="lg:col-span-3" aria-labelledby="panel-heading">
          <h2 id="panel-heading" className="mb-4 text-lg font-semibold text-[#003566]">
            {dashboard.panelTitle}
          </h2>

          <div className="divide-y divide-gray-100 overflow-hidden rounded-xl border border-gray-200 bg-white">
            {dashboard.rows.map((row) => (
              <div key={row.label} className="flex items-center justify-between gap-4 p-4">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-gray-800">{row.label}</p>
                  <p className="truncate text-xs text-gray-500">{row.meta}</p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="text-sm font-semibold text-[#003566]">{row.value}</span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyle[row.status] ?? "bg-gray-100 text-gray-600"
                      }`}
                  >
                    {row.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <footer className="mt-10 text-center text-xs text-gray-400">
        © 2026 Oikko Bank. All rights reserved.
      </footer>
    </div>
  );
}