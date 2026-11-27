
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  BadgeCheck,
  Ban,
  HandCoins,
  Loader2,
  RefreshCw,
  Search,
  X,
  Filter,
  Clock,
  CheckCircle2,
  ListFilter,
} from "lucide-react";

import {
  getAllLoans,
  updateLoan,
} from "@/components/lib/Apis/loan/loan";

type DataRecord = Record<string, unknown>;

type LoanStatus = "Pending" | "Reviewing" | "Approved" | "Other";
type UpdateStatus = "Reviewing" | "Cancelled";
type FilterStatus = "All" | "Pending" | "Reviewing" | "Approved";

type LoanApplication = {
  id: string;
  customer: string;
  email: string;
  loanType: string;
  amount: number | null;
  duration: string;
  monthlyIncome: number | null;
  status: string;
  appliedAt: string;
  timestamp: number;
};

const asRecord = (value: unknown): DataRecord | null =>
  value && typeof value === "object" && !Array.isArray(value)
    ? (value as DataRecord)
    : null;

const extractLoanRecords = (payload: unknown): DataRecord[] => {
  if (Array.isArray(payload)) {
    return payload.map((item) => {
      const record = asRecord(item);

      if (!record) {
        throw new Error("The loans API returned an invalid loan record.");
      }

      return record;
    });
  }

  const response = asRecord(payload);

  if (!response) {
    throw new Error("The loans API returned an invalid response.");
  }

  if (response.success === false) {
    throw new Error(
      typeof response.message === "string"
        ? response.message
        : "Failed to fetch loan applications."
    );
  }

  for (const key of ["data", "loans", "applications", "items", "results"]) {
    const candidate = response[key];

    if (Array.isArray(candidate)) {
      return extractLoanRecords(candidate);
    }

    const nested = asRecord(candidate);

    if (nested) {
      return extractLoanRecords(nested);
    }
  }

  if ("loanAmount" in response || "loanType" in response) {
    return [response];
  }

  throw new Error("The loans API returned an unexpected response.");
};

const getString = (record: DataRecord, ...keys: string[]) => {
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

const getAmount = (record: DataRecord, ...keys: string[]) => {
  for (const key of keys) {
    const value = record[key];

    if (value !== undefined && value !== null && value !== "") {
      const amount = Number(value);

      if (Number.isFinite(amount)) {
        return amount;
      }
    }
  }

  return null;
};

const toLoanApplication = (
  record: DataRecord,
  index: number
): LoanApplication => {
  const appliedAt = getString(
    record,
    "applicationDate",
    "createdAt",
    "updatedAt"
  );

  const timestamp = appliedAt ? new Date(appliedAt).getTime() : Number.NaN;

  return {
    id: getString(record, "_id", "id", "loanId") || `loan-${index}`,
    customer:
      getString(record, "accountName", "customerName", "name") ||
      "Customer name unavailable",
    email: getString(record, "userEmail", "email") || "Email unavailable",
    loanType: getString(record, "loanType") || "Loan application",
    amount: getAmount(record, "loanAmount", "amount"),
    duration: getString(record, "loanDuration", "duration") || "—",
    monthlyIncome: getAmount(record, "monthlyIncome"),
    status: getString(record, "applicationStatus", "status") || "Unknown",
    appliedAt,
    timestamp: Number.isFinite(timestamp) ? timestamp : 0,
  };
};

const getStatusGroup = (status: string): LoanStatus => {
  switch (status.trim().toLowerCase()) {
    case "pending":
      return "Pending";

    case "reviewing":
    case "under review":
      return "Reviewing";

    case "approved":
      return "Approved";

    default:
      return "Other";
  }
};

const formatMoney = (amount: number | null) =>
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

const getStatusStyle = (status: string) => {
  switch (getStatusGroup(status)) {
    case "Pending":
      return "bg-amber-50 text-amber-700";

    case "Reviewing":
      return "bg-blue-50 text-blue-700";

    case "Approved":
      return "bg-green-50 text-green-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
};

const filterOptions: {
  label: FilterStatus;
  icon: typeof ListFilter;
}[] = [
    { label: "All", icon: ListFilter },
    { label: "Pending", icon: Clock },
    { label: "Reviewing", icon: HandCoins },
    { label: "Approved", icon: CheckCircle2 },
  ];

export default function AllLoanApplications() {
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const [activeFilter, setActiveFilter] = useState<FilterStatus>("All");
  const [searchTerm, setSearchTerm] = useState("");

  const actionLock = useRef(false);

  useEffect(() => {
    let active = true;

    const loadApplications = async () => {
      setLoading(true);
      setLoadError("");

      try {
        const response = await getAllLoans<unknown>();

        if (!response.success) {
          throw new Error(
            response.message || "Failed to fetch loan applications."
          );
        }

        const loadedApplications = extractLoanRecords(response).map(
          toLoanApplication
        );

        loadedApplications.sort((a, b) => b.timestamp - a.timestamp);

        if (active) {
          setApplications(loadedApplications);
        }
      } catch (error) {
        if (active) {
          setApplications([]);

          setLoadError(
            error instanceof Error
              ? error.message
              : "Unable to load loan applications."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void loadApplications();

    return () => {
      active = false;
    };
  }, [refreshKey]);

  const handleStatusUpdate = async (
    application: LoanApplication,
    status: UpdateStatus
  ) => {
    if (actionLock.current) return;

    if (application.id.startsWith("loan-")) {
      setActionError("This application is missing its database ID.");
      return;
    }

    if (getStatusGroup(application.status) !== "Pending") {
      return;
    }

    if (
      status === "Cancelled" &&
      !window.confirm(`Cancel the ${application.loanType} application?`)
    ) {
      return;
    }

    actionLock.current = true;
    setProcessingId(application.id);
    setActionError("");

    try {
      const response = await updateLoan(application.id, {
        applicationStatus: status,
      });

      if (!response.success) {
        throw new Error(
          response.message || `Failed to ${status.toLowerCase()} loan.`
        );
      }

      setApplications((current) =>
        current.map((item) =>
          item.id === application.id ? { ...item, status } : item
        )
      );
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : `Failed to ${status.toLowerCase()} loan application.`
      );
    } finally {
      actionLock.current = false;
      setProcessingId(null);
    }
  };

  // Filter and Search
  const filteredApplications = useMemo(() => {
    let result = [...applications];

    if (activeFilter !== "All") {
      result = result.filter(
        (application) =>
          getStatusGroup(application.status) === activeFilter
      );
    }

    const search = searchTerm.trim().toLowerCase();

    if (search) {
      result = result.filter(
        (application) =>
          application.customer.toLowerCase().includes(search) ||
          application.email.toLowerCase().includes(search) ||
          application.loanType.toLowerCase().includes(search)
      );
    }

    return result.sort((a, b) => b.timestamp - a.timestamp);
  }, [applications, activeFilter, searchTerm]);

  const getCount = (status: FilterStatus) => {
    if (status === "All") {
      return applications.length;
    }

    return applications.filter(
      (application) => getStatusGroup(application.status) === status
    ).length;
  };

  return (
    <main className="min-h-screen space-y-5 bg-[#F4F7FB] p-3 sm:p-5 lg:p-6">
      {/* Header */}
      <header className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#003566] sm:text-3xl">
            Loan Applications
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Review and manage loan applications from all customers.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setRefreshKey((key) => key + 1)}
          disabled={loading || processingId !== null}
          className="inline-flex w-fit items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#1762AE] shadow-sm transition hover:border-[#1762AE] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw
            size={16}
            className={loading ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </header>

      {/* Action Error */}
      {actionError && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          {actionError}
        </div>
      )}

      {/* Summary Cards */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {(["Pending", "Reviewing", "Approved"] as const).map((status) => {
          const Icon =
            status === "Approved"
              ? BadgeCheck
              : status === "Reviewing"
                ? HandCoins
                : AlertCircle;

          const count = getCount(status);

          return (
            <div
              key={status}
              className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
            >
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-lg ${getStatusStyle(status)}`}
              >
                <Icon size={19} />
              </span>

              <div>
                <p className="text-xs text-gray-500">{status}</p>
                <p className="text-xl font-bold text-[#003566]">{count}</p>
              </div>
            </div>
          );
        })}
      </section>

      {/* Filter Buttons + Search */}
      <section className="space-y-4 rounded-2xl border border-gray-200 bg-white p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-bold text-[#003566]">
              Application Management
            </h2>
            <p className="mt-1 text-xs text-gray-500">
              Filter applications by their current status.
            </p>
          </div>

          <div className="text-sm text-gray-500">
            Total:{" "}
            <span className="font-bold text-[#003566]">
              {filteredApplications.length}
            </span>
          </div>
        </div>

        {/* Four Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {filterOptions.map(({ label, icon: Icon }) => {
            const isActive = activeFilter === label;

            return (
              <button
                key={label}
                type="button"
                onClick={() => setActiveFilter(label)}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${isActive
                    ? "bg-[#003566] text-white shadow-md"
                    : "border border-gray-200 bg-gray-50 text-gray-600 hover:border-[#1762AE] hover:text-[#003566]"
                  }`}
              >
                <Icon size={16} />
                {label}

                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] ${isActive
                      ? "bg-white/20 text-white"
                      : "bg-gray-200 text-gray-600"
                    }`}
                >
                  {getCount(label)}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="relative w-full">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by customer name, email or loan type..."
            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-11 text-sm outline-none transition focus:border-[#1762AE] focus:bg-white focus:ring-2 focus:ring-[#1762AE]/10"
          />

          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-red-500"
              aria-label="Clear search"
            >
              <X size={17} />
            </button>
          )}
        </div>
      </section>

      {/* Loading */}
      {loading ? (
        <div className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-2xl border border-gray-200 bg-white">
          <Loader2
            className="animate-spin text-[#1762AE]"
            size={32}
          />

          <p className="text-sm text-gray-500">
            Loading loan applications...
          </p>
        </div>
      ) : loadError ? (
        <div
          role="alert"
          className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-red-200 bg-white p-6 text-center"
        >
          <AlertCircle className="text-red-500" size={34} />

          <p className="mt-3 font-semibold text-gray-800">
            Unable to load loan applications
          </p>

          <p className="mt-1 max-w-lg text-sm text-gray-500">
            {loadError}
          </p>

          <button
            type="button"
            onClick={() => setRefreshKey((key) => key + 1)}
            className="mt-4 rounded-lg bg-[#003566] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1762AE]"
          >
            Try again
          </button>
        </div>
      ) : (
        /* Applications Table */
        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="flex flex-col gap-2 border-b border-gray-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-bold text-[#003566]">
                {activeFilter === "All"
                  ? "All Loan Applications"
                  : `${activeFilter} Applications`}
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                Showing {filteredApplications.length} applications
              </p>
            </div>

            <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-[#1762AE]">
              {activeFilter} Filter
            </span>
          </div>

          {filteredApplications.length === 0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center p-6 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                <Search size={25} className="text-gray-400" />
              </div>

              <h3 className="mt-3 font-semibold text-gray-800">
                No applications found
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                No loan applications match your selected filter or search.
              </p>

              <button
                type="button"
                onClick={() => {
                  setActiveFilter("All");
                  setSearchTerm("");
                }}
                className="mt-4 text-sm font-semibold text-[#1762AE] hover:underline"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px] text-left text-xs">
                <thead className="bg-gray-50 text-[10px] uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-3 py-3 font-semibold">Customer</th>
                    <th className="px-3 py-3 font-semibold">Loan type</th>
                    <th className="px-3 py-3 text-right font-semibold">
                      Amount
                    </th>
                    <th className="px-3 py-3 font-semibold">Duration</th>
                    <th className="px-3 py-3 text-right font-semibold">
                      Monthly income
                    </th>
                    <th className="px-3 py-3 font-semibold">Status</th>
                    <th className="px-3 py-3 font-semibold">Applied</th>
                    <th className="px-3 py-3 text-center font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredApplications.map((application) => {
                    const canTakeAction =
                      getStatusGroup(application.status) === "Pending";

                    const isProcessing =
                      processingId === application.id;

                    return (
                      <tr
                        key={application.id}
                        className="transition hover:bg-gray-50/70"
                      >
                        <td className="px-3 py-3">
                          <p className="font-semibold text-gray-800">
                            {application.customer}
                          </p>

                          <p className="mt-0.5 text-[10px] text-gray-500">
                            {application.email}
                          </p>
                        </td>

                        <td className="px-3 py-3 text-gray-700">
                          {application.loanType}
                        </td>

                        <td className="whitespace-nowrap px-3 py-3 text-right font-semibold text-[#003566]">
                          {formatMoney(application.amount)}
                        </td>

                        <td className="px-3 py-3 text-gray-600">
                          {application.duration}
                        </td>

                        <td className="whitespace-nowrap px-3 py-3 text-right text-gray-600">
                          {formatMoney(application.monthlyIncome)}
                        </td>

                        <td className="px-3 py-3">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold ${getStatusStyle(application.status)}`}
                          >
                            {application.status}
                          </span>
                        </td>

                        <td className="whitespace-nowrap px-3 py-3 text-gray-600">
                          {formatDate(application.appliedAt)}
                        </td>

                        <td className="px-3 py-3">
                          {canTakeAction ? (
                            <div className="flex justify-center gap-1.5">
                              <button
                                type="button"
                                onClick={() =>
                                  void handleStatusUpdate(
                                    application,
                                    "Reviewing"
                                  )
                                }
                                disabled={processingId !== null}
                                className="inline-flex items-center gap-1 rounded-md bg-[#1762AE] px-2 py-1.5 text-[10px] font-semibold text-white transition hover:bg-[#003566] disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {isProcessing ? (
                                  <Loader2
                                    size={12}
                                    className="animate-spin"
                                  />
                                ) : (
                                  <BadgeCheck size={12} />
                                )}
                                Pass to Admin
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  void handleStatusUpdate(
                                    application,
                                    "Cancelled"
                                  )
                                }
                                disabled={processingId !== null}
                                className="inline-flex items-center gap-1 rounded-md border border-red-200 bg-white px-2 py-1.5 text-[10px] font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {isProcessing ? (
                                  <Loader2
                                    size={12}
                                    className="animate-spin"
                                  />
                                ) : (
                                  <Ban size={12} />
                                )}
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <div className="flex justify-center">
                              <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-[10px] font-semibold text-green-700">
                                <BadgeCheck size={12} />
                                Passed
                              </span>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}
    </main>
  );
}
