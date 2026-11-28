
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowDownToLine,
  ArrowLeftRight,
  ArrowUpFromLine,
  HandCoins,
  Loader2,
  RefreshCw,
  Search,
  X,
  ReceiptText,
} from "lucide-react";

import { getAllDeposits } from "@/components/lib/Apis/deposits/deposits";
import { getAllLoans } from "@/components/lib/Apis/loan/loan";
import { getAllWithdraws } from "@/components/lib/Apis/withdrawals/withdrawals";
import { getAllTransfers } from "@/components/lib/Apis/transfer/transfer";

type TransactionKind =
  | "Deposit"
  | "Withdrawal"
  | "Loan"
  | "Transfer";

type FilterType = "All" | TransactionKind;

type HistoryItem = {
  id: string;
  kind: TransactionKind;
  customer: string;
  detail: string;
  account: string;
  amount: number | null;
  currency: string;
  status: string;
  date: string;
  timestamp: number;
};

type DataRecord = Record<string, unknown>;

const asRecord = (value: unknown): DataRecord | null =>
  value && typeof value === "object" && !Array.isArray(value)
    ? (value as DataRecord)
    : null;

const extractRecords = (
  payload: unknown,
  label: string
): DataRecord[] => {
  if (Array.isArray(payload)) {
    return payload.map((item) => {
      const record = asRecord(item);

      if (!record) {
        throw new Error(
          `The ${label} API returned an invalid record.`
        );
      }

      return record;
    });
  }

  const response = asRecord(payload);

  if (!response) {
    throw new Error(
      `The ${label} API returned an invalid response.`
    );
  }

  if (response.success === false) {
    throw new Error(
      typeof response.message === "string"
        ? response.message
        : `Failed to load ${label}.`
    );
  }

  for (const key of [
    "data",
    "items",
    "results",
    "transactions",
    label,
  ]) {
    const candidate = response[key];

    if (Array.isArray(candidate)) {
      return extractRecords(candidate, label);
    }

    const nested = asRecord(candidate);

    if (nested) {
      return extractRecords(nested, label);
    }
  }

  throw new Error(
    `The ${label} API returned an unexpected response.`
  );
};

const getString = (
  record: DataRecord,
  ...keys: string[]
): string => {
  for (const key of keys) {
    const value = record[key];

    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }

    if (typeof value === "number") {
      return String(value);
    }
  }

  return "";
};

const getAmount = (
  record: DataRecord,
  ...keys: string[]
): number | null => {
  for (const key of keys) {
    const value = record[key];

    if (
      value !== undefined &&
      value !== null &&
      value !== ""
    ) {
      const amount = Number(value);

      if (Number.isFinite(amount)) {
        return amount;
      }
    }
  }

  return null;
};

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

  const parsedDate = date
    ? new Date(date).getTime()
    : Number.NaN;

  const senderAccount = getString(
    record,
    "senderAccountNumber",
    "fromAccountNumber"
  );

  const receiverAccount = getString(
    record,
    "receiverAccountNumber",
    "toAccountNumber",
    "receiptAccountNumber"
  );

  const account =
    kind === "Transfer"
      ? senderAccount && receiverAccount
        ? `${senderAccount} → ${receiverAccount}`
        : getString(
          record,
          "accountNumber",
          "senderAccountNumber",
          "receiptNumber"
        ) || "—"
      : getString(
        record,
        "accountNumber",
        "senderAccountNumber",
        "receiptNumber",
        "accountId"
      ) || "—";

  const customer =
    kind === "Transfer"
      ? getString(
        record,
        "senderEmail",
        "userEmail",
        "customerEmail",
        "senderName",
        "customerName"
      )
      : getString(
        record,
        "userEmail",
        "senderEmail",
        "customerEmail",
        "customerName",
        "accountName"
      );

  let detail = "";

  switch (kind) {
    case "Deposit":
      detail =
        getString(
          record,
          "depositMethod",
          "description"
        ) || "Deposit";
      break;

    case "Withdrawal":
      detail =
        getString(
          record,
          "withdrawalMethod",
          "description"
        ) || "Withdrawal";
      break;

    case "Loan":
      detail =
        getString(
          record,
          "loanType",
          "description"
        ) || "Loan application";
      break;

    case "Transfer":
      detail =
        getString(
          record,
          "transferMethod",
          "description",
          "transactionType"
        ) || "Fund Transfer";
      break;
  }

  let amount: number | null = null;

  switch (kind) {
    case "Deposit":
      amount = getAmount(
        record,
        "depositAmount",
        "amount"
      );
      break;

    case "Withdrawal":
      amount = getAmount(
        record,
        "withdrawalAmount",
        "amount"
      );
      break;

    case "Loan":
      amount = getAmount(
        record,
        "loanAmount",
        "amount"
      );
      break;

    case "Transfer":
      amount = getAmount(
        record,
        "transferAmount",
        "amount",
        "transactionAmount"
      );
      break;
  }

  return {
    id:
      getString(
        record,
        "_id",
        "id",
        "transactionId",
        "loanId"
      ) || `${kind.toLowerCase()}-${index}`,

    kind,

    customer: customer || "Customer not provided",

    detail,

    account,

    amount,

    currency:
      getString(record, "currency") || "BDT",

    status:
      getString(
        record,
        "transactionStatus",
        "applicationStatus",
        "loanStatus",
        "status"
      ) || "Unknown",

    date,

    timestamp: Number.isFinite(parsedDate)
      ? parsedDate
      : 0,
  };
};

const formatAmount = (
  amount: number | null,
  currency: string
) => {
  if (amount === null) return "—";

  const symbol =
    currency.toUpperCase() === "BDT"
      ? "৳"
      : currency;

  return `${symbol} ${amount.toLocaleString("en-BD", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const formatDate = (date: string) => {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "—";
  }

  return parsedDate.toLocaleString("en-BD", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const statusClassName = (status: string) => {
  const normalized = status.toLowerCase();

  if (
    [
      "success",
      "completed",
      "approved",
      "paid",
    ].includes(normalized)
  ) {
    return "bg-green-50 text-green-700";
  }

  if (
    [
      "failed",
      "rejected",
      "cancelled",
      "canceled",
    ].includes(normalized)
  ) {
    return "bg-red-50 text-red-700";
  }

  return "bg-amber-50 text-amber-700";
};

const filterOptions: {
  label: FilterType;
  icon: typeof ReceiptText;
}[] = [
    { label: "All", icon: ReceiptText },
    { label: "Loan", icon: HandCoins },
    { label: "Deposit", icon: ArrowDownToLine },
    { label: "Withdrawal", icon: ArrowUpFromLine },
    { label: "Transfer", icon: ArrowLeftRight },
  ];

export default function AllTransitions() {
  const [transactions, setTransactions] = useState<
    HistoryItem[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [refreshKey, setRefreshKey] = useState(0);

  const [activeFilter, setActiveFilter] =
    useState<FilterType>("All");

  const [searchAccount, setSearchAccount] =
    useState("");

  // Fetch All Transactions
  useEffect(() => {
    let active = true;

    const loadTransactions = async () => {
      setLoading(true);
      setError("");

      try {
        const [
          depositsResponse,
          withdrawalsResponse,
          loansResponse,
          transfersResponse,
        ] = await Promise.all([
          getAllDeposits(),
          getAllWithdraws(),
          getAllLoans(),
          getAllTransfers(),
        ]);

        const allTransactions: HistoryItem[] = [
          ...extractRecords(
            depositsResponse,
            "deposits"
          ).map((record, index) =>
            toHistoryItem(record, "Deposit", index)
          ),

          ...extractRecords(
            withdrawalsResponse,
            "withdrawals"
          ).map((record, index) =>
            toHistoryItem(record, "Withdrawal", index)
          ),

          ...extractRecords(
            loansResponse,
            "loans"
          ).map((record, index) =>
            toHistoryItem(record, "Loan", index)
          ),

          ...extractRecords(
            transfersResponse,
            "transfers"
          ).map((record, index) =>
            toHistoryItem(record, "Transfer", index)
          ),
        ].sort(
          (a, b) => b.timestamp - a.timestamp
        );

        if (active) {
          setTransactions(allTransactions);
        }
      } catch (loadError) {
        if (active) {
          setTransactions([]);

          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load transaction history."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void loadTransactions();

    return () => {
      active = false;
    };
  }, [refreshKey]);

  // Filter and Search
  const filteredTransactions = useMemo(() => {
    let result = [...transactions];

    // Type Filter
    if (activeFilter !== "All") {
      result = result.filter(
        (transaction) =>
          transaction.kind === activeFilter
      );
    }

    // Account Number Search
    const searchValue = searchAccount
      .trim()
      .toLowerCase();

    if (searchValue) {
      result = result.filter((transaction) => {
        const accountNumbers =
          transaction.account.toLowerCase();

        return accountNumbers.includes(searchValue);
      });
    }

    return result.sort(
      (a, b) => b.timestamp - a.timestamp
    );
  }, [transactions, activeFilter, searchAccount]);

  // Counts
  const depositCount = transactions.filter(
    (item) => item.kind === "Deposit"
  ).length;

  const withdrawalCount = transactions.filter(
    (item) => item.kind === "Withdrawal"
  ).length;

  const loanCount = transactions.filter(
    (item) => item.kind === "Loan"
  ).length;

  const transferCount = transactions.filter(
    (item) => item.kind === "Transfer"
  ).length;

  const getCount = (filter: FilterType) => {
    if (filter === "All") return transactions.length;

    return transactions.filter(
      (item) => item.kind === filter
    ).length;
  };

  return (
    <main className="min-h-screen bg-[#F4F7FB] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <header className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#003566] sm:text-3xl">
              All Transaction History
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              View and manage all customer banking transactions.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setRefreshKey((key) => key + 1)
            }
            disabled={loading}
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#1762AE] shadow-sm transition hover:border-[#1762AE] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={
                loading ? "animate-spin" : ""
              }
            />
            Refresh
          </button>
        </header>

        {/* Summary Cards */}
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">

          {[
            {
              label: "Deposits",
              count: depositCount,
              icon: ArrowDownToLine,
              color: "text-green-600 bg-green-50",
            },
            {
              label: "Withdrawals",
              count: withdrawalCount,
              icon: ArrowUpFromLine,
              color: "text-orange-600 bg-orange-50",
            },
            {
              label: "Loans",
              count: loanCount,
              icon: HandCoins,
              color: "text-purple-600 bg-purple-50",
            },
            {
              label: "Transfers",
              count: transferCount,
              icon: ArrowLeftRight,
              color: "text-blue-600 bg-blue-50",
            },
          ].map(
            ({
              label,
              count,
              icon: Icon,
              color,
            }) => (
              <div
                key={label}
                className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
              >
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${color}`}
                >
                  <Icon size={20} />
                </span>

                <div>
                  <p className="text-xs font-medium text-gray-500">
                    {label}
                  </p>

                  <p className="text-lg font-bold text-[#003566]">
                    {count}
                  </p>
                </div>
              </div>
            )
          )}
        </div>

        {/* Transaction Section */}
        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

          {/* Section Header */}
          <div className="border-b border-gray-100 px-5 py-5 sm:px-7">

            <div className="mb-5">
              <h2 className="font-bold text-[#003566]">
                Transaction Records
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                Filter transactions and search by account number.
              </p>
            </div>

            {/* Filter Buttons + Search */}
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">

              {/* Filter Buttons */}
              <div className="flex flex-wrap gap-2">
                {filterOptions.map(
                  ({ label, icon: Icon }) => {
                    const selected =
                      activeFilter === label;

                    return (
                      <button
                        key={label}
                        type="button"
                        onClick={() =>
                          setActiveFilter(label)
                        }
                        className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${selected
                          ? "bg-[#003566] text-white shadow-md"
                          : "border border-gray-200 bg-white text-gray-600 hover:border-[#1762AE] hover:text-[#1762AE]"
                          }`}
                      >
                        <Icon size={16} />

                        {label === "Withdrawal"
                          ? "Withdraw"
                          : label}

                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] ${selected
                            ? "bg-white/20 text-white"
                            : "bg-gray-100 text-gray-500"
                            }`}
                        >
                          {getCount(label)}
                        </span>
                      </button>
                    );
                  }
                )}
              </div>

              {/* Account Search */}
              <div className="relative  xl:max-w-sm">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  value={searchAccount}
                  onChange={(e) =>
                    setSearchAccount(e.target.value)
                  }
                  placeholder="Search account number..."
                  className="w-full rounded-xl border border-[#003049] bg-gray-50 py-3 pl-11 pr-11 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-[#1762AE] focus:bg-white focus:ring-4 focus:ring-blue-50"
                />

                {searchAccount && (
                  <button
                    type="button"
                    onClick={() => setSearchAccount("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-red-500"
                    aria-label="Clear search"
                  >
                    <X size={17} />
                  </button>
                )}
              </div>
            </div>

            {/* Result Count */}
            <div className="mt-5 flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs text-gray-500">
                Showing{" "}
                <span className="font-bold text-[#003566]">
                  {filteredTransactions.length}
                </span>{" "}
                of{" "}
                <span className="font-bold text-[#003566]">
                  {transactions.length}
                </span>{" "}
                transactions
              </p>

              {(activeFilter !== "All" ||
                searchAccount) && (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveFilter("All");
                      setSearchAccount("");
                    }}
                    className="text-xs font-semibold text-[#1762AE] hover:underline"
                  >
                    Clear filters
                  </button>
                )}
            </div>
          </div>

          {/* Loading */}
          {loading ? (
            <div className="flex min-h-64 flex-col items-center justify-center gap-3 p-6 text-center">
              <Loader2
                className="animate-spin text-[#1762AE]"
                size={32}
              />

              <p className="text-sm text-gray-500">
                Loading records from the database...
              </p>
            </div>
          ) : error ? (
            /* Error */
            <div className="flex min-h-64 flex-col items-center justify-center p-6 text-center">
              <AlertCircle
                className="text-red-500"
                size={34}
              />

              <p className="mt-3 font-semibold text-gray-800">
                Unable to load transaction history
              </p>

              <p className="mt-1 max-w-lg text-sm text-gray-500">
                {error}
              </p>

              <button
                type="button"
                onClick={() =>
                  setRefreshKey((key) => key + 1)
                }
                className="mt-4 rounded-lg bg-[#003566] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1762AE]"
              >
                Try again
              </button>
            </div>
          ) : filteredTransactions.length === 0 ? (
            /* Empty State */
            <div className="flex min-h-64 flex-col items-center justify-center p-6 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
                <ReceiptText size={26} />
              </div>

              <h3 className="mt-4 font-bold text-gray-800">
                No Transactions Found
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                No records match your selected filter or account number.
              </p>

              <button
                type="button"
                onClick={() => {
                  setActiveFilter("All");
                  setSearchAccount("");
                }}
                className="mt-4 text-sm font-semibold text-[#1762AE] hover:underline"
              >
                Show all transactions
              </button>
            </div>
          ) : (
            /* Transaction Table */
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px] text-left text-sm">

                <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-5 py-4 font-semibold sm:px-7">
                      Type
                    </th>

                    <th className="px-5 py-4 font-semibold">
                      Customer
                    </th>

                    <th className="px-5 py-4 font-semibold">
                      Details
                    </th>

                    <th className="px-5 py-4 font-semibold">
                      Account Number
                    </th>

                    <th className="px-5 py-4 text-right font-semibold">
                      Amount
                    </th>

                    <th className="px-5 py-4 font-semibold">
                      Status
                    </th>

                    <th className="px-5 py-4 font-semibold">
                      Date
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredTransactions.map(
                    (transaction) => {
                      const Icon =
                        transaction.kind === "Deposit"
                          ? ArrowDownToLine
                          : transaction.kind === "Withdrawal"
                            ? ArrowUpFromLine
                            : transaction.kind === "Loan"
                              ? HandCoins
                              : ArrowLeftRight;

                      const iconColor =
                        transaction.kind === "Deposit"
                          ? "bg-green-50 text-green-600"
                          : transaction.kind === "Withdrawal"
                            ? "bg-orange-50 text-orange-600"
                            : transaction.kind === "Loan"
                              ? "bg-purple-50 text-purple-600"
                              : "bg-blue-50 text-blue-600";

                      return (
                        <tr
                          key={`${transaction.kind}-${transaction.id}`}
                          className="transition hover:bg-gray-50/70"
                        >
                          <td className="whitespace-nowrap px-5 py-4 sm:px-7">
                            <span className="flex items-center gap-2 font-semibold text-gray-800">
                              <span
                                className={`flex h-8 w-8 items-center justify-center rounded-lg ${iconColor}`}
                              >
                                <Icon size={16} />
                              </span>

                              {transaction.kind === "Withdrawal"
                                ? "Withdraw"
                                : transaction.kind}
                            </span>
                          </td>

                          <td
                            className="max-w-56 truncate px-5 py-4 text-gray-700"
                            title={transaction.customer}
                          >
                            {transaction.customer}
                          </td>

                          <td className="px-5 py-4 text-gray-600">
                            {transaction.detail}
                          </td>

                          <td className="px-5 py-4 font-medium text-gray-600">
                            {transaction.account}
                          </td>

                          <td className="whitespace-nowrap px-5 py-4 text-right font-semibold text-[#003566]">
                            {formatAmount(
                              transaction.amount,
                              transaction.currency
                            )}
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusClassName(
                                transaction.status
                              )}`}
                            >
                              {transaction.status}
                            </span>
                          </td>

                          <td className="whitespace-nowrap px-5 py-4 text-gray-600">
                            {formatDate(transaction.date)}
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
