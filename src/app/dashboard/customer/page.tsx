
"use client";

import Link from "next/link";
import {
  Wallet,
  ArrowDownToLine,
  ArrowUpFromLine,
  HandCoins,
  ArrowLeftRight,
  CreditCard,
  History,
  FileText,
  ShieldCheck,
  UserRound,
  ArrowUpRight,
  Plus,
} from "lucide-react";

import { selectUser } from "@/Redux/features/UserSlice";
import { useAppSelector } from "@/Redux/hooks";

const stats = [
  {
    title: "Available Balance",
    value: "৳ 85,000",
    note: "Current account balance",
    icon: Wallet,
  },
  {
    title: "Total Deposits",
    value: "৳ 1,50,000",
    note: "Lifetime deposits",
    icon: ArrowDownToLine,
  },
  {
    title: "Total Withdrawals",
    value: "৳ 65,000",
    note: "Lifetime withdrawals",
    icon: ArrowUpFromLine,
  },
  {
    title: "Active Loans",
    value: "৳ 25,000",
    note: "Remaining loan amount",
    icon: HandCoins,
  },
];

const quickActions = [
  {
    title: "Deposit Money",
    description: "Add money to your account",
    href: "/dashboard/customer/deposits",
    icon: ArrowDownToLine,
    color: "bg-green-50 text-green-600",
  },
  {
    title: "Withdraw Money",
    description: "Withdraw from your account",
    href: "/dashboard/customer/withdrawals",
    icon: ArrowUpFromLine,
    color: "bg-orange-50 text-orange-600",
  },
  {
    title: "Transfer Money",
    description: "Send money to another account",
    href: "/dashboard/customer/transfers",
    icon: ArrowLeftRight,
    color: "bg-blue-50 text-blue-600",
  },
  {
    title: "Apply for Loan",
    description: "Explore available loan options",
    href: "/dashboard/customer/loans",
    icon: HandCoins,
    color: "bg-purple-50 text-purple-600",
  },
  {
    title: "My Accounts",
    description: "View account details",
    href: "/dashboard/customer/accounts",
    icon: CreditCard,
    color: "bg-indigo-50 text-indigo-600",
  },
  {
    title: "Transaction History",
    description: "View all your transactions",
    href: "/dashboard/customer/transactions",
    icon: History,
    color: "bg-cyan-50 text-cyan-600",
  },
];

const transactions = [
  {
    id: "TXN-100245",
    title: "Money Deposit",
    date: "Nov 23, 2026",
    method: "Cash Deposit",
    amount: "+ ৳ 20,000",
    type: "credit",
    status: "Completed",
  },
  {
    id: "TXN-100244",
    title: "Money Transfer",
    date: "Nov 22, 2026",
    method: "Online Transfer",
    amount: "- ৳ 5,000",
    type: "debit",
    status: "Completed",
  },
  {
    id: "TXN-100243",
    title: "ATM Withdrawal",
    date: "Nov 21, 2026",
    method: "ATM",
    amount: "- ৳ 3,000",
    type: "debit",
    status: "Completed",
  },
  {
    id: "TXN-100242",
    title: "Money Deposit",
    date: "Nov 20, 2026",
    method: "Bank Deposit",
    amount: "+ ৳ 10,000",
    type: "credit",
    status: "Pending",
  },
];

export default function CustomerDashboard() {
  const user = useAppSelector(selectUser);

  if (!user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-gray-500">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F7FB]">

      {/* Welcome Header + Financial Cards */}
      <header className="mb-8 rounded-2xl bg-gradient-to-r from-[#003566] to-[#1762AE] p-5 text-white shadow-sm sm:p-7">

        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs text-blue-100">
              <ShieldCheck size={15} />
              Welcome to Oikko Bank
            </div>

            <h1 className="text-2xl font-bold sm:text-3xl">
              Hello, {user.name || "Customer"}!
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-blue-100">
              Manage your money, track transactions and enjoy secure digital
              banking services from one place.
            </p>
          </div>

          <Link
            href="/dashboard/customer/deposits"
            className="inline-flex w-fit shrink-0 items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-[#003566] transition hover:bg-blue-50"
          >
            <Plus size={17} />
            Add Money
          </Link>
        </div>

        {/* Financial Cards Inside Header */}
        <div className="mt-7 grid grid-cols-2 gap-3 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="rounded-xl border border-white/20 bg-white/10 p-3 backdrop-blur-md transition hover:bg-white/15 sm:p-4"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-medium text-blue-100">
                    {stat.title}
                  </p>

                  <Icon size={18} className="shrink-0 text-white/80" />
                </div>

                <h3 className="mt-3 text-xl font-bold text-white sm:text-2xl">
                  {stat.value}
                </h3>

                <p className="mt-1 text-[10px] text-blue-100 sm:text-xs">
                  {stat.note}
                </p>
              </div>
            );
          })}
        </div>
      </header>

      {/* Quick Actions */}
      <section className="mb-8">
        <div className="mb-4">
          <h2 className="text-lg font-bold text-[#003566]">
            Quick Actions
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Access your frequently used banking services
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {quickActions.map((action) => {
            const Icon = action.icon;

            return (
              <Link
                key={action.title}
                href={action.href}
                className="group flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white p-4 transition hover:border-[#1762AE]/40 hover:shadow-md sm:p-5"
              >
                <div className="flex min-w-0 items-center gap-4">
                  <div className={`shrink-0 rounded-xl p-3 ${action.color}`}>
                    <Icon size={22} />
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-[#003566]">
                      {action.title}
                    </h3>

                    <p className="mt-1 text-xs text-gray-500">
                      {action.description}
                    </p>
                  </div>
                </div>

                <ArrowUpRight
                  size={19}
                  className="shrink-0 text-gray-400 transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[#1762AE]"
                />
              </Link>
            );
          })}
        </div>
      </section>

      {/* Transactions + Account Information */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

        {/* Recent Transactions */}
        <section className="overflow-hidden rounded-xl border border-gray-200 bg-white xl:col-span-2">

          <div className="flex flex-col justify-between gap-3 border-b border-gray-100 p-5 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-bold text-[#003566]">
                Recent Transactions
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                Your latest account activities
              </p>
            </div>

            <Link
              href="/dashboard/customer/transactions"
              className="flex w-fit items-center gap-1 text-sm font-semibold text-[#1762AE] hover:underline"
            >
              View All
              <ArrowUpRight size={16} />
            </Link>
          </div>

          <div className="divide-y divide-gray-100">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex flex-col gap-3 p-4 transition hover:bg-gray-50 sm:flex-row sm:items-center sm:justify-between sm:p-5"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className={`shrink-0 rounded-full p-3 ${transaction.type === "credit"
                        ? "bg-green-50 text-green-600"
                        : "bg-orange-50 text-orange-600"
                      }`}
                  >
                    {transaction.type === "credit" ? (
                      <ArrowDownToLine size={19} />
                    ) : (
                      <ArrowUpFromLine size={19} />
                    )}
                  </div>

                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold text-gray-800">
                      {transaction.title}
                    </h3>

                    <p className="mt-1 text-xs text-gray-500">
                      {transaction.date} · {transaction.method}
                    </p>

                    <p className="mt-1 text-[11px] text-gray-400">
                      {transaction.id}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end sm:gap-2">
                  <p
                    className={`text-sm font-bold ${transaction.type === "credit"
                        ? "text-green-600"
                        : "text-gray-800"
                      }`}
                  >
                    {transaction.amount}
                  </p>

                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${transaction.status === "Completed"
                        ? "bg-green-50 text-green-700"
                        : "bg-amber-50 text-amber-700"
                      }`}
                  >
                    {transaction.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Account Information */}
        <section className="h-fit overflow-hidden rounded-xl border border-gray-200 bg-white">

          <div className="border-b border-gray-100 p-5">
            <h2 className="font-bold text-[#003566]">
              Account Information
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              Your personal banking details
            </p>
          </div>

          <div className="p-5">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-full bg-[#EAF2FA] p-3 text-[#1762AE]">
                <UserRound size={25} />
              </div>

              <div className="min-w-0">
                <h3 className="truncate font-bold text-[#003566]">
                  {user.name || "Customer"}
                </h3>

                <p className="text-xs capitalize text-gray-500">
                  {user.role || "Customer"}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-400">Account Holder</p>
                <p className="mt-1 text-sm font-semibold text-gray-700">
                  {user.name || "Not available"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400">Email Address</p>
                <p className="mt-1 break-all text-sm font-semibold text-gray-700">
                  {user.email || "Not available"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400">Account Type</p>
                <p className="mt-1 text-sm font-semibold text-gray-700">
                  Savings Account
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400">Account Number</p>
                <p className="mt-1 text-sm font-semibold tracking-wider text-gray-700">
                  1000 **** 4589
                </p>
              </div>
            </div>

            <Link
              href="/dashboard/customer/profile"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg border border-[#1762AE] py-3 text-sm font-semibold text-[#1762AE] transition hover:bg-[#1762AE] hover:text-white"
            >
              <FileText size={17} />
              View Profile
            </Link>
          </div>
        </section>
      </div>

      {/* Security Notice */}
      <div className="mt-6 flex flex-col gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4 sm:flex-row sm:items-center">
        <ShieldCheck className="shrink-0 text-blue-600" size={22} />

        <div>
          <h3 className="text-sm font-semibold text-blue-900">
            Your Security Matters
          </h3>

          <p className="mt-1 text-xs leading-5 text-blue-700">
            Oikko Bank uses secure banking practices to help protect your
            account and financial information. Never share your password or
            OTP with anyone.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-10 text-center text-xs text-gray-400">
        © 2026 Oikko Bank. All rights reserved.
      </footer>
    </div>
  );
}
