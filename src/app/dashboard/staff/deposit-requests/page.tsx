
"use client";

import React, { useEffect, useRef, useState } from "react";
import { Banknote, Check, Trash2 } from "lucide-react";
import {
  deleteDeposit,
  getAllDeposits,
  updateDeposit,
} from "@/components/lib/Apis/deposits/deposits";
import {
  getCustomerBankAccountById,
  updateCustomerBankAccount,
} from "@/components/lib/Apis/accounts/account";

interface DepositRequestItem {
  _id?: string;
  id?: string;
  accountId?: string;
  accountName?: string;
  accountNumber?: string;
  depositAmount?: number | string;
  transactionStatus?: string;
}

const asRecord = (value: unknown): Record<string, unknown> | null =>
  value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;

const getAccountBalance = (response: unknown): number => {
  const envelope = asRecord(response);

  if (!envelope || envelope.success === false) {
    throw new Error(
      typeof envelope?.message === "string"
        ? envelope.message
        : "Unable to fetch the deposit account."
    );
  }

  const data = asRecord(envelope.data);
  const account =
    asRecord(envelope.account) ??
    asRecord(data?.account) ??
    data ??
    envelope;
  const balance = Number(account.balance);

  if (!Number.isFinite(balance)) {
    throw new Error("The deposit account has an invalid balance.");
  }

  return balance;
};

const assertApiSuccess = (response: unknown, fallbackMessage: string) => {
  const result = asRecord(response);

  if (!result || result.success === false) {
    throw new Error(
      typeof result?.message === "string" ? result.message : fallbackMessage
    );
  }
};

const parseDeposits = (value: unknown): DepositRequestItem[] => {
  if (!Array.isArray(value)) {
    throw new Error("The deposits API returned an invalid response.");
  }

  return value.map((item) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) {
      throw new Error("The deposits API returned an invalid deposit record.");
    }

    const record = item as Record<string, unknown>;
    const isOptionalString = (field: unknown) =>
      field === undefined || typeof field === "string";

    if (
      !isOptionalString(record._id) ||
      !isOptionalString(record.id) ||
      !isOptionalString(record.accountId) ||
      !isOptionalString(record.accountName) ||
      !isOptionalString(record.accountNumber) ||
      !isOptionalString(record.transactionStatus) ||
      (record.depositAmount !== undefined &&
        typeof record.depositAmount !== "number" &&
        typeof record.depositAmount !== "string")
    ) {
      throw new Error("The deposits API returned an invalid deposit record.");
    }

    return {
      _id: record._id,
      id: record.id,
      accountId: record.accountId,
      accountName: record.accountName,
      accountNumber: record.accountNumber,
      depositAmount: record.depositAmount,
      transactionStatus: record.transactionStatus,
    };
  });
}

const DepositRequestTable = () => {
  const [deposits, setDeposits] = useState<DepositRequestItem[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);
  const actionLock = useRef(false);

  useEffect(() => {
    let isCurrent = true;

    const loadDeposits = async () => {
      try {
        const result = await getAllDeposits();

        if (!result.success) {
          throw new Error(result.message || "Failed to fetch deposits.");
        }

        const loadedDeposits = parseDeposits(result.data);

        if (isCurrent) {
          setDeposits(loadedDeposits);
        }
      } catch (error: unknown) {
        if (isCurrent) {
          setLoadError(
            error instanceof Error ? error.message : "Failed to fetch deposits."
          );
        }
      } finally {
        if (isCurrent) {
          setLoading(false);
        }
      }
    };

    void loadDeposits();

    return () => {
      isCurrent = false;
    };
  }, []);

  // Summary
  const successCount = deposits.filter(
    (item) => item.transactionStatus?.toLowerCase() === "success"
  ).length;

  const pendingCount = deposits.filter(
    (item) => item.transactionStatus?.toLowerCase() === "pending"
  ).length;

  // Filter Data
  const filteredDeposits = deposits.filter((item) => {
    const status = item.transactionStatus?.toLowerCase();

    if (filter === "success") return status === "success";
    if (filter === "pending") return status === "pending";

    return true;
  });

  // Accept Deposit
  const handleAccept = async (deposit: DepositRequestItem) => {
    const id = deposit._id || deposit.id;
    const accountId = deposit.accountId;
    const amount = Number(deposit.depositAmount);

    if (actionLock.current) return;
    if (!id || !accountId) {
      setActionError("Deposit ID or account ID is missing.");
      return;
    }
    if (deposit.transactionStatus?.toLowerCase() !== "pending") return;
    if (!Number.isFinite(amount) || amount <= 0) {
      setActionError("The deposit amount is invalid.");
      return;
    }

    actionLock.current = true;
    setProcessingId(id);
    setActionError("");

    try {
      const accountResponse: unknown =
        await getCustomerBankAccountById(accountId);
      const currentBalance = getAccountBalance(accountResponse);
      const accountUpdate: unknown = await updateCustomerBankAccount(
        accountId,
        { balance: currentBalance + amount }
      );
      assertApiSuccess(accountUpdate, "Failed to update the account balance.");

      try {
        const depositUpdate = await updateDeposit(id, {
          transactionStatus: "Success",
        });

        if (!depositUpdate.success) {
          throw new Error(
            depositUpdate.message || "Failed to update deposit status."
          );
        }
      } catch (error: unknown) {
        try {
          const rollback: unknown = await updateCustomerBankAccount(
            accountId,
            { balance: currentBalance }
          );
          assertApiSuccess(rollback, "Account balance rollback failed.");
        } catch (rollbackError: unknown) {
          const rollbackMessage =
            rollbackError instanceof Error
              ? rollbackError.message
              : "Unknown rollback error.";
          throw new Error(
            `Deposit status update failed and account balance rollback failed: ${rollbackMessage}`
          );
        }

        throw error;
      }

      setDeposits((prev) =>
        prev.map((item) =>
          (item._id || item.id) === id
            ? { ...item, transactionStatus: "Success" }
            : item
        )
      );
    } catch (error: unknown) {
      setActionError(
        error instanceof Error ? error.message : "Failed to accept deposit."
      );
    } finally {
      actionLock.current = false;
      setProcessingId(null);
    }
  };

  // Delete Deposit
  const handleDelete = async (deposit: DepositRequestItem) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this deposit request?"
    );

    if (!confirmed) return;

    const id = deposit._id || deposit.id;

    if (actionLock.current) return;
    if (!id) {
      setActionError("Deposit ID is missing.");
      return;
    }

    actionLock.current = true;
    setProcessingId(id);
    setActionError("");

    try {
      const result = await deleteDeposit(id);

      if (!result.success) {
        throw new Error(result.message || "Failed to delete deposit.");
      }

      setDeposits((prev) =>
        prev.filter((item) => (item._id || item.id) !== id)
      );
    } catch (error: unknown) {
      setActionError(
        error instanceof Error ? error.message : "Failed to delete deposit."
      );
    } finally {
      actionLock.current = false;
      setProcessingId(null);
    }
  };

  // Status Style
  const getStatusStyle = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "success":
        return "bg-green-100 text-green-700";

      case "pending":
        return "bg-yellow-100 text-yellow-700";

      case "rejected":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#003566]">
            Deposit Requests
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Manage and monitor all customer deposit requests.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-blue-50 text-[#1762AE] px-4 py-2 rounded-xl">
          <Banknote size={20} />

          <span className="font-semibold">
            {deposits.length} Total Requests
          </span>
        </div>
      </div>

      {actionError && (
        <p role="alert" className="text-sm text-red-600">
          {actionError}
        </p>
      )}

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <p className="text-sm text-slate-500">Total Requests</p>

          <h2 className="text-2xl font-bold text-[#003566] mt-2">
            {deposits.length}
          </h2>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <p className="text-sm text-slate-500">Success Requests</p>

          <h2 className="text-2xl font-bold text-green-600 mt-2">
            {successCount}
          </h2>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <p className="text-sm text-slate-500">Pending Requests</p>

          <h2 className="text-2xl font-bold text-yellow-600 mt-2">
            {pendingCount}
          </h2>
        </div>

      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">

        <div className="p-5 border-b border-slate-200">

          <h2 className="text-lg font-bold text-[#003566]">
            All Deposit Requests
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Customer deposit request information
          </p>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mt-5">

            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${filter === "all"
                  ? "bg-[#003566] text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
            >
              All ({deposits.length})
            </button>

            <button
              onClick={() => setFilter("success")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${filter === "success"
                  ? "bg-green-600 text-white"
                  : "bg-green-100 text-green-700 hover:bg-green-200"
                }`}
            >
              Success ({successCount})
            </button>

            <button
              onClick={() => setFilter("pending")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${filter === "pending"
                  ? "bg-yellow-500 text-white"
                  : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                }`}
            >
              Pending ({pendingCount})
            </button>

          </div>
        </div>

        {/* Table Data */}
        {loading ? (
          <div className="py-16 text-center text-sm text-slate-500">
            Loading deposit requests...
          </div>
        ) : loadError ? (
          <div role="alert" className="py-16 text-center text-sm text-red-600">
            Unable to load deposit requests: {loadError}
          </div>
        ) : filteredDeposits.length === 0 ? (

          <div className="py-16 text-center">
            <Banknote className="mx-auto text-slate-300" size={45} />

            <h3 className="font-semibold text-slate-700 mt-3">
              No Deposit Requests Found
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              No requests available in this category.
            </p>
          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full text-sm text-left whitespace-nowrap">

              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-5 py-4 font-semibold">S</th>

                  <th className="px-5 py-4 font-semibold">
                    Account Name
                  </th>

                  <th className="px-5 py-4 font-semibold">
                    Account Number
                  </th>

                  <th className="px-5 py-4 font-semibold">
                    Deposit Amount
                  </th>

                  <th className="px-5 py-4 font-semibold">
                    Status
                  </th>

                  <th className="px-5 py-4 font-semibold text-center">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">

                {filteredDeposits.map((deposit, index) => (

                  <tr
                    key={deposit._id || deposit.id || index}
                    className="hover:bg-blue-50/40 transition-colors"
                  >

                    <td className="px-5 py-4 text-slate-500">
                      {index + 1}
                    </td>

                    <td className="px-5 py-4 font-medium text-[#003566]">
                      {deposit.accountName || "N/A"}
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {deposit.accountNumber || "N/A"}
                    </td>

                    <td className="px-5 py-4 font-bold text-slate-800">
                      ৳{Number(deposit.depositAmount || 0).toLocaleString("en-BD")}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusStyle(
                          deposit.transactionStatus
                        )}`}
                      >
                        {deposit.transactionStatus || "Unknown"}
                      </span>
                    </td>

                    {/* Action Buttons */}
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center gap-2">

                        {/* Accept */}
                        <button
                          onClick={() => handleAccept(deposit)}
                          disabled={
                            processingId !== null ||
                            deposit.transactionStatus?.toLowerCase() !== "pending"
                          }
                          title="Accept Deposit"
                          className="p-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <Check size={18} />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(deposit)}
                          disabled={processingId !== null}
                          title="Delete Deposit"
                          className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <Trash2 size={18} />
                        </button>

                      </div>
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

        {!loading && !loadError && (
          <div className="px-5 py-4 border-t border-slate-100 text-sm text-slate-500">
            Showing {filteredDeposits.length} deposit requests
          </div>
        )}

      </div>

    </div>
  );
};

export default DepositRequestTable;
