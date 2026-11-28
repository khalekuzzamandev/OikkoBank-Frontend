"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Banknote,
  Building2,
  CircleDollarSign,
  Loader2,
  RefreshCw,
  UserRound,
  Users,
  Wallet,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { getCustomerBankAccounts } from "@/components/lib/Apis/accounts/account";
import { getAllDeposits } from "@/components/lib/Apis/deposits/deposits";
import getAllUser from "@/components/lib/Apis/users/users";
import { getAllWithdraws } from "@/components/lib/Apis/withdrawals/withdrawals";

type DataRecord = Record<string, unknown>;

type AnalyticsData = {
  accounts: DataRecord[];
  deposits: DataRecord[];
  users: DataRecord[];
  withdrawals: DataRecord[];
};

const EMPTY_DATA: AnalyticsData = {
  accounts: [],
  deposits: [],
  users: [],
  withdrawals: [],
};

const CHART_COLORS = ["#1762AE", "#13A882", "#F5A524", "#875BF7", "#F04438"];
const COMPLETED_STATUSES = new Set([
  "approved",
  "complete",
  "completed",
  "paid",
  "success",
  "successful",
]);

const asRecord = (value: unknown): DataRecord | null =>
  value && typeof value === "object" && !Array.isArray(value)
    ? (value as DataRecord)
    : null;

const extractRecords = (
  payload: unknown,
  label: string,
  collectionKeys: string[],
  recordKey: string,
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
        : `Failed to fetch ${label}.`
    );
  }

  for (const key of ["data", "items", "results", ...collectionKeys]) {
    const candidate = response[key];
    if (candidate === undefined) continue;

    if (Array.isArray(candidate)) {
      return extractRecords(candidate, label, collectionKeys, recordKey, depth + 1);
    }

    if (asRecord(candidate)) {
      return extractRecords(candidate, label, collectionKeys, recordKey, depth + 1);
    }
  }

  if (recordKey in response) {
    return [response];
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

const getAmount = (record: DataRecord, ...keys: string[]): number => {
  for (const key of keys) {
    const value = record[key];
    if (value === undefined || value === null || value === "") continue;

    const amount = Number(value);
    if (Number.isFinite(amount)) return amount;
  }
  return 0;
};

const isCompleted = (record: DataRecord): boolean =>
  COMPLETED_STATUSES.has(
    getString(record, "transactionStatus", "status").toLowerCase()
  );

const getTransactionDate = (record: DataRecord): Date | null => {
  const value = getString(
    record,
    "transactionDate",
    "createdAt",
    "updatedAt"
  );
  if (!value) return null;

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const formatMoney = (amount: number): string =>
  `৳${amount.toLocaleString("en-BD", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;

const formatAxisMoney = (value: number): string =>
  `৳${new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value)}`;

function AdminAnalyticsContent() {
  const [data, setData] = useState<AnalyticsData>(EMPTY_DATA);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let active = true;

    const loadAnalytics = async () => {
      setLoading(true);
      setError("");

      try {
        const [accountsPayload, depositsPayload, usersPayload, withdrawalsPayload] =
          await Promise.all([
            getCustomerBankAccounts(),
            getAllDeposits(),
            getAllUser(),
            getAllWithdraws(),
          ]);

        const nextData: AnalyticsData = {
          accounts: extractRecords(
            accountsPayload,
            "accounts",
            ["accounts"],
            "accountNumber"
          ),
          deposits: extractRecords(
            depositsPayload,
            "deposits",
            ["deposits", "transactions"],
            "depositAmount"
          ),
          users: extractRecords(
            usersPayload,
            "users",
            ["users"],
            "role"
          ),
          withdrawals: extractRecords(
            withdrawalsPayload,
            "withdrawals",
            ["withdrawals", "transactions"],
            "withdrawalAmount"
          ),
        };

        if (active) setData(nextData);
      } catch (loadError) {
        if (active) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load analytics."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadAnalytics();
    return () => {
      active = false;
    };
  }, [refreshKey]);

  const completedDeposits = useMemo(
    () => data.deposits.filter(isCompleted),
    [data.deposits]
  );
  const completedWithdrawals = useMemo(
    () => data.withdrawals.filter(isCompleted),
    [data.withdrawals]
  );

  const customers = data.users.filter(
    (user) => getString(user, "role").toLowerCase() === "customer"
  );
  const staff = data.users.filter(
    (user) => getString(user, "role").toLowerCase() === "staff"
  );

  const totalBalance = data.accounts.reduce(
    (total, account) => total + getAmount(account, "balance", "currentBalance"),
    0
  );
  const depositRevenue = completedDeposits.reduce(
    (total, deposit) =>
      total + getAmount(deposit, "depositAmount", "amount"),
    0
  );
  const withdrawnAmount = completedWithdrawals.reduce(
    (total, withdrawal) =>
      total + getAmount(withdrawal, "withdrawalAmount", "amount"),
    0
  );

  const monthlyData = useMemo(() => {
    const now = new Date();
    const months = Array.from({ length: 6 }, (_, index) => {
      const date = new Date(now.getFullYear(), now.getMonth() - 5 + index, 1);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      return {
        key,
        month: date.toLocaleDateString("en", { month: "short" }),
        deposits: 0,
        withdrawals: 0,
      };
    });
    const monthByKey = new Map(months.map((month) => [month.key, month]));

    for (const deposit of completedDeposits) {
      const date = getTransactionDate(deposit);
      if (!date) continue;
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      const month = monthByKey.get(key);
      if (month) {
        month.deposits += getAmount(deposit, "depositAmount", "amount");
      }
    }

    for (const withdrawal of completedWithdrawals) {
      const date = getTransactionDate(withdrawal);
      if (!date) continue;
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      const month = monthByKey.get(key);
      if (month) {
        month.withdrawals += getAmount(
          withdrawal,
          "withdrawalAmount",
          "amount"
        );
      }
    }

    return months;
  }, [completedDeposits, completedWithdrawals]);

  const accountTypeData = useMemo(() => {
    const counts = new Map<string, number>();
    for (const account of data.accounts) {
      const type = getString(account, "accountType") || "Other";
      counts.set(type, (counts.get(type) ?? 0) + 1);
    }

    return Array.from(counts, ([name, value]) => ({ name, value }));
  }, [data.accounts]);

  const stats = [
    {
      title: "Total Accounts",
      value: data.accounts.length.toLocaleString(),
      detail: "Registered bank accounts",
      icon: Building2,
      color: "bg-blue-50 text-blue-700",
    },
    {
      title: "Account Balance",
      value: formatMoney(totalBalance),
      detail: "Total money held in accounts",
      icon: Wallet,
      color: "bg-indigo-50 text-indigo-700",
    },
    {
      title: "Deposit Revenue",
      value: formatMoney(depositRevenue),
      detail: `${completedDeposits.length.toLocaleString()} completed deposits`,
      icon: CircleDollarSign,
      color: "bg-emerald-50 text-emerald-700",
    },
    {
      title: "Total Withdrawn",
      value: formatMoney(withdrawnAmount),
      detail: `${completedWithdrawals.length.toLocaleString()} completed withdrawals`,
      icon: ArrowUpFromLine,
      color: "bg-rose-50 text-rose-700",
    },
    {
      title: "Deposit Requests",
      value: data.deposits.length.toLocaleString(),
      detail: "All deposit transactions",
      icon: ArrowDownToLine,
      color: "bg-teal-50 text-teal-700",
    },
    {
      title: "Withdrawal Requests",
      value: data.withdrawals.length.toLocaleString(),
      detail: "All withdrawal transactions",
      icon: Banknote,
      color: "bg-orange-50 text-orange-700",
    },
    {
      title: "Customers",
      value: customers.length.toLocaleString(),
      detail: "Registered customer accounts",
      icon: Users,
      color: "bg-violet-50 text-violet-700",
    },
    {
      title: "Staff",
      value: staff.length.toLocaleString(),
      detail: "Registered staff members",
      icon: UserRound,
      color: "bg-cyan-50 text-cyan-700",
    },
  ];

  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 p-4 pb-8 sm:p-6 lg:p-8">
      <header className="flex flex-col gap-4 rounded-2xl bg-gradient-to-r from-[#003566] to-[#07549a] p-5 text-white shadow-md sm:flex-row sm:items-center sm:justify-between sm:p-7">
        <div>
          <p className="text-sm font-medium text-blue-100">Admin Workspace</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
            Banking Analytics
          </h1>
          <p className="mt-1 text-sm text-blue-100/80">
            Account balances, transaction activity, customers, and staff.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setRefreshKey((key) => key + 1)}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-white/25 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-60 sm:self-center"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </header>

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

      {loading && data.accounts.length === 0 && !error ? (
        <div className="flex min-h-64 items-center justify-center rounded-2xl border border-slate-200 bg-white">
          <div className="flex items-center gap-3 text-slate-600">
            <Loader2 size={22} className="animate-spin text-[#1762AE]" />
            <span className="text-sm font-medium">Loading analytics...</span>
          </div>
        </div>
      ) : (
        <>
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <article
                  key={stat.title}
                  className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-500">
                        {stat.title}
                      </p>
                      <p className="mt-2 break-words text-2xl font-bold tracking-tight text-slate-900">
                        {stat.value}
                      </p>
                    </div>
                    <div className={`shrink-0 rounded-xl p-3 ${stat.color}`}>
                      <Icon size={20} />
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-slate-500">{stat.detail}</p>
                </article>
              );
            })}
          </section>

          <section className="grid grid-cols-1 gap-5 xl:grid-cols-3">
            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2">
              <div className="mb-5">
                <h2 className="font-bold text-slate-900">
                  Deposit &amp; Withdrawal Volume
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Completed transactions over the last six months
                </p>
              </div>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={monthlyData}
                    margin={{ top: 8, right: 12, left: 8, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="depositFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#13A882" stopOpacity={0.22} />
                        <stop offset="95%" stopColor="#13A882" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient
                        id="withdrawalFill"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop offset="5%" stopColor="#F04438" stopOpacity={0.18} />
                        <stop offset="95%" stopColor="#F04438" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="#E8EEF5" strokeDasharray="3 3" />
                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: "#64748B", fontSize: 12 }}
                    />
                    <YAxis
                      tickFormatter={formatAxisMoney}
                      tickLine={false}
                      axisLine={false}
                      width={58}
                      tick={{ fill: "#64748B", fontSize: 11 }}
                    />
                    <Tooltip
                      formatter={(value) => formatMoney(Number(value ?? 0))}
                      contentStyle={{
                        borderRadius: 12,
                        border: "1px solid #E2E8F0",
                      }}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="deposits"
                      name="Deposits"
                      stroke="#13A882"
                      strokeWidth={2.5}
                      fill="url(#depositFill)"
                    />
                    <Area
                      type="monotone"
                      dataKey="withdrawals"
                      name="Withdrawals"
                      stroke="#F04438"
                      strokeWidth={2.5}
                      fill="url(#withdrawalFill)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-2">
                <h2 className="font-bold text-slate-900">Account Types</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Distribution of registered accounts
                </p>
              </div>
              {accountTypeData.length === 0 ? (
                <div className="flex h-72 items-center justify-center text-sm text-slate-500">
                  No account data available.
                </div>
              ) : (
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={accountTypeData}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={58}
                        outerRadius={92}
                        paddingAngle={3}
                      >
                        {accountTypeData.map((entry, index) => (
                          <Cell
                            key={entry.name}
                            fill={CHART_COLORS[index % CHART_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </article>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5">
              <h2 className="font-bold text-slate-900">People Overview</h2>
              <p className="mt-1 text-sm text-slate-500">
                Customer and staff account totals
              </p>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { name: "Customers", total: customers.length },
                    { name: "Staff", total: staff.length },
                  ]}
                  margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
                >
                  <CartesianGrid stroke="#E8EEF5" strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#64748B", fontSize: 12 }}
                  />
                  <YAxis
                    allowDecimals={false}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#64748B", fontSize: 12 }}
                  />
                  <Tooltip />
                  <Bar
                    dataKey="total"
                    name="People"
                    fill="#1762AE"
                    radius={[8, 8, 0, 0]}
                    maxBarSize={72}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
        </>
      )}
    </main>
  );
}

export default function AdminAnalytics() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-64 items-center justify-center">
          <div className="flex items-center gap-3 text-slate-600">
            <Loader2 size={22} className="animate-spin text-[#1762AE]" />
            <span className="text-sm font-medium">
              Loading analytics...
            </span>
          </div>
        </main>
      }
    >
      <AdminAnalyticsContent />
    </Suspense>
  );
}
