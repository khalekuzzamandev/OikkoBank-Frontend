"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  Banknote,
  Check,
  CheckCircle2,
  Clock3,
  Eye,
  HandCoins,
  Loader2,
  RefreshCw,
  Search,
  X,
  XCircle,
} from "lucide-react";
import {
  getCustomerBankAccountById,
  updateCustomerBankAccount,
} from "@/components/lib/Apis/accounts/account";
import {
  getAllLoans,
  updateLoan,
} from "@/components/lib/Apis/loan/loan";

type DataRecord = Record<string, unknown>;

type LoanApplication = {
  id: string;
  customerId: string;
  accountId: string;
  customer: string;
  email: string;
  accountName: string;
  accountNumber: string;
  accountType: string;
  accountEmail: string;
  accountStatus: string;
  loanType: string;
  amount: number | null;
  duration: string;
  repaymentMethod: string;
  occupation: string;
  organization: string;
  monthlyIncome: number | null;
  monthlyExpenses: number | null;
  employmentDuration: string;
  officePhone: string;
  additionalNotes: string;
  termsAccepted: string;
  status: string;
  appliedAt: string;
  timestamp: number;
};

type Decision = "Approved" | "Rejected";

const asRecord = (value: unknown): DataRecord | null =>
  value && typeof value === "object" && !Array.isArray(value)
    ? (value as DataRecord)
    : null;

const getString = (record: DataRecord, ...keys: string[]) => {
  for (const key of keys) {
    const value = record[key];

    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof value === "number") return String(value);

    const nested = asRecord(value);
    if (nested) {
      const nestedId = nested._id ?? nested.id;
      if (typeof nestedId === "string" && nestedId.trim()) {
        return nestedId.trim();
      }
    }
  }

  return "";
};

const getAmount = (record: DataRecord, ...keys: string[]) => {
  for (const key of keys) {
    const value = record[key];
    if (value === undefined || value === null || value === "") continue;

    const amount = Number(value);
    if (Number.isFinite(amount)) return amount;
  }

  return null;
};

const extractLoanRecords = (payload: unknown): DataRecord[] => {
  if (Array.isArray(payload)) {
    return payload.map((item) => {
      const record = asRecord(item);
      if (!record) throw new Error("The loans API returned an invalid record.");
      return record;
    });
  }

  const response = asRecord(payload);
  if (!response) throw new Error("The loans API returned an invalid response.");
  if (response.success === false) {
    throw new Error(
      typeof response.message === "string"
        ? response.message
        : "Failed to fetch loan applications."
    );
  }

  for (const key of ["data", "loans", "applications", "items", "results"]) {
    const candidate = response[key];
    if (Array.isArray(candidate)) return extractLoanRecords(candidate);

    const nested = asRecord(candidate);
    if (nested) return extractLoanRecords(nested);
  }

  if ("loanAmount" in response || "loanType" in response) return [response];
  throw new Error("The loans API returned an unexpected response.");
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
    customerId: getString(record, "userId") || "—",
    accountId: getString(record, "accountId"),
    customer:
      getString(record, "accountName", "customerName", "name") ||
      "Customer name unavailable",
    email: getString(record, "userEmail", "email") || "Email unavailable",
    accountName: getString(record, "accountName") || "—",
    accountNumber: getString(record, "accountNumber") || "—",
    accountType: getString(record, "accountType") || "—",
    accountEmail: getString(record, "accountEmail") || "—",
    accountStatus: getString(record, "accountStatus") || "—",
    loanType: getString(record, "loanType") || "Loan application",
    amount: getAmount(record, "loanAmount", "amount"),
    duration: getString(record, "loanDuration", "duration") || "—",
    repaymentMethod: getString(record, "repaymentMethod") || "—",
    occupation: getString(record, "occupation") || "—",
    organization: getString(record, "organization") || "—",
    monthlyIncome: getAmount(record, "monthlyIncome"),
    monthlyExpenses: getAmount(record, "monthlyExpenses"),
    employmentDuration: getString(record, "employmentDuration") || "—",
    officePhone: getString(record, "officePhone") || "—",
    additionalNotes: getString(record, "additionalNotes") || "—",
    termsAccepted:
      typeof record.termsAccepted === "boolean"
        ? record.termsAccepted
          ? "Accepted"
          : "Not accepted"
        : "—",
    status:
      getString(record, "applicationStatus", "status") || "Unknown",
    appliedAt,
    timestamp: Number.isFinite(timestamp) ? timestamp : 0,
  };
};

const isReviewing = (status: string) =>
  status.trim().toLowerCase() === "reviewing" ||
  status.trim().toLowerCase() === "under review";

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

const assertApiSuccess = (response: unknown, fallbackMessage: string) => {
  const result = asRecord(response);
  if (!result || result.success === false) {
    throw new Error(
      typeof result?.message === "string" ? result.message : fallbackMessage
    );
  }
};

const getAccountBalance = (response: unknown) => {
  const envelope = asRecord(response);
  if (!envelope || envelope.success === false) {
    throw new Error(
      typeof envelope?.message === "string"
        ? envelope.message
        : "Unable to fetch the loan account."
    );
  }

  const data = asRecord(envelope.data);
  const account =
    asRecord(envelope.account) ??
    asRecord(data?.account) ??
    data ??
    envelope;
  const rawBalance = account.balance;
  const balance =
    typeof rawBalance === "number"
      ? rawBalance
      : typeof rawBalance === "string" && rawBalance.trim()
        ? Number(rawBalance)
        : Number.NaN;

  if (!Number.isFinite(balance)) {
    throw new Error("The loan account has an invalid balance.");
  }

  const status = getString(account, "status");
  if (status && status.toLowerCase() !== "active") {
    throw new Error("The customer's account is not active.");
  }

  return balance;
};

export default function AllLoans() {
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [selectedLoan, setSelectedLoan] = useState<LoanApplication | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");
  const [notice, setNotice] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [processingDecision, setProcessingDecision] =
    useState<Decision | null>(null);
  const [search, setSearch] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const actionLock = useRef(false);

  const loadApplications = useCallback(async () => {
    setLoading(true);
    setLoadError("");

    try {
      const response = await getAllLoans<unknown>();
      if (!response.success) {
        throw new Error(response.message || "Failed to fetch loan applications.");
      }

      const loaded = extractLoanRecords(response)
        .map(toLoanApplication)
        .sort((a, b) => b.timestamp - a.timestamp);
      setApplications(loaded);
    } catch (error) {
      setApplications([]);
      setLoadError(
        error instanceof Error ? error.message : "Unable to load loan applications."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadApplications();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [loadApplications, refreshKey]);

  useEffect(() => {
    if (!selectedLoan) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && processingId === null) {
        setSelectedLoan(null);
      }
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [selectedLoan, processingId]);

  const reviewingLoans = useMemo(() => {
    const query = search.trim().toLowerCase();

    return applications.filter((application) => {
      if (!isReviewing(application.status)) return false;
      if (!query) return true;

      return (
        application.customer.toLowerCase().includes(query) ||
        application.email.toLowerCase().includes(query) ||
        application.accountNumber.toLowerCase().includes(query) ||
        application.loanType.toLowerCase().includes(query)
      );
    });
  }, [applications, search]);

  const handleDecision = async (
    application: LoanApplication,
    decision: Decision
  ) => {
    if (actionLock.current) return;

    if (!application.id || application.id.startsWith("loan-")) {
      setActionError("This application is missing its database ID.");
      return;
    }
    if (!isReviewing(application.status)) return;

    if (
      decision === "Rejected" &&
      !window.confirm(`Reject the ${application.loanType} application?`)
    ) {
      return;
    }

    const loanAmount = application.amount;
    if (decision === "Approved") {
      if (!application.accountId) {
        setActionError("The loan application is missing its account ID.");
        return;
      }
      if (loanAmount === null || loanAmount <= 0) {
        setActionError("The requested loan amount is invalid.");
        return;
      }
    }

    actionLock.current = true;
    setProcessingId(application.id);
    setProcessingDecision(decision);
    setActionError("");
    setNotice("");

    try {
      let previousBalance: number | null = null;

      if (decision === "Approved") {
        const accountResponse: unknown = await getCustomerBankAccountById(
          application.accountId
        );
        previousBalance = getAccountBalance(accountResponse);
        if (loanAmount === null) {
          throw new Error("The requested loan amount is invalid.");
        }
        const updatedBalance = previousBalance + loanAmount;

        if (!Number.isFinite(updatedBalance)) {
          throw new Error("The updated account balance would be invalid.");
        }

        const accountUpdate: unknown = await updateCustomerBankAccount(
          application.accountId,
          { balance: updatedBalance }
        );
        assertApiSuccess(
          accountUpdate,
          "Failed to update the customer's account balance."
        );
      }

      try {
        const loanUpdate = await updateLoan(application.id, {
          applicationStatus: decision,
        });
        if (!loanUpdate.success) {
          throw new Error(
            loanUpdate.message || `Failed to ${decision.toLowerCase()} loan.`
          );
        }
      } catch (error) {
        if (decision === "Approved" && previousBalance !== null) {
          try {
            const rollback: unknown = await updateCustomerBankAccount(
              application.accountId,
              { balance: previousBalance }
            );
            assertApiSuccess(rollback, "Account balance rollback failed.");
          } catch (rollbackError) {
            const rollbackMessage =
              rollbackError instanceof Error
                ? rollbackError.message
                : "Unknown rollback error.";
            throw new Error(
              `Loan status update failed and account balance rollback failed: ${rollbackMessage}`
            );
          }
        }

        throw error;
      }

      setApplications((current) =>
        current.map((item) =>
          item.id === application.id
            ? { ...item, status: decision }
            : item
        )
      );
      setSelectedLoan(null);
      setNotice(
        decision === "Approved"
          ? `Loan approved successfully. ${formatMoney(application.amount)} was added to ${application.accountName}'s account.`
          : "Loan application rejected."
      );
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : `Failed to ${decision.toLowerCase()} loan application.`
      );
    } finally {
      actionLock.current = false;
      setProcessingId(null);
      setProcessingDecision(null);
    }
  };

  const detailItems: { label: string; value: string }[] = selectedLoan
    ? [
      { label: "Loan ID", value: selectedLoan.id },
        { label: "Customer name", value: selectedLoan.customer },
        { label: "Customer ID", value: selectedLoan.customerId },
        { label: "Email", value: selectedLoan.email },
        { label: "Account ID", value: selectedLoan.accountId || "—" },
        { label: "Account name", value: selectedLoan.accountName },
        { label: "Account number", value: selectedLoan.accountNumber },
        { label: "Account type", value: selectedLoan.accountType },
        { label: "Account email", value: selectedLoan.accountEmail },
        { label: "Account status", value: selectedLoan.accountStatus },
        { label: "Loan type", value: selectedLoan.loanType },
        { label: "Requested amount", value: formatMoney(selectedLoan.amount) },
        { label: "Loan duration", value: selectedLoan.duration },
        { label: "Repayment method", value: selectedLoan.repaymentMethod },
        { label: "Occupation", value: selectedLoan.occupation },
        { label: "Organization", value: selectedLoan.organization },
        {
          label: "Monthly income",
          value: formatMoney(selectedLoan.monthlyIncome),
        },
        {
          label: "Monthly expenses",
          value: formatMoney(selectedLoan.monthlyExpenses),
        },
        {
          label: "Employment duration",
          value: selectedLoan.employmentDuration,
        },
        { label: "Office phone", value: selectedLoan.officePhone },
        { label: "Applied", value: formatDate(selectedLoan.appliedAt) },
        { label: "Terms accepted", value: selectedLoan.termsAccepted },
        { label: "Additional notes", value: selectedLoan.additionalNotes },
      ]
    : [];

  return (
    <main className="space-y-6 px-10">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#003566] text-white">
              <HandCoins size={22} />
            </span>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-[#003566] sm:text-3xl">
                Loan review
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Review applications currently awaiting an admin decision.
              </p>
            </div>
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
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
            <Clock3 size={19} />
          </span>
          <div>
            <p className="text-xs text-slate-500">Under review</p>
            <p className="text-xl font-bold text-[#003566]">
              {applications.filter((item) => isReviewing(item.status)).length}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-700">
            <CheckCircle2 size={19} />
          </span>
          <div>
            <p className="text-xs text-slate-500">Approved</p>
            <p className="text-xl font-bold text-[#003566]">
              {applications.filter(
                (item) => item.status.toLowerCase() === "approved"
              ).length}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-700">
            <XCircle size={19} />
          </span>
          <div>
            <p className="text-xs text-slate-500">Rejected</p>
            <p className="text-xl font-bold text-[#003566]">
              {applications.filter(
                (item) => item.status.toLowerCase() === "rejected"
              ).length}
            </p>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div>
            <h2 className="font-bold text-[#003566]">Applications to review</h2>
            <p className="mt-1 text-xs text-slate-500">
              {reviewingLoans.length} application
              {reviewingLoans.length === 1 ? "" : "s"} awaiting a decision
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
              placeholder="Search customer, email, account..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-[#1762AE] focus:bg-white focus:ring-2 focus:ring-[#1762AE]/10"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-56 flex-col items-center justify-center gap-3 text-sm text-slate-500">
            <Loader2 className="animate-spin text-[#1762AE]" size={30} />
            Loading loan applications...
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
              className="rounded-lg bg-[#003566] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1762AE]"
            >
              Try again
            </button>
          </div>
        ) : reviewingLoans.length === 0 ? (
          <div className="flex min-h-56 flex-col items-center justify-center p-6 text-center">
            <Banknote className="text-slate-300" size={36} />
            <h3 className="mt-3 font-semibold text-slate-800">
              No loans awaiting review
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Reviewing applications will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Customer</th>
                  <th className="px-5 py-3 font-semibold">Loan type</th>
                  <th className="px-5 py-3 text-right font-semibold">Amount</th>
                  <th className="px-5 py-3 font-semibold">Applied</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 text-center font-semibold">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reviewingLoans.map((application) => (
                  <tr
                    key={application.id}
                    className="transition-colors hover:bg-blue-50/40"
                  >
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-800">
                        {application.customer}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-500">
                        {application.email}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-slate-700">
                      {application.loanType}
                    </td>
                    <td className="px-5 py-4 text-right font-semibold text-[#003566]">
                      {formatMoney(application.amount)}
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {formatDate(application.appliedAt)}
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                        Reviewing
                      </span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <button
                        type="button"
                        onClick={() => {
                          setActionError("");
                          setSelectedLoan(application);
                        }}
                        aria-label={`View ${application.customer}'s loan details`}
                        title="View loan details"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-[#1762AE] transition hover:bg-[#1762AE] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F26B21]"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {selectedLoan && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && processingId === null) {
              setSelectedLoan(null);
              setActionError("");
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="loan-details-title"
            className="my-auto w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            <header className="flex items-start justify-between gap-4 border-b border-slate-100 bg-slate-50 px-5 py-4 sm:px-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[#1762AE]">
                  Loan application
                </p>
                <h2
                  id="loan-details-title"
                  className="mt-1 text-xl font-bold text-[#003566]"
                >
                  {selectedLoan.customer}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {selectedLoan.loanType} ·{" "}
                  {formatMoney(selectedLoan.amount)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedLoan(null);
                  setActionError("");
                }}
                disabled={processingId !== null}
                aria-label="Close loan details"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-200 hover:text-slate-800 disabled:opacity-50"
              >
                <X size={19} />
              </button>
            </header>

            <div className="max-h-[65vh] overflow-y-auto p-5 sm:p-6">
              <div className="grid gap-3 sm:grid-cols-2">
                {detailItems.map(({ label, value }) => (
                  <div
                    key={label}
                    className={`rounded-lg border border-slate-100 bg-slate-50 p-3 ${
                      label === "Additional notes" ? "sm:col-span-2" : ""
                    }`}
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

            <footer className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-white px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
              <button
                type="button"
                onClick={() => handleDecision(selectedLoan, "Rejected")}
                disabled={processingId !== null}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {processingId === selectedLoan.id &&
                processingDecision === "Rejected" ? (
                  <Loader2 size={17} className="animate-spin" />
                ) : (
                  <XCircle size={17} />
                )}
                Reject
              </button>
              <button
                type="button"
                onClick={() => handleDecision(selectedLoan, "Approved")}
                disabled={processingId !== null}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {processingId === selectedLoan.id &&
                processingDecision === "Approved" ? (
                  <Loader2 size={17} className="animate-spin" />
                ) : (
                  <Check size={17} />
                )}
                Accept and credit account
              </button>
            </footer>
          </section>
        </div>
      )}
    </main>
  );
}
