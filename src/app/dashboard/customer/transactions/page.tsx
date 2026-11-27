"use client";

import { useEffect, useState } from "react";
import {
  AlertCircle,
  ArrowDownToLine,
  ArrowUpFromLine,
  Clock3,
  HandCoins,
  History,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { selectUser } from "@/Redux/features/UserSlice";
import { useAppSelector } from "@/Redux/hooks";
import { getAllDeposits } from "@/components/lib/Apis/deposits/deposits";
import { getAllLoans } from "@/components/lib/Apis/loan/loan";
import { getAllWithdraws } from "@/components/lib/Apis/withdrawals/withdrawals";

type TransactionKind = "Deposit" | "Withdrawal" | "Loan";

type HistoryItem = {
  id: string;
  kind: TransactionKind;
  amount: number | null;
  currency: string;
  status: string;
  description: string;
  date: string;
  timestamp: number;
};

type DataRecord = Record<string, unknown>;

const asRecord = (value: unknown): DataRecord | null =>
  value && typeof value === "object" && !Array.isArray(value)
    ? (value as DataRecord)
    : null;

const extractRecords = (payload: unknown, label: string): DataRecord[] => {
  if (Array.isArray(payload)) {
    return payload.map((item) => {
      const record = asRecord(item);
      if (!record) {
        throw new Error(`The ${label} API returned an invalid record.`);
      }
      return record;
    });
  }

  const response = asRecord(payload);
  if (!response) {
    throw new Error(`The ${label} API returned an invalid response.`);
  }

  if (response.success === false) {
    throw new Error(
      typeof response.message === "string"
        ? response.message
        : `Failed to load ${label}.`
    );
  }

  for (const key of ["data", "items", "results", "transactions", label]) {
    const candidate = response[key];
    if (Array.isArray(candidate)) {
      return extractRecords(candidate, label);
    }

    const nested = asRecord(candidate);
    if (nested) {
      return extractRecords(nested, label);
    }
  }

  if ("userId" in response || "senderUserId" in response) {
    return [response];
  }

  throw new Error(`The ${label} API returned an unexpected response.`);
};

const getString = (record: DataRecord, ...keys: string[]) => {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof value === "number") return String(value);
  }
  return "";
};

const getAmount = (record: DataRecord, ...keys: string[]) => {
  for (const key of keys) {
    const value = record[key];
    if (value !== undefined && value !== null && value !== "") {
      const amount = Number(value);
      if (Number.isFinite(amount)) return amount;
    }
  }
  return null;
};

const belongsToUser = (record: DataRecord, userId: string) =>
  record.userId === userId || record.senderUserId === userId;

const toHistoryItem = (
  record: DataRecord,
  kind: TransactionKind,
  index: number
): HistoryItem => {
  const date = getString(
    record,
    "transactionDate",
    "applicationDate",
    "createdAt",
    "updatedAt"
  );
  const parsedDate = date ? new Date(date).getTime() : Number.NaN;

  return {
    id:
      getString(record, "_id", "id", "transactionId", "loanId") ||
      `${kind.toLowerCase()}-${index}`,
    kind,
    amount:
      kind === "Deposit"
        ? getAmount(record, "depositAmount", "amount")
        : kind === "Withdrawal"
          ? getAmount(record, "withdrawalAmount", "amount")
          : getAmount(record, "loanAmount", "amount"),
    currency: getString(record, "currency") || "BDT",
    status: getString(
      record,
      "transactionStatus",
      "applicationStatus",
      "loanStatus",
      "status"
    ) || "Unknown",
    description:
      kind === "Deposit"
        ? getString(record, "depositMethod", "description") || "Deposit"
        : kind === "Withdrawal"
          ? getString(record, "withdrawalMethod", "description") || "Withdrawal"
          : getString(record, "loanType", "description") || "Loan application",
    date,
    timestamp: Number.isFinite(parsedDate) ? parsedDate : 0,
  };
};

const formatAmount = (amount: number | null, currency: string) => {
  if (amount === null) return "Amount unavailable";
  const symbol = currency.toUpperCase() === "BDT" ? "৳" : currency;
  return `${symbol} ${amount.toLocaleString("en-BD", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const formatDate = (date: string) => {
  if (!date) return "Date unavailable";
  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return "Date unavailable";

  return parsedDate.toLocaleString("en-BD", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const statusClassName = (status: string) => {
  const normalized = status.toLowerCase();
  if (["success", "completed", "approved", "paid"].includes(normalized)) {
    return "bg-green-50 text-green-700";
  }
  if (["failed", "rejected", "cancelled", "canceled"].includes(normalized)) {
    return "bg-red-50 text-red-700";
  }
  return "bg-amber-50 text-amber-700";
};

const CustomerTransitions = () => {
  const user = useAppSelector(selectUser);
  const [transactions, setTransactions] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let active = true;

    const loadHistory = async () => {
      if (!user?.id) {
        setTransactions([]);
        setError("");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const [depositsResponse, withdrawalsResponse, loansResponse] =
          await Promise.all([
            getAllDeposits(user.id),
            getAllWithdraws(user.id),
            getAllLoans(user.id),
          ]);

        const history = [
          ...extractRecords(depositsResponse, "deposits")
            .filter((record) => belongsToUser(record, user.id))
            .map((record, index) => toHistoryItem(record, "Deposit", index)),
          ...extractRecords(withdrawalsResponse, "withdrawals")
            .filter((record) => belongsToUser(record, user.id))
            .map((record, index) =>
              toHistoryItem(record, "Withdrawal", index)
            ),
          ...extractRecords(loansResponse, "loans")
            .filter((record) => belongsToUser(record, user.id))
            .map((record, index) => toHistoryItem(record, "Loan", index)),
        ].sort((a, b) => b.timestamp - a.timestamp);

        if (active) setTransactions(history);
      } catch (loadError) {
        if (active) {
          setTransactions([]);
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load your transaction history."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadHistory();

    return () => {
      active = false;
    };
  }, [user?.id, refreshKey]);

  return (
    <main className="min-h-screen bg-[#F4F7FB] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#003566] text-white shadow-lg shadow-blue-900/15">
              <History size={27} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-[#003566] sm:text-3xl">
                Transaction History
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Your deposits, withdrawals, and loan applications in one place.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setRefreshKey((key) => key + 1)}
            disabled={loading || !user?.id}
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#1762AE] shadow-sm transition hover:border-[#1762AE] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </header>

        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 sm:px-7">
            <div>
              <h2 className="font-bold text-[#003566]">Recent activity</h2>
              <p className="mt-1 text-xs text-gray-500">
                {transactions.length} {transactions.length === 1 ? "item" : "items"}
              </p>
            </div>
            <Clock3 size={20} className="text-gray-400" />
          </div>

          {loading ? (
            <div className="flex min-h-64 flex-col items-center justify-center gap-3 p-6 text-center">
              <Loader2 className="animate-spin text-[#1762AE]" size={32} />
              <p className="text-sm text-gray-500">
                Loading your transaction history...
              </p>
            </div>
          ) : error ? (
            <div className="flex min-h-64 flex-col items-center justify-center p-6 text-center">
              <AlertCircle className="text-red-500" size={34} />
              <p className="mt-3 font-semibold text-gray-800">
                Unable to load your history
              </p>
              <p className="mt-1 max-w-lg text-sm text-gray-500">{error}</p>
              <button
                type="button"
                onClick={() => setRefreshKey((key) => key + 1)}
                className="mt-4 rounded-lg bg-[#003566] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1762AE]"
              >
                Try again
              </button>
            </div>
          ) : !user?.id ? (
            <div className="flex min-h-64 items-center justify-center p-6 text-center text-sm text-gray-500">
              Sign in to view your transaction history.
            </div>
          ) : transactions.length === 0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center p-6 text-center">
              <History className="text-gray-300" size={38} />
              <p className="mt-3 font-semibold text-gray-700">
                No activity yet
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Deposits, withdrawals, and loan applications will appear here.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {transactions.map((transaction) => {
                const Icon =
                  transaction.kind === "Deposit"
                    ? ArrowDownToLine
                    : transaction.kind === "Withdrawal"
                      ? ArrowUpFromLine
                      : HandCoins;

                return (
                  <li
                    key={transaction.id}
                    className="flex flex-col gap-3 px-5 py-4 transition hover:bg-gray-50/70 sm:flex-row sm:items-center sm:justify-between sm:px-7"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                          transaction.kind === "Deposit"
                            ? "bg-green-50 text-green-600"
                            : transaction.kind === "Withdrawal"
                              ? "bg-orange-50 text-orange-600"
                              : "bg-purple-50 text-purple-600"
                        }`}
                      >
                        <Icon size={20} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold text-gray-800">
                            {transaction.description}
                          </h3>
                          <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#1762AE]">
                            {transaction.kind}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                          {formatDate(transaction.date)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-4 pl-14 sm:justify-end sm:pl-0">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusClassName(
                          transaction.status
                        )}`}
                      >
                        {transaction.status}
                      </span>
                      <span className="min-w-32 text-right text-sm font-bold text-[#003566]">
                        {formatAmount(transaction.amount, transaction.currency)}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
};

export default CustomerTransitions;
