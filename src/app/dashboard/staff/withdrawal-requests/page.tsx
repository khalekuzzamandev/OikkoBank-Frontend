
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  Eye,
  Loader2,
  Search,
  RefreshCw,
  Wallet,
  Clock,
  CheckCircle2,
  XCircle,
  ListFilter,
} from "lucide-react";

import {
  getAllWithdraws,
} from "@/components/lib/Apis/withdrawals/withdrawals";

type DataRecord = Record<string, unknown>;

type WithdrawalRow = {
  id: string;
  customer: string;
  fromAccount: string;
  toAccount: string;
  amount: number | null;
  method: string;
  status: string;
  date: string;
  timestamp: number;
};

type FilterStatus = "All" | "Pending" | "Completed" | "Failed";

const asRecord = (value: unknown): DataRecord | null =>
  value && typeof value === "object" && !Array.isArray(value)
    ? (value as DataRecord)
    : null;

const extractWithdrawals = (payload: unknown): DataRecord[] => {
  if (Array.isArray(payload)) {
    return payload.map((item) => {
      const record = asRecord(item);

      if (!record) {
        throw new Error("The withdrawals API returned an invalid record.");
      }

      return record;
    });
  }

  const response = asRecord(payload);

  if (!response) {
    throw new Error("The withdrawals API returned an invalid response.");
  }

  if (response.success === false) {
    throw new Error(
      typeof response.message === "string"
        ? response.message
        : "Failed to fetch withdrawals."
    );
  }

  for (const key of ["data", "withdrawals", "requests", "items", "results"]) {
    const candidate = response[key];

    if (Array.isArray(candidate)) return extractWithdrawals(candidate);

    const nested = asRecord(candidate);

    if (nested) return extractWithdrawals(nested);
  }

  if ("withdrawalAmount" in response || "amount" in response) {
    return [response];
  }

  throw new Error("The withdrawals API returned an unexpected response.");
};

const getString = (record: DataRecord, ...keys: string[]) => {
  for (const key of keys) {
    const value = record[key];

    if (typeof value === "string" && value.trim()) return value.trim();

    if (typeof value === "number") return String(value);
  }

  return "";
};

const getAmount = (record: DataRecord) => {
  for (const key of ["withdrawalAmount", "amount"]) {
    const value = record[key];

    if (value !== undefined && value !== null && value !== "") {
      const amount = Number(value);

      if (Number.isFinite(amount)) return amount;
    }
  }

  return null;
};

const toWithdrawalRow = (
  record: DataRecord,
  index: number
): WithdrawalRow => {
  const date = getString(
    record,
    "transactionDate",
    "createdAt",
    "updatedAt"
  );

  const parsedDate = date ? new Date(date).getTime() : Number.NaN;

  return {
    id:
      getString(record, "_id", "id", "withdrawalId") ||
      `withdrawal-${index}`,

    customer:
      getString(record, "userEmail", "customerName", "accountName") ||
      "Customer unavailable",

    fromAccount:
      getString(record, "senderAccountNumber", "receiptNumber") || "—",

    toAccount: getString(record, "accountNumber") || "—",

    amount: getAmount(record),

    method: getString(record, "withdrawalMethod", "method") || "—",

    status: getString(record, "transactionStatus", "status") || "Unknown",

    date,

    timestamp: Number.isFinite(parsedDate) ? parsedDate : 0,
  };
};

const normalizeStatus = (status: string): FilterStatus | "Other" => {
  const value = status.toLowerCase().trim();

  if (value === "pending") return "Pending";

  if (
    value === "completed" ||
    value === "complete" ||
    value === "success" ||
    value === "successful"
  ) {
    return "Completed";
  }

  if (
    value === "failed" ||
    value === "failure" ||
    value === "rejected"
  ) {
    return "Failed";
  }

  return "Other";
};

const formatAmount = (amount: number | null) =>
  amount === null
    ? "—"
    : `৳${amount.toLocaleString("en-BD", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

const formatDate = (value: string) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString("en-BD", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const filterOptions: {
  label: FilterStatus;
  icon: typeof ListFilter;
}[] = [
    { label: "All", icon: ListFilter },
    { label: "Pending", icon: Clock },
    { label: "Completed", icon: CheckCircle2 },
    { label: "Failed", icon: XCircle },
  ];

export default function AllWithdrawRequests() {
  const [requests, setRequests] = useState<WithdrawalRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterStatus>("All");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let active = true;

    const loadRequests = async () => {
      try {
        setLoading(true);
        setError("");

        const response: unknown = await getAllWithdraws();

        const rows = extractWithdrawals(response)
          .map(toWithdrawalRow)
          .sort((a, b) => b.timestamp - a.timestamp);

        if (active) setRequests(rows);
      } catch (loadError) {
        if (active) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load withdrawal requests."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadRequests();

    return () => {
      active = false;
    };
  }, [refreshKey]);

  const getCount = (status: FilterStatus) => {
    if (status === "All") return requests.length;

    return requests.filter(
      (request) => normalizeStatus(request.status) === status
    ).length;
  };

  const filteredRequests = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();

    return requests.filter((request) => {
      const matchesStatus =
        activeFilter === "All" ||
        normalizeStatus(request.status) === activeFilter;

      const matchesSearch =
        request.customer.toLowerCase().includes(search) ||
        request.fromAccount.toLowerCase().includes(search) ||
        request.toAccount.toLowerCase().includes(search) ||
        request.method.toLowerCase().includes(search) ||
        request.id.toLowerCase().includes(search);

      return matchesStatus && matchesSearch;
    });
  }, [requests, activeFilter, searchTerm]);

  const getStatusStyle = (status: string) => {
    const normalized = normalizeStatus(status);

    if (normalized === "Pending") {
      return "bg-amber-50 text-amber-700 border-amber-200";
    }

    if (normalized === "Completed") {
      return "bg-green-50 text-green-700 border-green-200";
    }

    if (normalized === "Failed") {
      return "bg-red-50 text-red-700 border-red-200";
    }

    return "bg-gray-100 text-gray-600 border-gray-200";
  };

  const getStatusIcon = (status: string) => {
    const normalized = normalizeStatus(status);

    if (normalized === "Pending") return <Clock size={14} />;

    if (normalized === "Completed") return <CheckCircle2 size={14} />;

    if (normalized === "Failed") return <XCircle size={14} />;

    return <AlertCircle size={14} />;
  };

  return (
    <main className="min-h-screen bg-[#F4F7FB] p-4 sm:p-5 lg:p-7">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <div className="rounded-xl bg-[#003566] p-2.5 text-white">
                <Wallet size={21} />
              </div>

              <span className="text-sm font-semibold text-[#003566]">
                OikkoBank Admin
              </span>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Withdrawal Management
            </h1>

            <p className="mt-1 text-sm text-gray-500 sm:text-base">
              Manage and monitor all customer withdrawal requests.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setRefreshKey((prev) => prev + 1)}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-[#003566] shadow-sm transition hover:bg-blue-50 disabled:opacity-50"
          >
            <RefreshCw
              size={17}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  All Requests
                </p>
                <h2 className="mt-2 text-2xl font-bold text-gray-900">
                  {requests.length}
                </h2>
              </div>

              <div className="rounded-xl bg-blue-50 p-3 text-[#003566]">
                <Wallet size={22} />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Pending</p>
                <h2 className="mt-2 text-2xl font-bold text-amber-600">
                  {getCount("Pending")}
                </h2>
              </div>

              <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
                <Clock size={22} />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Completed</p>
                <h2 className="mt-2 text-2xl font-bold text-green-600">
                  {getCount("Completed")}
                </h2>
              </div>

              <div className="rounded-xl bg-green-50 p-3 text-green-600">
                <CheckCircle2 size={22} />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Failed</p>
                <h2 className="mt-2 text-2xl font-bold text-red-600">
                  {getCount("Failed")}
                </h2>
              </div>

              <div className="rounded-xl bg-red-50 p-3 text-red-600">
                <XCircle size={22} />
              </div>
            </div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          {filterOptions.map((option) => {
            const Icon = option.icon;
            const isActive = activeFilter === option.label;

            return (
              <button
                key={option.label}
                type="button"
                onClick={() => setActiveFilter(option.label)}
                className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${isActive
                    ? "border-[#003566] bg-[#003566] text-white shadow-sm"
                    : "border-gray-200 bg-white text-gray-600 hover:border-[#003566] hover:text-[#003566]"
                  }`}
              >
                <Icon size={16} />
                {option.label}

                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${isActive
                      ? "bg-white/20 text-white"
                      : "bg-gray-100 text-gray-600"
                    }`}
                >
                  {getCount(option.label)}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="relative">
            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search customer, account number, method or ID..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-12 pr-4 text-sm outline-none transition focus:border-[#1762AE] focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div
            role="alert"
            className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600"
          >
            <AlertCircle size={19} />
            {error}
          </div>
        )}

        {/* Withdrawal Table */}
        <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex flex-col gap-2 border-b border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#003566]">
                {activeFilter === "All"
                  ? "All Withdrawal Requests"
                  : `${activeFilter} Withdrawal Requests`}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Showing {filteredRequests.length} of {requests.length} requests
              </p>
            </div>

            <span className="w-fit rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-[#003566]">
              {filteredRequests.length} Requests
            </span>
          </div>

          {loading ? (
            <div className="flex min-h-64 flex-col items-center justify-center gap-3 text-sm text-gray-500">
              <Loader2
                className="animate-spin text-[#1762AE]"
                size={30}
              />
              Loading withdrawal requests...
            </div>
          ) : error ? (
            <div className="flex min-h-52 items-center justify-center text-sm text-gray-500">
              Unable to display withdrawal requests.
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center px-4 text-center">
              <div className="mb-3 rounded-full bg-gray-100 p-4 text-gray-400">
                <Wallet size={28} />
              </div>

              <h3 className="text-lg font-bold text-gray-800">
                No Withdrawal Requests Found
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                No requests match your selected filter or search.
              </p>

              <button
                type="button"
                onClick={() => {
                  setActiveFilter("All");
                  setSearchTerm("");
                }}
                className="mt-4 text-sm font-semibold text-[#003566] hover:underline"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px] text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-4 py-4 font-semibold">Customer</th>
                    <th className="px-4 py-4 font-semibold">From Account</th>
                    <th className="px-4 py-4 font-semibold">To Account</th>
                    <th className="px-4 py-4 text-right font-semibold">Amount</th>
                    <th className="px-4 py-4 font-semibold">Method</th>
                    <th className="px-4 py-4 font-semibold">Status</th>
                    <th className="px-4 py-4 font-semibold">Date</th>
                    <th className="px-4 py-4 text-center font-semibold">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredRequests.map((request) => (
                    <tr
                      key={request.id}
                      className="transition hover:bg-blue-50/40"
                    >
                      <td className="px-4 py-4 font-medium text-gray-800">
                        {request.customer}
                      </td>

                      <td className="px-4 py-4 text-gray-600">
                        {request.fromAccount}
                      </td>

                      <td className="px-4 py-4 text-gray-600">
                        {request.toAccount}
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 text-right font-bold text-[#003566]">
                        {formatAmount(request.amount)}
                      </td>

                      <td className="px-4 py-4 text-gray-600">
                        {request.method}
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-semibold ${getStatusStyle(request.status)}`}
                        >
                          {getStatusIcon(request.status)}
                          {normalizeStatus(request.status) === "Other"
                            ? request.status
                            : normalizeStatus(request.status)}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 text-gray-600">
                        {formatDate(request.date)}
                      </td>

                      <td className="px-4 py-4 text-center">
                        <Link
                          href={`/dashboard/staff/withdrawal-requests/${request.id}`}
                          aria-label="View withdrawal details"
                          title="View Details"
                          className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold text-[#003566] transition hover:bg-[#003566] hover:text-white"
                        >
                          <Eye size={16} />
                          Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
