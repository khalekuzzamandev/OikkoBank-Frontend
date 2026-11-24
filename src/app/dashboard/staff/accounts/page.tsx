
"use client";

import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";
import {
  Eye,
  Pencil,
  Trash2,
  Search,
  RefreshCw,
  X,
  Loader2,
  Wallet,
  CreditCard,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

interface BankAccount {
  _id: string;
  userId: string;
  userEmail: string;
  staffEmail: string;
  accountNumber: string;
  accountName: string;
  accountType: string;
  currency: string;
  status: string;
  accountPurpose?: string;
  balance: number;
  minimumBalance: number;
  dailyTransferLimit: number;
  monthlyTransferLimit: number;
  interestRate: number;
  branch: string;
  createdAt?: string;
  updatedAt?: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const inputClass =
  "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-[#003566] focus:ring-2 focus:ring-[#003566]/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white";

const labelClass =
  "mb-1 block text-xs font-semibold text-gray-600 dark:text-gray-300";

export default function AccountPage() {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [selectedAccount, setSelectedAccount] =
    useState<BankAccount | null>(null);

  const [editingAccount, setEditingAccount] =
    useState<BankAccount | null>(null);

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Fetch all accounts
  const fetchAccounts = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      if (!BASE_URL) {
        throw new Error("NEXT_PUBLIC_BASE_URL is not configured.");
      }

      const response = await fetch(`${BASE_URL}/api/accounts`, {
        method: "GET",
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok || result.success === false) {
        throw new Error(result.message || "Failed to fetch accounts");
      }

      const accountList = Array.isArray(result.data)
        ? result.data
        : Array.isArray(result.accounts)
          ? result.accounts
          : Array.isArray(result)
            ? result
            : [];

      setAccounts(accountList);
    } catch (err) {
      console.error("Fetch accounts error:", err);
      setError(
        err instanceof Error ? err.message : "Something went wrong!"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchAccounts();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [fetchAccounts]);

  // Search
  const filteredAccounts = accounts.filter((account) => {
    const searchValue = search.toLowerCase();

    return (
      account.accountName?.toLowerCase().includes(searchValue) ||
      account.accountNumber?.toLowerCase().includes(searchValue) ||
      account.userEmail?.toLowerCase().includes(searchValue) ||
      account.accountType?.toLowerCase().includes(searchValue) ||
      account.branch?.toLowerCase().includes(searchValue)
    );
  });

  // Update account
  const handleUpdate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!editingAccount) return;

    const formData = new FormData(e.currentTarget);

    const updateData = {
      accountName: String(formData.get("accountName") || ""),
      accountType: String(formData.get("accountType") || ""),
      currency: String(formData.get("currency") || ""),
      status: String(formData.get("status") || ""),
      branch: String(formData.get("branch") || ""),
      accountPurpose: String(formData.get("accountPurpose") || ""),
      balance: Number(formData.get("balance")),
      minimumBalance: Number(formData.get("minimumBalance")),
      dailyTransferLimit: Number(formData.get("dailyTransferLimit")),
      monthlyTransferLimit: Number(formData.get("monthlyTransferLimit")),
      interestRate: Number(formData.get("interestRate")),
    };

    try {
      setSaving(true);

      const response = await fetch(
        `${BASE_URL}/api/accounts/${editingAccount._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
        }
      );

      const result = await response.json();

      if (!response.ok || result.success === false) {
        throw new Error(result.message || "Account update failed");
      }

      setEditingAccount(null);
      await fetchAccounts();

      alert("Account updated successfully!");
    } catch (err) {
      console.error("Update account error:", err);
      alert(
        err instanceof Error ? err.message : "Failed to update account"
      );
    } finally {
      setSaving(false);
    }
  };

  // Delete account
  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this bank account?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);

      const response = await fetch(`${BASE_URL}/api/accounts/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok || result.success === false) {
        throw new Error(result.message || "Account deletion failed");
      }

      setAccounts((previous) =>
        previous.filter((account) => account._id !== id)
      );

      alert("Account deleted successfully!");
    } catch (err) {
      console.error("Delete account error:", err);
      alert(
        err instanceof Error ? err.message : "Failed to delete account"
      );
    } finally {
      setDeletingId(null);
    }
  };

  // Format money
  const formatMoney = (amount: number, currency = "BDT") => {
    return `${currency} ${Number(amount || 0).toLocaleString()}`;
  };

  // Status style
  const statusClass = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400";
      case "pending":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400";
      case "inactive":
        return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300";
      default:
        return "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-3 py-5 dark:bg-gray-950 sm:px-5 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-[#003566] p-3 text-white">
              <Wallet size={25} />
            </div>

            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
                Bank Accounts
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Manage all customer bank accounts
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => void fetchAccounts()}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            <RefreshCw
              size={16}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Accounts</p>
                <h2 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                  {accounts.length}
                </h2>
              </div>
              <Wallet className="text-[#003566]" size={27} />
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active Accounts</p>
                <h2 className="mt-2 text-2xl font-bold text-green-600">
                  {
                    accounts.filter(
                      (item) => item.status?.toLowerCase() === "active"
                    ).length
                  }
                </h2>
              </div>
              <CheckCircle2 className="text-green-600" size={27} />
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending Accounts</p>
                <h2 className="mt-2 text-2xl font-bold text-yellow-600">
                  {
                    accounts.filter(
                      (item) => item.status?.toLowerCase() === "pending"
                    ).length
                  }
                </h2>
              </div>
              <AlertCircle className="text-yellow-600" size={27} />
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Account Types</p>
                <h2 className="mt-2 text-2xl font-bold text-[#003566] dark:text-cyan-400">
                  {new Set(accounts.map((item) => item.accountType)).size}
                </h2>
              </div>
              <CreditCard className="text-[#003566]" size={27} />
            </div>
          </div>
        </div>

        {/* Account Table */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="flex flex-col justify-between gap-3 border-b border-gray-100 p-4 dark:border-gray-800 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-bold text-gray-900 dark:text-white">
                All Bank Accounts
              </h2>
              <p className="mt-1 text-xs text-gray-500">
                {filteredAccounts.length} accounts found
              </p>
            </div>

            <div className="relative w-full sm:max-w-xs">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search account..."
                className={`${inputClass} pl-10`}
              />
            </div>
          </div>

          {loading ? (
            <div className="flex min-h-64 flex-col items-center justify-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-[#003566]" />
              <p className="text-sm text-gray-500">
                Loading bank accounts...
              </p>
            </div>
          ) : error ? (
            <div className="flex min-h-64 flex-col items-center justify-center gap-3 px-4">
              <AlertCircle className="h-10 w-10 text-red-500" />
              <p className="text-sm text-red-500">{error}</p>
              <button
                type="button"
                onClick={() => void fetchAccounts()}
                className="rounded-lg bg-[#003566] px-4 py-2 text-sm text-white"
              >
                Try Again
              </button>
            </div>
          ) : filteredAccounts.length === 0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center gap-3">
              <Wallet className="h-12 w-12 text-gray-300" />
              <p className="text-sm font-medium text-gray-500">
                {search
                  ? "No matching accounts found."
                  : "No bank accounts available."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px] text-left">
                <thead className="bg-gray-50 dark:bg-gray-800/70">
                  <tr className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    <th className="px-5 py-4">Account</th>
                    <th className="px-5 py-4">Customer</th>
                    <th className="px-5 py-4">Account Type</th>
                    <th className="px-5 py-4">Balance</th>
                    <th className="px-5 py-4">Branch</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4 text-center">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {filteredAccounts.map((account) => (
                    <tr
                      key={account._id}
                      className="transition hover:bg-gray-50 dark:hover:bg-gray-800/40"
                    >
                      <td className="px-5 py-4">
                        <p className="text-sm font-bold text-gray-900 dark:text-white">
                          {account.accountName}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {account.accountNumber}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                          {account.userEmail}
                        </p>
                        <p className="mt-1 text-xs text-gray-400">
                          ID: {account.userId}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <span className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-medium text-[#003566] dark:bg-blue-950 dark:text-blue-300">
                          {account.accountType}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-sm font-bold text-gray-900 dark:text-white">
                          {formatMoney(account.balance, account.currency)}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300">
                        {account.branch}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass(
                            account.status
                          )}`}
                        >
                          {account.status}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            title="View Account"
                            aria-label="View Account"
                            onClick={() => setSelectedAccount(account)}
                            className="rounded-lg border border-blue-200 bg-blue-50 p-2 text-blue-600 transition hover:bg-blue-100 dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-400"
                          >
                            <Eye size={17} />
                          </button>

                          <button
                            type="button"
                            title="Edit Account"
                            aria-label="Edit Account"
                            onClick={() => setEditingAccount(account)}
                            className="rounded-lg border border-amber-200 bg-amber-50 p-2 text-amber-600 transition hover:bg-amber-100 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-400"
                          >
                            <Pencil size={17} />
                          </button>

                          <button
                            type="button"
                            title="Delete Account"
                            aria-label="Delete Account"
                            disabled={deletingId === account._id}
                            onClick={() => void handleDelete(account._id)}
                            className="rounded-lg border border-red-200 bg-red-50 p-2 text-red-600 transition hover:bg-red-100 disabled:opacity-50 dark:border-red-900 dark:bg-red-950/50 dark:text-red-400"
                          >
                            {deletingId === account._id ? (
                              <Loader2 size={17} className="animate-spin" />
                            ) : (
                              <Trash2 size={17} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* View Account Modal */}
        {selectedAccount && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-3 backdrop-blur-sm sm:p-5"
            onClick={() => setSelectedAccount(null)}
          >
            <div
              className="my-auto flex max-h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-900"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-5 py-3 dark:border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-[#003566] p-2.5 text-white">
                    <Wallet size={21} />
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-900 dark:text-white">
                      Account Details
                    </h2>
                    <p className="text-xs text-gray-500">
                      Complete account information
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedAccount(null)}
                  aria-label="Close modal"
                  className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Content */}
              <div className="overflow-y-auto p-5">
                <div className="mb-4 rounded-xl bg-[#003566]/5 p-4 dark:bg-blue-950/30">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    Account Name
                  </p>
                  <h3 className="mt-1 text-xl font-bold text-[#003566] dark:text-white">
                    {selectedAccount.accountName}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {selectedAccount.accountNumber}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {Object.entries(selectedAccount)
                    .filter(
                      ([key]) =>
                        !["_id", "__v", "updatedAt"].includes(key)
                    )
                    .map(([key, value]) => (
                      <div key={key} className="min-w-0">
                        <p className="mb-1 text-xs font-semibold capitalize text-gray-500 dark:text-gray-400">
                          {key.replace(/([A-Z])/g, " $1")}
                        </p>
                        <div className="break-all rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200">
                          {value === null || value === undefined
                            ? "Not Provided"
                            : typeof value === "object"
                              ? JSON.stringify(value)
                              : String(value)}
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Footer */}
              <div className="flex shrink-0 justify-end gap-2 border-t border-gray-100 px-5 py-3 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => {
                    setEditingAccount(selectedAccount);
                    setSelectedAccount(null);
                  }}
                  className="flex items-center gap-2 rounded-lg bg-[#003566] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#00264d]"
                >
                  <Pencil size={16} />
                  Edit Account
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedAccount(null)}
                  className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Account Modal */}
        {editingAccount && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-3 backdrop-blur-sm sm:p-5"
            onClick={() => !saving && setEditingAccount(null)}
          >
            <div
              className="my-auto flex max-h-[88vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-900"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-5 py-3 dark:border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-[#003566]/10 p-2.5 text-[#003566] dark:bg-blue-950 dark:text-blue-300">
                    <CreditCard size={21} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                      Edit Bank Account
                    </h2>
                    <p className="text-xs text-gray-500">
                      Update account information
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setEditingAccount(null)}
                  disabled={saving}
                  aria-label="Close modal"
                  className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 disabled:opacity-50 dark:hover:bg-gray-800"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Form Content */}
              <form
                onSubmit={handleUpdate}
                className="flex min-h-0 flex-1 flex-col"
              >
                <div className="overflow-y-auto p-5">
                  <div className="mb-4 rounded-xl bg-gray-50 p-3 dark:bg-gray-800/70">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Account Number
                        </p>
                        <p className="mt-1 font-bold tracking-wider text-gray-900 dark:text-white">
                          {editingAccount.accountNumber}
                        </p>
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass(
                          editingAccount.status
                        )}`}
                      >
                        {editingAccount.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    <div>
                      <label className={labelClass}>Account Name</label>
                      <input
                        name="accountName"
                        defaultValue={editingAccount.accountName}
                        required
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Account Type</label>
                      <select
                        name="accountType"
                        defaultValue={editingAccount.accountType}
                        className={inputClass}
                      >
                        <option value="Savings">Savings</option>
                        <option value="Current">Current</option>
                        <option value="Salary">Salary</option>
                        <option value="Student">Student</option>
                        <option value="Fixed Deposit">Fixed Deposit</option>
                      </select>
                    </div>

                    <div>
                      <label className={labelClass}>Currency</label>
                      <select
                        name="currency"
                        defaultValue={editingAccount.currency}
                        className={inputClass}
                      >
                        <option value="BDT">BDT</option>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                      </select>
                    </div>

                    <div>
                      <label className={labelClass}>Account Status</label>
                      <select
                        name="status"
                        defaultValue={editingAccount.status}
                        className={inputClass}
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Pending">Pending</option>
                      </select>
                    </div>

                    <div>
                      <label className={labelClass}>Branch</label>
                      <input
                        name="branch"
                        defaultValue={editingAccount.branch}
                        required
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Balance</label>
                      <input
                        type="number"
                        name="balance"
                        min="0"
                        step="0.01"
                        defaultValue={editingAccount.balance}
                        required
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Minimum Balance</label>
                      <input
                        type="number"
                        name="minimumBalance"
                        min="0"
                        step="0.01"
                        defaultValue={editingAccount.minimumBalance}
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Daily Transfer Limit</label>
                      <input
                        type="number"
                        name="dailyTransferLimit"
                        min="0"
                        step="0.01"
                        defaultValue={editingAccount.dailyTransferLimit}
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Monthly Transfer Limit</label>
                      <input
                        type="number"
                        name="monthlyTransferLimit"
                        min="0"
                        step="0.01"
                        defaultValue={editingAccount.monthlyTransferLimit}
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Interest Rate (%)</label>
                      <input
                        type="number"
                        name="interestRate"
                        min="0"
                        step="0.01"
                        defaultValue={editingAccount.interestRate}
                        className={inputClass}
                      />
                    </div>

                    <div className="sm:col-span-2 lg:col-span-3">
                      <label className={labelClass}>Account Purpose</label>
                      <textarea
                        name="accountPurpose"
                        rows={2}
                        defaultValue={editingAccount.accountPurpose || ""}
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex shrink-0 flex-col-reverse justify-end gap-3 border-t border-gray-100 px-5 py-3 dark:border-gray-800 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => setEditingAccount(null)}
                    disabled={saving}
                    className="rounded-lg border border-gray-200 px-5 py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center justify-center gap-2 rounded-lg bg-[#003566] px-6 py-2 text-sm font-semibold text-white transition hover:bg-[#00264d] disabled:opacity-50"
                  >
                    {saving ? (
                      <>
                        <Loader2 size={17} className="animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={17} />
                        Update Account
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
