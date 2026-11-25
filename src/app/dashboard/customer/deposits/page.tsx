
"use client";

import React, { useState } from "react";
import {
  Wallet,
  Banknote,
  FileText,
  CheckCircle2,
  Loader2,
  ArrowDownToLine,
  ShieldCheck,
  ReceiptText,
  Info,
} from "lucide-react";

import { useLoggedInUserAccounts } from "@/components/lib/hooks/useLoggedInUserAccounts";

const CustomerDepositPage = () => {
  const [loading, setLoading] = useState(false);

  const {
    user,
    primaryAccount,
    loading: accountLoading,
    error: accountError,
  } = useLoggedInUserAccounts();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (accountLoading) {
      alert("Please wait. Your bank account is loading.");
      return;
    }

    if (accountError) {
      alert("Unable to load your bank account. Please try again.");
      return;
    }

    if (!user?.id) {
      alert("User information not found. Please login again.");
      return;
    }

    if (!primaryAccount) {
      alert("No bank account found. Please create a bank account first.");
      return;
    }

    if (primaryAccount.status?.toLowerCase() !== "active") {
      alert("Your bank account is not active. Deposit is unavailable.");
      return;
    }

    const form = e.currentTarget;
    const formData = new FormData(form);
    const depositAmount = Number(formData.get("depositAmount"));

    if (!Number.isFinite(depositAmount) || depositAmount <= 0) {
      alert("Please enter a valid deposit amount.");
      return;
    }

    setLoading(true);

    const depositData = {
      // Deposit Information
      depositAmount,
      currency: primaryAccount.currency || "BDT",
      depositMethod: formData.get("depositMethod"),
      referenceNumber: formData.get("referenceNumber"),
      depositNotes: formData.get("depositNotes"),
      termsAccepted: formData.get("termsAccepted") === "true",

      // User Information
      userId: user.id,
      userEmail: user.email || primaryAccount.userEmail || "",

      // Bank Account Information
      accountId: primaryAccount._id || "",
      accountNumber: primaryAccount.accountNumber,
      accountName: primaryAccount.accountName,
      accountType: primaryAccount.accountType,
      accountEmail: primaryAccount.userEmail,
      accountStatus: primaryAccount.status,

      // Transaction Information
      transactionType: "Deposit",
      transactionStatus: "Pending",
      transactionDate: new Date().toISOString(),
    };

    console.log("Customer Deposit Data:", depositData);

    setLoading(false);
    form.reset();

    alert("Deposit request submitted successfully! Check console.");
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

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
        >
          {/* Deposit Details */}
          <div className="border-b border-gray-100 p-5 sm:p-8">
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

              {/* Amount */}
              <div>
                <label className={labelClass}>
                  Deposit Amount (৳) <span className="text-red-500">*</span>
                </label>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base font-bold text-gray-500">
                    ৳
                  </span>

                  <input
                    name="depositAmount"
                    type="number"
                    min="1"
                    step="0.01"
                    placeholder="Enter deposit amount"
                    required
                    className={`${inputClass} pl-10`}
                  />
                </div>

                <p className="mt-2 text-xs text-gray-400">
                  Enter the amount you want to deposit.
                </p>
              </div>

              {/* Method */}
              <div>
                <label className={labelClass}>
                  Deposit Method <span className="text-red-500">*</span>
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
                  <option value="Cash Deposit">Cash Deposit</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Cheque Deposit">Cheque Deposit</option>
                  <option value="Mobile Banking">Mobile Banking</option>
                </select>
              </div>

              {/* Reference */}
              <div className="sm:col-span-2">
                <label className={labelClass}>
                  Transaction / Reference Number
                </label>

                <input
                  name="referenceNumber"
                  type="text"
                  placeholder="Enter transaction ID or cheque reference number"
                  className={inputClass}
                />

                <p className="mt-2 text-xs text-gray-400">
                  Optional for cash deposits. Recommended for transfers and cheques.
                </p>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="p-5 sm:p-8">
            <div className="mb-7 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-[#1762AE]">
                <FileText size={22} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-[#003566]">
                  Additional Information
                </h2>
                <p className="text-xs text-gray-500">
                  Add any additional information about your deposit.
                </p>
              </div>
            </div>

            <div>
              <label className={labelClass}>
                Deposit Notes
              </label>

              <textarea
                name="depositNotes"
                rows={4}
                placeholder="Write additional information about your deposit..."
                className={`${inputClass} resize-none`}
              />
            </div>

            {/* Terms */}
            <div className="mt-6 rounded-xl border border-gray-100 bg-gray-50 p-4">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  name="termsAccepted"
                  value="true"
                  required
                  className="mt-1 h-4 w-4 shrink-0 accent-[#1762AE]"
                />

                <span className="text-xs leading-6 text-gray-600">
                  I confirm that the deposit information provided is
                  accurate and complete. I agree to the bank&apos;s
                  deposit terms and conditions.
                  <span className="text-red-500"> *</span>
                </span>
              </label>
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
              disabled={loading || accountLoading}
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
