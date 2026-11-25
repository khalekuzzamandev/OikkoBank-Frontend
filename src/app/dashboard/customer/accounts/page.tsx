
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CreditCard,
  Wallet,
  ArrowDownToLine,
  ArrowUpFromLine,
  ArrowLeftRight,
  HandCoins,
  Headset,
  ShieldCheck,
  ShieldAlert,
  Building2,
  Percent,
  Mail,
  LockKeyhole,
  Loader2,
  ChevronRight,
  CircleCheck,
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

function parseAccountArray(value: unknown[]): AccountRecord[] {
  if (!value.every(isAccountRecord)) {
    throw new Error("Unexpected accounts response.");
  }

  return value;
}

function extractAccounts(payload: unknown): AccountRecord[] {
  if (Array.isArray(payload)) {
    return parseAccountArray(payload);
  }

  if (!payload || typeof payload !== "object") {
    throw new Error("Unexpected accounts response.");
  }

  const response = payload as Record<string, unknown>;

  if (response.success === false) {
    throw new Error(
      typeof response.message === "string"
        ? response.message
        : "Failed to load your accounts."
    );
  }

  const candidates = [
    response.accounts,
    response.account,
    response.data,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return parseAccountArray(candidate);
    }

    if (isAccountRecord(candidate)) {
      return [candidate];
    }

    if (candidate && typeof candidate === "object") {
      const nested = candidate as Record<string, unknown>;

      if (Array.isArray(nested.accounts)) {
        return parseAccountArray(nested.accounts);
      }

      if (isAccountRecord(nested.account)) {
        return [nested.account];
      }
    }
  }

  if (isAccountRecord(payload)) {
    return [payload];
  }

  throw new Error("Unexpected accounts response.");
}

function formatBalance(balance: number | string | undefined) {
  if (balance === undefined) return "0.00";

  const numericBalance = Number(balance);

  return Number.isFinite(numericBalance)
    ? numericBalance.toLocaleString("en-BD", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
    : balance;
}

function isAccountActive(status?: string) {
  return status?.trim().toLowerCase() === "active";
}

export default function CustomerAccountPage() {
  const user = useAppSelector(selectUser);
  const router = useRouter();

  const [accounts, setAccounts] = useState<AccountRecord[]>([]);
  const [loading, setLoading] = useState(Boolean(user?.id));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    let active = true;

    const loadAccounts = async () => {
      setLoading(true);
      setError(null);

      try {
        const result: unknown =
          await getCustomerBankAccountByUserId(user.id);

        const customerAccounts = extractAccounts(result);

        if (active) setAccounts(customerAccounts);
      } catch (loadError) {
        if (active) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Failed to load your accounts."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadAccounts();

    return () => {
      active = false;
    };
  }, [user?.id]);

  const handleAction = (path: string) => {
    router.push(path);
  };

  const quickActions = [
    {
      title: "Deposit",
      description: "Add money",
      icon: ArrowDownToLine,
      color: "bg-emerald-50 text-emerald-600",
      path: "/dashboard/customer/deposits",
    },
    {
      title: "Withdraw",
      description: "Cash withdrawal",
      icon: ArrowUpFromLine,
      color: "bg-orange-50 text-orange-600",
      path: "/dashboard/customer/withdrawls",
    },
    {
      title: "Transfer",
      description: "Send money",
      icon: ArrowLeftRight,
      color: "bg-blue-50 text-blue-600",
      path: "/dashboard/customer/transfer",
    },
    {
      title: "Loans",
      description: "Loan services",
      icon: HandCoins,
      color: "bg-purple-50 text-purple-600",
      path: "/dashboard/customer/loans",
    },
  ];

  return (
    <section className="min-h-screen space-y-7 bg-[#F6F8FC] p-4 sm:p-6 lg:p-8">

      {/* Header */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#003566]">
            My Accounts
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your bank accounts and financial activities.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-blue-100 bg-white px-4 py-2.5">
          <ShieldCheck size={18} className="text-emerald-600" />
          <span className="text-xs font-semibold text-gray-600">
            Secure Banking
          </span>
        </div>
      </div>

      {/* Loading */}
      {loading || !user ? (
        <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-gray-200 bg-white">
          <div className="text-center">
            <Loader2 className="mx-auto animate-spin text-[#1762AE]" size={32} />
            <p className="mt-3 text-sm text-gray-500">
              Loading your accounts...
            </p>
          </div>
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-600">
          {error}
        </div>
      ) : accounts.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white px-5 py-16 text-center">
          <CreditCard className="mx-auto text-gray-400" size={42} />
          <h2 className="mt-4 text-lg font-bold text-gray-800">
            No Bank Account Found
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            You don&apos;t have any bank account linked to your profile yet.
          </p>
        </div>
      ) : (
        <div className="space-y-7">

          {accounts.map((account, index) => {
            const accountActive = isAccountActive(account.status);

            return (
              <div
                key={
                  account._id ||
                  account.id ||
                  account.accountNumber ||
                  index
                }
                className="space-y-6"
              >

                {/* Account Card */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#00264D] via-[#004B87] to-[#1762AE] p-6 text-white shadow-xl sm:p-8">

                  <div className="pointer-events-none absolute -right-20 -top-28 h-72 w-72 rounded-full border-[35px] border-white/5" />
                  <div className="pointer-events-none absolute -bottom-32 right-28 h-64 w-64 rounded-full border-[30px] border-white/5" />

                  <div className="relative z-10">

                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-white/15 p-3">
                          <CreditCard size={25} />
                        </div>
                        <div>
                          <p className="text-xs text-blue-100">
                            Account Holder
                          </p>
                          <h2 className="mt-1 text-lg font-bold">
                            {account.accountName || user.name}
                          </h2>
                        </div>
                      </div>

                      <span
                        className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${accountActive
                            ? "bg-emerald-400/20 text-emerald-100"
                            : "bg-red-400/20 text-red-100"
                          }`}
                      >
                        {accountActive ? (
                          <CircleCheck size={14} />
                        ) : (
                          <ShieldAlert size={14} />
                        )}
                        {account.status || "Unknown"}
                      </span>
                    </div>

                    <div className="mt-9">
                      <p className="text-xs text-blue-100">
                        Account Number
                      </p>
                      <p className="mt-2 break-all text-2xl font-bold tracking-[0.13em] sm:text-3xl">
                        {account.accountNumber || "Not available"}
                      </p>
                    </div>

                    <div className="mt-8 flex flex-wrap items-end justify-between gap-5">
                      <div>
                        <p className="text-xs text-blue-100">
                          Account Type
                        </p>
                        <p className="mt-1 text-sm font-semibold capitalize">
                          {account.accountType || "Savings Account"}
                        </p>
                      </div>

                      <div className="text-left sm:text-right">
                        <p className="text-xs text-blue-100">
                          Branch
                        </p>
                        <p className="mt-1 flex items-center gap-1 text-sm font-semibold">
                          <Building2 size={15} />
                          {account.branch || "Main Branch"}
                        </p>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Suspended Account Warning */}
                {!accountActive && (
                  <div className="rounded-2xl border border-red-200 bg-red-50 p-5 sm:p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
                        <LockKeyhole size={24} />
                      </div>

                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-red-700">
                          Your Account Is Suspended
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-red-600">
                          Your bank account is currently not active.
                          Deposits, withdrawals, transfers and other
                          banking services are temporarily unavailable.
                          Please contact our support team or visit your
                          nearest bank branch to verify your information
                          and reactivate your account.
                        </p>

                        <button
                          type="button"
                          onClick={() =>
                            handleAction("/dashboard/customer/support")
                          }
                          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
                        >
                          <Headset size={17} />
                          Contact Support
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Balance */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Available Balance
                        </p>
                        <h3 className="mt-2 text-2xl font-bold text-[#003566] sm:text-3xl">
                          {account.currency || "৳"}{" "}
                          {formatBalance(account.balance)}
                        </h3>
                      </div>

                      <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                        <Wallet size={24} />
                      </div>
                    </div>
                    <p className="mt-3 text-xs text-gray-400">
                      Your current account balance
                    </p>
                  </div>

                  <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Interest Rate
                        </p>
                        <h3 className="mt-2 text-2xl font-bold text-[#003566] sm:text-3xl">
                          {account.interestRate === undefined
                            ? "N/A"
                            : `${account.interestRate}%`}
                        </h3>
                      </div>

                      <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                        <Percent size={24} />
                      </div>
                    </div>
                    <p className="mt-3 text-xs text-gray-400">
                      Account interest rate
                    </p>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                  <div className="mb-5">
                    <h3 className="text-lg font-bold text-[#003566]">
                      Quick Actions
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Access your banking services quickly.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                    {quickActions.map((action) => {
                      const Icon = action.icon;

                      return (
                        <button
                          key={action.title}
                          type="button"
                          disabled={!accountActive}
                          onClick={() => handleAction(action.path)}
                          className="group flex items-center gap-3 rounded-xl border border-gray-100 p-4 text-left transition hover:border-blue-200 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-gray-100 disabled:hover:bg-white"
                        >
                          <div
                            className={`rounded-xl p-3 ${action.color}`}
                          >
                            <Icon size={21} />
                          </div>

                          <div className="min-w-0">
                            <p className="text-sm font-bold text-gray-800">
                              {action.title}
                            </p>
                            <p className="mt-1 text-xs text-gray-400">
                              {action.description}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {!accountActive && (
                    <p className="mt-4 text-xs font-medium text-red-500">
                      Banking actions are disabled until your account is activated.
                    </p>
                  )}
                </div>

                {/* Account Information */}
                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                  <h3 className="mb-5 text-lg font-bold text-[#003566]">
                    Account Information
                  </h3>

                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    <div>
                      <p className="text-xs text-gray-500">
                        Account Holder
                      </p>
                      <p className="mt-1 break-words text-sm font-semibold text-gray-800">
                        {account.accountName || user.name || "N/A"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">
                        Account Type
                      </p>
                      <p className="mt-1 text-sm font-semibold capitalize text-gray-800">
                        {account.accountType || "N/A"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">
                        Branch
                      </p>
                      <p className="mt-1 text-sm font-semibold text-gray-800">
                        {account.branch || "N/A"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">
                        Interest Rate
                      </p>
                      <p className="mt-1 text-sm font-semibold text-gray-800">
                        {account.interestRate === undefined
                          ? "N/A"
                          : `${account.interestRate}%`}
                      </p>
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs text-gray-500">
                        Registered Email
                      </p>
                      <p className="mt-1 break-all text-sm font-semibold text-gray-800">
                        {account.userEmail || user.email || "N/A"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">
                        Account Status
                      </p>
                      <p
                        className={`mt-1 text-sm font-bold ${accountActive
                            ? "text-emerald-600"
                            : "text-red-600"
                          }`}
                      >
                        {account.status || "Unknown"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Help & Support */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl bg-gradient-to-r from-[#003566] to-[#1762AE] p-5 text-white shadow-lg sm:flex-row sm:items-center sm:p-6">
        <div className="flex items-center gap-4">
          <div className="rounded-xl bg-white/15 p-3">
            <Headset size={25} />
          </div>

          <div>
            <h3 className="font-bold">Need Banking Assistance?</h3>
            <p className="mt-1 text-xs leading-5 text-blue-100 sm:text-sm">
              Our support team is ready to help you with your account.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() =>
            handleAction("/dashboard/customer/support")
          }
          className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#003566] transition hover:bg-blue-50"
        >
          <Mail size={17} />
          Help & Support
          <ChevronRight size={16} />
        </button>
      </div>
    </section>
  );
}
