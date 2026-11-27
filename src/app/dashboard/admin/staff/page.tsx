"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  Ban,
  CheckCircle2,
  Eye,
  Loader2,
  RefreshCw,
  Search,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import getAllUser, { editUser } from "@/components/lib/Apis/users/users";
import { getCustomerBankAccounts } from "@/components/lib/Apis/accounts/account";

type DataRecord = Record<string, unknown>;

type StaffMember = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  isBlocked: boolean;
  accountNumber: string;
  accountType: string;
  accountStatus: string;
  department: string;
  position: string;
  createdAt: string;
};

const asRecord = (value: unknown): DataRecord | null =>
  value && typeof value === "object" && !Array.isArray(value)
    ? (value as DataRecord)
    : null;

const getId = (value: unknown): string => {
  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }

  const record = asRecord(value);
  if (!record) return "";

  const id = record._id ?? record.id ?? record.$oid;
  return typeof id === "string" || typeof id === "number" ? String(id) : "";
};

const getString = (record: DataRecord, ...keys: string[]) => {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof value === "number") return String(value);
  }

  return "";
};

const extractRecords = (
  payload: unknown,
  collection: "users" | "accounts"
): DataRecord[] => {
  if (Array.isArray(payload)) {
    return payload.map((item) => {
      const record = asRecord(item);
      if (!record) {
        throw new Error(`The ${collection} API returned an invalid record.`);
      }
      return record;
    });
  }

  const response = asRecord(payload);
  if (!response) {
    throw new Error(`The ${collection} API returned an invalid response.`);
  }
  if (response.success === false) {
    throw new Error(
      typeof response.message === "string"
        ? response.message
        : `Failed to fetch ${collection}.`
    );
  }

  for (const key of [collection, "data", "items", "results"]) {
    const candidate = response[key];
    if (Array.isArray(candidate)) return extractRecords(candidate, collection);

    const nested = asRecord(candidate);
    if (nested) return extractRecords(nested, collection);
  }

  if (
    (collection === "users" && "role" in response) ||
    (collection === "accounts" && "accountNumber" in response)
  ) {
    return [response];
  }

  throw new Error(`The ${collection} API returned an unexpected response.`);
};

const normalizeStaff = (
  record: DataRecord,
  accounts: DataRecord[]
): StaffMember => {
  const id = getId(record._id ?? record.id ?? record.userId);
  const email = getString(record, "email");
  const linkedAccounts = accounts.filter((account) => {
    const accountUserId = getId(account.userId);
    return (
      (id && accountUserId === id) ||
      (!accountUserId &&
        email &&
        getString(account, "userEmail", "accountEmail").toLowerCase() ===
          email.toLowerCase())
    );
  });
  const account =
    linkedAccounts.find(
      (item) => getString(item, "status").toLowerCase() === "active"
    ) ?? linkedAccounts[0];

  return {
    id,
    name: getString(record, "name") || "Name unavailable",
    email: email || "Email unavailable",
    phone: getString(record, "phone", "mobile") || "—",
    role: getString(record, "role") || "Staff",
    status: getString(record, "status") || "Unknown",
    isBlocked:
      record.isBlocked === true ||
      (typeof record.isBlocked === "string" &&
        record.isBlocked.toLowerCase() === "true"),
    accountNumber:
      getString(account ?? {}, "accountNumber") ||
      getString(record, "accountNumber") ||
      "—",
    accountType: getString(account ?? {}, "accountType") || "—",
    accountStatus: getString(account ?? {}, "status") || "—",
    department: getString(record, "department") || "—",
    position: getString(record, "position", "designation", "jobTitle") || "—",
    createdAt: getString(record, "createdAt"),
  };
};

const formatDate = (value: string) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString("en-BD", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

export default function AllStaff() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");
  const [notice, setNotice] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const actionLock = useRef(false);

  useEffect(() => {
    let active = true;

    const loadStaff = async () => {
      setLoading(true);
      setLoadError("");

      try {
        const [usersPayload, accountsPayload]: [unknown, unknown] =
          await Promise.all([getAllUser(), getCustomerBankAccounts()]);
        const users = extractRecords(usersPayload, "users");
        const accounts = extractRecords(accountsPayload, "accounts");
        const staffList = users
          .filter(
            (user) =>
              getString(user, "role").toLowerCase() === "staff"
          )
          .map((user) => normalizeStaff(user, accounts));

        if (active) setStaff(staffList);
      } catch (error) {
        if (active) {
          setStaff([]);
          setLoadError(
            error instanceof Error ? error.message : "Unable to load staff."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    const timer = window.setTimeout(() => {
      void loadStaff();
    }, 0);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [refreshKey]);

  useEffect(() => {
    if (!selectedStaff) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && processingId === null) {
        setSelectedStaff(null);
      }
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [selectedStaff, processingId]);

  const filteredStaff = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return staff;

    return staff.filter((member) =>
      [
        member.name,
        member.email,
        member.phone,
        member.accountNumber,
        member.status,
      ].some((value) => value.toLowerCase().includes(query))
    );
  }, [staff, search]);

  const handleBlock = async (member: StaffMember) => {
    if (actionLock.current || member.isBlocked) return;

    if (!member.id) {
      setActionError("This staff member is missing a database ID.");
      return;
    }

    if (!window.confirm(`Block ${member.name} from using their account?`)) {
      return;
    }

    actionLock.current = true;
    setProcessingId(member.id);
    setActionError("");
    setNotice("");

    try {
      const result = await editUser(member.id, { isBlocked: true });
      if (!result.success) {
        throw new Error(result.message || "Failed to block this staff member.");
      }

      setStaff((current) =>
        current.map((item) =>
          item.id === member.id ? { ...item, isBlocked: true } : item
        )
      );
      setSelectedStaff((current) =>
        current?.id === member.id ? { ...current, isBlocked: true } : current
      );
      setNotice(`${member.name} has been blocked.`);
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "Failed to block this staff member."
      );
    } finally {
      actionLock.current = false;
      setProcessingId(null);
    }
  };

  const details: { label: string; value: string }[] = selectedStaff
    ? [
        { label: "Name", value: selectedStaff.name },
        { label: "Email", value: selectedStaff.email },
        { label: "Phone", value: selectedStaff.phone },
        { label: "Role", value: selectedStaff.role },
        { label: "Staff status", value: selectedStaff.status },
        { label: "Blocked", value: selectedStaff.isBlocked ? "Yes" : "No" },
        { label: "Account number", value: selectedStaff.accountNumber },
        { label: "Account type", value: selectedStaff.accountType },
        { label: "Account status", value: selectedStaff.accountStatus },
        { label: "Department", value: selectedStaff.department },
        { label: "Position", value: selectedStaff.position },
        { label: "Joined", value: formatDate(selectedStaff.createdAt) },
        { label: "Staff ID", value: selectedStaff.id || "—" },
      ]
    : [];

  const blockedCount = staff.filter((member) => member.isBlocked).length;
  const activeCount = staff.filter(
    (member) =>
      member.status.toLowerCase() === "active" && !member.isBlocked
  ).length;

  return (
    <main className="space-y-6">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#003566] text-white">
            <Users size={22} />
          </span>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#003566] sm:text-3xl">
              Staff management
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              View staff accounts and manage access.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setRefreshKey((key) => key + 1)}
          disabled={loading || processingId !== null}
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-[#003566] shadow-sm transition hover:border-[#003566] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </header>

      {actionError && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <p>{actionError}</p>
        </div>
      )}

      {notice && (
        <div
          role="status"
          className="flex items-start gap-2 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700"
        >
          <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
          <p>{notice}</p>
        </div>
      )}

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-slate-500">All staff</p>
          <p className="mt-1 text-2xl font-bold text-[#003566]">{staff.length}</p>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-700">
            <ShieldCheck size={19} />
          </span>
          <div>
            <p className="text-xs text-slate-500">Active</p>
            <p className="text-xl font-bold text-[#003566]">{activeCount}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-700">
            <Ban size={19} />
          </span>
          <div>
            <p className="text-xs text-slate-500">Blocked</p>
            <p className="text-xl font-bold text-[#003566]">{blockedCount}</p>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div>
            <h2 className="font-bold text-[#003566]">Staff users</h2>
            <p className="mt-1 text-xs text-slate-500">
              Showing {filteredStaff.length} of {staff.length} staff members
            </p>
          </div>
          <div className="relative w-full sm:max-w-sm">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search name, email or account..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-[#1762AE] focus:bg-white focus:ring-2 focus:ring-[#1762AE]/10"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-56 flex-col items-center justify-center gap-3 text-sm text-slate-500">
            <Loader2 className="animate-spin text-[#1762AE]" size={30} />
            Loading staff users...
          </div>
        ) : loadError ? (
          <div
            role="alert"
            className="flex min-h-56 flex-col items-center justify-center gap-3 p-6 text-center"
          >
            <AlertCircle className="text-red-500" size={30} />
            <p className="text-sm text-red-700">{loadError}</p>
            <button
              type="button"
              onClick={() => setRefreshKey((key) => key + 1)}
              className="rounded-lg bg-[#003566] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1762AE]"
            >
              Try again
            </button>
          </div>
        ) : filteredStaff.length === 0 ? (
          <div className="flex min-h-56 flex-col items-center justify-center p-6 text-center">
            <Users className="text-slate-300" size={36} />
            <h3 className="mt-3 font-semibold text-slate-800">
              No staff users found
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              {search
                ? "Try a different search."
                : "Users with the staff role will appear here."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[780px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Staff member</th>
                  <th className="px-5 py-3 font-semibold">Phone</th>
                  <th className="px-5 py-3 font-semibold">Account number</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 text-center font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStaff.map((member) => (
                  <tr
                    key={member.id || member.email}
                    className="transition-colors hover:bg-blue-50/40"
                  >
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-800">
                        {member.name}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-500">
                        {member.email}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-slate-600">{member.phone}</td>
                    <td className="px-5 py-4 font-medium text-slate-700">
                      {member.accountNumber}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                          member.isBlocked
                            ? "bg-red-50 text-red-700"
                            : member.status.toLowerCase() === "active"
                              ? "bg-green-50 text-green-700"
                              : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {member.isBlocked ? "Blocked" : member.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setActionError("");
                            setSelectedStaff(member);
                          }}
                          className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-[#1762AE] transition hover:bg-[#1762AE] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F26B21]"
                        >
                          <Eye size={15} />
                          Details
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleBlock(member)}
                          disabled={
                            member.isBlocked || processingId !== null
                          }
                          className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-600 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {processingId === member.id ? (
                            <Loader2 size={15} className="animate-spin" />
                          ) : (
                            <Ban size={15} />
                          )}
                          {member.isBlocked ? "Blocked" : "Block"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {selectedStaff && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              processingId === null
            ) {
              setSelectedStaff(null);
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="staff-details-title"
            className="my-auto w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            <header className="flex items-start justify-between gap-4 border-b border-slate-100 bg-slate-50 px-5 py-4 sm:px-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[#1762AE]">
                  Staff account
                </p>
                <h2
                  id="staff-details-title"
                  className="mt-1 text-xl font-bold text-[#003566]"
                >
                  {selectedStaff.name}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {selectedStaff.email}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedStaff(null)}
                disabled={processingId !== null}
                aria-label="Close staff details"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-200 hover:text-slate-800 disabled:opacity-50"
              >
                <X size={19} />
              </button>
            </header>

            <div className="max-h-[70vh] overflow-y-auto p-5 sm:p-6">
              <div className="grid gap-3 sm:grid-cols-2">
                {details.map(({ label, value }) => (
                  <div
                    key={label}
                    className="rounded-lg border border-slate-100 bg-slate-50 p-3"
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                      {label}
                    </p>
                    <p className="mt-1 break-words text-sm font-medium text-slate-800">
                      {value}
                    </p>
                  </div>
                ))}
              </div>

              {actionError && (
                <div
                  role="alert"
                  className="mt-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                >
                  <AlertCircle size={17} className="mt-0.5 shrink-0" />
                  <p>{actionError}</p>
                </div>
              )}
            </div>

            <footer className="flex flex-col-reverse gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
              <button
                type="button"
                onClick={() => setSelectedStaff(null)}
                disabled={processingId !== null}
                className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => void handleBlock(selectedStaff)}
                disabled={selectedStaff.isBlocked || processingId !== null}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {processingId === selectedStaff.id ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Ban size={16} />
                )}
                {selectedStaff.isBlocked ? "Already blocked" : "Block staff"}
              </button>
            </footer>
          </section>
        </div>
      )}
    </main>
  );
}
