
"use client";

import React, { useState } from "react";
import {
  Wallet,
  Banknote,
  Loader2,
  ArrowDownToLine,
  ShieldCheck,
  ReceiptText,
  Info,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

import { useLoggedInUserAccounts } from "@/components/lib/hooks/useLoggedInUserAccounts";
import { createDeposit, CreateDepositData } from "@/components/lib/Apis/deposits/deposits";


const CustomerDepositPage = () => {
  const [loading, setLoading] = useState(false);
  const [amountError, setAmountError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const {
    user,
    primaryAccount,
    loading: accountLoading,
    error: accountError,
  } = useLoggedInUserAccounts();

  // Amount Validation
  const handleAmountChange = (value: string) => {
    setSubmitError("");
    setSuccessMessage("");

    if (!value) {
      setAmountError("");
      return;
    }

    const amount = Number(value);

    if (!Number.isFinite(amount) || amount < 500) {
      setAmountError("Minimum deposit amount is ৳500.");
    } else {
      setAmountError("");
    }
  };

  // Submit Deposit
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (loading) return;

    setSubmitError("");
    setSuccessMessage("");

    // Account Loading
    if (accountLoading) {
      setSubmitError("Please wait. Your bank account is loading.");
      return;
    }

    // Account Error
    if (accountError) {
      setSubmitError(
        "Unable to load your bank account. Please try again."
      );
      return;
    }

    // User Validation
    if (!user?.id) {
      setSubmitError("User information not found. Please login again.");
      return;
    }

    // Account Validation
    if (!primaryAccount) {
      setSubmitError(
        "No bank account found. Please create a bank account first."
      );
      return;
    }

    if (primaryAccount.status?.toLowerCase() !== "active") {
      setSubmitError(
        "Your bank account is not active. Deposit is unavailable."
      );
      return;
    }

    const form = e.currentTarget;
    const formData = new FormData(form);

    const depositAmount = Number(formData.get("depositAmount"));
    const depositMethod = formData.get("depositMethod");

    // Minimum Amount Validation
    if (!Number.isFinite(depositAmount) || depositAmount < 500) {
      setAmountError("Minimum deposit amount is ৳500.");
      return;
    }

    setAmountError("");

    // Method Validation
    if (
      typeof depositMethod !== "string" ||
      !depositMethod.trim()
    ) {
      setSubmitError("Please select a deposit method.");
      return;
    }

    // Extract Account Information
    const accountId = primaryAccount._id;
    const accountNumber = primaryAccount.accountNumber;
    const accountName = primaryAccount.accountName;
    const accountType = primaryAccount.accountType;
    const accountEmail = primaryAccount.userEmail;
    const accountStatus = primaryAccount.status;

    // Required Account Information Validation
    if (
      typeof accountId !== "string" ||
      !accountId.trim() ||
      typeof accountNumber !== "string" ||
      !accountNumber.trim() ||
      typeof accountName !== "string" ||
      !accountName.trim() ||
      typeof accountType !== "string" ||
      !accountType.trim() ||
      typeof accountEmail !== "string" ||
      !accountEmail.trim() ||
      typeof accountStatus !== "string" ||
      !accountStatus.trim()
    ) {
      setSubmitError(
        "Your bank account information is incomplete. Please contact the bank."
      );
      return;
    }

    // User Email Validation
    const userEmail = user.email || accountEmail;

    if (!userEmail.trim()) {
      setSubmitError("User email information is missing.");
      return;
    }

    setLoading(true);

    try {
      // Prepare Deposit Data
      const depositData: CreateDepositData = {
        depositAmount,
        currency: primaryAccount.currency || "BDT",
        depositMethod: depositMethod.trim(),

        // User Information
        userId: user.id,
        userEmail,

        // Bank Account Information
        accountId,
        accountNumber,
        accountName,
        accountType,
        accountEmail,
        accountStatus,

        // Transaction Information
        transactionType: "Deposit",
        transactionStatus: "Pending",
        transactionDate: new Date().toISOString(),
      };

      // Send POST Request to Backend
      const result = await createDeposit(depositData);

      if (!result.success) {
        throw new Error(
          result.message || "Failed to submit deposit request."
        );
      }

      // Success
      setSuccessMessage(
        result.message || "Deposit request submitted successfully!"
      );

      form.reset();
      setAmountError("");

      console.log("Deposit Created:", result.data);

    } catch (error: unknown) {
      console.error("Deposit Submission Error:", error);

      setSubmitError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 hover:border-gray-300 focus:border-[#1762AE] focus:ring-4 focus:ring-blue-50";

  const labelClass =
    "mb-2 block text-sm font-semibold text-gray-700";

  return (
    <div className="min-h-screen bg-[#F4F7FB] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#003566] text-white shadow-lg shadow-blue-900/15">
              <ArrowDownToLine size={27} />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-[#003566] sm:text-3xl">
                Deposit Money
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Submit a deposit request to your bank account.
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
              Important Deposit Information
            </h3>
            <p className="mt-1 text-sm leading-6 text-blue-800">
              Please provide accurate deposit details. All deposit
              requests will remain pending until reviewed and approved
              by a bank representative.
            </p>
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4">
            <CheckCircle2
              size={20}
              className="mt-0.5 shrink-0 text-green-600"
            />
            <p className="text-sm font-medium text-green-700">
              {successMessage}
            </p>
          </div>
        )}

        {/* Error Message */}
        {submitError && (
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
            <AlertCircle
              size={20}
              className="mt-0.5 shrink-0 text-red-600"
            />
            <p className="text-sm font-medium text-red-600">
              {submitError}
            </p>
          </div>
        )}

        {/* Deposit Form */}
        <form
          onSubmit={handleSubmit}
          className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
        >
          <div className="border-b border-gray-100 p-5 sm:p-8">

            {/* Form Heading */}
            <div className="mb-7 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-[#1762AE]">
                <Wallet size={22} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-[#003566]">
                  Deposit Details
                </h2>
                <p className="text-xs text-gray-500">
                  Enter the amount and payment information.
                </p>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">

              {/* Deposit Amount */}
              <div>
                <label className={labelClass}>
                  Deposit Amount (৳){" "}
                  <span className="text-red-500">*</span>
                </label>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base font-bold text-gray-500">
                    ৳
                  </span>

                  <input
                    name="depositAmount"
                    type="number"
                    min="500"
                    step="0.01"
                    placeholder="Enter deposit amount"
                    required
                    onChange={(e) =>
                      handleAmountChange(e.target.value)
                    }
                    className={`${inputClass} pl-10 ${amountError
                        ? "border-red-500 focus:border-red-500 focus:ring-red-50"
                        : ""
                      }`}
                  />
                </div>

                {amountError ? (
                  <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-red-600">
                    <AlertCircle size={14} />
                    {amountError}
                  </p>
                ) : (
                  <p className="mt-2 text-xs text-gray-400">
                    Minimum deposit amount is ৳500.
                  </p>
                )}
              </div>

              {/* Deposit Method */}
              <div>
                <label className={labelClass}>
                  Deposit Method{" "}
                  <span className="text-red-500">*</span>
                </label>

                <select
                  name="depositMethod"
                  required
                  defaultValue=""
                  className={inputClass}
                >
                  <option value="" disabled>
                    Select deposit method
                  </option>

                  <option value="Cash Deposit">
                    Cash Deposit
                  </option>
                </select>
              </div>

            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col-reverse justify-between gap-4 border-t border-gray-100 bg-gray-50 p-5 sm:flex-row sm:items-center sm:px-8">

            <div className="flex items-center gap-2 text-xs text-gray-500">
              <ShieldCheck size={16} className="text-green-600" />
              Your deposit request will be reviewed by the bank.
            </div>

            <button
              type="submit"
              disabled={
                loading ||
                accountLoading ||
                !!amountError
              }
              className="flex items-center justify-center gap-2 rounded-xl bg-[#003566] px-7 py-3.5 text-sm font-bold text-white shadow-md shadow-blue-900/10 transition hover:bg-[#1762AE] disabled:cursor-not-allowed disabled:opacity-60"
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
                  : "Submit Deposit Request"}
            </button>
          </div>
        </form>

        {/* Bottom Note */}
        <div className="mt-5 flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4">
          <ReceiptText
            size={19}
            className="mt-0.5 shrink-0 text-[#1762AE]"
          />

          <p className="text-xs leading-5 text-gray-500">
            After submission, your deposit request will be marked as
            <strong className="mx-1 text-amber-600">Pending</strong>
            until the bank verifies and processes the transaction.
          </p>
        </div>

      </div>
    </div>
  );
};

export default CustomerDepositPage;
