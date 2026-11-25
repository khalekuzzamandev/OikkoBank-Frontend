
"use client";

import { useEffect, useState } from "react";
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
  Building2,
  Percent,
  Loader2,
  AlertCircle,
} from "lucide-react";

import { selectUser } from "@/Redux/features/UserSlice";
import { useAppSelector } from "@/Redux/hooks";
import { getCustomerBankAccountByUserId } from "@/components/lib/Apis/accounts/account";

type AccountRecord = {
  _id?: string;
  id?: string;
  accountName?: string;
  accountNumber?: string;
  accountType?: string;
  currency?: string;
  status?: string;
  balance?: number | string;
  interestRate?: number | string;
  branch?: string;
  userEmail?: string;
};

function isAccountRecord(value: unknown): value is AccountRecord {
  return (
    typeof value === "object" &&
    value !== null &&
    ("accountNumber" in value ||
      "accountName" in value ||
      "accountType" in value)
  );
}

function extractAccounts(payload: unknown): AccountRecord[] {
  if (Array.isArray(payload)) {
    if (!payload.every(isAccountRecord)) {
      throw new Error("Invalid account response.");
    }
    return payload;
  }

  if (!payload || typeof payload !== "object") {
    throw new Error("Invalid account response.");
  }

  const response = payload as Record<string, unknown>;

  if (response.success === false) {
    throw new Error(
      typeof response.message === "string"
        ? response.message
        : "Failed to load accounts."
    );
  }

  const candidates = [
    response.accounts,
    response.account,
    response.data,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      if (!candidate.every(isAccountRecord)) {
        throw new Error("Invalid account response.");
      }
      return candidate;
    }

    if (isAccountRecord(candidate)) {
      return [candidate];
    }

    if (candidate && typeof candidate === "object") {
      const nested = candidate as Record<string, unknown>;

      if (Array.isArray(nested.accounts)) {
        if (!nested.accounts.every(isAccountRecord)) {
          throw new Error("Invalid account response.");
        }
        return nested.accounts;
      }

      if (isAccountRecord(nested.account)) {
        return [nested.account];
      }
    }
  }

  if (isAccountRecord(payload)) return [payload];

  throw new Error("Unexpected accounts response.");
}

function formatMoney(value: number | string | undefined) {
  const amount = Number(value ?? 0);

  if (!Number.isFinite(amount)) return "0.00";

  return amount.toLocaleString("en-BD", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

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
    description: "View your transactions",
    href: "/dashboard/customer/transactions",
    icon: History,
    color: "bg-cyan-50 text-cyan-600",
  },
];

export default function CustomerDashboard() {
  const user = useAppSelector(selectUser);

  const [accounts, setAccounts] = useState<AccountRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    let active = true;

    const fetchAccounts = async () => {
      try {
        setLoading(true);
        setError(null);

        const result: unknown =
          await getCustomerBankAccountByUserId(user.id);

        const accountData = extractAccounts(result);

        if (active) {
          setAccounts(accountData);
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load account information."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    void fetchAccounts();

    return () => {
      active = false;
    };
  }, [user?.id]);

  if (!user || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto animate-spin text-[#1762AE]" size={35} />
          <p className="mt-3 text-sm text-gray-500">
            Loading your banking dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center p-5">
        <div className="max-w-md rounded-2xl border border-red-200 bg-white p-7 text-center shadow-sm">
          <AlertCircle className="mx-auto text-red-500" size={40} />
          <h2 className="mt-4 font-bold text-gray-800">
            Unable to Load Account
          </h2>
          <p className="mt-2 text-sm text-gray-500">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-5 rounded-lg bg-[#003566] px-5 py-2.5 text-sm font-semibold text-white"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const activeAccounts = accounts.filter(
    (account) => account.status?.toLowerCase() === "active"
  );

  const totalBalance = activeAccounts.reduce(
    (total, account) => total + (Number(account.balance) || 0),
    0
  );

  const primaryAccount = accounts[0];
  const isActive =
    primaryAccount?.status?.toLowerCase() === "active";

  const currency = primaryAccount?.currency || "৳";

  const stats = [
    {
      title: "Available Balance",
      value: `${currency} ${formatMoney(totalBalance)}`,
      note: "Total balance in active accounts",
      icon: Wallet,
    },
    {
      title: "My Accounts",
      value: accounts.length.toString(),
      note: "Total linked bank accounts",
      icon: CreditCard,
    },
    {
      title: "Active Accounts",
      value: activeAccounts.length.toString(),
      note: "Currently active accounts",
      icon: ShieldCheck,
    },
    {
      title: "Interest Rate",
      value:
        primaryAccount?.interestRate !== undefined
          ? `${primaryAccount.interestRate}%`
          : "N/A",
      note: "Primary account interest rate",
      icon: Percent,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F4F7FB]">

      {/* Welcome Header */}
      <header className="mb-8 rounded-2xl bg-gradient-to-r from-[#003566] to-[#1762AE] p-5 text-white shadow-sm sm:p-7">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs text-blue-100">
              <ShieldCheck size={15} />
              Welcome to Oikko Bank
            </div>

            <h1 className="text-2xl font-bold sm:text-3xl">
              Hello, {user.name || primaryAccount?.accountName || "Customer"}!
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-blue-100">
              Manage your bank accounts and enjoy secure digital banking
              services from one place.
            </p>
          </div>

          <Link
            href="/dashboard/customer/accounts"
            className="inline-flex w-fit shrink-0 items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-[#003566] transition hover:bg-blue-50"
          >
            <Plus size={17} />
            My Accounts
          </Link>
        </div>

        {/* Real Account Stats */}
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

                <h3 className="mt-3 break-words text-xl font-bold text-white sm:text-2xl">
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

      {/* Account Status */}
      {accounts.length > 0 && (
        <div
          className={`mb-7 flex items-start gap-3 rounded-xl border p-4 ${isActive
              ? "border-green-200 bg-green-50"
              : "border-red-200 bg-red-50"
            }`}
        >
          {isActive ? (
            <ShieldCheck className="shrink-0 text-green-600" size={22} />
          ) : (
            <AlertCircle className="shrink-0 text-red-600" size={22} />
          )}

          <div>
            <h3
              className={`text-sm font-bold ${isActive ? "text-green-800" : "text-red-700"
                }`}
            >
              {isActive
                ? "Your Bank Account Is Active"
                : "Your Account Is Suspended"}
            </h3>

            <p
              className={`mt-1 text-xs leading-5 ${isActive ? "text-green-700" : "text-red-600"
                }`}
            >
              {isActive
                ? "Your account is active and ready for banking activities."
                : "Your account is currently not active. Please contact bank support to verify your information and activate your account."}
            </p>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <section className="mb-8">
        <div className="mb-4">
          <h2 className="text-lg font-bold text-[#003566]">
            Quick Actions
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Access your banking services
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {quickActions.map((action) => {
            const Icon = action.icon;

            const disabled =
              !isActive &&
              ["Deposit Money", "Withdraw Money", "Transfer Money"].includes(
                action.title
              );

            return (
              <Link
                key={action.title}
                href={disabled ? "#" : action.href}
                aria-disabled={disabled}
                onClick={(event) => {
                  if (disabled) event.preventDefault();
                }}
                className={`group flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white p-4 transition sm:p-5 ${disabled
                    ? "cursor-not-allowed opacity-40"
                    : "hover:border-[#1762AE]/40 hover:shadow-md"
                  }`}
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
                  className="shrink-0 text-gray-400"
                />
              </Link>
            );
          })}
        </div>
      </section>

      {/* Real Account Details */}
      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="flex flex-col justify-between gap-3 border-b border-gray-100 p-5 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-bold text-[#003566]">
              My Bank Accounts
            </h2>
            <p className="mt-1 text-xs text-gray-500">
              Your actual account information from Oikko Bank
            </p>
          </div>

          <Link
            href="/dashboard/customer/accounts"
            className="flex w-fit items-center gap-1 text-sm font-semibold text-[#1762AE] hover:underline"
          >
            View All
            <ArrowUpRight size={16} />
          </Link>
        </div>

        {accounts.length === 0 ? (
          <div className="p-12 text-center">
            <CreditCard className="mx-auto text-gray-400" size={40} />
            <h3 className="mt-4 font-bold text-gray-800">
              No Bank Account Found
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              You don&apos;t have any bank account linked to your profile.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 p-5 md:grid-cols-2">
            {accounts.map((account, index) => {
              const accountActive =
                account.status?.toLowerCase() === "active";

              return (
                <article
                  key={account._id || account.id || index}
                  className="overflow-hidden rounded-2xl border border-blue-100"
                >
                  <div className="bg-gradient-to-br from-[#003566] to-[#1762AE] p-5 text-white">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <CreditCard size={21} />
                        <span className="text-sm font-semibold">
                          {account.accountType || "Bank Account"}
                        </span>
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${accountActive
                            ? "bg-green-400/20 text-green-100"
                            : "bg-red-400/20 text-red-100"
                          }`}
                      >
                        {account.status || "Unknown"}
                      </span>
                    </div>

                    <p className="mt-7 text-xs text-blue-100">
                      Account Number
                    </p>

                    <p className="mt-1 break-all text-xl font-bold tracking-wider">
                      {account.accountNumber || "Not available"}
                    </p>

                    <div className="mt-6 flex justify-between gap-3">
                      <div>
                        <p className="text-xs text-blue-100">
                          Account Holder
                        </p>
                        <p className="mt-1 text-sm font-semibold">
                          {account.accountName || user.name || "N/A"}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-xs text-blue-100">
                          Available Balance
                        </p>
                        <p className="mt-1 text-sm font-bold">
                          {account.currency || "৳"}{" "}
                          {formatMoney(account.balance)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 p-5">
                    <div>
                      <p className="text-xs text-gray-400">Branch</p>
                      <p className="mt-1 flex items-center gap-1 text-sm font-semibold text-gray-700">
                        <Building2 size={15} />
                        {account.branch || "N/A"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400">Interest Rate</p>
                      <p className="mt-1 text-sm font-semibold text-gray-700">
                        {account.interestRate === undefined
                          ? "N/A"
                          : `${account.interestRate}%`}
                      </p>
                    </div>

                    <div className="col-span-2">
                      <p className="text-xs text-gray-400">Email Address</p>
                      <p className="mt-1 break-all text-sm font-semibold text-gray-700">
                        {account.userEmail || user.email || "N/A"}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Profile Information */}
      <section className="mt-6 rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-[#EAF2FA] p-3 text-[#1762AE]">
            <UserRound size={25} />
          </div>

          <div>
            <h2 className="font-bold text-[#003566]">
              Customer Information
            </h2>
            <p className="text-xs text-gray-500">
              Your registered profile information
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div>
            <p className="text-xs text-gray-400">Full Name</p>
            <p className="mt-1 text-sm font-semibold text-gray-700">
              {user.name || "N/A"}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-400">Email Address</p>
            <p className="mt-1 break-all text-sm font-semibold text-gray-700">
              {user.email || "N/A"}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-400">Account Holder</p>
            <p className="mt-1 text-sm font-semibold text-gray-700">
              {primaryAccount?.accountName || "N/A"}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-400">Account Status</p>
            <p
              className={`mt-1 text-sm font-bold ${isActive ? "text-green-600" : "text-red-600"
                }`}
            >
              {primaryAccount?.status || "No account"}
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
      </section>

      {/* Security Notice */}
      <div className="mt-6 flex flex-col gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4 sm:flex-row sm:items-center">
        <ShieldCheck className="shrink-0 text-blue-600" size={22} />
        <div>
          <h3 className="text-sm font-semibold text-blue-900">
            Your Security Matters
          </h3>
          <p className="mt-1 text-xs leading-5 text-blue-700">
            Never share your banking password, PIN or OTP with anyone.
          </p>
        </div>
      </div>

      <footer className="mt-10 text-center text-xs text-gray-400">
        © 2026 Oikko Bank. All rights reserved.
      </footer>
    </div>
  );
}
