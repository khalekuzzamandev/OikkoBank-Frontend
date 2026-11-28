"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Banknote,
  Building2,
  CheckCircle2,
  Clock3,
  CreditCard,
  ShieldCheck,
  Users,
  UserRoundCheck,
  UserRoundPlus,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import getAllUser from "@/components/lib/Apis/users/users";
import { getCustomerBankAccounts } from "@/components/lib/Apis/accounts/account";

interface UserRecord {
  _id?: string;
  id?: string;
  name?: string;
  email?: string;
  role?: string;
  status?: string;
}

interface AccountRecord {
  _id?: string;
  id?: string;
  accountName?: string;
  accountNumber?: string;
  accountType?: string;
  userEmail?: string;
  currency?: string;
  balance?: number | string;
  status?: string;
}

interface DataState<T> {
  records: T[];
  error: string | null;
}

function extractRecords<T>(
  payload: unknown,
  collection: "users" | "accounts"
): T[] {
  if (Array.isArray(payload)) {
    return payload as T[];
  }

  if (!payload || typeof payload !== "object") {
    throw new Error(`Unexpected ${collection} response.`);
  }

  const response = payload as Record<string, unknown>;

  if (response.success === false) {
    throw new Error(
      typeof response.message === "string"
        ? response.message
        : `Failed to load ${collection}.`
    );
  }

  const candidates = [response[collection], response.data];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate as T[];
    }

    if (candidate && typeof candidate === "object") {
      const nested = candidate as Record<string, unknown>;
      const nestedRecords = nested[collection];

      if (Array.isArray(nestedRecords)) {
        return nestedRecords as T[];
      }
    }
  }

  throw new Error(`Unexpected ${collection} response.`);
}

function resolveData<T>(
  result: PromiseSettledResult<unknown>,
  collection: "users" | "accounts"
): DataState<T> {
  if (result.status === "rejected") {
    return {
      records: [],
      error:
        result.reason instanceof Error
          ? result.reason.message
          : `Failed to load ${collection}.`,
    };
  }

  try {
    return { records: extractRecords<T>(result.value, collection), error: null };
  } catch (error) {
    return {
      records: [],
      error:
        error instanceof Error
          ? error.message
          : `Failed to load ${collection}.`,
    };
  }
}

function countStatus<T extends { status?: string }>(
  records: T[],
  status: string
) {
  return records.filter(
    (record) => record.status?.toLowerCase() === status
  ).length;
}

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  tone,
  href,
}: {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
  tone: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
            {value}
          </p>
        </div>
        <span className={`rounded-xl p-3 ${tone}`}>
          <Icon size={21} />
        </span>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <p className="text-xs text-slate-500">{description}</p>
        <ArrowUpRight
          size={16}
          className="text-slate-300 transition group-hover:text-[#075985]"
        />
      </div>
    </Link>
  );
}

function StatusOverview({
  title,
  description,
  total,
  active,
  pending,
  icon: Icon,
  loading,
  error,
}: {
  title: string;
  description: string;
  total: number;
  active: number;
  pending: number;
  icon: LucideIcon;
  loading: boolean;
  error: string | null;
}) {
  const other = Math.max(total - active - pending, 0);
  const activeWidth = total ? (active / total) * 100 : 0;
  const pendingWidth = total ? (pending / total) * 100 : 0;
  const otherWidth = total ? (other / total) * 100 : 0;

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-start gap-3">
        <span className="rounded-xl bg-sky-50 p-2.5 text-sky-700">
          <Icon size={20} />
        </span>
        <div>
          <h2 className="font-semibold text-slate-900">{title}</h2>
          <p className="mt-1 text-xs text-slate-500">{description}</p>
        </div>
      </div>

      {error ? (
        <p className="mt-5 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {error}
        </p>
      ) : (
        <>
          <div className="mt-6 flex items-end justify-between">
            <p className="text-3xl font-bold text-slate-900">
              {loading ? "—" : total.toLocaleString()}
            </p>
            <p className="text-xs text-slate-500">total records</p>
          </div>

          <div className="mt-4 flex h-2 overflow-hidden rounded-full bg-slate-100">
            <span
              className="bg-emerald-500 transition-all"
              style={{ width: `${activeWidth}%` }}
            />
            <span
              className="bg-amber-400 transition-all"
              style={{ width: `${pendingWidth}%` }}
            />
            <span
              className="bg-slate-300 transition-all"
              style={{ width: `${otherWidth}%` }}
            />
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
            <div>
              <p className="flex items-center gap-1.5 text-slate-500">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Active
              </p>
              <p className="mt-1 font-semibold text-slate-800">
                {loading ? "—" : active.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="flex items-center gap-1.5 text-slate-500">
                <span className="h-2 w-2 rounded-full bg-amber-400" />
                Pending
              </p>
              <p className="mt-1 font-semibold text-slate-800">
                {loading ? "—" : pending.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="flex items-center gap-1.5 text-slate-500">
                <span className="h-2 w-2 rounded-full bg-slate-300" />
                Other
              </p>
              <p className="mt-1 font-semibold text-slate-800">
                {loading ? "—" : other.toLocaleString()}
              </p>
            </div>
          </div>
        </>
      )}
    </section>
  );
}

export default function StaffOverviewPage() {
  const [usersState, setUsersState] = useState<DataState<UserRecord>>({
    records: [],
    error: null,
  });
  const [accountsState, setAccountsState] = useState<
    DataState<AccountRecord>
  >({ records: [], error: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadOverview = async () => {
      const usersRequest: Promise<unknown> = getAllUser();
      const accountsRequest: Promise<unknown> = getCustomerBankAccounts();
      const [usersResult, accountsResult] = await Promise.allSettled([
        usersRequest,
        accountsRequest,
      ]);

      if (!isMounted) return;

      setUsersState(resolveData<UserRecord>(usersResult, "users"));
      setAccountsState(resolveData<AccountRecord>(accountsResult, "accounts"));
      setLoading(false);
    };

    void loadOverview();

    return () => {
      isMounted = false;
    };
  }, []);

  const users = usersState.records;
  const accounts = accountsState.records;
  const customers = users.filter(
    (user) => user.role?.toLowerCase() === "customer"
  );
  const activeCustomers = countStatus(customers, "active");
  const pendingCustomers = countStatus(customers, "pending");
  const activeAccounts = countStatus(accounts, "active");
  const pendingAccounts = countStatus(accounts, "pending");

  const stats = [
    {
      title: "All Users",
      value: loading ? "—" : usersState.error ? "!" : users.length.toLocaleString(),
      description: "Every registered profile",
      icon: Users,
      tone: "bg-sky-50 text-sky-700",
      href: "/dashboard/staff/customers",
    },
    {
      title: "Customers",
      value: loading ? "—" : usersState.error ? "!" : customers.length.toLocaleString(),
      description: "Customer profiles",
      icon: UserRoundPlus,
      tone: "bg-indigo-50 text-indigo-700",
      href: "/dashboard/staff/customers",
    },
    {
      title: "Active Customers",
      value: loading ? "—" : usersState.error ? "!" : activeCustomers.toLocaleString(),
      description: "Approved and active",
      icon: UserRoundCheck,
      tone: "bg-emerald-50 text-emerald-700",
      href: "/dashboard/staff/customers",
    },
    {
      title: "Pending Approvals",
      value: loading ? "—" : usersState.error ? "!" : pendingCustomers.toLocaleString(),
      description: "Awaiting review",
      icon: Clock3,
      tone: "bg-amber-50 text-amber-700",
      href: "/dashboard/staff/customers",
    },
    {
      title: "All Accounts",
      value: loading ? "—" : accountsState.error ? "!" : accounts.length.toLocaleString(),
      description: "Bank accounts",
      icon: CreditCard,
      tone: "bg-violet-50 text-violet-700",
      href: "/dashboard/staff/accounts",
    },
    {
      title: "Active Accounts",
      value: loading ? "—" : accountsState.error ? "!" : activeAccounts.toLocaleString(),
      description: "Ready for use",
      icon: CheckCircle2,
      tone: "bg-teal-50 text-teal-700",
      href: "/dashboard/staff/accounts",
    },
  ];

  return (
    <div className="min-h-full bg-[#f3f6fb] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#003566] via-[#075985] to-[#0e7490] p-6 text-white shadow-lg sm:p-8">
          <div className="absolute -right-10 -top-20 h-64 w-64 rounded-full border-[35px] border-white/5" />
          <div className="absolute -bottom-28 right-40 h-56 w-56 rounded-full bg-cyan-300/10 blur-2xl" />
          <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-cyan-50">
                <ShieldCheck size={15} />
                Staff workspace
              </div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Operations overview
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-blue-100">
                A clear snapshot of your customers, approvals, and bank
                accounts.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/dashboard/staff/customers"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-[#003566] transition hover:bg-blue-50"
              >
                <Users size={17} />
                Customers
                <ArrowUpRight size={15} />
              </Link>
              <Link
                href="/dashboard/staff/accounts"
                className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/15"
              >
                <Building2 size={17} />
                Accounts
                <ArrowUpRight size={15} />
              </Link>
            </div>
          </div>
        </header>

        <section
          aria-label="Banking statistics"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
        >
          {stats.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </section>

        <section className="grid gap-5 lg:grid-cols-2">
          <StatusOverview
            title="Customer status"
            description="Customer approval and activation summary"
            total={customers.length}
            active={activeCustomers}
            pending={pendingCustomers}
            icon={Users}
            loading={loading}
            error={usersState.error}
          />
          <StatusOverview
            title="Account status"
            description="Overview of all customer bank accounts"
            total={accounts.length}
            active={activeAccounts}
            pending={pendingAccounts}
            icon={Banknote}
            loading={loading}
            error={accountsState.error}
          />
        </section>

      </div>
    </div>
  );
}
