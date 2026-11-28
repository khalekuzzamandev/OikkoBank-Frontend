"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowDownToLine,
  ArrowLeftRight,
  ArrowUpFromLine,
  Clock3,
  Loader2,
  RefreshCw,
  Search,
  ShieldAlert,
  ShieldCheck,
  Wallet,
} from "lucide-react";

import { getAllDeposits } from "@/components/lib/Apis/deposits/deposits";
import { getAllLoans } from "@/components/lib/Apis/loan/loan";
import { getAllTransfers } from "@/components/lib/Apis/transfer/transfer";
import { getAllWithdraws } from "@/components/lib/Apis/withdrawals/withdrawals";

type DataRecord = Record<string, unknown>;
type ActivityKind = "Deposit" | "Withdrawal" | "Transfer" | "Loan";
type PriorityFilter = "all" | "priority" | "review";
type KindFilter = "all" | ActivityKind;

type Activity = {
  id: string;
  kind: ActivityKind;
  customer: string;
  customerKey: string;
  account: string;
  amount: number | null;
  currency: string;
  status: string;
  timestamp: number | null;
};

type FlaggedActivity = Activity & {
  reasons: string[];
  priority: "Priority review" | "Review";
};

const HIGH_VALUE_THRESHOLD = 100_000;
const PENDING_AGE_MS = 24 * 60 * 60 * 1000;
const FAILURE_WINDOW_MS = 24 * 60 * 60 * 1000;
const BURST_WINDOW_MS = 10 * 60 * 1000;

const asRecord = (value: unknown): DataRecord | null =>
  value && typeof value === "object" && !Array.isArray(value)
    ? (value as DataRecord)
    : null;

const extractRecords = (
  payload: unknown,
  label: string,
  depth = 0
): DataRecord[] => {
  if (depth > 5) {
    throw new Error(`The ${label} API response is nested too deeply.`);
  }
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

  for (const key of ["data", "items", "results", label, "transactions"]) {
    const candidate = response[key];
    if (candidate === undefined) continue;
    if (Array.isArray(candidate) || asRecord(candidate)) {
      return extractRecords(candidate, label, depth + 1);
    }
  }

  throw new Error(`The ${label} API returned an unexpected response.`);
};

const getString = (record: DataRecord, ...keys: string[]): string => {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof value === "number") return String(value);
  }
  return "";
};

const getAmount = (record: DataRecord, ...keys: string[]): number | null => {
  for (const key of keys) {
    const value = record[key];
    if (value === undefined || value === null || value === "") continue;
    const amount = Number(value);
    if (Number.isFinite(amount)) return amount;
  }
  return null;
};

const toActivity = (
  record: DataRecord,
  kind: ActivityKind,
  index: number
): Activity => {
  const rawId = getString(
    record,
    "_id",
    "id",
    "transactionId",
    "applicationId"
  );
  const customerEmail = getString(
    record,
    "userEmail",
    "senderEmail",
    "customerEmail",
    "email"
  );
  const userId = getString(record, "userId", "senderUserId", "customerId");
  const timestampValue = getString(
    record,
    "transactionDate",
    "applicationDate",
    "createdAt",
    "updatedAt"
  );
  const parsedDate = timestampValue
    ? new Date(timestampValue).getTime()
    : Number.NaN;

  const senderAccount = getString(
    record,
    "senderAccountNumber",
    "fromAccountNumber",
    "accountNumber"
  );
  const receiverAccount = getString(
    record,
    "receiverAccountNumber",
    "toAccountNumber",
    "recipientAccountNumber"
  );

  let amountKeys: string[];
  switch (kind) {
    case "Deposit":
      amountKeys = ["depositAmount", "amount"];
      break;
    case "Withdrawal":
      amountKeys = ["withdrawalAmount", "amount"];
      break;
    case "Transfer":
      amountKeys = ["transferAmount", "amount"];
      break;
    case "Loan":
      amountKeys = ["loanAmount", "amount", "requestedAmount"];
      break;
  }

  return {
    id: `${kind.toLowerCase()}-${rawId || index}`,
    kind,
    customer:
      customerEmail ||
      getString(record, "customerName", "senderName", "accountName") ||
      (userId ? `User ${userId}` : "Customer unavailable"),
    customerKey: (userId || customerEmail).toLowerCase(),
    account:
      kind === "Transfer" && senderAccount && receiverAccount
        ? `${senderAccount} → ${receiverAccount}`
        : senderAccount || receiverAccount || "Account unavailable",
    amount: getAmount(record, ...amountKeys),
    currency: getString(record, "currency") || "BDT",
    status:
      getString(record, "transactionStatus", "status") || "Unknown",
    timestamp: Number.isNaN(parsedDate) ? null : parsedDate,
  };
};

const analyzeActivities = (
  activities: Activity[],
  highValueThreshold: number,
  now: number
): FlaggedActivity[] => {
  const reasons = new Map<string, Set<string>>();

  const addReason = (activity: Activity, reason: string) => {
    const activityReasons = reasons.get(activity.id) ?? new Set<string>();
    activityReasons.add(reason);
    reasons.set(activity.id, activityReasons);
  };

  for (const activity of activities) {
    if (
      activity.currency.toUpperCase() === "BDT" &&
      activity.amount !== null &&
      activity.amount >= highValueThreshold
    ) {
      addReason(
        activity,
        `Amount meets the BDT ${highValueThreshold.toLocaleString("en-BD")} review threshold`
      );
    }

    if (
      activity.status.toLowerCase() === "pending" &&
      activity.timestamp !== null &&
      now - activity.timestamp > PENDING_AGE_MS
    ) {
      addReason(activity, "Pending for more than 24 hours");
    }
  }

  const recentFailures = new Map<string, Activity[]>();
  const recentActivity = new Map<string, Activity[]>();

  for (const activity of activities) {
    if (!activity.customerKey || activity.timestamp === null) continue;
    if (activity.timestamp >= now - FAILURE_WINDOW_MS && activity.status.toLowerCase() === "failed") {
      const failures = recentFailures.get(activity.customerKey) ?? [];
      failures.push(activity);
      recentFailures.set(activity.customerKey, failures);
    }
    if (activity.timestamp >= now - BURST_WINDOW_MS) {
      const recent = recentActivity.get(activity.customerKey) ?? [];
      recent.push(activity);
      recentActivity.set(activity.customerKey, recent);
    }
  }

  for (const failures of recentFailures.values()) {
    if (failures.length >= 3) {
      for (const activity of failures) {
        addReason(activity, "3 or more failed transactions for this customer in 24 hours");
      }
    }
  }

  for (const recent of recentActivity.values()) {
    if (recent.length >= 5) {
      for (const activity of recent) {
        addReason(activity, "5 or more transactions for this customer in 10 minutes");
      }
    }
  }

  return activities
    .flatMap((activity) => {
      const activityReasons = Array.from(reasons.get(activity.id) ?? []);
      if (activityReasons.length === 0) return [];

      const highPriority = activityReasons.some(
        (reason) =>
          reason.startsWith("3 or more") || reason.startsWith("5 or more")
      );

      return [
        {
          ...activity,
          reasons: activityReasons,
          priority: highPriority
            ? ("Priority review" as const)
            : ("Review" as const),
        },
      ];
    })
    .sort((first, second) => (second.timestamp ?? 0) - (first.timestamp ?? 0));
};

const formatMoney = (amount: number | null, currency: string) => {
  if (amount === null) return "—";
  return `${currency} ${amount.toLocaleString("en-BD", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
};

const formatDate = (timestamp: number | null) => {
  if (timestamp === null) return "Date unavailable";
  return new Date(timestamp).toLocaleString("en-BD", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

export default function SuspiciousActivities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [checkedAt, setCheckedAt] = useState(0);
  const [thresholdInput, setThresholdInput] = useState(
    String(HIGH_VALUE_THRESHOLD)
  );
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("all");
  const [kindFilter, setKindFilter] = useState<KindFilter>("all");

  useEffect(() => {
    let active = true;

    const loadActivities = async () => {
      setLoading(true);
      setError("");

      try {
        const [depositsPayload, withdrawalsPayload, transfersPayload, loansPayload] =
          await Promise.all([
            getAllDeposits(),
            getAllWithdraws(),
            getAllTransfers(),
            getAllLoans(),
          ]);

        const nextActivities = [
          ...extractRecords(depositsPayload, "deposits").map((record, index) =>
            toActivity(record, "Deposit", index)
          ),
          ...extractRecords(withdrawalsPayload, "withdrawals").map(
            (record, index) => toActivity(record, "Withdrawal", index)
          ),
          ...extractRecords(transfersPayload, "transfers").map((record, index) =>
            toActivity(record, "Transfer", index)
          ),
          ...extractRecords(loansPayload, "loans").map((record, index) =>
            toActivity(record, "Loan", index)
          ),
        ];

        if (active) {
          setActivities(nextActivities);
          setCheckedAt(Date.now());
        }
      } catch (loadError) {
        if (active) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load transaction activity."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadActivities();
    return () => {
      active = false;
    };
  }, [refreshKey]);

  const thresholdNumber = Number(thresholdInput);
  const highValueThreshold =
    Number.isFinite(thresholdNumber) && thresholdNumber > 0
      ? thresholdNumber
      : HIGH_VALUE_THRESHOLD;

  const flaggedActivities = useMemo(
    () => analyzeActivities(activities, highValueThreshold, checkedAt),
    [activities, highValueThreshold, checkedAt]
  );

  const visibleActivities = useMemo(() => {
    const query = search.trim().toLowerCase();

    return flaggedActivities.filter((activity) => {
      const matchesPriority =
        priorityFilter === "all" ||
        (priorityFilter === "priority" &&
          activity.priority === "Priority review") ||
        (priorityFilter === "review" && activity.priority === "Review");
      const matchesKind =
        kindFilter === "all" || activity.kind === kindFilter;
      const matchesSearch =
        !query ||
        [
          activity.customer,
          activity.account,
          activity.kind,
          activity.status,
          ...activity.reasons,
        ]
          .join(" ")
          .toLowerCase()
          .includes(query);

      return matchesPriority && matchesKind && matchesSearch;
    });
  }, [flaggedActivities, kindFilter, priorityFilter, search]);

  const priorityCount = flaggedActivities.filter(
    (activity) => activity.priority === "Priority review"
  ).length;
  const stalePendingCount = flaggedActivities.filter((activity) =>
    activity.reasons.some((reason) => reason.startsWith("Pending for"))
  ).length;
  const highValueCount = flaggedActivities.filter((activity) =>
    activity.reasons.some((reason) => reason.startsWith("Amount meets"))
  ).length;

  const statCards = [
    {
      title: "Flagged activities",
      value: flaggedActivities.length,
      detail: "Transactions needing a review",
      icon: ShieldAlert,
      color: "bg-amber-50 text-amber-700",
    },
    {
      title: "Priority review",
      value: priorityCount,
      detail: "Repeated failures or transaction bursts",
      icon: AlertTriangle,
      color: "bg-red-50 text-red-700",
    },
    {
      title: "Long-pending",
      value: stalePendingCount,
      detail: "Pending for more than 24 hours",
      icon: Clock3,
      color: "bg-orange-50 text-orange-700",
    },
    {
      title: "High-value",
      value: highValueCount,
      detail: "At or above the amount threshold",
      icon: Wallet,
      color: "bg-blue-50 text-blue-700",
    },
  ];

  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 p-4 pb-8 sm:p-6 lg:p-8">
      <header className="flex flex-col gap-4 rounded-2xl bg-gradient-to-r from-[#003566] to-[#07549a] p-5 text-white shadow-md sm:flex-row sm:items-center sm:justify-between sm:p-7">
        <div>
          <p className="text-sm font-medium text-blue-100">Admin Workspace</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
            Suspicious Activity Review
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-blue-100/80">
            Review rule-based transaction alerts across deposits, withdrawals,
            transfers, and loan applications.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setRefreshKey((key) => key + 1)}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-white/25 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-60 sm:self-center"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh activity
        </button>
      </header>

      <div
        role="note"
        className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"
      >
        <ShieldCheck size={19} className="mt-0.5 shrink-0" />
        <p>
          These are rule-based review signals, not proof of fraud. Verify each
          item using your bank&apos;s approved investigation process before
          taking action.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 sm:flex-row sm:items-center sm:justify-between"
        >
          <p>{error}</p>
          <button
            type="button"
            onClick={() => setRefreshKey((key) => key + 1)}
            className="font-semibold underline underline-offset-2"
          >
            Try again
          </button>
        </div>
      )}

      {loading && activities.length === 0 && !error ? (
        <div className="flex min-h-64 items-center justify-center rounded-2xl border border-slate-200 bg-white">
          <div className="flex items-center gap-3 text-slate-600">
            <Loader2 size={22} className="animate-spin text-[#1762AE]" />
            <span className="text-sm font-medium">
              Checking recent activity...
            </span>
          </div>
        </div>
      ) : (
        <>
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {statCards.map((card) => {
              const Icon = card.icon;
              return (
                <article
                  key={card.title}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-slate-500">
                        {card.title}
                      </p>
                      <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                        {card.value.toLocaleString()}
                      </p>
                    </div>
                    <div className={`rounded-xl p-3 ${card.color}`}>
                      <Icon size={20} />
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-slate-500">{card.detail}</p>
                </article>
              );
            })}
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Activity review queue
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {checkedAt
                    ? `Last checked ${new Date(checkedAt).toLocaleString("en-BD", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}`
                    : "Waiting for activity data"}
                </p>
              </div>

              <label className="block w-full text-sm font-medium text-slate-700 lg:max-w-xs">
                Large-amount review threshold (BDT)
                <input
                  type="number"
                  min="1"
                  step="1000"
                  value={thresholdInput}
                  onChange={(event) => setThresholdInput(event.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#1762AE] focus:ring-4 focus:ring-[#1762AE]/10"
                />
              </label>
            </div>

            <div className="grid grid-cols-1 gap-3 py-5 md:grid-cols-2 xl:grid-cols-4">
              <label className="relative block md:col-span-2 xl:col-span-2">
                <span className="sr-only">Search flagged activity</span>
                <Search
                  size={17}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search customer, account, or reason..."
                  className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-[#1762AE] focus:ring-4 focus:ring-[#1762AE]/10"
                />
              </label>

              <label>
                <span className="sr-only">Filter by review priority</span>
                <select
                  value={priorityFilter}
                  onChange={(event) =>
                    setPriorityFilter(event.target.value as PriorityFilter)
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-[#1762AE] focus:ring-4 focus:ring-[#1762AE]/10"
                >
                  <option value="all">All review levels</option>
                  <option value="priority">Priority review</option>
                  <option value="review">Standard review</option>
                </select>
              </label>

              <label>
                <span className="sr-only">Filter by activity type</span>
                <select
                  value={kindFilter}
                  onChange={(event) =>
                    setKindFilter(event.target.value as KindFilter)
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-[#1762AE] focus:ring-4 focus:ring-[#1762AE]/10"
                >
                  <option value="all">All activity types</option>
                  <option value="Deposit">Deposits</option>
                  <option value="Withdrawal">Withdrawals</option>
                  <option value="Transfer">Transfers</option>
                  <option value="Loan">Loan applications</option>
                </select>
              </label>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                    <th className="px-3 py-3 font-semibold">Activity</th>
                    <th className="px-3 py-3 font-semibold">Customer</th>
                    <th className="px-3 py-3 font-semibold">Account</th>
                    <th className="px-3 py-3 font-semibold">Amount</th>
                    <th className="px-3 py-3 font-semibold">Status</th>
                    <th className="px-3 py-3 font-semibold">Review signals</th>
                    <th className="px-3 py-3 font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {visibleActivities.map((activity) => (
                    <tr key={activity.id} className="align-top hover:bg-slate-50/70">
                      <td className="px-3 py-4">
                        <div className="flex items-center gap-2 font-semibold text-slate-800">
                          <ActivityIcon kind={activity.kind} />
                          {activity.kind}
                        </div>
                        <span
                          className={`mt-1.5 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                            activity.priority === "Priority review"
                              ? "bg-red-50 text-red-700"
                              : "bg-amber-50 text-amber-800"
                          }`}
                        >
                          {activity.priority}
                        </span>
                      </td>
                      <td className="max-w-48 break-all px-3 py-4 text-sm text-slate-700">
                        {activity.customer}
                      </td>
                      <td className="max-w-48 break-all px-3 py-4 text-sm text-slate-600">
                        {activity.account}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm font-semibold text-slate-800">
                        {formatMoney(activity.amount, activity.currency)}
                      </td>
                      <td className="px-3 py-4">
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium capitalize text-slate-700">
                          {activity.status}
                        </span>
                      </td>
                      <td className="max-w-sm px-3 py-4">
                        <ul className="space-y-1.5">
                          {activity.reasons.map((reason) => (
                            <li
                              key={reason}
                              className="flex items-start gap-1.5 text-xs leading-5 text-slate-600"
                            >
                              <AlertTriangle
                                size={13}
                                className="mt-0.5 shrink-0 text-amber-600"
                              />
                              {reason}
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-600">
                        {formatDate(activity.timestamp)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {visibleActivities.length === 0 && (
                <div className="flex min-h-48 flex-col items-center justify-center px-4 text-center">
                  <ShieldCheck size={28} className="text-emerald-600" />
                  <p className="mt-3 font-semibold text-slate-800">
                    {flaggedActivities.length === 0
                      ? "No activities match the current review rules."
                      : "No activities match these filters."}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    This means no matching rule was triggered in the data
                    currently available.
                  </p>
                </div>
              )}
            </div>

            {loading && activities.length > 0 && (
              <p className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                <Loader2 size={14} className="animate-spin" />
                Updating activity...
              </p>
            )}
          </section>

          <p className="text-xs leading-5 text-slate-500">
            Rules: BDT amount meets the threshold above; pending status exceeds
            24 hours; at least 3 failed transactions for the same customer in
            24 hours; or at least 5 transactions for the same customer in 10
            minutes. Only BDT transactions are compared with the amount
            threshold. Signals are calculated from the transaction history
            returned by the connected APIs.
          </p>
        </>
      )}
    </main>
  );
}

function ActivityIcon({ kind }: { kind: ActivityKind }) {
  const Icon =
    kind === "Deposit"
      ? ArrowDownToLine
      : kind === "Withdrawal"
        ? ArrowUpFromLine
        : kind === "Transfer"
          ? ArrowLeftRight
          : Clock3;

  return <Icon size={16} className="shrink-0 text-[#1762AE]" />;
}
