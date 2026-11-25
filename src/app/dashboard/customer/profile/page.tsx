"use client";

import { useLoggedInUserAccounts } from "@/components/lib/hooks/useLoggedInUserAccounts";
import {
  Loader2,
  MessageSquare,
  Wallet,
  User,
  CreditCard,
  AlertCircle,
} from "lucide-react";

export default function Page() {
  const {
    user,
    accounts,
    loading,
    error,
    primaryAccount,
  } = useLoggedInUserAccounts();

  if (loading) {
    return (
      <main className="flex min-h-[300px] items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-blue-600" />
        <span className="ml-2 text-sm text-gray-500">
          Loading account information...
        </span>
      </main>
    );
  }

  if (error) {
    return (
      <main className="p-6">
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-red-600">
          <AlertCircle size={20} />
          <p>{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="space-y-6 p-4 md:p-6">
      <div>
        <div className="flex items-center gap-2">
          <MessageSquare className="text-blue-600" size={25} />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            SMS Banking
          </h1>
        </div>

        <p className="mt-1 text-sm text-gray-500">
          Manage SMS banking information for your bank account.
        </p>
      </div>

      {/* Logged-in User */}
      <section className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
        <h2 className="mb-4 flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
          <User size={19} className="text-blue-600" />
          Customer Information
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs text-gray-500">Customer Name</p>
            <p className="mt-1 font-medium text-gray-900 dark:text-white">
              {user?.name || "N/A"}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500">Email Address</p>
            <p className="mt-1 font-medium text-gray-900 dark:text-white">
              {user?.email || "N/A"}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500">User ID</p>
            <p className="mt-1 break-all font-medium text-gray-900 dark:text-white">
              {user?.id || "N/A"}
            </p>
          </div>
        </div>
      </section>

      {/* Bank Accounts */}
      <section className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
        <h2 className="mb-4 flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
          <Wallet size={19} className="text-blue-600" />
          Your Bank Accounts
        </h2>

        {accounts.length === 0 ? (
          <p className="rounded-lg bg-gray-50 p-4 text-sm text-gray-500 dark:bg-gray-800">
            No bank account found for your profile.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {accounts.map((account) => (
              <div
                key={account._id || account.accountNumber}
                className={`rounded-xl border p-4 ${primaryAccount?.accountNumber === account.accountNumber
                    ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/20"
                    : "border-gray-200 dark:border-gray-700"
                  }`}
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {account.accountName}
                  </span>

                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium capitalize text-green-700">
                    {account.status}
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500">Account Number</p>
                    <p className="mt-1 font-semibold text-gray-900 dark:text-white">
                      {account.accountNumber}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-gray-500">Account Type</p>
                      <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                        {account.accountType}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">Currency</p>
                      <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                        {account.currency}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Available Balance</p>
                    <p className="mt-1 text-xl font-bold text-blue-600">
                      {account.currency}{" "}
                      {Number(account.balance || 0).toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Branch</p>
                    <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                      {account.branch || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Primary Account */}
      {primaryAccount && (
        <section className="rounded-xl border border-blue-200 bg-blue-50 p-5 dark:border-blue-900 dark:bg-blue-950/20">
          <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
            <CreditCard size={20} />
            <h2 className="font-semibold">Primary Account</h2>
          </div>

          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            Account Number:{" "}
            <strong>{primaryAccount.accountNumber}</strong>
          </p>

          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
            Account Email: <strong>{primaryAccount.userEmail}</strong>
          </p>
        </section>
      )}
    </main>
  );
}