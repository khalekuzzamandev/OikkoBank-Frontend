
"use client";

import React, { useState } from "react";
import {
  Wallet,
  Banknote,
  ArrowUpFromLine,
  ShieldCheck,
  Loader2,
  Info,
  ReceiptText,
} from "lucide-react";

import { useLoggedInUserAccounts } from "@/components/lib/hooks/useLoggedInUserAccounts";
import { createWithdraw } from "@/components/lib/Apis/withdrawals/withdrawals";

const CustomerwithdrawalsPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [receiptNumber, setReceiptNumber] = useState("");

  const {
    user,
    accounts,
    loading: accountLoading,
    error: accountError,
  } = useLoggedInUserAccounts();

  const handleReceiptChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setReceiptNumber(e.target.value);
    setError("");
    setSuccess("");
  };

  const isReceiptValid =
    receiptNumber.trim().length > 0 &&
    accounts.some(
      (account) =>
        account.accountNumber?.trim() === receiptNumber.trim()
    );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (accountLoading) {
      setError("Please wait. Your account is loading.");
      return;
    }

    if (accountError) {
      setError("Unable to load your bank account. Please try again.");
      return;
    }

    if (!user?.id || accounts.length === 0) {
      setError("Bank account not found. Please login again.");
      return;
    }

    const form = e.currentTarget;
    const formData = new FormData(form);

    const withdrawalAccount = accounts.find(
      (account) =>
        account.accountNumber?.trim() === receiptNumber.trim()
    );

    if (!withdrawalAccount) {
      setError("Please enter a valid account/receipt number.");
      return;
    }

    if (withdrawalAccount.status?.toLowerCase() !== "active") {
      setError("Your bank account is not active.");
      return;
    }

    const withdrawalAmount = Number(
      formData.get("withdrawalAmount")
    );

    // Amount Validation
    if (
      !Number.isFinite(withdrawalAmount) ||
      withdrawalAmount < 500
    ) {
      setError("Minimum withdrawal amount must be ৳500.");
      return;
    }

    // Balance Validation
    if (withdrawalAmount > Number(withdrawalAccount.balance)) {
      setError("Insufficient account balance.");
      return;
    }

    setLoading(true);

    try {
      const withdrawalData = {
        // Amount fields
        amount: withdrawalAmount,
        withdrawalAmount: withdrawalAmount,

        // Receipt
        receiptNumber: receiptNumber.trim(),

        // Currency and method
        currency: withdrawalAccount.currency || "BDT",
        withdrawalMethod: "Branch Cash Withdrawal",

        // User information
        userId: user.id,
        userEmail: user.email || withdrawalAccount.userEmail || "",

        // Account information
        accountId: withdrawalAccount._id || "",
        accountNumber: withdrawalAccount.accountNumber,
        accountName: withdrawalAccount.accountName,
        accountType: withdrawalAccount.accountType,
        accountEmail: withdrawalAccount.userEmail,
        accountStatus: withdrawalAccount.status,

        // Transaction information
        transactionType: "Withdrawal",
        transactionStatus: "Pending",
        transactionDate: new Date().toISOString(),
      };

      const result = await createWithdraw(withdrawalData);

      if (!result || result.success === false) {
        throw new Error(
          result?.message || "Failed to submit withdrawal request."
        );
      }

      setSuccess(
        result.message || "Withdrawal request submitted successfully!"
      );

      form.reset();
      setReceiptNumber("");

    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 hover:border-gray-300 focus:border-[#1762AE] focus:bg-white focus:ring-4 focus:ring-blue-50";

  const labelClass =
    "mb-2 block text-sm font-semibold text-gray-700";

  return (
    <div className="min-h-screen bg-[#F4F7FB] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#003566] text-white shadow-lg">
              <ArrowUpFromLine size={27} />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-[#003566] sm:text-3xl">
                Withdraw Money
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Request a branch cash withdrawal from your bank account.
              </p>
            </div>
          </div>

          <div className="flex w-fit items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 text-xs font-semibold text-[#1762AE] shadow-sm">
            <ShieldCheck size={16} />
            Secure Banking
          </div>
        </div>

        {/* Information Banner */}
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-4 sm:p-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
            <Info size={21} />
          </div>

          <div>
            <h3 className="text-sm font-bold text-blue-900">
              Branch Cash Withdrawal
            </h3>

            <p className="mt-1 text-sm leading-6 text-blue-800">
              Enter your withdrawal amount and an account/receipt
              number registered to your bank account. Your request will
              be reviewed by the bank.
              Minimum withdrawal amount is ৳500.
            </p>
          </div>
        </div>

        {/* Withdrawal Form */}
        <form
          onSubmit={handleSubmit}
          className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
        >
          <div className="border-b border-gray-100 p-5 sm:p-8">

            {/* Section Heading */}
            <div className="mb-7 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-[#1762AE]">
                <Wallet size={22} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-[#003566]">
                  Withdrawal Details
                </h2>

                <p className="text-xs text-gray-500">
                  Enter the required information for your withdrawal.
                </p>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">

              {/* Withdrawal Amount */}
              <div>
                <label className={labelClass}>
                  Withdrawal Amount (৳)
                  <span className="text-red-500"> *</span>
                </label>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base font-bold text-gray-500">
                    ৳
                  </span>

                  <input
                    name="withdrawalAmount"
                    type="number"
                    min="500"
                    step="0.01"
                    placeholder="Minimum ৳500"
                    required
                    className={`${inputClass} pl-10`}
                  />
                </div>

                <p className="mt-2 text-xs font-medium text-gray-500">
                  Minimum withdrawal: ৳500
                </p>
              </div>

              {/* Receipt Number */}
              <div>
                <label className={labelClass}>
                  Account / Receipt Number
                  <span className="text-red-500"> *</span>
                </label>

                <div className="relative">
                  <ReceiptText
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    name="receiptNumber"
                    type="text"
                    autoComplete="off"
                    value={receiptNumber}
                    onChange={handleReceiptChange}
                    maxLength={32}
                    required
                    placeholder="Enter your account/receipt number"
                    className={`${inputClass} pl-11 ${receiptNumber.trim().length > 0 && !isReceiptValid
                        ? "border-red-500 focus:border-red-500 focus:ring-red-50"
                        : isReceiptValid
                          ? "border-green-500"
                          : ""
                      }`}
                  />
                </div>

                {receiptNumber.trim().length > 0 &&
                  !isReceiptValid &&
                  !accountLoading && (
                    <p className="mt-2 text-xs font-medium text-red-500">
                      Please enter a valid account/receipt number.
                    </p>
                  )}

                {isReceiptValid && (
                  <p className="mt-2 text-xs font-medium text-green-600">
                    Account/receipt number matches your account.
                  </p>
                )}

                <p className="mt-2 text-xs text-gray-500">
                  Must match an account number registered to your profile.
                </p>
              </div>

            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-5 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                <Info size={18} className="shrink-0" />
                {error}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="mt-5 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                <ShieldCheck size={18} className="shrink-0" />
                {success}
              </div>
            )}

          </div>

          {/* Footer */}
          <div className="flex flex-col-reverse justify-between gap-4 border-t border-gray-100 bg-gray-50 p-5 sm:flex-row sm:items-center sm:px-8">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <ShieldCheck size={16} className="text-green-600" />
              Your withdrawal request will be reviewed by the bank.
            </div>

            <button
              type="submit"
              disabled={
                loading ||
                accountLoading ||
                !!accountError ||
                !isReceiptValid
              }
              className="flex items-center justify-center gap-2 rounded-xl bg-[#003566] px-7 py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-[#1762AE] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading || accountLoading ? (
                <Loader2 size={19} className="animate-spin" />
              ) : (
                <Banknote size={19} />
              )}

              {accountLoading
                ? "Loading Account..."
                : loading
                  ? "Submitting..."
                  : "Submit Withdrawal Request"}
            </button>
          </div>
        </form>

        {/* Bottom Note */}
        <div className="mt-5 flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4">
          <ShieldCheck
            size={19}
            className="mt-0.5 shrink-0 text-[#1762AE]"
          />

          <p className="text-xs leading-5 text-gray-500">
            Your withdrawal request will remain{" "}
            <strong className="text-amber-600">Pending</strong> until
            the bank verifies and processes it. Your account balance
            will not be deducted at this stage.
          </p>
        </div>

      </div>
    </div>
  );
};

export default CustomerwithdrawalsPage;
