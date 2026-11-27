
"use client";

import { use, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  ArrowDownLeft,
  ArrowUpRight,
  Ban,
  CheckCircle2,
  Loader2,
  RefreshCw,
  Trash2,
  UserRound,
  Mail,
  Wallet,
  CreditCard,
  Banknote,
  CalendarDays,
  FileText,
  ShieldCheck,
  Clock,
} from "lucide-react";

import {
  deleteWithdraw,
  getWithdrawById,
  updateWithdraw,
} from "@/components/lib/Apis/withdrawals/withdrawals";

type DataRecord = Record<string, unknown>;
type Action = "approve" | "reject" | "delete";

const asRecord = (value: unknown): DataRecord | null =>
  value && typeof value === "object" && !Array.isArray(value)
    ? (value as DataRecord)
    : null;

const extractWithdrawal = (payload: unknown): DataRecord => {
  let current = payload;

  for (let depth = 0; depth < 5; depth += 1) {
    if (Array.isArray(current)) {
      if (current.length !== 1) {
        throw new Error("Invalid withdrawal response.");
      }
      current = current[0];
    }

    const record = asRecord(current);

    if (!record) {
      throw new Error("Invalid withdrawal response.");
    }

    if (record.success === false) {
      throw new Error(
        typeof record.message === "string"
          ? record.message
          : "Failed to fetch withdrawal details."
      );
    }

    const nested = ["data", "withdrawal", "request"].find(
      (key) => record[key] !== undefined
    );

    if (!nested) {
      if (
        "withdrawalAmount" in record ||
        "amount" in record ||
        "transactionType" in record
      ) {
        return record;
      }

      throw new Error("Unexpected withdrawal response.");
    }

    current = record[nested];
  }

  throw new Error("Withdrawal response is nested too deeply.");
};

const getString = (record: DataRecord, ...keys: string[]): string => {
  for (const key of keys) {
    const value = record[key];

    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }

    if (typeof value === "number") {
      return String(value);
    }

    if (value && typeof value === "object") {
      const nested = asRecord(value);

      if (nested) {
        const nestedValue = getString(
          nested,
          "accountNumber",
          "number",
          "_id",
          "email",
          "name"
        );

        if (nestedValue) return nestedValue;
      }
    }
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

const formatAmount = (amount: number | null, currency: string) => {
  if (amount === null) return "—";

  const symbol = currency.toUpperCase() === "BDT" ? "৳" : currency;

  return `${symbol} ${amount.toLocaleString("en-BD", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
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

const getStatusStyle = (status: string) => {
  switch (status.toLowerCase()) {
    case "pending":
      return "bg-amber-50 text-amber-700 border-amber-200";

    case "completed":
      return "bg-green-50 text-green-700 border-green-200";

    case "failed":
      return "bg-red-50 text-red-700 border-red-200";

    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

export default function WithdrawDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const router = useRouter();

  const [withdrawal, setWithdrawal] = useState<DataRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [processingAction, setProcessingAction] =
    useState<Action | null>(null);

  const [refreshKey, setRefreshKey] = useState(0);

  const actionLock = useRef(false);

  // Fetch Withdrawal
  useEffect(() => {
    let active = true;

    const loadWithdrawal = async () => {
      setLoading(true);
      setLoadError("");

      try {
        const response: unknown = await getWithdrawById(id);

        const data = extractWithdrawal(response);

        if (active) {
          setWithdrawal(data);
        }
      } catch (error) {
        if (active) {
          setWithdrawal(null);

          setLoadError(
            error instanceof Error
              ? error.message
              : "Unable to load withdrawal details."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadWithdrawal();

    return () => {
      active = false;
    };
  }, [id, refreshKey]);

  // Approve / Reject
  const handleStatusUpdate = async (
    action: "approve" | "reject"
  ) => {
    if (!withdrawal || actionLock.current) return;

    const currentStatus = getString(
      withdrawal,
      "transactionStatus",
      "status"
    ).toLowerCase();

    if (currentStatus !== "pending") {
      setActionError("This withdrawal has already been processed.");
      return;
    }

    const nextStatus = action === "approve" ? "Completed" : "Failed";

    const confirmed = window.confirm(
      action === "approve"
        ? "Are you sure you want to approve this withdrawal? The amount will be transferred to the receiver account."
        : "Are you sure you want to reject this withdrawal? The amount will be returned to the sender account."
    );

    if (!confirmed) return;

    actionLock.current = true;
    setProcessingAction(action);
    setActionError("");
    setSuccessMessage("");

    try {
      const response: unknown = await updateWithdraw(id, {
        transactionStatus: nextStatus,
      });

      const result = asRecord(response);

      if (result?.success === false) {
        throw new Error(
          typeof result.message === "string"
            ? result.message
            : "Failed to update withdrawal."
        );
      }

      // Update local status only after API success
      setWithdrawal((previous) =>
        previous
          ? {
            ...previous,
            transactionStatus: nextStatus,
          }
          : previous
      );

      setSuccessMessage(
        action === "approve"
          ? "Withdrawal approved successfully. Please verify the account balances."
          : "Withdrawal rejected successfully. Please verify the sender balance."
      );
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "Failed to update withdrawal status."
      );
    } finally {
      actionLock.current = false;
      setProcessingAction(null);
    }
  };

  // Delete Withdrawal
  const handleDelete = async () => {
    if (!withdrawal || actionLock.current) return;

    if (
      !window.confirm(
        "Are you sure you want to permanently delete this withdrawal?"
      )
    ) {
      return;
    }

    actionLock.current = true;
    setProcessingAction("delete");
    setActionError("");

    try {
      const response: unknown = await deleteWithdraw(id);

      const result = asRecord(response);

      if (result?.success === false) {
        throw new Error(
          typeof result.message === "string"
            ? result.message
            : "Failed to delete withdrawal."
        );
      }

      router.push("/dashboard/staff/withdrawal-requests");
      router.refresh();
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "Failed to delete withdrawal."
      );
    } finally {
      actionLock.current = false;
      setProcessingAction(null);
    }
  };

  const status = withdrawal
    ? getString(withdrawal, "transactionStatus", "status") || "Unknown"
    : "";

  const isPending = status.toLowerCase() === "pending";

  const currency = withdrawal
    ? getString(withdrawal, "currency") || "BDT"
    : "BDT";

  const amount = withdrawal ? getAmount(withdrawal) : null;

  const senderAccount = withdrawal
    ? getString(
      withdrawal,
      "senderAccountNumber",
      "receiptNumber",
      "fromAccountNumber"
    )
    : "";

  const receiverAccount = withdrawal
    ? getString(
      withdrawal,
      "accountNumber",
      "receiverAccountNumber",
      "toAccountNumber"
    )
    : "";

  const fields = withdrawal
    ? [
      {
        label: "Customer Email",
        value: getString(withdrawal, "userEmail"),
        icon: Mail,
      },
      {
        label: "User ID",
        value: getString(withdrawal, "userId", "senderUserId"),
        icon: UserRound,
      },
      {
        label: "Account Holder",
        value: getString(withdrawal, "accountName"),
        icon: UserRound,
      },
      {
        label: "Account Email",
        value: getString(withdrawal, "accountEmail"),
        icon: Mail,
      },
      {
        label: "Withdrawal Method",
        value: getString(withdrawal, "withdrawalMethod", "method"),
        icon: Wallet,
      },
      {
        label: "Account Type",
        value: getString(withdrawal, "accountType"),
        icon: CreditCard,
      },
      {
        label: "Transaction Type",
        value: getString(withdrawal, "transactionType"),
        icon: FileText,
      },
      {
        label: "Current Sender Balance",
        value: getString(withdrawal, "senderCurrentBalance"),
        icon: Banknote,
      },
      {
        label: "Transaction Date",
        value: formatDate(
          getString(withdrawal, "transactionDate", "createdAt")
        ),
        icon: CalendarDays,
      },
    ].filter((field) => field.value !== "")
    : [];

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F4F7FB]">
        <div className="flex flex-col items-center gap-3">
          <Loader2
            size={35}
            className="animate-spin text-[#003566]"
          />
          <p className="text-sm text-gray-500">
            Loading withdrawal details...
          </p>
        </div>
      </main>
    );
  }

  if (!withdrawal) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F4F7FB] p-4">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-7 text-center shadow-sm">
          <AlertCircle
            className="mx-auto mb-3 text-red-500"
            size={35}
          />

          <h2 className="text-xl font-bold text-gray-900">
            Withdrawal Not Found
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            {loadError || "This withdrawal could not be found."}
          </p>

          <button
            onClick={() => router.back()}
            className="mt-5 rounded-xl bg-[#003566] px-5 py-2.5 text-sm font-semibold text-white"
          >
            Go Back
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F4F7FB] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl space-y-5">

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/dashboard/admin/withdrawals"
              className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-[#1762AE] hover:text-[#003566]"
            >
              <ArrowLeft size={17} />
              Back to withdrawals
            </Link>

            <h1 className="text-2xl font-bold text-[#003566] sm:text-3xl">
              Withdrawal Details
            </h1>

            <p className="mt-1 break-all text-sm text-gray-500">
              Transaction ID: {id}
            </p>
          </div>

          <span
            className={`inline-flex w-fit items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold ${getStatusStyle(status)}`}
          >
            {status.toLowerCase() === "pending" && <Clock size={16} />}
            {status.toLowerCase() === "completed" && (
              <CheckCircle2 size={16} />
            )}
            {status.toLowerCase() === "failed" && <Ban size={16} />}
            {status}
          </span>
        </div>

        {/* Error */}
        {actionError && (
          <div
            role="alert"
            className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600"
          >
            <AlertCircle size={19} />
            {actionError}
          </div>
        )}

        {/* Success */}
        {successMessage && (
          <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            <CheckCircle2 size={19} />
            {successMessage}
          </div>
        )}

        {/* Amount Card */}
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Withdrawal Amount
              </p>

              <h2 className="mt-2 text-3xl font-bold text-[#003566]">
                {formatAmount(amount, currency)}
              </h2>

              <p className="mt-2 text-xs text-gray-500">
                {formatDate(
                  getString(withdrawal, "transactionDate", "createdAt")
                )}
              </p>
            </div>

            <div className="w-fit rounded-2xl bg-blue-50 p-4 text-[#003566]">
              <Banknote size={35} />
            </div>
          </div>
        </section>

        {/* Sender & Receiver */}
        <section className="grid grid-cols-1 gap-5 md:grid-cols-2">

          {/* Sender */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-xl bg-red-50 p-3 text-red-600">
                <ArrowUpRight size={23} />
              </div>

              <div>
                <h2 className="font-bold text-gray-900">
                  Sender Account
                </h2>
                <p className="text-xs text-gray-500">
                  Money will be deducted from this account.
                </p>
              </div>
            </div>

            <p className="text-xs text-gray-500">
              Sender Account Number
            </p>

            <h3 className="mt-2 break-all text-lg font-bold text-gray-900">
              {senderAccount || "Not available"}
            </h3>

            <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">
              <span className="font-semibold">Sender:</span>{" "}
              {getString(withdrawal, "userEmail") || "Customer"}
            </div>
          </div>

          {/* Receiver */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-xl bg-green-50 p-3 text-green-600">
                <ArrowDownLeft size={23} />
              </div>

              <div>
                <h2 className="font-bold text-gray-900">
                  Receiver Account
                </h2>
                <p className="text-xs text-gray-500">
                  Money will be credited to this account after approval.
                </p>
              </div>
            </div>

            <p className="text-xs text-gray-500">
              Receiver Account Number
            </p>

            <h3 className="mt-2 break-all text-lg font-bold text-gray-900">
              {receiverAccount || "Not available"}
            </h3>

            <div className="mt-4 rounded-xl bg-green-50 p-3 text-sm text-green-700">
              <span className="font-semibold">Account Holder:</span>{" "}
              {getString(withdrawal, "accountName") || "Receiver"}
            </div>
          </div>
        </section>

  
        {/* Actions */}
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900">
            Manage Withdrawal
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Approve or reject this withdrawal request.
          </p>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">

            {isPending ? (
              <>
                <button
                  type="button"
                  onClick={() => void handleStatusUpdate("approve")}
                  disabled={processingAction !== null}
                  className="flex items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {processingAction === "approve" ? (
                    <Loader2 size={17} className="animate-spin" />
                  ) : (
                    <CheckCircle2 size={17} />
                  )}

                  Approve Withdrawal
                </button>

                <button
                  type="button"
                  onClick={() => void handleStatusUpdate("reject")}
                  disabled={processingAction !== null}
                  className="flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {processingAction === "reject" ? (
                    <Loader2 size={17} className="animate-spin" />
                  ) : (
                    <Ban size={17} />
                  )}

                  Reject Withdrawal
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2 rounded-xl bg-gray-50 px-4 py-3 text-sm font-medium text-gray-600">
                <ShieldCheck size={18} />
                This withdrawal has already been processed.
              </div>
            )}

            <button
              type="button"
              onClick={() => void handleDelete()}
              disabled={processingAction !== null}
              className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {processingAction === "delete" ? (
                <Loader2 size={17} className="animate-spin" />
              ) : (
                <Trash2 size={17} />
              )}

              Delete Withdrawal
            </button>
          </div>
        </section>

        {/* Refresh */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setRefreshKey((key) => key + 1)}
            className="flex items-center gap-2 text-sm font-semibold text-[#1762AE] hover:text-[#003566]"
          >
            <RefreshCw size={16} />
            Refresh Details
          </button>
        </div>
      </div>
    </main>
  );
}
